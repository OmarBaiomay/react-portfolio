/**
 * Brand accent palettes for landing + admin.
 * Values are space-separated RGB channels for CSS: rgb(var(--c-accent) / <alpha>)
 */
export const THEME_PALETTES = [
  {
    id: 'orange',
    name: { en: 'Sunset Orange', ar: 'برتقالي الغروب' },
    tagline: { en: 'B-Code classic energy', ar: 'طاقة بي‑كود الكلاسيكية' },
    dark: { accent: '255 92 26' },
    light: { accent: '224 74 12' },
    swatch: '#FF5C1A',
  },
  {
    id: 'emerald',
    name: { en: 'Emerald Green', ar: 'أخضر زمردي' },
    tagline: { en: 'Fresh, confident growth', ar: 'نمو واثق ومنعش' },
    dark: { accent: '16 185 129' },
    light: { accent: '5 150 105' },
    swatch: '#10B981',
  },
  {
    id: 'kingy-blue',
    name: { en: 'Kingy Blue', ar: 'أزرق ملكي' },
    tagline: { en: 'Bold royal clarity', ar: 'وضوح ملكي جريء' },
    dark: { accent: '59 130 246' },
    light: { accent: '37 99 235' },
    swatch: '#3B82F6',
  },
  {
    id: 'violet',
    name: { en: 'Violet Pulse', ar: 'نبض بنفسجي' },
    tagline: { en: 'Modern creative spark', ar: 'شرارة إبداع عصرية' },
    dark: { accent: '168 85 247' },
    light: { accent: '147 51 234' },
    swatch: '#A855F7',
  },
  {
    id: 'crimson',
    name: { en: 'Crimson Forge', ar: 'قرمزي مشتعِل' },
    tagline: { en: 'High-impact intensity', ar: 'شدة عالية التأثير' },
    dark: { accent: '244 63 94' },
    light: { accent: '225 29 72' },
    swatch: '#F43F5E',
  },
  {
    id: 'teal',
    name: { en: 'Teal Horizon', ar: 'أفق تركوازي' },
    tagline: { en: 'Calm tech precision', ar: 'دقة تقنية هادئة' },
    dark: { accent: '20 184 166' },
    light: { accent: '13 148 136' },
    swatch: '#14B8A6',
  },
  {
    id: 'amber',
    name: { en: 'Amber Voltage', ar: 'كهرمان مشحون' },
    tagline: { en: 'Warm signal power', ar: 'قوة إشارة دافئة' },
    dark: { accent: '245 158 11' },
    light: { accent: '217 119 6' },
    swatch: '#F59E0B',
  },
  {
    id: 'cyan',
    name: { en: 'Ice Cyan', ar: 'سماوي جليدي' },
    tagline: { en: 'Sharp digital chill', ar: 'برودة رقمية حادة' },
    dark: { accent: '34 211 238' },
    light: { accent: '8 145 178' },
    swatch: '#22D3EE',
  },
  {
    id: 'lime',
    name: { en: 'Neon Lime', ar: 'ليموني نيون' },
    tagline: { en: 'Electric startup punch', ar: 'لكمة ناشئة كهربائية' },
    dark: { accent: '163 230 53' },
    light: { accent: '101 163 13' },
    swatch: '#A3E635',
  },
  {
    id: 'magenta',
    name: { en: 'Magenta Beam', ar: 'شعاع ماجنتا' },
    tagline: { en: 'Nightlife product flair', ar: 'لمسة منتج ليلية' },
    dark: { accent: '236 72 153' },
    light: { accent: '219 39 119' },
    swatch: '#EC4899',
  },
  {
    id: 'indigo',
    name: { en: 'Indigo Night', ar: 'نيلي ليلي' },
    tagline: { en: 'Deep product focus', ar: 'تركيز منتج عميق' },
    dark: { accent: '99 102 241' },
    light: { accent: '79 70 229' },
    swatch: '#6366F1',
  },
  {
    id: 'coral',
    name: { en: 'Coral Tide', ar: 'مرجاني المدّ' },
    tagline: { en: 'Friendly brand warmth', ar: 'دفء علامة ودود' },
    dark: { accent: '251 113 133' },
    light: { accent: '244 63 94' },
    swatch: '#FB7185',
  },
  {
    id: 'mint',
    name: { en: 'Mint Signal', ar: 'إشارة نعناع' },
    tagline: { en: 'Clean SaaS freshness', ar: 'انتعاش SaaS نظيف' },
    dark: { accent: '52 211 153' },
    light: { accent: '16 185 129' },
    swatch: '#34D399',
  },
  {
    id: 'gold',
    name: { en: 'Desert Gold', ar: 'ذهب صحراوي' },
    tagline: { en: 'Premium Gulf shine', ar: 'لمعان خليجي فاخر' },
    dark: { accent: '234 179 8' },
    light: { accent: '202 138 4' },
    swatch: '#EAB308',
  },
  {
    id: 'sapphire',
    name: { en: 'Sapphire Core', ar: 'ياقوت أزرق' },
    tagline: { en: 'Enterprise trust blue', ar: 'أزرق ثقة مؤسسي' },
    dark: { accent: '14 165 233' },
    light: { accent: '2 132 199' },
    swatch: '#0EA5E9',
  },
  {
    id: 'fuchsia',
    name: { en: 'Fuchsia Spark', ar: 'شرارة فوشيا' },
    tagline: { en: 'Bold campaign energy', ar: 'طاقة حملات جريئة' },
    dark: { accent: '217 70 239' },
    light: { accent: '192 38 211' },
    swatch: '#D946EF',
  },
  {
    id: 'forest',
    name: { en: 'Forest Code', ar: 'كود الغابة' },
    tagline: { en: 'Grounded craft green', ar: 'أخضر حرفية راسخ' },
    dark: { accent: '34 197 94' },
    light: { accent: '22 163 74' },
    swatch: '#22C55E',
  },
  {
    id: 'slate-blue',
    name: { en: 'Slate Signal', ar: 'إشارة رمادية زرقاء' },
    tagline: { en: 'Quiet technical calm', ar: 'هدوء تقني رصين' },
    dark: { accent: '100 116 139' },
    light: { accent: '71 85 105' },
    swatch: '#64748B',
  },
  {
    id: 'tangerine',
    name: { en: 'Tangerine Rush', ar: 'اندفاع اليوسفي' },
    tagline: { en: 'Playful conversion pop', ar: 'لمسة تحويل مرِحة' },
    dark: { accent: '249 115 22' },
    light: { accent: '234 88 12' },
    swatch: '#F97316',
  },
  {
    id: 'lavender',
    name: { en: 'Lavender Soft', ar: 'لافندر ناعم' },
    tagline: { en: 'Soft creative polish', ar: 'لمسة إبداع ناعمة' },
    dark: { accent: '196 181 253' },
    light: { accent: '139 92 246' },
    swatch: '#C4B5FD',
  },
];

export const DEFAULT_PALETTE_ID = 'orange';

export function getPaletteById(id) {
  return THEME_PALETTES.find((p) => p.id === id) || THEME_PALETTES.find((p) => p.id === DEFAULT_PALETTE_ID);
}

export function listPalettes() {
  return THEME_PALETTES;
}
