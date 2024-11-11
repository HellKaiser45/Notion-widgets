# Simple Banner Notion Widget

## Project Structure

```
.
├── config/
│   └── nginx/
│       └── my-nginx.conf
├── docker/
│   ├── Dockerfile
│   └── entrypoint.sh
├── docs/
│   └── README.md
├── scripts/
│   └── generate_sitemap.sh
└── src/
    ├── index.html
    ├── manifest.json
    ├── robot.txt
    ├── script.js
    ├── style.css
    └── ui/
        ├── index.html
        ├── jscolor.js
        ├── script.js
        └── style.css
```

## Docker Configuration

This project uses Nginx as the web server and is containerized for easy deployment.

### Environment Variables

- `SITE_ORIGIN`: The base URL for the website (required)

### Building the Docker Image

```bash
docker build -t simple-banner-widget -f docker/Dockerfile .
```

### Running the Container

```bash
docker run -p 80:80 -e SITE_ORIGIN=https://example.com simple-banner-widget
```

## Sitemap Generation

A custom script (`generate_sitemap.sh`) dynamically generates a sitemap.xml during container startup.

## Nginx Configuration

The nginx configuration is templated and uses environment variable substitution for flexible deployment.
