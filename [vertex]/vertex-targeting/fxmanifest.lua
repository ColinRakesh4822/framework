fx_version 'cerulean'
game 'gta5'
lua54 'yes'
version '1.0.1'

client_script "@vertex-base/components/cl_error.lua"
client_script "@vertex-pwnzor/client/check.lua"

client_scripts {
    '@vertex-polyzone/client.lua',
    '@vertex-polyzone/BoxZone.lua',
    '@vertex-polyzone/EntityZone.lua',
    '@vertex-polyzone/CircleZone.lua',
    '@vertex-polyzone/ComboZone.lua',

    'client/*.lua',
    'client/targets/*.lua',
}