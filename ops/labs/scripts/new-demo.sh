#!/usr/bin/env sh
set -eu

slug="${1:-}"
port="${2:-}"

if [ -z "$slug" ] || [ -z "$port" ]; then
  echo "usage: $0 <slug> <port>" >&2
  exit 1
fi

case "$slug" in
  *[!a-z0-9-]* )
    echo "slug must be lowercase [a-z0-9-]" >&2
    exit 1
  ;;
esac

root_dir="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
final_demo_dir="$root_dir/demos/$slug"

if [ -e "$final_demo_dir" ]; then
  echo "demo already exists: $final_demo_dir" >&2
  exit 1
fi

demo_dir="$(mktemp -d "$root_dir/demos/.${slug}.XXXXXX")"
cleanup() {
  rm -rf "$demo_dir"
}
trap cleanup EXIT HUP INT TERM

cat > "$demo_dir/package.json" <<EOF
{
  "name": "bluedot-labs-${slug}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.19.2"
  }
}
EOF

cat > "$demo_dir/server.js" <<'EOF'
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 3000);
const basePath = (process.env.BASE_PATH || '/demo').replace(/\/$/, '');

app.get(`${basePath}/`, (req, res) => {
  res.type('html').send(`<!doctype html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Labs demo</title></head>
<body style="font-family:system-ui; padding:16px">
  <h1>Demo: ${basePath}</h1>
  <p>Wire me into <code>ops/labs/docker-compose.yml</code> + <code>ops/labs/nginx/conf.d/routes.conf</code>.</p>
  <p><a href="/">Back to Labs index</a></p>
</body>
</html>`);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`demo listening on :${port} (basePath=${basePath})`);
});
EOF

cat > "$demo_dir/Dockerfile" <<'EOF'
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.js ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
EOF

(cd "$demo_dir" && npm install --package-lock-only --ignore-scripts --no-audit --no-fund)

mv "$demo_dir" "$final_demo_dir"
demo_dir="$final_demo_dir"
trap - EXIT HUP INT TERM

echo "created demo template at: $demo_dir"
echo "next:" 
echo "  1) add a service to ops/labs/docker-compose.yml (build: ./demos/$slug, BASE_PATH=/$slug)"
echo "  2) add a location block to ops/labs/nginx/conf.d/routes.conf (location ^~ /$slug/)"
