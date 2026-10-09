"""Extract Contacts-only vector assets from the permitted view-only SVG export."""
import copy
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

root = Path(__file__).resolve().parent.parent
ns = 'http://www.w3.org/2000/svg'
ET.register_namespace('', ns)
nodes = {n.get('id'): n for n in ET.parse(root / 'design-reference/contacts.svg').iter() if n.get('id')}
specs = {
    'contacts-add': ('Add', (341, 140, 14, 14)),
    'contacts-search-small': ('Search', (255, 135, 16, 16)),
    'contacts-search': ('Search_3', (1228, 134, 24, 24)),
    'contacts-grid': ('Frame_2', (1280, 137, 20, 20)),
    'contacts-dropdown': ('Arrow drop down_2', (1305, 138, 16, 16)),
    'contacts-prev': ('Keyboard arrow left', (684, 1088, 16, 16)),
    'contacts-next': ('Keyboard arrow right', (886, 1088, 16, 16)),
}
manifest_path = root / 'public/assets/manifest.json'
manifest = [item for item in json.loads(manifest_path.read_text()) if not item['file'].startswith('contacts-')]
for name, (layer, box) in specs.items():
    svg = ET.Element(f'{{{ns}}}svg', {'width':str(box[2]), 'height':str(box[3]), 'viewBox':' '.join(map(str, box)), 'fill':'none'})
    node = copy.deepcopy(nodes[layer])
    svg.append(node)
    defs = ET.SubElement(svg, f'{{{ns}}}defs')
    seen = set()
    def dependencies(element):
        for item in element.iter():
            for key, value in item.attrib.items():
                refs = re.findall(r'url\(#([^)]*)\)', value)
                if key.endswith('href') and value.startswith('#'):
                    refs.append(value[1:])
                for ref in refs:
                    if ref not in seen and ref in nodes:
                        seen.add(ref)
                        dep = copy.deepcopy(nodes[ref])
                        defs.append(dep)
                        dependencies(dep)
    dependencies(node)
    ET.ElementTree(svg).write(root / f'public/assets/{name}.svg', encoding='utf-8', xml_declaration=True)
    manifest.append({'file':f'{name}.svg', 'figmaLayer':layer, 'figmaNode':'28:430', 'viewBox':list(box)})
manifest_path.write_text(json.dumps(manifest, indent=2))
print(f'Exported {len(specs)} Contacts assets.')
