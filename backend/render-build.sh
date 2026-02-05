#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py loaddata db_dump.json || echo "WARNING: loaddata failed but continuing deployment"
python build_admin.py || echo "WARNING: build_admin failed but continuing deployment"
