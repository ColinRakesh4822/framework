import os
import hashlib

def get_files_with_hashes(root_dir):
    files_dict = {}
    for dirpath, _, filenames in os.walk(root_dir):
        for f in filenames:
            fullpath = os.path.join(dirpath, f)
            relpath = os.path.relpath(fullpath, root_dir)
            try:
                with open(fullpath, 'rb') as file_obj:
                    # Just size is enough for quick comparison or MD5
                    file_size = os.path.getsize(fullpath)
                    files_dict[relpath] = file_size
            except Exception:
                pass
    return files_dict

source = r"D:\FiveM Development\FiveM local hosts\vertex\server\resources\[ox]\ox_inventory\web"
target = r"d:\FiveM Development\FiveM local hosts\mythic\txData\vertex.base\resources\[vertex]\vertex-inventory\ui"

print(f"Comparing:")
print(f"Source: {source}")
print(f"Target: {target}")

src_files = get_files_with_hashes(source)
tgt_files = get_files_with_hashes(target)

only_src = set(src_files.keys()) - set(tgt_files.keys())
only_tgt = set(tgt_files.keys()) - set(src_files.keys())

common = set(src_files.keys()) & set(tgt_files.keys())
different = []

for f in common:
    if src_files[f] != tgt_files[f]:
        different.append(f)

print(f"\nFiles only in Source ({len(only_src)}):")
for f in sorted(only_src)[:10]:
    print(f"  + {f}")
if len(only_src) > 10:
    print(f"  ... and {len(only_src)-10} more")

print(f"\nFiles only in Target ({len(only_tgt)}):")
for f in sorted(only_tgt)[:10]:
    print(f"  - {f}")
if len(only_tgt) > 10:
    print(f"  ... and {len(only_tgt)-10} more")

print(f"\nFiles that differ in size ({len(different)}):")
for f in sorted(different)[:10]:
    print(f"  * {f} (Src: {src_files[f]} vs Tgt: {tgt_files[f]})")
if len(different) > 10:
    print(f"  ... and {len(different)-10} more")
