#!/bin/sh
set -e

# Export runtime environment variables for Next.js
# These are injected by Portainer at runtime
export NEXT_PUBLIC_DIRECTUS_URL="${NEXT_PUBLIC_DIRECTUS_URL}"
export DIRECTUS_TOKEN="${DIRECTUS_TOKEN}"

# Execute the CMD
exec "$@"
