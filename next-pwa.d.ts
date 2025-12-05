declare module 'next-pwa' {
    import { NextConfig } from 'next';
    function withPWA(config: {
        dest?: string;
        disable?: boolean;
        register?: boolean;
        scope?: string;
        sw?: string;
        skipWaiting?: boolean;
        runtimeCaching?: any[];
        buildExcludes?: string[];
        cacheOnFrontEndNav?: boolean;
        reloadOnOnline?: boolean;
        fallbacks?: {
            image?: string;
            document?: string;
            font?: string;
            audio?: string;
            video?: string;
        };
        cacheStartUrl?: boolean;
        dynamicStartUrl?: boolean;
        dynamicStartUrlRedirect?: string;
        publicExcludes?: string[];
        subdomainPrefix?: string;
    }): (nextConfig: NextConfig) => NextConfig;
    export = withPWA;
}
