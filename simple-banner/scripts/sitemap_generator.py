#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from datetime import datetime
import xml.etree.ElementTree as ET
from xml.dom import minidom
import os

# Configuration Parameters
BASE_URL = os.environ.get('SITE_ORIGIN')
OUTPUT_PATH = os.environ.get('SITEMAP_PATH')
FREQUENCY = os.environ.get('SITEMAP_FREQUENCY')
PRIORITY = float(os.environ.get('SITEMAP_PRIORITY'))
EXCLUDE_PATHS = os.environ.get('SITEMAP_EXCLUDE_PATHS').split(',')
EXCLUDE_EXTENSIONS = os.environ.get('SITEMAP_EXCLUDE_EXTENSIONS').split(',')
REQUEST_TIMEOUT = int(os.environ.get('SITEMAP_TIMEOUT'))
USER_AGENT = os.environ.get('SITEMAP_USER_AGENT')

class SitemapGenerator:
    def __init__(self):
        self.urls = set()
        self.headers = {'User-Agent': USER_AGENT}

    def is_valid_url(self, url):
        """Check if URL should be included in sitemap"""
        parsed = urlparse(url)

        # Check if URL is from the same domain
        if parsed.netloc and parsed.netloc not in BASE_URL:
            return False

        # Check excluded paths
        if any(excluded in parsed.path for excluded in EXCLUDE_PATHS):
            return False

        # Check excluded extensions
        if any(parsed.path.endswith(ext) for ext in EXCLUDE_EXTENSIONS):
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
            print(f"Error crawling {url}: {e}")

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
        with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
            f.write(xml_str)

def main():
    generator = SitemapGenerator()
    generator.crawl(BASE_URL)
    generator.generate_sitemap()
    print(f"Sitemap generated successfully at {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
