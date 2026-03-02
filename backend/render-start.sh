#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current directory: $(pwd)"

if [ -d "backend" ]; then
  echo "Changing directory to backend..."
  cd backend
fi

echo "MIGRATING DATABASE..."
python manage.py migrate --no-input

echo "LOADING DATA FROM db_dump.json..."
if [ -f "db_dump.json" ]; then
    python manage.py loaddata db_dump.json -v 2
else
    echo "ERROR: db_dump.json NOT FOUND in $(pwd)"
    ls -la
    exit 1
fi

echo "STARTING GUNICORN..."
gunicorn van360sound.wsgi:application --bind 0.0.0.0:${PORT:-10000} --workers 1 --log-level debug --access-logfile -
