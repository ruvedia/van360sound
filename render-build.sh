#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current directory: $(pwd)"

# Check if we are in the root and need to cd into backend
if [ -d "backend" ]; then
  echo "Changing directory to backend..."
  cd backend
fi

echo "STARTING BUILD..."
python -m pip install --upgrade pip setuptools wheel
python -m pip install psycopg2-binary
python -m pip install -r requirements.txt

echo "COLLECTING STATIC..."
python manage.py collectstatic --no-input

echo "MIGRATING DATABASE..."
python manage.py migrate --no-input

echo "BUILD FINISHED"
