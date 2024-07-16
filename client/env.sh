#!/bin/sh
set -e

# Replace env vars in config.js
sed -i 's|${API_URL}|'"${API_URL}"'|g' /usr/share/nginx/html/assets/config.js
sed -i 's|${PRODUCTION}|'"${PRODUCTION}"'|g' /usr/share/nginx/html/assets/config.js
sed -i 's|${WS_URL}|'"${WS_URL}"'|g' /usr/share/nginx/html/assets/config.js
sed -i 's|${STRIPE_PUBLISHABLE_KEY}|'"${STRIPE_PUBLISHABLE_KEY}"'|g' /usr/share/nginx/html/assets/config.js

exec "$@"