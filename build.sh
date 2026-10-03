#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

cd "$(dirname "$0")"

python -m pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate --noinput
