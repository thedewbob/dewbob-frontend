# Dev Environment Deployment Guide

## Overview
This guide covers building and deploying the dewbob-frontend **dev** instance.

## Environment Details

- **Dev Frontend URL**: https://dev.dewbob.com (via Caddy reverse proxy)
- **Dev Backend URL**: https://cms-dev.dewbob.com
- **Server IP Binding**: 10.60.0.40:3000
- **Docker Network**: ubp-dev_backend
- **Container Name**: dewbob-frontend-dev
- **Registry Image**: registry.dewbob.com/dewbob/dewbob:dev

## Prerequisites

1. Access to deployment server (10.60.0.40)
2. Docker and docker-compose installed
3. Access to registry.dewbob.com
4. Network `ubp-dev_backend` must exist

## Automated Deployment (Woodpecker CI/CD)

**Recommended:** Push to the `dev` branch and Woodpecker will automatically build and push the image.

```bash
git checkout dev
git add .
git commit -m "Your changes"
git push origin dev
```

Woodpecker will:
1. Build with `--build-arg DIRECTUS_URL=https://cms-dev.dewbob.com`
2. Tag as `:dev` and `:dev-{commit-sha}`
3. Push to registry.dewbob.com

Then on the server, pull and restart:

```bash
cd /opt/dewbob-frontend-dev
docker compose pull
docker compose up -d
```

## Manual Build Process (if needed)

### 1. Build the Docker Image

From the `dewbob-frontend` directory:

```bash
docker build \
  --build-arg DIRECTUS_URL=https://cms-dev.dewbob.com \
  -t registry.dewbob.com/dewbob/dewbob:dev .
```

### 2. Push to Registry

```bash
docker push registry.dewbob.com/dewbob/dewbob:dev
```

## Deployment Process

### 1. Ensure Network Exists

```bash
docker network ls | grep upd-dev_backend
```

If it doesn't exist:

```bash
docker network create upd-dev_backend
```

### 2. Deploy Using Docker Compose

From the `dewbob-frontend` directory:

```bash
docker-compose -f docker-compose-dev.yml up -d
```

### 3. Verify Deployment

Check container status:

```bash
docker ps | grep dewbob-frontend-dev
```

Check logs:

```bash
docker logs dewbob-frontend-dev
```

Check health:

```bash
curl http://10.60.0.40:3000/
```

## Configuration

### Environment Variables (.env.dev)

```
NEXT_PUBLIC_DIRECTUS_URL=https://cms-dev.dewbob.com
DIRECTUS_TOKEN=<dev-token>
```

### Caddy Reverse Proxy

Ensure Caddy is configured to proxy dev.dewbob.com to 10.60.0.40:3000

## Troubleshooting

### Container won't start

Check logs:
```bash
docker logs dewbob-frontend-dev --tail 100
```

### Can't connect to Directus

Verify network connectivity:
```bash
docker exec dewbob-frontend-dev curl https://cms-dev.dewbob.com/server/health
```

### Port already in use

Check what's using port 3000:
```bash
lsof -i :3000
```

## Stop/Restart Commands

Stop:
```bash
docker-compose -f docker-compose-dev.yml down
```

Restart:
```bash
docker-compose -f docker-compose-dev.yml restart
```

Rebuild and restart:
```bash
docker-compose -f docker-compose-dev.yml down
docker build -t registry.dewbob.com/dewbob/dewbob:dev .
docker push registry.dewbob.com/dewbob/dewbob:dev
docker-compose -f docker-compose-dev.yml up -d
```

## Next Steps

After dev is stable and tested:
- Set up Woodpecker CI/CD pipeline for automated dev deployments
- Document promotion process to production
- Migrate production from Portainer to docker-compose
