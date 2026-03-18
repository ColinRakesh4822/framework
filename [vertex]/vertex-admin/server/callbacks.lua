function GetSpawnLocations()
    local p = promise.new()

    Database.Game:find({
        collection = 'locations',
        query = {
            Type = 'spawn'
        }
    }, function(success, results)
        if success and #results > 0 then
            p:resolve(results)
        else
            p:resolve(false)
        end
    end)

    local res = Citizen.Await(p)
    return res
end

function RegisterCallbacks()
    Callbacks:RegisterServerCallback('Admin:GetPlayerList', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsStaff() then
            local data = {}
            local activePlayers = Fetch:All()

            for k, v in pairs(activePlayers) do
                if v and v:GetData('AccountID') then
                    local char = v:GetData('Character')
                    table.insert(data, {
                        Source = v:GetData('Source'),
                        Name = v:GetData('Name'),
                        AccountID = v:GetData('AccountID'),
                        Character = char and {
                            First = char:GetData('First'),
                            Last = char:GetData('Last'),
                            SID = char:GetData('SID'),
                        } or false,
                    })
                end
            end
            cb(data)
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:GetDisconnectedPlayerList', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsStaff() then
            local rDs = exports['vertex-base']:FetchComponent('RecentDisconnects')
            cb(rDs)
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:GetPlayer', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsStaff() then
            local target = Fetch:Source(data)

            if target then
                local staffGroupName = false
                if target.Permissions:IsStaff() then
                    local highestLevel = 0
                    for k, v in ipairs(target:GetData('Groups')) do
                        if C.Groups[tostring(v)] ~= nil and (type(C.Groups[tostring(v)].Permission) == 'table') then
                            if C.Groups[tostring(v)].Permission.Level > highestLevel then
                                highestLevel = C.Groups[tostring(v)].Permission.Level
                                staffGroupName = C.Groups[tostring(v)].Name
                            end
                        end
                    end
                end

                local coords = GetEntityCoords(GetPlayerPed(target:GetData('Source')))

                local char = target:GetData('Character')
                local tData = {
                    Source = target:GetData('Source'),
                    Name = target:GetData('Name'),
                    AccountID = target:GetData('AccountID'),
                    Identifier = target:GetData('Identifier'),
                    Level = target.Permissions:GetLevel(),
                    Groups = target:GetData('Groups'),
                    StaffGroup = staffGroupName,
                    Character = char and {
                        First = char:GetData('First'),
                        Last = char:GetData('Last'),
                        SID = char:GetData('SID'),
                        DOB = char:GetData('DOB'),
                        Phone = char:GetData('Phone'),
                        Jobs = char:GetData('Jobs'),
                        Coords = {
                            x = coords.x,
                            y = coords.y,
                            z = coords.z
                        }
                    } or false,
                }

                cb(tData)
            else
                local rDs = exports['vertex-base']:FetchComponent('RecentDisconnects')
                for k, v in ipairs(rDs) do
                    if v.Source == data then
                        local tData = v

                        if tData.IsStaff then
                            local highestLevel = 0
                            for k, v in ipairs(tData.Groups) do
                                if C.Groups[tostring(v)] ~= nil and (type(C.Groups[tostring(v)].Permission) == 'table') then
                                    if C.Groups[tostring(v)].Permission.Level > highestLevel then
                                        highestLevel = C.Groups[tostring(v)].Permission.Level
                                        tData.StaffGroup = C.Groups[tostring(v)].Name
                                    end
                                end
                            end
                        end

                        tData.Disconnected = true
                        tData.Reconnected = false

                        for k, v in pairs(Fetch:All()) do
                            if v:GetData('AccountID') == tData.AccountID then
                                tData.Reconnected = k
                            end
                        end

                        cb(tData)
                        return
                    end
                end

                cb(false)
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:BanPlayer', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and data.targetSource and type(data.length) == "number" and type(data.reason) == "string" and data.length >= -1 and data.length <= 90 then
            if player.Permissions:IsAdmin() or (player.Permissions:IsStaff() and data.length > 0 and data.length <= 7) then
                cb(Punishment.Ban:Source(data.targetSource, data.length, data.reason, source))
            else
                cb(false)
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:KickPlayer', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and data.targetSource and type(data.reason) == "string" and player.Permissions:IsStaff() then
            cb(Punishment:Kick(data.targetSource, data.reason, source))
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:ActionPlayer', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and data.action and data.targetSource and player.Permissions:IsStaff() then
            local target = Fetch:Source(data.targetSource)
            if target then
                local canFuckWith = player.Permissions:GetLevel() > target.Permissions:GetLevel()
                local notMe = player:GetData('Source') ~= target:GetData('Source')
                local wasSuccessful = false

                local targetChar = target:GetData('Character')
                if targetChar then
                    local playerPed = GetPlayerPed(player:GetData('Source'))
                    local targetPed = GetPlayerPed(target:GetData('Source'))
                    if data.action == 'bring' and canFuckWith and notMe then
                        local playerCoords = GetEntityCoords(playerPed)
                        Pwnzor.Players:TempPosIgnore(target:GetData("Source"))
                        SetEntityCoords(targetPed, playerCoords.x, playerCoords.y, playerCoords.z + 1.0)

                        cb({
                            success = true,
                            message = 'Brought Successfully'
                        })

                        wasSuccessful = true
                    elseif data.action == 'goto' then
                        local targetCoords = GetEntityCoords(targetPed)
                        SetEntityCoords(playerPed, targetCoords.x, targetCoords.y, targetCoords.z + 1.0)

                        cb({
                            success = true,
                            message = 'Teleported To Successfully'
                        })

                        wasSuccessful = true
                    elseif data.action == 'heal' then
                        if (notMe or player.Permissions:IsAdmin()) then
                            Callbacks:ClientCallback(targetChar:GetData("Source"), "Damage:Heal", true)
                            
                            cb({
                                success = true,
                                message = 'Healed Successfully'
                            })

                            wasSuccessful = true
                        else
                            cb({
                                success = false,
                                message = 'Can\'t Heal Yourself'
                            })
                        end
                    elseif data.action == 'attach' and canFuckWith and notMe then
                        TriggerClientEvent('Admin:Client:Attach', source, target:GetData('Source'), GetEntityCoords(targetPed), {
                            First = targetChar:GetData("First"),
                            Last = targetChar:GetData("Last"),
                            SID = targetChar:GetData("SID"),
                            Account = target:GetData("AccountID"),
                        })

                        cb({
                            success = true,
                            message = 'Attached Successfully'
                        })

                        wasSuccessful = true
                    elseif data.action == 'marker' and (canFuckWith or player.Permissions:GetLevel() == 100) then
                        local targetCoords = GetEntityCoords(targetPed)
                        TriggerClientEvent('Admin:Client:Marker', source, targetCoords.x, targetCoords.y)
                    end

                    if wasSuccessful then
                        Logger:Warn(
                            "Admin",
                            string.format(
                                "%s [%s] Used Staff Action %s On %s [%s] - Character %s %s (%s)", 
                                player:GetData("Name"),
                                player:GetData("AccountID"),
                                string.upper(data.action),
                                target:GetData("Name"),
                                target:GetData("AccountID"),
                                targetChar:GetData('First'),
                                targetChar:GetData('Last'),
                                targetChar:GetData('SID')
                            ),
                            {
                                console = (player.Permissions:GetLevel() < 100),
                                file = false,
                                database = true,
                                discord = (player.Permissions:GetLevel() < 100) and {
                                    embed = true,
                                    type = "error",
                                    webhook = GetConvar("discord_admin_webhook", ''),
                                } or false,
                            }
                        )
                    end
                    return
                end
            end
        end

        cb(false)
    end)

    Callbacks:RegisterServerCallback('Admin:CurrentVehicleAction', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and data.action and player.Permissions:IsAdmin() and player.Permissions:GetLevel() >= 90 then
            Logger:Warn(
                "Admin",
                string.format(
                    "%s [%s] Used Vehicle Action %s",
                    player:GetData("Name"),
                    player:GetData("AccountID"),
                    string.upper(data.action)
                ),
                {
                    console = (player.Permissions:GetLevel() < 100),
                    file = false,
                    database = true,
                    discord = (player.Permissions:GetLevel() < 100) and {
                        embed = true,
                        type = "error",
                        webhook = GetConvar("discord_admin_webhook", ''),
                    } or false,
                }
            )
            cb(true)
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:NoClip', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            Logger:Warn(
                "Admin",
                string.format(
                    "%s [%s] Used NoClip (State: %s)",
                    player:GetData("Name"),
                    player:GetData("AccountID"),
                    data?.active and 'On' or 'Off'
                ),
                {
                    console = (player.Permissions:GetLevel() < 100),
                    file = false,
                    database = true,
                    discord = (player.Permissions:GetLevel() < 100) and {
                        embed = true,
                        type = "error",
                        webhook = GetConvar("discord_admin_webhook", ''),
                    } or false,
                }
            )
            cb(true)
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:UpdatePhonePerms', function(source, data, cb)
        local player = Fetch:Source(source)
        if player.Permissions:IsAdmin() then
            local target = Fetch:Source(data.target)
            if target ~= nil then
                local char = target:GetData("Character")
                if char ~= nil then
                    local cPerms = char:GetData("PhonePermissions")
                    cPerms[data.app][data.perm] = data.state
                    char:SetData("PhonePermissions", cPerms)
                    cb(true)
                else
                    cb(false)
                end
            else
                cb(false)
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:GetItemList', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            local Inventory = exports['vertex-base']:FetchComponent('Inventory')
            local items = Inventory:GetItemsDatabase()
            cb(items)
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:GiveItem', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            local Inventory = exports['vertex-base']:FetchComponent('Inventory')

            if not Inventory:DoesItemExist(data.itemName) then
                cb({ success = false, message = 'Item Does Not Exist' })
                return
            end

            local targetSID
            if data.toSelf then
                local char = player:GetData('Character')
                if char then
                    targetSID = char:GetData('SID')
                end
            else
                targetSID = tonumber(data.sid)
            end

            if not targetSID then
                cb({ success = false, message = 'Invalid Target' })
                return
            end

            local target = Fetch:SID(targetSID)
            if not target then
                cb({ success = false, message = 'Player Not Online' })
                return
            end

            local targetChar = target:GetData('Character')
            if not targetChar then
                cb({ success = false, message = 'Target has no active character' })
                return
            end

            local charSID = targetChar:GetData('SID')
            local itemName = data.itemName
            local quantity = tonumber(data.quantity) or 1
            local isWeapon = data.isWeapon
            local targetName = targetChar:GetData('First') .. ' ' .. targetChar:GetData('Last')

            if isWeapon then
                local ammo = tonumber(data.ammo) or 0
                Inventory:AddItem(charSID, itemName, 1, { ammo = ammo, clip = 0 }, 1)
            else
                Inventory:AddItem(charSID, itemName, quantity, {}, 1)
            end

            Logger:Warn(
                "Admin",
                string.format(
                    "%s [%s] Gave Item %s (x%s) To %s (SID %s) Via Admin Panel",
                    player:GetData("Name"),
                    player:GetData("AccountID"),
                    itemName,
                    quantity,
                    targetName,
                    charSID
                ),
                {
                    console = true,
                    file = false,
                    database = true,
                    discord = {
                        embed = true,
                        type = "error",
                        webhook = GetConvar("discord_admin_webhook", ''),
                    },
                }
            )

            cb({ success = true, message = string.format('Gave %sx %s to %s (SID %s)', quantity, itemName, targetName, charSID) })
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:ToggleInvisible', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            Logger:Warn(
                "Admin",
                string.format(
                    "%s [%s] Used Invisibility",
                    player:GetData("Name"),
                    player:GetData("AccountID")
                ),
                {
                    console = (player.Permissions:GetLevel() < 100),
                    file = false,
                    database = true,
                    discord = (player.Permissions:GetLevel() < 100) and {
                        embed = true,
                        type = "error",
                        webhook = GetConvar("discord_admin_webhook", ''),
                    } or false,
                }
            )

            TriggerClientEvent('Admin:Client:Invisible', source)
            cb(true)
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:StartDoorHelper', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            TriggerClientEvent('Doors:Client:DoorHelper', source)
            cb({ success = true })
        else
            cb({ success = false })
        end
    end)

    Callbacks:RegisterServerCallback('Admin:TeleportToCoords', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() and data and data.x and data.y and data.z then
            Pwnzor.Players:TempPosIgnore(source)
            local ped = GetPlayerPed(source)
            SetEntityCoords(ped, data.x + 0.0, data.y + 0.0, data.z + 0.0)
            cb({ success = true, message = 'Teleported Successfully' })
        else
            cb({ success = false, message = 'Invalid Coordinates' })
        end
    end)

    -- Door Lock Tool
    Callbacks:RegisterServerCallback('Admin:GetDoorList', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            local doors = exports['vertex-doors']:GetAllDoors()
            cb(doors or {})
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:CreateDoor', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() and data then
            if not data.model or not data.coords then
                cb({ success = false, message = 'Missing model or coordinates' })
                return
            end

            local doorData = {
                id = data.id or false,
                model = tonumber(data.model),
                coords = { x = tonumber(data.coords.x), y = tonumber(data.coords.y), z = tonumber(data.coords.z) },
                locked = data.locked or false,
                maxDist = tonumber(data.maxDist) or 2.0,
                canLockpick = data.canLockpick or false,
                holdOpen = data.holdOpen or false,
                autoRate = tonumber(data.autoRate) or 0,
                autoDist = data.autoDist and tonumber(data.autoDist) or false,
                autoLock = tonumber(data.autoLock) or 0,
                double = data.double or false,
                special = data.special or false,
                restricted = data.restricted or {},
            }

            local result = exports['vertex-doors']:AddDynamicDoor(doorData)
            if result and result.success then
                Logger:Warn(
                    "Admin",
                    string.format(
                        "%s [%s] Created Dynamic Door '%s' (Index: %s) Via Admin Panel",
                        player:GetData("Name"),
                        player:GetData("AccountID"),
                        doorData.id or "unnamed",
                        result.index
                    ),
                    {
                        console = true,
                        file = false,
                        database = true,
                        discord = {
                            embed = true,
                            type = "info",
                            webhook = GetConvar("discord_admin_webhook", ''),
                        },
                    }
                )
                cb({ success = true, message = 'Door Created Successfully', index = result.index })
            else
                cb({ success = false, message = 'Failed To Create Door' })
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:UpdateDoor', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() and data and data.index then
            local doorData = {
                id = data.id or false,
                model = tonumber(data.model),
                coords = { x = tonumber(data.coords.x), y = tonumber(data.coords.y), z = tonumber(data.coords.z) },
                locked = data.locked or false,
                maxDist = tonumber(data.maxDist) or 2.0,
                canLockpick = data.canLockpick or false,
                holdOpen = data.holdOpen or false,
                autoRate = tonumber(data.autoRate) or 0,
                autoDist = data.autoDist and tonumber(data.autoDist) or false,
                autoLock = tonumber(data.autoLock) or 0,
                double = data.double or false,
                special = data.special or false,
                restricted = data.restricted or {},
            }

            local result = exports['vertex-doors']:UpdateDynamicDoor(tonumber(data.index), doorData)
            if result then
                Logger:Warn(
                    "Admin",
                    string.format(
                        "%s [%s] Updated Dynamic Door '%s' (Index: %s) Via Admin Panel",
                        player:GetData("Name"),
                        player:GetData("AccountID"),
                        doorData.id or "unnamed",
                        data.index
                    ),
                    {
                        console = true,
                        file = false,
                        database = true,
                        discord = {
                            embed = true,
                            type = "info",
                            webhook = GetConvar("discord_admin_webhook", ''),
                        },
                    }
                )
                cb({ success = true, message = 'Door Updated Successfully' })
            else
                cb({ success = false, message = 'Failed To Update Door (Not Dynamic or Not Found)' })
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:DeleteDoor', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() and data and data.index then
            local result = exports['vertex-doors']:RemoveDynamicDoor(tonumber(data.index))
            if result then
                Logger:Warn(
                    "Admin",
                    string.format(
                        "%s [%s] Deleted Dynamic Door (Index: %s) Via Admin Panel",
                        player:GetData("Name"),
                        player:GetData("AccountID"),
                        data.index
                    ),
                    {
                        console = true,
                        file = false,
                        database = true,
                        discord = {
                            embed = true,
                            type = "error",
                            webhook = GetConvar("discord_admin_webhook", ''),
                        },
                    }
                )
                cb({ success = true, message = 'Door Deleted Successfully' })
            else
                cb({ success = false, message = 'Failed To Delete Door (Not Dynamic or Not Found)' })
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:ToggleDoorLock', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() and data and data.index then
            local Doors = exports['vertex-base']:FetchComponent('Doors')
            local newState = Doors:SetLock(tonumber(data.index))
            if newState ~= nil then
                cb({ success = true, locked = newState, message = newState and 'Door Locked' or 'Door Unlocked' })
            else
                cb({ success = false, message = 'Door Not Found' })
            end
        else
            cb(false)
        end
    end)

    -- Elevator Tool
    Callbacks:RegisterServerCallback('Admin:GetElevatorList', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            local elevators = exports['vertex-doors']:GetAllElevators()
            cb(elevators or {})
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:CreateElevator', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() and data then
            if not data.name then
                cb({ success = false, message = 'Missing elevator name' })
                return
            end

            local result = exports['vertex-doors']:AddDynamicElevator(data)
            if result and result.success then
                Logger:Warn(
                    "Admin",
                    string.format(
                        "%s [%s] Created Dynamic Elevator '%s' (Index: %s) Via Admin Panel",
                        player:GetData("Name"),
                        player:GetData("AccountID"),
                        data.name or "unnamed",
                        result.index
                    ),
                    {
                        console = true,
                        file = false,
                        database = true,
                        discord = {
                            embed = true,
                            type = "info",
                            webhook = GetConvar("discord_admin_webhook", ''),
                        },
                    }
                )
                cb({ success = true, message = 'Elevator Created Successfully', index = result.index })
            else
                cb({ success = false, message = 'Failed To Create Elevator' })
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:UpdateElevator', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() and data and data.index then
            local result = exports['vertex-doors']:UpdateDynamicElevator(tonumber(data.index), data)
            if result then
                Logger:Warn(
                    "Admin",
                    string.format(
                        "%s [%s] Updated Dynamic Elevator '%s' (Index: %s) Via Admin Panel",
                        player:GetData("Name"),
                        player:GetData("AccountID"),
                        data.name or "unnamed",
                        data.index
                    ),
                    {
                        console = true,
                        file = false,
                        database = true,
                        discord = {
                            embed = true,
                            type = "info",
                            webhook = GetConvar("discord_admin_webhook", ''),
                        },
                    }
                )
                cb({ success = true, message = 'Elevator Updated Successfully' })
            else
                cb({ success = false, message = 'Failed To Update Elevator (Not Dynamic or Not Found)' })
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:DeleteElevator', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() and data and data.index then
            local result = exports['vertex-doors']:RemoveDynamicElevator(tonumber(data.index))
            if result then
                Logger:Warn(
                    "Admin",
                    string.format(
                        "%s [%s] Deleted Dynamic Elevator (Index: %s) Via Admin Panel",
                        player:GetData("Name"),
                        player:GetData("AccountID"),
                        data.index
                    ),
                    {
                        console = true,
                        file = false,
                        database = true,
                        discord = {
                            embed = true,
                            type = "error",
                            webhook = GetConvar("discord_admin_webhook", ''),
                        },
                    }
                )
                cb({ success = true, message = 'Elevator Deleted Successfully' })
            else
                cb({ success = false, message = 'Failed To Delete Elevator (Not Dynamic or Not Found)' })
            end
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:StartElevatorZoneHelper', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            TriggerClientEvent('Doors:Client:ElevatorZoneHelper', source)
            cb({ success = true })
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback('Admin:StartElevatorPositionHelper', function(source, data, cb)
        local player = Fetch:Source(source)
        if player and player.Permissions:IsAdmin() then
            TriggerClientEvent('Doors:Client:ElevatorPositionHelper', source)
            cb({ success = true })
        else
            cb(false)
        end
    end)
end