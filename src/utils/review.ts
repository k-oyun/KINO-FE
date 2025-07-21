function extractFirstImageUrl(html: string): string | null {
  const match = html.match(/<img [^>]*src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

function extractFirstImageHtml(html: string): string | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const firstImg = doc.querySelector("img");
  return firstImg ? firstImg.outerHTML : null;
}

export { extractFirstImageUrl, extractFirstImageHtml };
