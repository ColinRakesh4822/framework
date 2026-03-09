AddEventHandler('Animations:Shared:DependencyUpdate', RetrieveComponents)
function RetrieveComponents()
    Callbacks = exports['vertex-base']:FetchComponent('Callbacks')
    Utils = exports['vertex-base']:FetchComponent('Utils')
    Notification = exports['vertex-base']:FetchComponent('Notification')
    Menu = exports['vertex-base']:FetchComponent('Menu')
    Damage = exports['vertex-base']:FetchComponent('Damage')
    Keybinds = exports['vertex-base']:FetchComponent('Keybinds')
    Animations = exports['vertex-base']:FetchComponent('Animations')
    Targeting = exports['vertex-base']:FetchComponent('Targeting')
    Interaction = exports['vertex-base']:FetchComponent('Interaction')
    Hud = exports['vertex-base']:FetchComponent('Hud')
    Weapons = exports['vertex-base']:FetchComponent('Weapons')
    ListMenu = exports['vertex-base']:FetchComponent('ListMenu')
    Input = exports['vertex-base']:FetchComponent('Input')
    Sounds = exports['vertex-base']:FetchComponent('Sounds')
end

GLOBAL_VEH = nil

IsInAnimation = false

_isPointing = false
_isCrouched = false

walkStyle = 'default'
facialExpression = 'default'
emoteBinds = {}

_doingStateAnimation = false


AddEventHandler('Core:Shared:Ready', function()
    exports['vertex-base']:RequestDependencies('Animations', {
        'Callbacks',
        'Utils',
        'Notification',
        'Menu',
        'Damage',
        'Keybinds',
        'Animations',
        'Targeting',
        'Interaction',
        'Hud',
        'Weapons',
        'ListMenu',
        'Input',
        'Sounds',
    }, function(error)  
        if #error > 0 then return; end
        RetrieveComponents()
        RegisterKeybinds()

        RegisterChairTargets()

        Interaction:RegisterMenu("expressions", 'Expressions', "face-laugh-squint", function()
            Interaction:Hide()
            Animations:OpenExpressionsMenu()
        end)

        Interaction:RegisterMenu("walks", 'Walk Styles', "person-walking", function()
            Interaction:Hide()
            Animations:OpenWalksMenu()
        end)
    end)
end)

AddEventHandler('Characters:Client:Spawn', function()
    Animations.Emotes:Cancel()
    TriggerEvent('Animations:Client:StandUp', true, true)

    CreateThread(function()
        while LocalPlayer.state.loggedIn do 
            Wait(5000)
            if not _isCrouched and not LocalPlayer.state.drunkMovement then
                Animations.PedFeatures:RequestFeaturesUpdate()
            end
        end
    end)

    CreateThread(function()
        while LocalPlayer.state.loggedIn do
            Wait(5)
            DisableControlAction(0, 36, true)
            if IsDisabledControlJustPressed(0, 36) then 
                Animations.PedFeatures:ToggleCrouch()
            end
            if IsInAnimation and IsPedShooting(LocalPlayer.state.ped) then
                Animations.Emotes:ForceCancel()
            end
        end
    end)
end)


RegisterNetEvent('Characters:Client:Logout')
AddEventHandler('Characters:Client:Logout', function()
    Animations.Emotes:ForceCancel()
    Wait(20)

    LocalPlayer.state:set('anim', false, true)
end)

RegisterNetEvent('Vehicles:Client:EnterVehicle')
AddEventHandler('Vehicles:Client:EnterVehicle', function(veh)
    GLOBAL_VEH = veh
end)

RegisterNetEvent('Vehicles:Client:ExitVehicle')
AddEventHandler('Vehicles:Client:ExitVehicle', function()
    GLOBAL_VEH = nil
end)

RegisterNetEvent('Animations:Client:RecieveStoredAnimSettings')
AddEventHandler('Animations:Client:RecieveStoredAnimSettings', function(data)
    if data then
        walkStyle, facialExpression, emoteBinds = data.walk, data.expression, data.emoteBinds
        Animations.PedFeatures:RequestFeaturesUpdate()
    else -- There is non stored and reset back to default
        walkStyle, facialExpression, emoteBinds =  Config.DefaultSettings.walk, Config.DefaultSettings.expression, Config.DefaultSettings.emoteBinds
        Animations.PedFeatures:RequestFeaturesUpdate()
    end
end)

AddEventHandler('Animations:Shared:DependencyUpdate', RetrieveComponents)
function RetrieveComponents()
    Callbacks = exports['vertex-base']:FetchComponent('Callbacks')
    Utils = exports['vertex-base']:FetchComponent('Utils')
    Notification = exports['vertex-base']:FetchComponent('Notification')
    Menu = exports['vertex-base']:FetchComponent('Menu')
    Damage = exports['vertex-base']:FetchComponent('Damage')
    Keybinds = exports['vertex-base']:FetchComponent('Keybinds')
    Animations = exports['vertex-base']:FetchComponent('Animations')
    Targeting = exports['vertex-base']:FetchComponent('Targeting')
    Interaction = exports['vertex-base']:FetchComponent('Interaction')
    Hud = exports['vertex-base']:FetchComponent('Hud')
    Weapons = exports['vertex-base']:FetchComponent('Weapons')
    ListMenu = exports['vertex-base']:FetchComponent('ListMenu')
    Input = exports['vertex-base']:FetchComponent('Input')
    Sounds = exports['vertex-base']:FetchComponent('Sounds')
    Admin = exports['vertex-base']:FetchComponent('Admin')
end


function RegisterKeybinds()
    Keybinds:Add('pointing', 'b', 'keyboard', 'Pointing - Toggle', function()
        if _isPointing then
            StopPointing()
        else
            StartPointing()
        end
    end)

    Keybinds:Add('emote_cancel', 'x', 'keyboard', 'Emotes - Cancel Current', function()
        Animations.Emotes:Cancel()

        TriggerEvent('Animations:Client:StandUp')
        TriggerEvent('Animations:Client:Selfie', false)
    end)

    -- Don't specify and key so then players can set it themselves if they want to use...
    Keybinds:Add('emote_menu', '', 'keyboard', 'Emotes - Open Menu', function()
        Animations:OpenMainEmoteMenu()
    end)

    -- There are 5 emote binds and by default they use numbers 5, 6, 7, 8 and 9
    for bindNum = 1, 5 do
        Keybinds:Add('emote_bind_'.. bindNum, tostring(4 + bindNum), 'keyboard', 'Emotes - Bind #'.. bindNum, function()
            Animations.EmoteBinds:Use(bindNum)
        end)
    end
end