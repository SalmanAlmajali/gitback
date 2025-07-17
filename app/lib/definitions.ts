export type Theme = 'light' | 'dark' | 'system';

export interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}