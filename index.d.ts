/// <reference types="node" />

import { FastifyPlugin, FastifyRequest, RouteOptions, RawServerBase, RawServerDefault, RawRequestDefaultExpression, RequestGenericInterface } from 'fastify';

declare module 'fastify' {
  interface FastifyRequestInterface<
    RawServer extends RawServerBase = RawServerDefault,
    RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
    RequestGeneric extends RequestGenericInterface = RequestGenericInterface
  > {
    ip: string | number
  }
}

export interface FastifyRateLimitOptions {}

export interface errorResponseBuilderContext {
  after: string;
  max: number;
}

export interface FastifyRateLimitStoreCtor {
  new (options: FastifyRateLimitOptions): FastifyRateLimitStore;
}

export interface FastifyRateLimitStore {
  incr(key: string, callback: ( error: Error|null, result?: { current: number, ttl: number } ) => void): void;
  child(routeOptions: RouteOptions & { path: string, prefix: string }): FastifyRateLimitStore;
}

interface AddHeaders {
  'x-ratelimit-limit'?: boolean,
  'x-ratelimit-remaining'?: boolean,
  'x-ratelimit-reset'?: boolean,
  'retry-after'?: boolean
}

export interface RateLimitPluginOptions {
  global?: boolean;
  max?: number | ((req: FastifyRequest, key: string) => number);
  timeWindow?: number;
  cache?: number;
  store?: FastifyRateLimitStoreCtor;
  whitelist?: string[] | ((req: FastifyRequest, key: string) => boolean);
  redis?: any;
  skipOnError?: boolean;
  ban?: number;
  keyGenerator?: (req: FastifyRequest) => string | number;
  errorResponseBuilder?: (req: FastifyRequest, context: errorResponseBuilderContext) => object;
  addHeaders?: AddHeaders;
}

declare const fastifyRateLimit: FastifyPlugin<RateLimitPluginOptions>;

export default fastifyRateLimit;
