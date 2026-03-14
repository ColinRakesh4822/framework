fx_version 'cerulean'
game 'gta5'
lua54 "yes"
this_is_a_map 'yes'

author 'Vertexgroup'
description 'https://discord.gg/Ny8vth7Mv5'

files {
    "audio/*",
    "stream/*",
    "stream/*/**",
    "*2133180019.ymt"
}

data_file "AUDIO_GAMEDATA" "audio/80DB4582_game.dat"
data_file "AUDIO_GAMEDATA" "audio/vertexgroup_ts2_audio_doors_game.dat"

escrow_ignore {
    'stream/replace/*', 
    'stream/replace/*/**'
  }



dependency '/assetpacks'
