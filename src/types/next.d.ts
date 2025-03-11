// 扩展全局Window接口，添加Next.js相关类型
interface Window {
  __NEXT_DATA__?: {
    props?: {
      pageProps?: Record<string, unknown>;
      [key: string]: unknown;
    };
    page?: string;
    query?: Record<string, unknown>;
    buildId?: string;
    assetPrefix?: string;
    runtimeConfig?: {
      basePath?: string;
      [key: string]: unknown;
    };
    nextExport?: boolean;
    autoExport?: boolean;
    isFallback?: boolean;
    dynamicIds?: string[];
    err?: Error & { statusCode?: number };
    gsp?: boolean;
    gssp?: boolean;
    customServer?: boolean;
    gip?: boolean;
    appGip?: boolean;
    locale?: string;
    locales?: string[];
    defaultLocale?: string;
    domainLocales?: Record<string, unknown>;
    scriptLoader?: unknown[];
    basePath?: string;
    [key: string]: unknown;
  };
}
