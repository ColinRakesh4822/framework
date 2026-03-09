fx_version 'cerulean'
games { 'gta5' }
lua54 'yes'
client_script "@vertex-base/components/cl_error.lua"
client_script "@vertex-pwnzor/client/check.lua"

client_scripts {
    'config/**/*.lua',
    'client/**/*.lua'
}