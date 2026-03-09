fx_version 'cerulean'
games {'gta5'}
lua54 'yes'
client_script "@vertex-base/components/cl_error.lua"
client_script "@vertex-pwnzor/client/check.lua"

author 'Dr Nick'
version 'v1.0.0'
url 'https://www.vertexrp.com'

server_scripts {
    'shared/**/*.lua',
    'server/**/*.lua',
}

client_scripts {
    'shared/**/*.lua',
    'client/**/*.lua',
}