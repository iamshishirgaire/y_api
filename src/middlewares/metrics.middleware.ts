import { createMiddleware } from "hono/factory";
import { collectDefaultMetrics, register, Counter, Gauge } from "prom-client";
import type { MiddlewareHandler } from "hono";

const httpMetricsLabelNames = ["method", "path"];
const totalHttpRequestCount = new Counter({
  name: "nodejs_http_total_count",
  help: "Total request number",
  labelNames: httpMetricsLabelNames,
});
const totalHttpRequestDuration = new Gauge({
  name: "nodejs_http_total_duration",
  help: "The duration or response time of the last request",
  labelNames: httpMetricsLabelNames,
});

export const metricsMiddleware: MiddlewareHandler = createMiddleware(
  async (c, next) => {
    const start = Date.now();
    await next();
    const responseTime = Date.now() - start;
    const method = c.req.method;
    const path = c.req.url;
    totalHttpRequestCount.labels(method, path).inc();
    totalHttpRequestDuration.labels(method, path).set(responseTime);
  },
);

export const metricsEndpoint: MiddlewareHandler = createMiddleware(
  async (c, next) => {
    c.header("Content-Type", register.contentType);
    const metrics = await register.metrics();
    return c.text(metrics);
  },
);
