"""Build the editable site, access form and shared ribbon into public/."""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src'
PUBLIC = ROOT / 'public'
site = SOURCE / 'site'
(PUBLIC / 'index.html').write_text((site / 'index.html').read_text().replace('__BUILD__', '20261026'))
shutil.copy2(site / 'style.css', PUBLIC / 'assets/site.css')
(PUBLIC / 'assets/site.js').write_text(
    '/* NeuralThermal review site · built from source/src (logo.js, content.js, app.js) */\n'
    + '\n'.join((site / name).read_text() for name in ['logo.js', 'content.js', 'app.js'])
)
for name in ['index.html', 'style.css', 'privacy.html']:
    shutil.copy2(SOURCE / 'access' / name, PUBLIC / 'access' / name)
shutil.copy2(SOURCE / 'api-studio/site-shell.css', PUBLIC / 'api-studio/site-shell.css')
ribbon = (SOURCE / 'labs/ribbon.css').read_text()
for path in [*PUBLIC.glob('tools/*/index.html'), *PUBLIC.glob('labs/*/index.html')]:
    html = path.read_text()
    updated, count = re.subn(r'<style id="nt-ribbon-style">[\s\S]*?</style>', lambda _: '<style id="nt-ribbon-style">\n' + ribbon + '</style>', html)
    if count != 1:
        raise SystemExit(f'Expected one shared ribbon block in {path.relative_to(ROOT)}, found {count}')
    path.write_text(updated)
print('Built site, access form styles and six lab ribbons.')
