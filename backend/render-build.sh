#!/usr/bin/env bash
# exit on error
set -o errexit

cd backend

python -m pip install --upgrade pip
python -m pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
python manage.py loaddata db_dump.json
python build_admin.py
