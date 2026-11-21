import { getCollection, type CollectionEntry } from 'astro:content';
import { groupProjects } from './groupProjects';

export type Project = CollectionEntry<'projects'>;

export async function getGroupedProjects(): Promise<{ production: Project[]; other: Project[] }> {
  return groupProjects(await getCollection('projects'));
}
