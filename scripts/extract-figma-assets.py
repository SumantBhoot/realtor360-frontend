"""Preserve exported Figma asset subtrees and their referenced definitions."""
import copy
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
NS = 'http://www.w3.org/2000/svg'
ET.register_namespace('', NS)
ET.register_namespace('xlink', 'http://www.w3.org/1999/xlink')
tree = ET.parse(ROOT / 'design-reference/home.svg')
nodes = {n.get('id'): n for n in tree.iter() if n.get('id')}
specs = {
 'logo': ('Logo', (26, 17, 140, 30)),
 'stat-listing': ('Frame 9144', (39, 95, 38, 38)),
 'stat-leads': ('Frame 9142', (314, 95, 38, 38)),
 'stat-closed': ('Frame 9146', (589, 95, 38, 38)),
 'stat-revenue': ('Frame 9148', (864, 95, 38, 38)),
 'profile': ('User profile', (1355, 15, 35, 35)),
 'lead-one': ('Ellipse 261', (481, 974, 30, 30)),
 'lead-two': ('Ellipse 262', (501, 974, 30, 30)),
 'reminder-one': ('Ellipse 261_5', (1150, 186, 20, 20)),
 'reminder-two': ('Ellipse 262_5', (1160, 186, 20, 20)),
 'reminder-three': ('Ellipse 263', (1170, 186, 20, 20)),
 'reminder-four': ('Ellipse 264', (1180, 186, 20, 20)),
 'contact-john': ('Ellipse 256', (871, 931, 35, 35)),
 'contact-jessica': ('Ellipse 257', (871, 977, 35, 35)),
 'contact-evan': ('Ellipse 258', (871, 1023, 35, 35)),
 'contact-jack': ('Ellipse 259', (871, 1069, 35, 35)),
 'contact-emily': ('Ellipse 260', (871, 1115, 35, 35)),
 'property-maplewood': ('Rectangle 34625398', (58, 974, 30, 30)),
 'property-serenity': ('Rectangle 34625399', (58, 1014, 30, 30)),
 'property-rosehill': ('Rectangle 34625400', (58, 1054, 30, 30)),
 'property-skyline': ('Rectangle 34625401', (58, 1094, 30, 30)),
 'lead-source': ('charts', (146, 262, 290, 230)),
 'stage-bars': ('bars', (644, 253, 392, 149)),
 'sales-bars': ('Frame 9089', (74, 587, 450, 75)),
 'search': ('Search', (1295, 20, 24, 24)),
 'call': ('Call', (1076, 941, 14, 14)),
 'arrow-left': ('Keyboard arrow left', (1324, 486, 28, 28)),
 'arrow-right': ('Keyboard arrow right', (1376, 486, 28, 28)),
 'arrow-down': ('Arrow drop down', (1395, 20, 20, 24)),
}
manifest = []
for filename, (node_id, (x, y, w, h)) in specs.items():
    node = copy.deepcopy(nodes[node_id])
    svg = ET.Element(f'{{{NS}}}svg', {'width':str(w), 'height':str(h), 'viewBox':f'{x} {y} {w} {h}', 'fill':'none'})
    svg.append(node)
    defs = ET.SubElement(svg, f'{{{NS}}}defs')
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
    destination = ROOT / 'public/assets' / f'{filename}.svg'
    ET.ElementTree(svg).write(destination, encoding='utf-8', xml_declaration=True)
    manifest.append({'file':f'{filename}.svg','figmaLayer':node_id,'viewBox':[x,y,w,h]})
# Preserve the original ring paths without the desktop annotation arrows on phones.
mobile_ring = ET.Element(f'{{{NS}}}svg', {'width':'230', 'height':'230', 'viewBox':'179 262 230 230', 'fill':'none'})
for path in nodes['charts'].iter(f'{{{NS}}}path'):
    if path.get('id') in {'vector', 'vector_2', 'vector_3', 'vector_4'}:
        mobile_ring.append(copy.deepcopy(path))
assert len(mobile_ring) == 4, 'Expected four original lead source segments'
ET.ElementTree(mobile_ring).write(ROOT / 'public/assets/lead-source-mobile.svg', encoding='utf-8', xml_declaration=True)
manifest.append({'file':'lead-source-mobile.svg', 'figmaLayer':'charts (original ring paths)', 'viewBox':[179,262,230,230]})
(ROOT / 'public/assets/manifest.json').write_text(json.dumps(manifest, indent=2))
print(f'Exported {len(manifest)} original Figma assets.')
