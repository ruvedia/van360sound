#!/usr/bin/env bash
# exit on error
set -o errexit

echo "MIGRATING DATABASE..."
python manage.py migrate --no-input

echo "LOADING DATA FROM db_dump.json..."
# Probar en ambas ubicaciones posibles
if [ -f "../db_dump.json" ]; then
    python manage.py loaddata ../db_dump.json -v 2
elif [ -f "db_dump.json" ]; then
    python manage.py loaddata db_dump.json -v 2
else
    echo "WARNING: db_dump.json NOT FOUND!"
fi

echo "STARTING GUNICORN..."
gunicorn van360sound.wsgi:application --bind 0.0.0.0:${PORT:-10000} --workers 1 --log-level debug --access-logfile -
