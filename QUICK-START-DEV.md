# Quick Start - Dev Environment

## TL;DR - Deploy Dev Frontend

On your deployment server (10.60.0.40):

```bash
# 1. Build and push image
cd /path/to/dewbob-frontend
docker build -t registry.dewbob.com/dewbob/dewbob:dev .
docker push registry.dewbob.com/dewbob/dewbob:dev

# 2. Deploy
docker-compose -f docker-compose-dev.yml up -d

# 3. Verify
curl http://10.60.0.40:3000/
docker logs dewbob-frontend-dev
```

## Access Points

- **Public URL**: https://dev.dewbob.com (via Caddy)
- **Direct Access**: http://10.60.0.40:3000
- **Backend**: https://cms-dev.dewbob.com

## Files Created

- [docker-compose-dev.yml](docker-compose-dev.yml) - Dev environment compose file
- [DEV-DEPLOYMENT.md](DEV-DEPLOYMENT.md) - Detailed deployment guide
- [.env.dev](.env.dev) - Dev environment variables (already configured)

## Key Differences from Production

| Aspect | Dev | Prod |
|--------|-----|------|
| URL | dev.dewbob.com | (prod URL) |
| Backend | cms-dev.dewbob.com | cms.dewbob.com |
| IP Binding | 10.60.0.40:3000 | 10.60.0.20:3000 |
| Network | upd-dev_backend | (prod network) |
| Image Tag | :dev | :latest |
| Container | dewbob-frontend-dev | dewbob-frontend |

## Next Steps

After successful dev deployment:
1. Test all functionality against cms-dev.dewbob.com
2. Set up Woodpecker CI/CD for automated dev builds
3. Define promotion process to production
4. Migrate prod from Portainer to docker-compose

See [../docs/DevOps Plan/directus_frontend_dev→prod_promotion_process.md](../docs/DevOps%20Plan/directus_frontend_dev→prod_promotion_process.md) for the full promotion strategy.
