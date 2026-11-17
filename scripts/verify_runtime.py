"""Require the exact private model before building a deployment bundle."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
lock = json.loads((ROOT / 'runtime-lock.json').read_text())
for name, expected in lock['files'].items():
    path = ROOT / 'private-runtime' / name
    if not path.is_file():
        raise SystemExit(f'Missing {path.relative_to(ROOT)}. Follow README.md to clone the private runtime.')
    if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
        raise SystemExit(f'Runtime mismatch: {name}. Check out commit {lock["commit"]} in private-runtime/.')
print('Private runtime matches the locked deployment version.')
