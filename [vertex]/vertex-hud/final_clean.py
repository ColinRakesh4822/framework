import subprocess
import os

hud_dir = r"d:\FiveM Development\FiveM local hosts\mythic\txData\vertex.base\resources\[vertex]\vertex-hud"

def git_revert(relative_path):
    filepath = os.path.join(hud_dir, relative_path)
    if not os.path.exists(filepath):
         print(f"Skipping {relative_path} - not found")
         return
    try:
         # Git show HEAD file content
         cmd = f'git show HEAD:vertex-hud/{relative_path}'
         # Actually we can run from parent resources directory
         cwd = r"d:\FiveM Development\FiveM local hosts\mythic\txData\vertex.base\resources"
         cmd = f'git show HEAD:[vertex]/vertex-hud/{relative_path}'
         res = subprocess.run(['git', 'show', f'HEAD:[vertex]/vertex-hud/{relative_path}'], cwd=cwd, capture_output=True, text=True, encoding='latin-1')
         if res.returncode == 0:
              with open(filepath, 'w', encoding='latin-1') as f:
                   f.write(res.stdout)
              print(f"Restored {relative_path} from Git HEAD")
         else:
              print(f"Git failed for {relative_path}: {res.stderr}")
    except Exception as e:
         print(f"Error reverting {relative_path}: {e}")

git_revert("client/hud.lua")
git_revert("client/interaction.lua")
git_revert("server/server.lua")

# Clean up any residual clean_revert scripts
for p in ["clean_revert.py"]:
    fpath = os.path.join(hud_dir, p)
    if os.path.exists(fpath):
         os.remove(fpath)
