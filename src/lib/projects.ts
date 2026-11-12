import data from '@/content/projects.json';
import type {Locale} from './paths';

export type ProjectCopy = {
  title: string;
  role: string;
  summary: string;
  contribution: string;
  result: string;
  short: string;
  listRole: string;
};

export type Project = {
  slug: string;
  url: string | null;
  en: ProjectCopy;
  ru: ProjectCopy;
};

export const projects: Project[] = data;
export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
export function getProjectCopy(project: Project, locale: Locale) {
  return project[locale];
}
