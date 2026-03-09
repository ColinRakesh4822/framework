fx_version 'cerulean'
game 'gta5'
client_script "@vertex-base/components/cl_error.lua"
client_script "@vertex-pwnzor/client/check.lua"

client_scripts {
    'shared/**/*.lua',
    'client/**/*.lua'
}

server_scripts {
    'shared/**/*.lua',
    'server/*.lua',
}