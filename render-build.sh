#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Python dependencies
pip install -r backend/requirements.txt

# Run migrations (optional if using SQLite on free tier, but good practice)
python backend/manage.py migrate
