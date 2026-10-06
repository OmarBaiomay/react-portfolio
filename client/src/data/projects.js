import { projects } from '../../../shared/content/projects.js';

export { projects };

export function getProjectBySlug(slug, list = projects) {
  return list.find((p) => p.slug === slug) || null;
}

/** The project after `slug`, wrapping around to the first. */
export function getNextProject(slug, list = projects) {
  if (list.length < 2) return null;
  const index = list.findIndex((p) => p.slug === slug);
  return list[(index + 1) % list.length];
}
