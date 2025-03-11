// 扩展全局Window接口，添加Next.js相关类型
interface Window {
  __NEXT_DATA__?: {
    props?: {
      pageProps?: any;
      [key: string]: any;
    };
    page?: string;
    query?: any;
    buildId?: string;
    assetPrefix?: string;
    runtimeConfig?: {
      basePath?: string;
      [key: string]: any;
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
    domainLocales?: any;
    scriptLoader?: any[];
    basePath?: string;
    [key: string]: any;
  };
}
