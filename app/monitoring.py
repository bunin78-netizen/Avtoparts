import time

from fastapi import FastAPI, Request
from prometheus_client import Counter, Histogram

http_requests_total = Counter("http_requests_total", "Total HTTP requests", ["method", "endpoint", "status"])
http_request_duration = Histogram("http_request_duration_seconds", "HTTP request duration", ["method", "endpoint"])


def add_monitoring(app: FastAPI) -> None:
    @app.middleware("http")
    async def monitor_requests(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time

        http_requests_total.labels(
            method=request.method,
            endpoint=request.url.path,
            status=response.status_code,
        ).inc()
        http_request_duration.labels(method=request.method, endpoint=request.url.path).observe(duration)
        return response
