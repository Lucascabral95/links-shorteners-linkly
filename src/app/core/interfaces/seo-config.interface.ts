export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  locale?: string;
  author?: string;
  siteName?: string;
  twitterHandle?: string;
}

export interface SchemaConfig {
  type: 'WebApplication' | 'Organization' | 'Article' | 'WebPage';
  name: string;
  description: string;
  url?: string;
  additionalProperties?: any;
}

export interface Options {
  keywords?: string;
  image?: string;
  noIndex?: boolean;
}
