client_script '@ElectronAC/src/include/client.lua'


------------------------------------------------------------------------------------
-- CircuitRP Weapons
-- Designed & Written By akaLucifer#0103
-- Releasing or Claiming this as your own is against, this resources License
------------------------------------------------------------------------------------
fx_version "adamant"
game "gta5"

files {
  "data/**/weaponcomponents.meta",
  "data/**/weaponarchetypes.meta",
  "data/**/weaponanimations.meta",
  "data/**/pedpersonality.meta",
  "data/**/loadouts.meta",
  "data/**/pickups.meta",
  "data/**/ptfxassetinfo.meta",
  "data/**/shop_weapon.meta",
  "data/**/explosionfx.dat",
  "data/**/weapons.meta",

  -- Default Meta Replacements
  "data/[Replacements]/Default_Metas/*.meta"
}

data_file "EXPLOSION_INFO_FILE" "data/**/explosion.meta"
data_file "WEAPONCOMPONENTSINFO_FILE" "data/**/weaponcomponents.meta"
data_file "WEAPON_METADATA_FILE" "data/**/weaponarchetypes.meta"
data_file "WEAPON_ANIMATIONS_FILE" "data/**/weaponanimations.meta"
data_file "PED_PERSONALITY_FILE" "data/**/pedpersonality.meta"
data_file "LOADOUTS_FILE" "data/**/loadouts.meta"
data_file "DLC_WEAPON_PICKUPS" "data/**/pickups.meta"
data_file "PTFXASSETINFO_FILE" "data/**/ptfxassetinfo.meta"
data_file "WEAPON_SHOP_INFO_METADATA_FILE" "data/**/shop_weapon.meta"
data_file "EXPLOSIONFX_FILE" "data/**/explosionfx.dat"
data_file "WEAPONINFO_FILE" "data/**/weapons.meta"

-- Default Meta Replacements
data_file "WEAPONINFO_FILE" "data/[Replacements]/Default_Metas/*.meta"
data_file "WEAPONINFO_FILE_PATCH" "data/[Replacements]/Default_Metas/*.meta"

client_script "client/hashes.lua"

escrow_ignore {
  "stream/**/*.ytd",
  "data/**/*.meta",
  "client/hashes.lua"
}

lua54 "yes"
