import { query } from '../db/pg-connection.js';
import {
  DEFAULT_PALETTE_ID,
  getPaletteById,
  listPalettes,
} from '../lib/themePalettes.js';
import { DEFAULT_MANIFESTO, normalizeManifesto } from '../lib/manifestoDefaults.js';
import {
  DEFAULT_HERO_SCENE_ID,
  getHeroSceneById,
  listHeroScenes,
} from '../lib/heroScenes.js';

async function readThemeSetting() {
  const result = await query(`SELECT value FROM site_settings WHERE key = 'theme'`);
  const value = result.rows[0]?.value || { paletteId: DEFAULT_PALETTE_ID };
  const paletteId = value.paletteId || DEFAULT_PALETTE_ID;
  return getPaletteById(paletteId);
}

async function readManifestoSetting() {
  const result = await query(`SELECT value FROM site_settings WHERE key = 'manifesto'`);
  return normalizeManifesto(result.rows[0]?.value || DEFAULT_MANIFESTO);
}

async function readHeroSceneSetting() {
  const result = await query(`SELECT value FROM site_settings WHERE key = 'heroScene'`);
  const sceneId = result.rows[0]?.value?.sceneId || DEFAULT_HERO_SCENE_ID;
  return getHeroSceneById(sceneId);
}

export async function getPublicTheme(req, res) {
  try {
    const palette = await readThemeSetting();
    res.json({
      paletteId: palette.id,
      palette,
      palettes: listPalettes(),
    });
  } catch (error) {
    console.error('getPublicTheme:', error.message);
    res.status(500).json({ message: 'Failed to load theme' });
  }
}

export async function updateTheme(req, res) {
  try {
    const { paletteId } = req.body || {};
    const palette = getPaletteById(paletteId);

    if (!paletteId || palette.id !== paletteId) {
      return res.status(400).json({ message: 'Invalid paletteId' });
    }

    await query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ('theme', $1::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify({ paletteId: palette.id })]
    );

    res.json({
      message: 'Theme updated',
      paletteId: palette.id,
      palette,
      palettes: listPalettes(),
    });
  } catch (error) {
    console.error('updateTheme:', error.message);
    res.status(500).json({ message: 'Failed to update theme' });
  }
}

export async function getPublicManifesto(req, res) {
  try {
    const manifesto = await readManifestoSetting();
    res.json(manifesto);
  } catch (error) {
    console.error('getPublicManifesto:', error.message);
    res.status(500).json({ message: 'Failed to load manifesto' });
  }
}

export async function updateManifesto(req, res) {
  try {
    const manifesto = normalizeManifesto(req.body || {});

    if (!manifesto.lines.length) {
      return res.status(400).json({ message: 'At least one line is required' });
    }

    await query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ('manifesto', $1::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(manifesto)]
    );

    res.json({
      message: 'Manifesto updated',
      ...manifesto,
    });
  } catch (error) {
    console.error('updateManifesto:', error.message);
    res.status(500).json({ message: 'Failed to update manifesto' });
  }
}

export async function getPublicHeroScene(req, res) {
  try {
    const scene = await readHeroSceneSetting();
    res.json({
      sceneId: scene.id,
      scene,
      scenes: listHeroScenes(),
    });
  } catch (error) {
    console.error('getPublicHeroScene:', error.message);
    res.status(500).json({ message: 'Failed to load hero scene' });
  }
}

export async function updateHeroScene(req, res) {
  try {
    const { sceneId } = req.body || {};
    const scene = getHeroSceneById(sceneId);

    if (!sceneId || scene.id !== sceneId) {
      return res.status(400).json({ message: 'Invalid sceneId' });
    }

    await query(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ('heroScene', $1::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify({ sceneId: scene.id })]
    );

    res.json({
      message: 'Hero scene updated',
      sceneId: scene.id,
      scene,
      scenes: listHeroScenes(),
    });
  } catch (error) {
    console.error('updateHeroScene:', error.message);
    res.status(500).json({ message: 'Failed to update hero scene' });
  }
}
