# Carolina Ink

Django website prepared for Render's Python runtime.

## Local development

Use Python 3.13.5, then run:

```sh
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Visit http://127.0.0.1:8000/. The existing `/app/` URL also works.
Local development uses SQLite. Settings read environment variables directly;
the project does not automatically load `.env` files.

## Deploy an existing Render service

Commit and push these changes, then configure your Python web service:

| Setting | Value |
| --- | --- |
| Root Directory | Repository root (leave blank) |
| Build Command | `./build.sh` |
| Start Command | `python -m gunicorn shop.wsgi:application --bind 0.0.0.0:$PORT` |
| Health Check Path | `/app/` |
| Python | `3.13.5` (from `.python-version`) |

Set these environment variables in Render before redeploying:

- `SECRET_KEY`: a generated, private random value.
- `DATABASE_URL`: your Render PostgreSQL database's internal connection URL.
  Keep the database and web service in the same region.
- `WEB_CONCURRENCY`: `2`.
- `ALLOWED_HOSTS`: optional comma-separated custom domain names, without schemes.
  The Render hostname is allowed automatically.

If the service has a `PYTHON_VERSION` environment variable, set it to `3.13.5`
or remove it so `.python-version` controls the runtime.
Render sets `RENDER=true` and `RENDER_EXTERNAL_HOSTNAME` automatically.
The build installs dependencies, collects static assets, and applies database
migrations. WhiteNoise serves the collected CSS and JavaScript with debug off.

## Create a service with a Blueprint

Choose **New > Blueprint** in Render and select this repository. The
`render.yaml` file defines the web service, generates its secret key, and prompts
for `DATABASE_URL`. Supply your existing database's internal connection URL;
the Blueprint does not create a database. For an existing service, use the
manual settings above, or change the Blueprint's service name to match it before
importing. Secret variables added to an existing Blueprint must be set manually.

See [Render's Django guide](https://render.com/docs/deploy-django) and
[Blueprint reference](https://render.com/docs/blueprint-spec).
