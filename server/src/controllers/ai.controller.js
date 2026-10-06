import { generateJSON, PROVIDERS } from '../lib/ai/providers.js';
import { getPublicAISettings, resolveProvider, saveAISettings } from '../lib/ai/settings.js';
import { getJob, listJobs, startJob } from '../lib/ai/jobs.js';
import { assertPublicUrl } from '../lib/ai/browser.js';
import { generateBlogPost, generateProject } from '../lib/ai/generators.js';

const fail = (res, error, fallback) =>
  res.status(error.status && error.status < 600 ? error.status : 500).json({ message: error.message || fallback });

export async function getSettings(req, res) {
  try {
    res.json(await getPublicAISettings());
  } catch (error) {
    console.error('ai getSettings:', error.message);
    fail(res, error, 'Failed to load AI settings');
  }
}

export async function updateSettings(req, res) {
  try {
    res.json(await saveAISettings(req.body || {}));
  } catch (error) {
    console.error('ai updateSettings:', error.message);
    fail(res, error, 'Failed to save AI settings');
  }
}

/** Tiny round trip to confirm the key + model work. */
export async function testProvider(req, res) {
  try {
    const ai = await resolveProvider(req.body?.provider);
    const started = Date.now();
    const out = await generateJSON({
      ...ai,
      effort: 'low',
      system: 'You are a connection test.',
      prompt: 'Reply with {"ok": true}.',
      schema: {
        type: 'object',
        properties: { ok: { type: 'boolean' } },
        required: ['ok'],
        additionalProperties: false,
      },
    });
    res.json({ ok: out?.ok === true, provider: ai.provider, model: ai.model, ms: Date.now() - started });
  } catch (error) {
    fail(res, error, 'Connection test failed');
  }
}

async function begin(req, res, type, input, run) {
  const ai = await resolveProvider(req.body?.provider);
  if (!ai.apiKey) {
    return res.status(400).json({ message: `Add an API key for ${PROVIDERS[ai.provider].label} in AI Settings first.` });
  }
  const job = await startJob(
    { type, input, provider: ai.provider, model: ai.model, userId: req.user?.id },
    (progress) => run(ai, progress)
  );
  res.status(202).json(job);
}

export async function createProjectJob(req, res) {
  try {
    const url = assertPublicUrl(req.body?.url).href;
    const notes = String(req.body?.notes || '').slice(0, 4000);
    await begin(req, res, 'project', { url, notes }, (ai, progress) => generateProject({ url, notes, ai }, progress));
  } catch (error) {
    console.error('ai createProjectJob:', error.message);
    fail(res, error, 'Could not start the job');
  }
}

export async function createBlogJob(req, res) {
  try {
    const topic = String(req.body?.topic || '').trim().slice(0, 4000);
    if (topic.length < 3) return res.status(400).json({ message: 'Describe the topic for the article.' });
    const notes = String(req.body?.notes || '').slice(0, 4000);
    const length = ['short', 'medium', 'long'].includes(req.body?.length) ? req.body.length : 'medium';
    const author = req.user?.fullName || 'B-Code Team';
    await begin(req, res, 'blog', { topic, notes, length }, (ai, progress) =>
      generateBlogPost({ topic, notes, length, author, ai }, progress)
    );
  } catch (error) {
    console.error('ai createBlogJob:', error.message);
    fail(res, error, 'Could not start the job');
  }
}

export async function getJobStatus(req, res) {
  try {
    const job = await getJob(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    if (error.code === '22P02') return res.status(404).json({ message: 'Job not found' });
    fail(res, error, 'Failed to load job');
  }
}

export async function getJobs(req, res) {
  try {
    res.json(await listJobs(20));
  } catch (error) {
    fail(res, error, 'Failed to load jobs');
  }
}
