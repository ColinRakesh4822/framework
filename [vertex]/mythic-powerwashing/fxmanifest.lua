shared_script '@WaveShield/resource/waveshield.lua' --this line was automatically written by WaveShield

client_script '@ElectronAC/src/include/client.lua'

fx_version 'cerulean'
game 'gta5'

name 'sanitation'
description 'Sanitation job scripts (leaf blowing, washing) for me'
author 'Assistant'
version '1.0.0'

lua54 'yes'

client_script "@base/components/cl_error.lua"
client_script "@pwnzor/client/check.lua"

shared_scripts {
    '@ox_lib/init.lua',
}

client_scripts {
    'config.lua',
    'client/*.lua'
}

server_scripts {
    'config.lua',
    'server/*.lua'
}

dependencies {
    'ox_lib'
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