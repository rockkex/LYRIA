#!/usr/bin/env python3
"""Extract text content + structure from lyria.html for copy analysis."""
import re, html

raw = open('/home/z/my-project/.zscripts/lyria.html', encoding='utf-8').read()

# Extract section headings and text
body = raw[raw.find('<body'):]
# Mark structural elements
body = re.sub(r'<(h1|h2|h3|h4)[^>]*>', lambda m: f"\n\n[{m.group(1).upper()}] ", body)
body = re.sub(r'</(h1|h2|h3|h4)>', '\n', body)
body = re.sub(r'<(p|li|div|section|footer|button|label|option|span)[^>]*>', '\n', body)
body = re.sub(r'<script[\s\S]*?</script>', '', body)
body = re.sub(r'<style[\s\S]*?</style>', '', body)
text = re.sub(r'<[^>]+>', ' ', body)
text = html.unescape(text)
lines = [re.sub(r'\s+', ' ', l).strip() for l in text.split('\n')]
out, prev = [], None
for l in lines:
    if l and l != prev:
        out.append(l)
        prev = l
print('\n'.join(out))
