import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

const collectDefault = client.collectDefaultMetrics;
collectDefault();

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime();
  res.on('finish', () => {
    const delta = process.hrtime(start);
    const seconds = delta[0] + delta[1] / 1e9;
    httpRequestDuration.labels(req.method, req.path, String(res.statusCode)).observe(seconds);
  });
  next();
}

export async function metricsHandler(_req: Request, res: Response) {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err: any) {
    res.status(500).end(err.message);
  }
}
