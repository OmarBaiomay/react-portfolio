import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

/** Providers the dashboard can pick from, with a sensible default model each. */
export const PROVIDERS = {
  anthropic: { label: 'Claude (Anthropic)', defaultModel: 'claude-opus-5-5', envKey: 'ANTHROPIC_API_KEY' },
  openai: { label: 'OpenAI', defaultModel: 'gpt-5', envKey: 'OPENAI_API_KEY' },
  gemini: { label: 'Google Gemini', defaultModel: 'gemini-2.5-pro', envKey: 'GEMINI_API_KEY' },
  compatible: {
    label: 'OpenAI-compatible (DeepSeek, OpenRouter, Groq, Mistral…)',
    defaultModel: '',
    envKey: 'AI_COMPATIBLE_API_KEY',
  },
};

export class AIError extends Error {
  constructor(message, { status = 502, cause } = {}) {
    super(message);
    this.status = status;
    this.cause = cause;
  }
}

function parseJson(text, provider) {
  const raw = String(text || '').trim();
  try {
    return JSON.parse(raw);
  } catch {
    // Some OpenAI-compatible models wrap JSON in prose or code fences.
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        // fall through
      }
    }
    throw new AIError(`${PROVIDERS[provider]?.label || provider} returned text that is not valid JSON`);
  }
}

/** Claude: streaming + structured outputs, refusal fallback opted in. */
async function claudeJSON({ apiKey, model, system, prompt, schema, effort }) {
  const client = new Anthropic({ apiKey });
  try {
    const stream = client.beta.messages.stream({
      model,
      max_tokens: 64000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system,
      messages: [{ role: 'user', content: prompt }],
      output_config: {
        effort: effort || 'medium',
        format: { type: 'json_schema', schema },
      },
    });
    const message = await stream.finalMessage();
    if (message.stop_reason === 'refusal') {
      throw new AIError('Claude declined this request. Try rephrasing the topic.', { status: 422 });
    }
    if (message.stop_reason === 'max_tokens') {
      throw new AIError('The response was cut off (too long). Try a shorter article.', { status: 422 });
    }
    const text = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');
    return parseJson(text, 'anthropic');
  } catch (error) {
    if (error instanceof AIError) throw error;
    if (error instanceof Anthropic.AuthenticationError) {
      throw new AIError('Claude rejected the API key. Check it in AI Settings.', { status: 401, cause: error });
    }
    if (error instanceof Anthropic.NotFoundError) {
      throw new AIError(`Claude model "${model}" was not found. Check the model name in AI Settings.`, { status: 400, cause: error });
    }
    if (error instanceof Anthropic.RateLimitError) {
      throw new AIError('Claude rate limit reached — try again in a minute.', { status: 429, cause: error });
    }
    if (error instanceof Anthropic.APIError) {
      throw new AIError(`Claude API error ${error.status ?? ''}: ${error.message}`, { cause: error });
    }
    throw new AIError(`Could not reach Claude: ${error.message}`, { cause: error });
  }
}

/** OpenAI and OpenAI-compatible APIs (chat completions). */
async function openaiJSON({ provider, apiKey, model, baseURL, system, prompt, schema, effort }) {
  const client = new OpenAI({ apiKey, baseURL: provider === 'compatible' ? baseURL : undefined });
  // Strict JSON schema on OpenAI itself; many compatible providers only support json_object.
  const responseFormat =
    provider === 'openai'
      ? { type: 'json_schema', json_schema: { name: 'result', schema, strict: true } }
      : { type: 'json_object' };
  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            provider === 'openai'
              ? system
              : `${system}\n\nRespond with a single JSON object matching this JSON Schema:\n${JSON.stringify(schema)}`,
        },
        { role: 'user', content: prompt },
      ],
      response_format: responseFormat,
      ...(provider === 'openai' && effort ? { reasoning_effort: effort === 'max' || effort === 'xhigh' ? 'high' : effort } : {}),
    });
    const choice = completion.choices?.[0];
    if (choice?.message?.refusal) throw new AIError(`The model declined: ${choice.message.refusal}`, { status: 422 });
    return parseJson(choice?.message?.content, provider);
  } catch (error) {
    if (error instanceof AIError) throw error;
    if (error instanceof OpenAI.AuthenticationError) {
      throw new AIError('The API key was rejected. Check it in AI Settings.', { status: 401, cause: error });
    }
    if (error instanceof OpenAI.NotFoundError) {
      throw new AIError(`Model "${model}" was not found. Check the model name in AI Settings.`, { status: 400, cause: error });
    }
    if (error instanceof OpenAI.RateLimitError) {
      throw new AIError('Rate limit reached — try again in a minute.', { status: 429, cause: error });
    }
    if (error instanceof OpenAI.APIError) {
      throw new AIError(`AI API error ${error.status ?? ''}: ${error.message}`, { cause: error });
    }
    throw new AIError(`Could not reach the AI provider: ${error.message}`, { cause: error });
  }
}

/** Google Gemini. */
async function geminiJSON({ apiKey, model, system, prompt, schema }) {
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: system,
        responseMimeType: 'application/json',
        responseJsonSchema: schema,
      },
    });
    return parseJson(response.text, 'gemini');
  } catch (error) {
    if (error instanceof AIError) throw error;
    const status = error?.status;
    if (status === 400 && /api key/i.test(error.message)) {
      throw new AIError('Gemini rejected the API key. Check it in AI Settings.', { status: 401, cause: error });
    }
    if (status === 404) {
      throw new AIError(`Gemini model "${model}" was not found. Check the model name in AI Settings.`, { status: 400, cause: error });
    }
    if (status === 429) throw new AIError('Gemini rate limit reached — try again in a minute.', { status: 429, cause: error });
    throw new AIError(`Gemini error: ${error.message}`, { cause: error });
  }
}

/**
 * Ask the configured provider for a JSON object matching `schema`.
 * `schema` must be strict-compatible: every object has `additionalProperties: false`
 * and lists all its properties in `required`.
 */
export async function generateJSON({ provider, apiKey, model, baseURL, effort, system, prompt, schema }) {
  if (!PROVIDERS[provider]) throw new AIError(`Unknown AI provider "${provider}"`, { status: 400 });
  if (!apiKey) throw new AIError(`No API key set for ${PROVIDERS[provider].label}. Add one in AI Settings.`, { status: 400 });
  if (!model) throw new AIError(`No model set for ${PROVIDERS[provider].label}. Add one in AI Settings.`, { status: 400 });
  if (provider === 'compatible' && !baseURL) {
    throw new AIError('Set the API base URL for the OpenAI-compatible provider in AI Settings.', { status: 400 });
  }

  const args = { provider, apiKey, model, baseURL, effort, system, prompt, schema };
  if (provider === 'anthropic') return claudeJSON(args);
  if (provider === 'gemini') return geminiJSON(args);
  return openaiJSON(args);
}
