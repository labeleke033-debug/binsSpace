set -euo pipefail

BRANCH="${1:-main}"

cd /opt/zuobin-blog/binsSpace

echo "==> Sync code ($BRANCH)"
git fetch --all
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd

echo "==> Stop old containers"
docker compose down --remove-orphans || true

# ✅ 防止“同名残留容器”导致冲突（你这次就是这个问题）
docker rm -f binbin-blog 2>/dev/null || true

echo "==> Build & start"
docker compose build --no-cache --pull
docker compose up -d --force-recreate

echo "==> Cleanup images"
docker image prune -f

echo "==> Done: $(git rev-parse --short HEAD)"

chmod +x deploy.sh