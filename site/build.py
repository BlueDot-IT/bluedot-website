"""Build the public spatial site with Python's standard library only."""
from pathlib import Path
import argparse
import shutil
import tempfile
from documents import build_documents, build_flow

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT.parent / 'public' / 'spatial'


def render(output: Path) -> None:
    output.mkdir(parents=True, exist_ok=True)
    page = (ROOT / 'index.template.html').read_text(encoding='utf-8')
    for marker, filename in [('DOCUMENT_STYLES', 'documents.css'), ('FLOW_STYLES', 'flow.css'), ('STYLES', 'styles.css'), ('ASSETS', 'assets.js'), ('ENGINE', 'engine.js'), ('UI', 'ui.js'), ('CONTACT', 'contact.js')]:
        token = '/*' + marker + '*/'
        if page.count(token) != 1:
            raise ValueError(f'Expected exactly one template marker: {marker}')
        page = page.replace(token, (ROOT / 'src' / filename).read_text(encoding='utf-8'), 1)
    if page.count('<!--FLOW-->') != 1:
        raise ValueError('Expected one flow content marker')
    page = page.replace('<!--FLOW-->', build_flow())
    (output / 'index.html').write_text(page, encoding='utf-8')
    build_documents(output)
    shutil.copyfile(ROOT / 'src' / 'documents.css', output / 'documents.css')
    shutil.copyfile(ROOT / 'src' / 'contact.js', output / 'contact.js')
    for name in ['assets.js', 'engine.js']:
        shutil.copyfile(ROOT / 'src' / name, output / name)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Verify generated output without changing it.')
    parser.add_argument('--standalone', type=Path, help='Also export the self-contained homepage.')
    args = parser.parse_args()
    if args.check:
        with tempfile.TemporaryDirectory(prefix='bluedot-public-check-') as directory:
            candidate = Path(directory)
            render(candidate)
            if OUTPUT.exists() and {p.name for p in OUTPUT.iterdir()} != {p.name for p in candidate.iterdir()}:
                raise SystemExit("Output file set differs from the public build. Inspect unexpected files before continuing.")
            for file in candidate.iterdir():
                target = OUTPUT / file.name
                if not target.is_file() or target.read_bytes() != file.read_bytes():
                    raise SystemExit(f'Stale or absent output: {file.name}. Run python3 site/build.py.')
        print('Public spatial build is current.')
    else:
        render(OUTPUT)
        if args.standalone:
            args.standalone.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(OUTPUT / 'index.html', args.standalone)
        print('Built public spatial homepage and document pages.')


if __name__ == '__main__':
    main()
