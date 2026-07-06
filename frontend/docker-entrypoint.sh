set -eu
cp -r /app/dist/. /usr/share/nginx/html/
exec tail -f /dev/null
