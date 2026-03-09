name 'Vertex Robbery'
author '[VertexRP Team]'
version 'v1.0.0'
lua54 'yes'
fx_version "cerulean"
game "gta5"
client_script "@vertex-base/components/cl_error.lua"
client_script "@vertex-pwnzor/client/check.lua"

client_scripts {
    'client/**/*.lua',
}
shared_scripts {
    'shared/**/*.lua',
}

server_scripts {
    'server/**/*.lua',
}