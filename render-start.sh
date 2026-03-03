#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current directory: $(pwd)"

if [ -d "backend" ]; then
  echo "Changing directory to backend..."
  cd backend
fi

echo "STARTING GUNICORN..."
gunicorn van360sound.wsgi:application --bind 0.0.0.0:${PORT:-10000} --workers 1 --log-level debug --access-logfile -
