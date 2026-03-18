_hasMenu = false

RegisterNetEvent('Admin:Client:Menu:RecievePermissionData', function(userData, permission, permissionName, permissionLevel)
    if not _hasMenu then
        _hasMenu = true

        SendNUIMessage({
            type = "SET_USERDATA",
            data = {
                user = userData,
                permission = permission,
                permissionName = permissionName,
                permissionLevel = permissionLevel,
            }
        })
    end
end)

function OpenMenu()
    if not _menuOpen and _hasMenu then
        _menuOpen = true
        SendNUIMessage({ type = "APP_SHOW" })
		SetNuiFocus(true, true)
    end
end

function CloseMenu()
    if _menuOpen then
        SendNUIMessage({ type = "APP_HIDE" })
		SetNuiFocus(false, false)


        _menuOpen = false
    end
end

RegisterNetEvent('Admin:Client:Menu:Open', function()
    OpenMenu()
end)

RegisterNetEvent('UI:Client:Reset', function(apps)
    CloseMenu()
end)

RegisterNUICallback('Close', function(data, cb)
	cb('OK')
	CloseMenu()
end)

RegisterNUICallback('GetPlayerList', function(data, cb)
    if data and data.disconnected then
        Callbacks:ServerCallback('Admin:GetDisconnectedPlayerList', data, cb)
    else
        Callbacks:ServerCallback('Admin:GetPlayerList', data, cb)
    end
end)

RegisterNUICallback('GetPlayer', function(data, cb)
    Callbacks:ServerCallback('Admin:GetPlayer', data, cb)
end)

RegisterNUICallback('GetCurrentVehicle', function(data, cb)
    local insideVehicle = GetVehiclePedIsIn(LocalPlayer.state.ped, true)
    if insideVehicle and insideVehicle > 0 and DoesEntityExist(insideVehicle) then
        local vehState = Entity(insideVehicle).state
        local vehicleCoords = GetEntityCoords(insideVehicle)
        local vehicleHeading = GetEntityHeading(insideVehicle)
        local currentSeat = 'Not In Vehicle'
        for i = -1, 14 do
            if GetPedInVehicleSeat(insideVehicle, i) == LocalPlayer.state.ped then
                currentSeat = i
                break
            end
        end

        cb({
            Make = vehState.Make,
            Model = vehState.Model,
            VIN = vehState.VIN,
            Owned = vehState.Owned,
            Owner = vehState.Owner,
            Plate = vehState.Plate,
            Value = vehState.Value,
            EntityModel = GetEntityModel(insideVehicle),
            Coords = {
                x = vehicleCoords.x,
                y = vehicleCoords.y,
                z = vehicleCoords.z,
            },
            Heading = vehicleHeading,
            Seat = currentSeat,
            Fuel = vehState.Fuel,
            Damage = vehState.Damage,
            DamagedParts = vehState.DamagedParts,
        })
    else
        cb(false)
    end
end)

RegisterNUICallback('ActionPlayer', function(data, cb)
    Callbacks:ServerCallback('Admin:ActionPlayer', data, cb)
end)

RegisterNUICallback('KickPlayer', function(data, cb)
    Callbacks:ServerCallback('Admin:KickPlayer', data, cb)
end)

RegisterNUICallback('BanPlayer', function(data, cb)
    Callbacks:ServerCallback('Admin:BanPlayer', data, cb)
end)

RegisterNUICallback('CurrentVehicleAction', function(data, cb)
    local insideVehicle = GetVehiclePedIsIn(LocalPlayer.state.ped, true)
    if insideVehicle and insideVehicle > 0 and DoesEntityExist(insideVehicle) then
        Callbacks:ServerCallback('Admin:CurrentVehicleAction', data, function(canDo)
            if canDo then
                if data.action == 'repair' then
                    if Vehicles.Repair:Normal(insideVehicle) then
                        return cb({
                            success = true,
                            message = 'Vehicle Repaired',
                        })
                    end
                elseif data.action == 'repair_full' then
                    if Vehicles.Repair:Full(insideVehicle) then
                        return cb({
                            success = true,
                            message = 'Vehicle Repaired Fully',
                        })
                    end
                elseif data.action == 'repair_engine' then
                    if Vehicles.Repair:Engine(insideVehicle) then
                        return cb({
                            success = true,
                            message = 'Engine Repaired',
                        })
                    end
                elseif data.action == 'explode' then
                    NetSync:NetworkExplodeVehicle(insideVehicle, 1, 0)
                    return cb({
                        success = true,
                        message = 'Vehicle Exploded',
                    })
                elseif data.action == 'alarm' then
                    if IsVehicleAlarmSet(insideVehicle) then
                        SetVehicleAlarm(insideVehicle, false)
                    else
                        SetVehicleAlarm(insideVehicle, true)
                        SetVehicleAlarmTimeLeft(insideVehicle, 25000)
                    end

                    return cb({
                        success = true,
                        message = 'Vehicle Alarm Activated',
                    })
                elseif data.action == 'fuel' then
                    Entity(insideVehicle).state:set('Fuel', 100, true)

                    return cb({
                        success = true,
                        message = 'Vehicle Refueled',
                    })
                -- elseif data.action == 'delete' then
                elseif data.action == 'customs' then
                    TriggerEvent('VehicleCustoms:Client:Admin', true, 0.0)

                    SetTimeout(1000, function()
                        CloseMenu()
                    end)

                    return cb({
                        success = true,
                        message = 'Opened',
                    })
                end

                cb(false)
            else
                cb(false);
            end
        end)
    else
        cb({
            success = false,
            message = 'No Longer In Vehicle Control',
        })
    end
end)

RegisterNUICallback('StopAllAttach', function(data, cb)
	cb('OK')
	AdminStopAttach()
end)

RegisterNUICallback('GetPlayerHistory', function(data, cb)
	cb({
        current = GlobalState.PlayerCount or 0,
        max = GlobalState.MaxPlayers or 1,
        queue = GlobalState.QueueCount or 0,
        history = GlobalState.AdminPlayerHistory
    })
end)

RegisterNUICallback('ToggleInvisible', function(data, cb)
    Callbacks:ServerCallback('Admin:ToggleInvisible', data, cb)
end)

RegisterNUICallback('ToggleIDs', function(data, cb)
    cb('OK')

    if LocalPlayer.state.isDev then
        ToggleAdminPlayerIDs()
    end
end)

RegisterNUICallback('GetItemList', function(data, cb)
    Callbacks:ServerCallback('Admin:GetItemList', data, cb)
end)

RegisterNUICallback('GiveItem', function(data, cb)
    Callbacks:ServerCallback('Admin:GiveItem', data, cb)
end)

-- Door Lock Tool
RegisterNUICallback('GetDoorList', function(data, cb)
    Callbacks:ServerCallback('Admin:GetDoorList', data, cb)
end)

RegisterNUICallback('CreateDoor', function(data, cb)
    Callbacks:ServerCallback('Admin:CreateDoor', data, cb)
end)

RegisterNUICallback('UpdateDoor', function(data, cb)
    Callbacks:ServerCallback('Admin:UpdateDoor', data, cb)
end)

RegisterNUICallback('DeleteDoor', function(data, cb)
    Callbacks:ServerCallback('Admin:DeleteDoor', data, cb)
end)

RegisterNUICallback('ToggleDoorLock', function(data, cb)
    Callbacks:ServerCallback('Admin:ToggleDoorLock', data, cb)
end)

RegisterNUICallback('StartDoorHelper', function(data, cb)
    cb('OK')
    CloseMenu()
    Callbacks:ServerCallback('Admin:StartDoorHelper', {}, function() end)
end)

RegisterNUICallback('TeleportToCoords', function(data, cb)
    Callbacks:ServerCallback('Admin:TeleportToCoords', data, cb)
end)

RegisterNetEvent('Admin:Client:DoorCaptured', function(data)
    SendNUIMessage({
        type = "DOOR_CAPTURED",
        data = data,
    })
    OpenMenu()
end)

-- Elevator Tool
RegisterNUICallback('GetElevatorList', function(data, cb)
    Callbacks:ServerCallback('Admin:GetElevatorList', data, cb)
end)

RegisterNUICallback('CreateElevator', function(data, cb)
    Callbacks:ServerCallback('Admin:CreateElevator', data, cb)
end)

RegisterNUICallback('UpdateElevator', function(data, cb)
    Callbacks:ServerCallback('Admin:UpdateElevator', data, cb)
end)

RegisterNUICallback('DeleteElevator', function(data, cb)
    Callbacks:ServerCallback('Admin:DeleteElevator', data, cb)
end)

RegisterNUICallback('StartElevatorZoneHelper', function(data, cb)
    cb('OK')
    CloseMenu()
    Callbacks:ServerCallback('Admin:StartElevatorZoneHelper', {}, function() end)
end)

RegisterNUICallback('StartElevatorPositionHelper', function(data, cb)
    cb('OK')
    CloseMenu()
    Callbacks:ServerCallback('Admin:StartElevatorPositionHelper', {}, function() end)
end)

RegisterNetEvent('Admin:Client:ElevatorZoneCaptured', function(data)
    SendNUIMessage({
        type = "ELEVATOR_ZONE_CAPTURED",
        data = data,
    })
    OpenMenu()
end)

RegisterNetEvent('Admin:Client:ElevatorPositionCaptured', function(data)
    SendNUIMessage({
        type = "ELEVATOR_POSITION_CAPTURED",
        data = data,
    })
    OpenMenu()
end)

-- Ped Management Tool
RegisterNUICallback('GetPedInteractionSnapshot', function(data, cb)
    local PedInteraction = exports['vertex-base']:FetchComponent('PedInteraction')
    if PedInteraction then
        cb(PedInteraction:GetAll())
    else
        cb({ total = 0, spawned = 0, peds = {} })
    end
end)

RegisterNUICallback('PedMgmt_TeleportTo', function(data, cb)
    if data and data.x and data.y and data.z then
        SetEntityCoords(PlayerPedId(), data.x + 0.0, data.y + 0.0, data.z + 0.0, false, false, false, false)
        cb({ success = true })
    else
        cb({ success = false, message = 'Invalid coordinates' })
    end
end)

RegisterNUICallback('PedMgmt_Toggle', function(data, cb)
    local PedInteraction = exports['vertex-base']:FetchComponent('PedInteraction')
    if PedInteraction and data and data.id ~= nil then
        PedInteraction:Toggle(data.id, data.enabled and true or false)
        cb({ success = true })
    else
        cb({ success = false, message = 'Failed to toggle ped' })
    end
end)

RegisterNUICallback('PedMgmt_ForceSpawn', function(data, cb)
    local PedInteraction = exports['vertex-base']:FetchComponent('PedInteraction')
    if PedInteraction and data and data.id ~= nil then
        PedInteraction:ForceSpawn(data.id)
        cb({ success = true })
    else
        cb({ success = false, message = 'Failed to force spawn ped' })
    end
end)

RegisterNUICallback('PedMgmt_ForceDespawn', function(data, cb)
    local PedInteraction = exports['vertex-base']:FetchComponent('PedInteraction')
    if PedInteraction and data and data.id ~= nil then
        PedInteraction:ForceDespawn(data.id)
        cb({ success = true })
    else
        cb({ success = false, message = 'Failed to force despawn ped' })
    end
end)

RegisterNUICallback('PedMgmt_Update', function(data, cb)
    local PedInteraction = exports['vertex-base']:FetchComponent('PedInteraction')
    if PedInteraction and data and data.id ~= nil and data.patch then
        local ok = PedInteraction:Update(data.id, data.patch)
        cb({ success = ok })
    else
        cb({ success = false, message = 'Failed to update ped' })
    end
end)

RegisterNUICallback('PedMgmt_CreateTemp', function(data, cb)
    local PedInteraction = exports['vertex-base']:FetchComponent('PedInteraction')
    if PedInteraction and data and data.tempId and data.def then
        local ok = PedInteraction:CreateTemp(data.tempId, data.def)
        cb({ success = ok })
    else
        cb({ success = false, message = 'Failed to create temp ped' })
    end
end)

-- Ped Placement Helper — Raycast Utilities
local function PedHelper_GetCameraRay()
    local camCoords = GetGameplayCamCoord()
    local camRot = GetGameplayCamRot(2)
    local radX = math.rad(camRot.x)
    local radZ = math.rad(camRot.z)
    local dir = vector3(
        -math.sin(radZ) * math.abs(math.cos(radX)),
        math.cos(radZ) * math.abs(math.cos(radX)),
        math.sin(radX)
    )
    return camCoords, dir
end

local function PedHelper_RaycastFromCamera(camCoords, dir, maxDist)
    local dest = camCoords + dir * maxDist
    local ped = PlayerPedId()
    local ray = StartExpensiveSynchronousShapeTestLosProbe(camCoords.x, camCoords.y, camCoords.z, dest.x, dest.y, dest.z, 1, ped, 7)
    local _, hit, hitCoords, _, entity = GetShapeTestResult(ray)
    return hit == 1, entity, hitCoords
end

local function PedHelper_DrawInstructionUI(line1, line2)
    -- Background rect for both lines
    DrawRect(0.85, 0.935, 0.28, 0.065, 10, 10, 18, 190)
    DrawRect(0.85, 0.9025, 0.28, 0.002, 32, 134, 146, 220)

    -- Line 1 (top)
    SetTextFont(4)
    SetTextScale(0.0, 0.35)
    SetTextColour(255, 255, 255, 220)
    SetTextEdge(1, 0, 0, 0, 150)
    SetTextOutline()
    SetTextCentre(true)
    BeginTextCommandDisplayText("STRING")
    AddTextComponentSubstringPlayerName(line1)
    EndTextCommandDisplayText(0.85, 0.91)

    -- Line 2 (bottom)
    SetTextFont(4)
    SetTextScale(0.0, 0.35)
    SetTextColour(255, 255, 255, 220)
    SetTextEdge(1, 0, 0, 0, 150)
    SetTextOutline()
    SetTextCentre(true)
    BeginTextCommandDisplayText("STRING")
    AddTextComponentSubstringPlayerName(line2)
    EndTextCommandDisplayText(0.85, 0.938)
end

-- Ped Placement Helper — State
local pedPlacementActive = false
local previewPed = 0
local previewHeading = 0.0
local previewZOffset = 0.0
local PREVIEW_MODEL = `a_m_y_business_03`

RegisterNUICallback('StartPedPlacementHelper', function(data, cb)
    cb('OK')
    CloseMenu()
    TriggerEvent('Admin:Client:PedPlacementHelper')
end)

RegisterNetEvent('Admin:Client:PedPlacementHelper', function()
    if pedPlacementActive then
        pedPlacementActive = false
        return
    end

    pedPlacementActive = true
    previewHeading = GetEntityHeading(PlayerPedId())
    previewZOffset = 0.0

    -- Load the preview model
    RequestModel(PREVIEW_MODEL)
    while not HasModelLoaded(PREVIEW_MODEL) do
        Wait(10)
    end

    CreateThread(function()
        while pedPlacementActive do
            -- Disable controls
            DisablePlayerFiring(PlayerId(), true)
            DisableControlAction(0, 24, true)   -- Attack
            DisableControlAction(0, 25, true)   -- Aim / Right click
            DisableControlAction(0, 38, true)   -- E key
            DisableControlAction(0, 14, true)   -- Scroll up
            DisableControlAction(0, 15, true)   -- Scroll down
            DisableControlAction(0, 172, true)  -- Arrow up
            DisableControlAction(0, 173, true)  -- Arrow down

            local camCoords, dir = PedHelper_GetCameraRay()
            local hit, _, hitCoords = PedHelper_RaycastFromCamera(camCoords, dir, 25.0)

            if hit then
                local placeZ = hitCoords.z + previewZOffset

                -- Create preview ped on first hit
                if previewPed == 0 or not DoesEntityExist(previewPed) then
                    previewPed = CreatePed(5, PREVIEW_MODEL, hitCoords.x, hitCoords.y, placeZ, previewHeading, false, false)
                    SetEntityAlpha(previewPed, 150, false)
                    FreezeEntityPosition(previewPed, true)
                    SetEntityCollision(previewPed, false, false)
                    SetEntityInvincible(previewPed, true)
                    SetPedCanRagdoll(previewPed, false)
                    SetBlockingOfNonTemporaryEvents(previewPed, true)
                end

                -- Update position and heading
                SetEntityCoordsNoOffset(previewPed, hitCoords.x, hitCoords.y, placeZ, false, false, false)

                -- Scroll to rotate
                if IsDisabledControlPressed(0, 14) then
                    previewHeading = previewHeading + 3.0
                    if previewHeading >= 360.0 then previewHeading = previewHeading - 360.0 end
                end
                if IsDisabledControlPressed(0, 15) then
                    previewHeading = previewHeading - 3.0
                    if previewHeading < 0.0 then previewHeading = previewHeading + 360.0 end
                end
                SetEntityHeading(previewPed, previewHeading)

                -- Arrow keys to adjust height (hold Shift for fine control)
                local zStep = IsControlPressed(0, 21) and 0.005 or 0.05  -- Shift = slow
                if IsDisabledControlPressed(0, 172) then
                    previewZOffset = previewZOffset + zStep
                end
                if IsDisabledControlPressed(0, 173) then
                    previewZOffset = previewZOffset - zStep
                end

                -- Draw teal ring marker at ped feet + vertical column
                DrawMarker(28, hitCoords.x, hitCoords.y, placeZ - 0.95, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.6, 0.6, 0.15, 32, 134, 146, 150, false, false, 0, true, false, false, false)
                DrawMarker(1, hitCoords.x, hitCoords.y, placeZ + 0.1, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.15, 0.15, 1.8, 32, 134, 146, 40, false, false, 0, true, false, false, false)

                PedHelper_DrawInstructionUI("~b~E~s~ Place  |  ~b~Scroll~s~ Rotate  |  ~r~Right Click~s~ Cancel", "~b~Arrows~s~ Height  |  ~b~Shift~s~ Slow")

                -- E key — confirm placement
                if IsDisabledControlJustPressed(0, 38) then
                    local round2 = function(n) return math.floor(n * 100 + 0.5) / 100 end
                    local data = {
                        x = round2(hitCoords.x),
                        y = round2(hitCoords.y),
                        z = round2(placeZ),
                        heading = round2(previewHeading),
                    }

                    -- Cleanup preview ped
                    if previewPed ~= 0 and DoesEntityExist(previewPed) then
                        DeleteEntity(previewPed)
                    end
                    previewPed = 0
                    pedPlacementActive = false
                    SetModelAsNoLongerNeeded(PREVIEW_MODEL)

                    SendNUIMessage({
                        type = "PED_POSITION_CAPTURED",
                        data = data,
                    })
                    OpenMenu()
                end
            else
                PedHelper_DrawInstructionUI("~b~Aim~s~ at ground", "~r~Right Click~s~ Cancel")
            end

            -- Right click — cancel
            if IsDisabledControlJustPressed(0, 25) then
                if previewPed ~= 0 and DoesEntityExist(previewPed) then
                    DeleteEntity(previewPed)
                end
                previewPed = 0
                pedPlacementActive = false
                SetModelAsNoLongerNeeded(PREVIEW_MODEL)

                Notification:Error('Ped Placement Cancelled')
                OpenMenu()
            end

            Wait(0)
        end

        -- Safety cleanup if loop exits
        if previewPed ~= 0 and DoesEntityExist(previewPed) then
            DeleteEntity(previewPed)
            previewPed = 0
        end
        SetModelAsNoLongerNeeded(PREVIEW_MODEL)
    end)
end)

function CopyClipboard(txt)
    SendNUIMessage({
        type = "COPY",
        data = {
            data = txt,
        }
    })
end