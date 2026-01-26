#!/usr/bin/env bash
# exit on error
set -o errexit

pip install --upgrade pip
pip install -r requirements.txt
pip install psycopg2-binary

python manage.py collectstatic --no-input
python manage.py migrate
