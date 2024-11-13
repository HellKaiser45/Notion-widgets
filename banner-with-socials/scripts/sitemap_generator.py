#!/usr/bin/env python3

import os
import sys
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from datetime import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom

# Validate required environment variables
if not os.environ.get('SITE_ORIGIN'):
    print("Error: SITE_ORIGIN environment variable is not set.", file=sys.stderr)
    sys.exit(1)

# Configuration Parameters
BASE_URL = os.environ.get('SITE_ORIGIN')
OUTPUT_PATH = os.environ.get('SITEMAP_PATH', '/var/www/html/sitemap.xml')
FREQUENCY = os.environ.get('SITEMAP_FREQUENCY', 'daily')
PRIORITY = float(os.environ.get('SITEMAP_PRIORITY', '0.8'))
EXCLUDE_PATHS = os.environ.get('SITEMAP_EXCLUDE_PATHS', '/admin/,/login/,/private/').split(',')
EXCLUDE_EXTENSIONS = os.environ.get('SITEMAP_EXCLUDE_EXTENSIONS', '.pdf,.jpg,.png,.gif').split(',')
REQUEST_TIMEOUT = int(os.environ.get('SITEMAP_TIMEOUT', '10'))
USER_AGENT = os.environ.get('SITEMAP_USER_AGENT', 'SitemapGenerator/1.0')

class SitemapGenerator:
    def __init__(self):
        self.urls = set()
        self.headers = {'User-Agent': USER_AGENT}

    def is_valid_url(self, url):
        """Check if URL should be included in sitemap"""
        parsed = urlparse(url)

        # Check if URL is from the same domain
        if parsed.netloc and parsed.netloc not in urlparse(BASE_URL).netloc:
            return False

        # Check excluded paths
        if any(excluded.strip() in parsed.path for excluded in EXCLUDE_PATHS):
            return False

        # Check excluded extensions
        if any(parsed.path.endswith(ext.strip()) for ext in EXCLUDE_EXTENSIONS):
            return False

        return True

    def crawl(self, url):
        """Crawl website recursively"""
        if url in self.urls:
            return

        try:
            response = requests.get(url, headers=self.headers, timeout=REQUEST_TIMEOUT)
            if response.status_code != 200:
                return

            self.urls.add(url)

            # Parse HTML content
            soup = BeautifulSoup(response.text, 'html.parser')

            # Find all links
            for link in soup.find_all('a', href=True):
                href = link['href']
                full_url = urljoin(url, href)

                if self.is_valid_url(full_url):
                    self.crawl(full_url)

        except Exception as e:
            print(f"Error crawling {url}: {e}", file=sys.stderr)

    def generate_sitemap(self):
        """Generate sitemap XML"""
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
            print(f"Sitemap generated successfully at {OUTPUT_PATH}")
        except Exception as e:
            print(f"Error writing sitemap: {e}", file=sys.stderr)

def main():
    # Ensure BASE_URL has a scheme
    if not BASE_URL.startswith(('http://', 'https://')):
        base_url = f'http://{BASE_URL}'
    else:
        base_url = BASE_URL

    generator = SitemapGenerator()
    generator.crawl(base_url)
    generator.generate_sitemap()

if __name__ == "__main__":
    main()
