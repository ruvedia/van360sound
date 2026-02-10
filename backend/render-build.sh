#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current directory: $(pwd)"
ls -la

# Check if we are in the root and need to cd into backend
if [ -d "backend" ]; then
  echo "Changing directory to backend..."
  cd backend
fi

echo "New directory: $(pwd)"
ls -la

echo "STARTING BUILD..."

echo "UPGRADING PIP AND SETUPTOOLS..."
python -m pip install --upgrade pip setuptools wheel

echo "INSTALLING PSYCOPG2-BINARY..."
# Install psycopg2-binary separately to ensure it has precedence
python -m pip install psycopg2-binary

echo "INSTALLING REQUIREMENTS..."
# Remove || echo ... so it actually fails if installation fails
python -m pip install -r requirements.txt

echo "COLLECTING STATIC..."
python manage.py collectstatic --no-input

echo "BUILDING ADMIN..."
# Check if build_admin.py exists before running
if [ -f "build_admin.py" ]; then
    python build_admin.py
else
    echo "WARNING: build_admin.py not found, skipping."
fi

echo "BUILD FINISHED"
