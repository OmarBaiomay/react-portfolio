export const HERO_SCENES = [
  {
    id: 'random',
    name: { en: 'Random each visit', ar: 'عشوائي في كل زيارة' },
    tagline: { en: 'Surprise mix of all shapes', ar: 'مزيج مفاجئ من كل الأشكال' },
  },
  {
    id: 'crystal',
    name: { en: 'Crystal Core', ar: 'نواة بلورية' },
    tagline: { en: 'Icosahedron + orbiting shards', ar: 'متعدد سطوح وشظايا دوّارة' },
  },
  {
    id: 'ribbon',
    name: { en: 'Ribbon Orbit', ar: 'شريط مداري' },
    tagline: { en: 'Twisting wireframe ribbon', ar: 'شريط سلكي ملتوٍ' },
  },
  {
    id: 'helix',
    name: { en: 'DNA Helix', ar: 'حلزون DNA' },
    tagline: { en: 'Twin spirals with glowing nodes', ar: 'حلزونان مع نقاط متوهجة' },
  },
  {
    id: 'panels',
    name: { en: 'Dashboard Panels', ar: 'لوحات تحكم' },
    tagline: { en: 'Floating UI shards', ar: 'شظايا واجهة عائمة' },
  },
  {
    id: 'orbs',
    name: { en: 'Orbit Orbs', ar: 'كرات مدارية' },
    tagline: { en: 'Stacked spheres in motion', ar: 'كرات متراكبة متحركة' },
  },
  {
    id: 'lattice',
    name: { en: 'Node Lattice', ar: 'شبكة عقد' },
    tagline: { en: 'Connected network graph', ar: 'رسم شبكة متصلة' },
  },
  {
    id: 'torus',
    name: { en: 'Torus Stack', ar: 'حلقات متراكبة' },
    tagline: { en: 'Nested spinning rings', ar: 'حلقات دوّارة متداخلة' },
  },
  {
    id: 'constellation',
    name: { en: 'Constellation', ar: 'كوكبة' },
    tagline: { en: 'Star field with links', ar: 'حقل نجوم مع روابط' },
  },
];

export const DEFAULT_HERO_SCENE_ID = 'random';

export function getHeroSceneById(id) {
  return HERO_SCENES.find((s) => s.id === id) || HERO_SCENES[0];
}

export function listHeroScenes() {
  return HERO_SCENES;
}

export function resolveHeroSceneIndex(sceneId, sceneCount) {
  if (!sceneId || sceneId === 'random') {
    return Math.floor(Math.random() * sceneCount);
  }
  const order = ['crystal', 'ribbon', 'helix', 'panels', 'orbs', 'lattice', 'torus', 'constellation'];
  const idx = order.indexOf(sceneId);
  if (idx >= 0 && idx < sceneCount) return idx;
  return Math.floor(Math.random() * sceneCount);
}
