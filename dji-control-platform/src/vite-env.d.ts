/// <reference types="vite/client" />
// 构建时通过 vite.config.ts define 注入的环境变量
declare const __APP_ENVIRONMENT__: string | undefined;
declare const __AMAP_KEY__: string | undefined;
declare const __AMAP_SECURITY__: string | undefined;
