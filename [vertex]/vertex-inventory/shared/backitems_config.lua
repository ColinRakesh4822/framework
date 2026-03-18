---@class Slot
---@field bone number
---@field pos vector3
---@field rot vector3

---@class BackItemConfig
---@field prio number Priority for slot assignment (higher = more important)
---@field group? string Slot group to use (defaults to 'back')
---@field customPos? {bone?: number, pos?: vector3, rot?: vector3} Custom position override
---@field ignoreLimits? boolean Attach regardless of slot limits (requires full customPos)
---@field model? number|string Alternative model (for sheathed weapons, non-weapon items)

---@class BackItemsConfig
---@field defaultSlots table<string, Slot[]>
---@field BackItems table<string, BackItemConfig>
---@field allowedVehicleClasses table<number, boolean>

BACKITEMS_CONFIG = {
    defaultSlots = {
        ['back'] = {
            { bone = 24818, pos = vec3(0.09, -0.16, 0.12),  rot = vec3(0.0, 180.0, 0.0) },
            { bone = 24818, pos = vec3(0.09, -0.16, 0.00),  rot = vec3(0.0, 180.0, 0.0) },
            { bone = 24818, pos = vec3(0.09, -0.16, -0.12), rot = vec3(0.0, 180.0, 0.0) },
            { bone = 24818, pos = vec3(0.09, -0.16, -0.24), rot = vec3(0.0, 180.0, 0.0) },
        },
        ['melee'] = {
            { bone = 24818, pos = vec3(0.35, -0.125, -0.15), rot = vec3(2.5, -60.0, 0.0) },
            { bone = 24818, pos = vec3(0.25, -0.125, -0.15), rot = vec3(2.5, -60.0, 0.0) },
        },
    },

    allowedVehicleClasses = {
        [8] = true,   -- motorcycles
        [13] = true,  -- bicycles
        [14] = true,  -- boats
    },

    BackItems = {
        -- Machine Guns
        ['WEAPON_MG'] = { prio = 4, group = 'back' },
        ['WEAPON_COMBATMG'] = { prio = 4, group = 'back' },
        ['WEAPON_COMBATMG_MK2'] = { prio = 4, group = 'back' },

        -- Assault Rifles
        ['WEAPON_G36'] = { prio = 3, group = 'back' },
        ['WEAPON_RPK16'] = { prio = 3, group = 'back' },
        ['WEAPON_AK74'] = { prio = 3, group = 'back' },
        ['WEAPON_ASSAULTRIFLE'] = { prio = 3, group = 'back' },
        ['WEAPON_ASSAULTRIFLE_MK2'] = { prio = 3, group = 'back' },
        ['WEAPON_CARBINERIFLE'] = { prio = 3, group = 'back' },
        ['WEAPON_CARBINERIFLE_MK2'] = { prio = 3, group = 'back' },
        ['WEAPON_BULLPUPRIFLE'] = { prio = 3, group = 'back' },
        ['WEAPON_BULLPUPRIFLE_MK2'] = { prio = 3, group = 'back' },
        ['WEAPON_COMPACTRIFLE'] = { prio = 2, group = 'back' },
        ['WEAPON_HK416B'] = { prio = 3, group = 'back' },
        ['WEAPON_50BEOWULF'] = { prio = 3, group = 'back' },
        ['WEAPON_AR15'] = { prio = 3, group = 'back' },
        ['WEAPON_MUSKET'] = { prio = 2, group = 'back' },
        ['WEAPON_PRESSURE1'] = { prio = 3, group = 'back' },

        -- SMGs
        ['WEAPON_HKUMP'] = { prio = 2, group = 'back' },
        ['WEAPON_P90FM'] = { prio = 2, group = 'back' },
        ['WEAPON_MINIUZI'] = { prio = 2, group = 'back' },
        ['WEAPON_MP9A'] = { prio = 2, group = 'back' },
        ['WEAPON_MPX'] = { prio = 2, group = 'back' },
        ['WEAPON_PP19'] = { prio = 2, group = 'back' },
        ['WEAPON_ASSAULTSMG'] = { prio = 2, group = 'back' },
        ['WEAPON_GUSENBERG'] = { prio = 2, group = 'back' },
        ['WEAPON_COMBATPDW'] = { prio = 2, group = 'back' },
        ['WEAPON_SMG_MK2'] = { prio = 2, group = 'back' },
        ['WEAPON_SMG'] = { prio = 2, group = 'back' },
        ['WEAPON_MP5'] = { prio = 2, group = 'back' },
        ['WEAPON_MINISMG'] = { prio = 2, group = 'back' },
        ['WEAPON_MICROSMG'] = { prio = 2, group = 'back' },

        -- Shotguns
        ['WEAPON_BULLPUPSHOTGUN'] = { prio = 3, group = 'back' },
        ['WEAPON_HEAVYSHOTGUN'] = { prio = 3, group = 'back' },
        ['WEAPON_ASSAULTSHOTGUN'] = { prio = 3, group = 'back' },
        ['WEAPON_PUMPSHOTGUN'] = { prio = 3, group = 'back' },
        ['WEAPON_PUMPSHOTGUN_MK2'] = { prio = 3, group = 'back' },
        ['WEAPON_DBSHOTGUN'] = { prio = 2, group = 'back' },
        ['WEAPON_SAWNOFFSHOTGUN'] = { prio = 2, group = 'back' },
        ['WEAPON_BEANBAG'] = { prio = 3, group = 'back' },

        -- Sniper Rifles
        ['WEAPON_SNIPERRIFLE'] = { prio = 4, group = 'back' },
        ['WEAPON_SNIPERRIFLE2'] = { prio = 4, group = 'back' },

        -- Melee
        ['KATANA'] = { prio = 1, group = 'melee' },
        ['WEAPON_MACHETE'] = { prio = 1, group = 'melee' },
        ['WEAPON_PONY'] = { prio = 1, group = 'melee' },

        -- Objects
        ['moneybag'] = {
            prio = 1,
            ignoreLimits = true,
            model = `prop_money_bag_01`,
            customPos = {
                bone = 11816,
                pos = vec3(-0.55, -0.11, 0.14),
                rot = vec3(0.0, 90.0, 0.0)
            }
        },
    },
}
