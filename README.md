# Telescope

## Run

```bash
mkdir telescope
cd telescope
curl -L https://raw.githubusercontent.com/lcnem/telescope/main/projects/main/config.js.template -o config.js
curl -O https://raw.githubusercontent.com/lcnem/telescope/main/projects/main/docker-compose.yml
curl -O https://raw.githubusercontent.com/lcnem/telescope/main/projects/main/nginx.conf
docker-compose up -d
```
