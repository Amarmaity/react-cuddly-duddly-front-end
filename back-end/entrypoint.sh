#!/bin/sh

# কোনো command fail করলে script বন্ধ হয়ে যাবে
set -e

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn server..."
exec "$@"