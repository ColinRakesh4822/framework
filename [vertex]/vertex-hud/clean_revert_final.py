import subprocess
import os

hud_dir = r"d:\FiveM Development\FiveM local hosts\mythic\txData\vertex.base\resources\[vertex]\vertex-hud"
cwd = r"d:\FiveM Development\FiveM local hosts\mythic\txData\vertex.base\resources"

def restore():
    print("Reverting all HUD modifications from Git history...")
    res = subprocess.run(['git', 'checkout', '--', r'[vertex]/vertex-hud/client/hud.lua', r'[vertex]/vertex-hud/client/interaction.lua', r'[vertex]/vertex-hud/server/server.lua'], cwd=cwd, capture_output=True, text=True)
    if res.returncode == 0:
         print("Restored all HUD files to original HEAD state successfully.")
    else:
         print(f"Failed to restore using git: {res.stderr}")

restore()

# Cleanup any lingering trace scripts
residual_scripts = ["find_hash.py", "apply_hud_fix2.py", "clean_revert.py", "safe_fix.py", "safe_fix2.py", "safe_fix3.py", "revert_fix.py", "revert_fix2.py", "revert_and_patch.py", "fix_hud_final.py", "apply_hud_fix.py", "update_hud.py", "update_hud.ps1", "fix_deps.ps1"]
for item in residual_scripts:
    p = os.path.join(hud_dir, item)
    if os.path.exists(p):
         os.remove(p)
