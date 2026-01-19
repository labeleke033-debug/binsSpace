set -euo pipefail

BRANCH="${1:-main}"

cd /opt/zuobin-blog/binsSpace

git fetch --all
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd

docker compose down --remove-orphans
docker compose build --no-cache --pull
docker compose up -d --force-recreate

docker image prune -f
echo "Deployed $(git rev-parse --short HEAD)"
EOF

chmod +x deploy.sh