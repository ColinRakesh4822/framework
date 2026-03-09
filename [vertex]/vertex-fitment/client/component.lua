EDITING_VEHICLE = nil

AddEventHandler('Fitment:Shared:DependencyUpdate', RetrieveComponents)
function RetrieveComponents()
    Logger = exports['vertex-base']:FetchComponent('Logger')
    Fetch = exports['vertex-base']:FetchComponent('Fetch')
    Callbacks = exports['vertex-base']:FetchComponent('Callbacks')
    Game = exports['vertex-base']:FetchComponent('Game')
    Targeting = exports['vertex-base']:FetchComponent('Targeting')
    Utils = exports['vertex-base']:FetchComponent('Utils')
    Animations = exports['vertex-base']:FetchComponent('Animations')
    Notification = exports['vertex-base']:FetchComponent('Notification')
    Polyzone = exports['vertex-base']:FetchComponent('Polyzone')
    Jobs = exports['vertex-base']:FetchComponent('Jobs')
    Weapons = exports['vertex-base']:FetchComponent('Weapons')
    Progress = exports['vertex-base']:FetchComponent('Progress')
    Vehicles = exports['vertex-base']:FetchComponent('Vehicles')
    Targeting = exports['vertex-base']:FetchComponent('Targeting')
    ListMenu = exports['vertex-base']:FetchComponent('ListMenu')
    Action = exports['vertex-base']:FetchComponent('Action')
    Sounds = exports['vertex-base']:FetchComponent('Sounds')
    Menu = exports['vertex-base']:FetchComponent('Menu')
    Interaction = exports['vertex-base']:FetchComponent('Interaction')
end

AddEventHandler('Core:Shared:Ready', function()
    exports['vertex-base']:RequestDependencies('Fitment', {
        'Logger',
        'Fetch',
        'Callbacks',
        'Game',
        'Menu',
        'Targeting',
        'Notification',
        'Utils',
        'Animations',
        'Polyzone',
        'Jobs',
        'Weapons',
        'Progress',
        'Vehicles',
        'Targeting',
        'ListMenu',
        'Action',
        'Sounds',
        'Menu',
        'Interaction',
    }, function(error)
        if #error > 0 then return; end
        RetrieveComponents()

        Interaction:RegisterMenu("veh_wheels", "Wheel Fitment", "truck-monster", function()
            OpenWheelMenu()
            Interaction:Hide()
        end, function()
            local pedCoords = GetEntityCoords(LocalPlayer.state.ped)

            local insideZone = Polyzone:IsCoordsInZone(pedCoords, false, 'veh_customs_wheels')
            if insideZone?.veh_customs_wheels and LocalPlayer.state.onDuty and insideZone.veh_customs_wheels == LocalPlayer.state.onDuty then
                return true
            end
            return false
        end)
    end)
end)

local fitmentVehicles = {}

RegisterNetEvent('Characters:Client:Spawn')
AddEventHandler('Characters:Client:Spawn', function()
    StartFitmentThread()
end)

RegisterNetEvent('Characters:Client:Logout')
AddEventHandler('Characters:Client:Logout', function()
    RunVehicleCleanup()
end)

RegisterNetEvent('Fitment:Client:Update', function(netId, data)
    if LocalPlayer.state.loggedIn then
        if fitmentVehicles[netId] and fitmentVehicles[netId].veh then
            if data then
                fitmentVehicles[netId] = {
                    veh = fitmentVehicles[netId].veh,
                    data = data,
                }

                if v ~= EDITING_VEHICLE then
                    SetVehicleWheelWidth(v, data.width + 0.0)
                end
            else
                fitmentVehicles[netId] = nil
            end
        end
    end
end)

function RunVehicleCleanup()
    for k, v in pairs(fitmentVehicles) do
        if not v?.veh or not DoesEntityExist(v?.veh) then
            fitmentVehicles[k] = nil
        end
    end
end

function RunFitmentDataUpdate()
    local vPool = GetGamePool('CVehicle')
    for k, v in ipairs(vPool) do
        if NetworkGetEntityIsNetworked(v) then
            local fitmentData = Entity(v)?.state?.WheelFitment
            if fitmentData then
                fitmentVehicles[VehToNet(v)] = {
                    veh = v,
                    data = fitmentData,
                }

                if fitmentData.width and v ~= EDITING_VEHICLE then
                    SetVehicleWheelWidth(v, fitmentData.width + 0.0)
                end
            end
        end
    end
end

function StartFitmentThread()
    CreateThread(function()
        local tick = 0
        while LocalPlayer.state.loggedIn do
            RunFitmentDataUpdate()
            Wait(5000)

            if tick >= 5 then
                tick = 0
                RunVehicleCleanup()
            else
                tick = tick + 1
            end
        end
    end)

    CreateThread(function()
        while LocalPlayer.state.loggedIn do
            Wait(1)
            for k, v in pairs(fitmentVehicles) do
                if v?.veh and v.veh ~= EDITING_VEHICLE and DoesEntityExist(v.veh) then
                    SetVehicleFrontTrackWidth(v.veh, v?.data?.frontTrack)
                    SetVehicleRearTrackWidth(v.veh, v?.data?.rearTrack)
                end
            end
        end
    end)
end