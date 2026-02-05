#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend

echo "STARTING BUILD..."

python -m pip install --upgrade pip
echo "INSTALLING REQUIREMENTS..."
python -m pip install -r requirements.txt || echo "PIP INSTALL FAILED"

echo "COLLECTING STATIC..."
python manage.py collectstatic --no-input || echo "COLLECTSTATIC FAILED"

echo "LOADING DATA..."
python manage.py loaddata db_dump.json || echo "WARNING: loaddata failed but continuing deployment"

echo "BUILDING ADMIN..."
python build_admin.py || echo "WARNING: build_admin failed but continuing deployment"

echo "BUILD FINISHED"
