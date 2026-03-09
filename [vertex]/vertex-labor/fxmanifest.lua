fx_version 'cerulean'
lua54 'yes'
game 'gta5'
client_script "@vertex-base/components/cl_error.lua"
client_script "@vertex-pwnzor/client/check.lua"

client_scripts {
    'client/**/*.lua',
}

shared_scripts {
    'shared/**/*.lua',
}

server_scripts {
    'configs/**/*.lua',
    'server/**/*.lua',
}

files {
    'stream/dirty_plane.ydr',
    'stream/farming.ytyp',
	'weaponarchetypes.meta',
	'weaponanimations.meta',
	'weaponpressurewand.meta',
	'weapons.meta'
    
}
data_file 'DLC_ITYP_REQUEST' 'stream/farming.ytyp'
	data_file 'WEAPON_METADATA_FILE' 'weaponarchetypes.meta'
	data_file 'WEAPON_ANIMATIONS_FILE' 'weaponanimations.meta'
	data_file 'WEAPONINFO_FILE' 'weaponpressurewand.meta'
	data_file 'WEAPONINFO_FILE_PATCH' 'weapons.meta'