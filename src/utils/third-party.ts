export interface PinterestTagOptions {
  tagId?: string;
  noindex?: boolean;
  vercelEnv?: string;
}

export function shouldLoadPinterestTag({
  tagId,
  noindex = false,
  vercelEnv,
}: PinterestTagOptions): boolean {
  return Boolean(tagId?.trim()) && !noindex && vercelEnv === 'production';
}
