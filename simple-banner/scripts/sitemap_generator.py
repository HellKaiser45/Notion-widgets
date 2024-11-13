#!/usr/bin/env python3

import os
import sys
import logging
import traceback
import urllib.parse

# Configure logging early and comprehensively
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),  # Log to console
        logging.FileHandler('/var/log/sitemap_generator.log', mode='a')  # Log to file
    ]
)

# Verify imports before main logic
try:
    from datetime import datetime
    import xml.etree.ElementTree as ET
    from xml.dom import minidom
except ImportError as e:
    logging.error(f"Import error: {e}")
    sys.exit(1)

def log_exception(e):
    """Log detailed exception information"""
    logging.error(f"Exception occurred: {e}")
    logging.error(traceback.format_exc())

# Validate required environment variables
site_origin = os.environ.get('SITE_ORIGIN', 'localhost')

# Configuration Parameters
BASE_URL = f'http://{site_origin}'
OUTPUT_PATH = os.environ.get('SITEMAP_PATH', '/var/www/html/sitemap.xml')
FREQUENCY = os.environ.get('SITEMAP_FREQUENCY', 'daily')
PRIORITY = float(os.environ.get('SITEMAP_PRIORITY', '0.8'))
EXCLUDE_PATHS = os.environ.get('SITEMAP_EXCLUDE_PATHS', '/admin/,/login/,/private/').split(',')
EXCLUDE_EXTENSIONS = os.environ.get('SITEMAP_EXCLUDE_EXTENSIONS', '.pdf,.jpg,.png,.gif').split(',')

class SitemapGenerator:
    def __init__(self, base_path='/var/www/html'):
        self.urls = set()
        self.base_path = base_path
        logging.info(f"Initializing SitemapGenerator for {BASE_URL}")

    def is_valid_url(self, url):
        """Check if URL should be included in sitemap"""
        try:
            parsed = urllib.parse.urlparse(url)

            # Check excluded paths
            if any(excluded.strip() in parsed.path for excluded in EXCLUDE_PATHS):
                return False

            # Check excluded extensions
            if any(url.endswith(ext.strip()) for ext in EXCLUDE_EXTENSIONS):
                return False

            return True
        except Exception as e:
            log_exception(e)
            return False

    def clean_url(self, url):
        """Clean and normalize URL"""
        # Remove 'index.html' from URLs
        url = url.replace('/index.html', '/')

        # Ensure single trailing slash for root paths
        if url.endswith('/index') or url.endswith('/index/'):
            url = url.replace('/index', '/')

        # Normalize URL
        url = url.replace('\\', '/')

        return url

    def crawl_filesystem(self, directory=None):
        """Crawl filesystem to find HTML pages"""
        if directory is None:
            directory = self.base_path

        logging.info(f"Crawling directory: {directory}")

        for root, _, files in os.walk(directory):
            for file in files:
                if file.endswith('.html'):
                    # Create full file path
                    full_path = os.path.join(root, file)

                    # Create relative URL from base path
                    relative_path = os.path.relpath(full_path, self.base_path)
                    url = urllib.parse.urljoin(BASE_URL, relative_path)

                    # Clean and normalize URL
                    url = self.clean_url(url)

                    if self.is_valid_url(url):
                        self.urls.add(url)
                        logging.info(f"Added URL: {url}")

    def generate_sitemap(self):
        """Generate sitemap XML"""
        # Crawl filesystem to find pages
        self.crawl_filesystem()

        # If no URLs were found, create a minimal sitemap with base URL
        if not self.urls:
            logging.warning("No URLs found. Creating minimal sitemap.")
            self.urls.add(BASE_URL + '/')

        logging.info(f"Generating sitemap with {len(self.urls)} URLs")

        urlset = ET.Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

        for url in sorted(self.urls):
            url_element = ET.SubElement(urlset, 'url')

            # Add location
            loc = ET.SubElement(url_element, 'loc')
            loc.text = url

            # Add last modified date
            lastmod = ET.SubElement(url_element, 'lastmod')
            lastmod.text = datetime.now().strftime('%Y-%m-%d')

            # Add change frequency
            changefreq = ET.SubElement(url_element, 'changefreq')
            changefreq.text = FREQUENCY

            # Add priority
            priority = ET.SubElement(url_element, 'priority')
            priority.text = str(PRIORITY)

        # Create pretty XML
        xml_str = minidom.parseString(ET.tostring(urlset)).toprettyxml(indent="  ")

        # Save sitemap
        try:
            with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
                f.write(xml_str)
            logging.info(f"Sitemap generated successfully at {OUTPUT_PATH}")

            # Debug: Print sitemap contents
            with open(OUTPUT_PATH, 'r') as f:
                logging.info("Sitemap contents:")
                logging.info(f.read())
        except Exception as e:
            log_exception(e)

def main():
    try:
        logging.info(f"Starting sitemap generation for {BASE_URL}")
        generator = SitemapGenerator()

        generator.generate_sitemap()

        logging.info("Sitemap generation completed successfully")
    except Exception as e:
        log_exception(e)
        sys.exit(1)

if __name__ == "__main__":
    main()
