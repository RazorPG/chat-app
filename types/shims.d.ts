declare function defineEventHandler<T = any>(handler: (event: any) => T): any
declare function readBody(event?: any): Promise<any>
declare function sendError(event: any, err: any): any
declare function createError(opts: any): any
declare function useRuntimeConfig(): any
declare function navigateTo(url: string): any
declare function useRoute(): any
declare function useState<T = any>(key: string, init?: T): T
declare function defineNuxtRouteMiddleware(
  middleware: (to: any, from?: any) => any
): any
declare function definePageMeta(meta: any): void
// `process` is provided by the environment/ts lib; do not redeclare it here.

// Basic DOM / fetch types are available via lib: DOM in tsconfig
