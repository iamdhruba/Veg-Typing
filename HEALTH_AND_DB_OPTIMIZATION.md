# Health Check & Database Optimization

## ✅ Implemented Features

### 1. Health Check Endpoints

#### Main Health Check: `GET /health`
Returns comprehensive health status including:
- Server uptime
- Database connection status
- Memory usage (RSS, Heap Used, Heap Total)
- HTTP Status: 200 (healthy) or 503 (unhealthy)

**Example Response:**
```json
{
  "uptime": 3600.5,
  "message": "OK",
  "timestamp": 1704067200000,
  "checks": {
    "database": "connected",
    "memory": {
      "rss": "45MB",
      "heapUsed": "25MB",
      "heapTotal": "35MB"
    }
  }
}
```

#### Readiness Check: `GET /health/ready`
For Kubernetes readiness probes - checks if database is ready.

#### Liveness Check: `GET /health/live`
For Kubernetes liveness probes - checks if server is alive.

### 2. Logging System

#### Winston Logger
- **Levels**: error, warn, info, debug
- **Transports**:
  - `logs/error.log` - Error level logs only
  - `logs/combined.log` - All logs
  - Console - Development mode only
- **Features**:
  - Automatic log rotation (5MB max, 5 files)
  - JSON format for production
  - Colorized console output for development
  - Timestamps on all logs

#### HTTP Request Logging (Morgan)
- Logs all HTTP requests
- Format: 'combined' (production), 'dev' (development)
- Integrated with Winston logger

### 3. Database Optimizations

#### Connection Pooling
```javascript
{
  maxPoolSize: 10,  // Max connections
  minPoolSize: 5,   // Min connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
}
```

#### Connection Event Handlers
- Monitors connection errors
- Logs disconnections
- Logs reconnections
- Automatic reconnection handling

### 4. Pagination

#### Results Endpoint: `GET /api/results/me`
**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response:**
```json
{
  "results": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasMore": true
  }
}
```

#### Leaderboard Endpoint: `GET /api/leaderboard`
**Query Parameters:**
- `language` (default: 'english')
- `duration` (default: 30)
- `timeframe` (default: 'alltime')
- `page` (default: 1)
- `limit` (default: 50, max: 100)

**Response:**
```json
{
  "results": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 200,
    "pages": 4,
    "hasMore": true
  }
}
```

### 5. Error Handling

#### Global Error Handler
- Catches all unhandled errors
- Logs errors with context (URL, method, stack trace)
- Returns appropriate error responses
- Hides stack traces in production

#### Graceful Shutdown
- Handles SIGTERM and SIGINT signals
- Closes server gracefully
- 10-second timeout for forced shutdown
- Logs shutdown process

---

## 🚀 Usage

### Testing Health Endpoints

```bash
# Main health check
curl http://localhost:5000/health

# Readiness check
curl http://localhost:5000/health/ready

# Liveness check
curl http://localhost:5000/health/live
```

### Testing Pagination

```bash
# Get first page of results
curl http://localhost:5000/api/results/me?page=1&limit=10 \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get leaderboard with pagination
curl "http://localhost:5000/api/leaderboard?page=1&limit=20&language=unicode"
```

### Viewing Logs

```bash
# View error logs
tail -f backend/logs/error.log

# View all logs
tail -f backend/logs/combined.log

# View logs in real-time (development)
npm run dev
```

---

## 📊 Performance Impact

### Database
- ✅ Connection pooling reduces connection overhead
- ✅ Pagination reduces memory usage
- ✅ Lean queries improve performance
- ✅ Parallel queries with Promise.all

### Memory
- ✅ Log rotation prevents disk space issues
- ✅ Pagination prevents loading large datasets
- ✅ Graceful shutdown prevents memory leaks

### Monitoring
- ✅ Health checks enable uptime monitoring
- ✅ Structured logging enables log analysis
- ✅ Request logging tracks API usage

---

## 🔧 Configuration

### Environment Variables

Add to `backend/.env`:
```env
LOG_LEVEL=info  # Options: error, warn, info, debug
```

### Log Levels

- **error**: Critical errors only
- **warn**: Warnings and errors
- **info**: General information (recommended)
- **debug**: Detailed debugging information

---

## 📈 Monitoring Setup

### Using Health Checks

#### Docker Health Check
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1
```

#### Kubernetes Probes
```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 5000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /health/ready
    port: 5000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Log Monitoring

#### Using PM2
```bash
pm2 start backend/index.js --name veg-typing
pm2 logs veg-typing
```

#### Using Docker
```bash
docker logs -f container_name
```

---

## 🔍 Troubleshooting

### High Memory Usage
Check health endpoint for memory stats:
```bash
curl http://localhost:5000/health | jq '.checks.memory'
```

### Database Connection Issues
Check logs:
```bash
grep "MongoDB" backend/logs/combined.log
```

### Slow Queries
Enable debug logging:
```env
LOG_LEVEL=debug
```

---

## 📝 Next Steps

### Recommended Additions
1. **Metrics**: Add Prometheus metrics
2. **APM**: Add New Relic or Datadog
3. **Alerts**: Set up alerts for health check failures
4. **Caching**: Add Redis for leaderboard caching
5. **Rate Limiting**: Add per-user rate limiting

---

**Last Updated:** 2025
**Version:** 1.1.0
