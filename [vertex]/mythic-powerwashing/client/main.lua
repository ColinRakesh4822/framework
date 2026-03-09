local Washing = {}
Washing.Created_Objects = {}
Washing.StartedJob = false
Washing.Job = {}
Washing.Zone = nil
Washing.Required = 0
Washing.TotalRequired = 0
Washing.Blip = nil
Washing.JobSearching = false


local Targeting = nil
local Progress = nil
local Notification = nil
local Callbacks = nil
local Logger = nil
local Reputation = nil
local ListMenu = nil

AddEventHandler("Sanitation:Shared:DependencyUpdate", RetrieveComponents)

function RetrieveComponents()
    Targeting = exports['mythic-base']:FetchComponent("Targeting")
    Progress = exports['mythic-base']:FetchComponent("Progress")
    Notification = exports['mythic-base']:FetchComponent("Notification")
    Callbacks = exports['mythic-base']:FetchComponent("Callbacks")
    Logger = exports['mythic-base']:FetchComponent("Logger")
    Reputation = exports['mythic-base']:FetchComponent("Reputation")
    ListMenu = exports['mythic-base']:FetchComponent("ListMenu")
end

local setupEvent = nil
setupEvent = AddEventHandler("Core:Shared:Ready", function()
    exports['mythic-base']:RequestDependencies("Sanitation", {
        "Targeting",
        "Progress",
        "Notification",
        "Callbacks",
        "Logger",
        "Reputation",
        "ListMenu"
    }, function(error)
        if #error > 0 then
            return
        end
        RetrieveComponents()
        RemoveEventHandler(setupEvent)
    end)
end)


RegisterNetEvent("Sanitation:Client:StartJobFromLabor", function(job)
    if not job or not job.job then
        return
    end
    
    if Washing.StartedJob then 
        Notification:Error("You already have an active job!", 3000)
        return 
    end
    
    Washing.StartWashingJob(job.job)
end)


RegisterNetEvent("Sanitation:Client:StopJobFromLabor", function()
    if Washing.StartedJob then
        Washing.CleanUp()
    end
end)


local function CreateWashingBlip(x, y, z, route, sprite, color)
    local blip = AddBlipForCoord(x,y,z)
    if route then
        SetBlipRoute(blip, true)
        SetBlipRouteColour(blip, 2)
    end
    SetBlipSprite(blip, sprite)
    SetBlipScale(blip, 0.9)
    SetBlipColour(blip, color)
    SetBlipAsShortRange(blip, true)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString("Pressure Washing")
    EndTextCommandSetBlipName(blip)
    return blip
end

local function findClosestObject(coordList, targetCoord)
    local object = nil
    local shortestDistance = math.huge
    local distance = 0
    local key = -1

    for k, v in ipairs(coordList) do
        local distance = #(v.coords - targetCoord)
        if distance < shortestDistance then
            shortestDistance = distance
            object = v.obj
            distance = distance
            key = k
        end
    end

    return object, distance, key
end

local function LoadParticleDictionary(dictionary)
    if not HasNamedPtfxAssetLoaded(dictionary) then
        RequestNamedPtfxAsset(dictionary)
        while not HasNamedPtfxAssetLoaded(dictionary) do
            Citizen.Wait(0)
        end
    end
end

Washing.StartWashingJob = function(job)
    local coords = job.top_left
    Washing.Job = job
    Washing.StartedJob = true
    Washing.Blip = CreateWashingBlip(coords.x, coords.y, coords.z, true, 764, 5)

    Washing.Zone = lib.zones.sphere({
        coords = coords,
        radius = 20.0,
        onEnter = function(self)
            Washing.CreateWashingJob(Washing.Job)
            Washing.StartWashingLoop()
            Washing.ShowProgressBar()
            self:remove()
        end,
        debug = false,
    })
end

local power_wash_hash = `WEAPON_PRESSURE1`
local washing_speed = function() return math.random(100, 250) end

Washing.StartWashingLoop = function()
    CreateThread(function()
        LoadParticleDictionary('core')
        local PlayerPed = cache.ped
        local handle = nil
        while Washing.StartedJob do
            local _, weapon = GetCurrentPedWeapon(PlayerPed)
            local entity = GetCurrentPedWeaponEntityIndex(PlayerPed)
            
            if weapon == `WEAPON_PRESSURE1` then
                if IsControlPressed(0, 24) then
                    if not handle then
                        local rotation = GetGameplayCamRot(5)
                        UseParticleFxAssetNextCall("core")
                        handle = StartNetworkedParticleFxLoopedOnEntityBone("water_cannon_jet", entity, 0.0, 0.0, 0.0, rotation.x/360, 0.0, -90.0, GetEntityBoneIndexByName(entity, 'Gun_Muzzle'), 0.6, 0.0, 0.0, 0.0)
                    end
                    
                    local playerCoords = GetEntityCoords(PlayerPed)
                    local playerHeading = GetEntityHeading(PlayerPed)
                    local forwardVector = vector3(
                        math.sin(math.rad(-playerHeading)),
                        math.cos(math.rad(-playerHeading)),
                        0.0
                    )
                    
                    local closest = nil
                    local closestDistance = 8.0
                    
                    for i, obj in pairs(Washing.Created_Objects) do
                        local objCoords = obj.coords
                        local distance = #(playerCoords - objCoords)
                        
                        if distance < closestDistance then
                            local dirToObj = objCoords - playerCoords
                            local dotProduct = (dirToObj.x * forwardVector.x) + (dirToObj.y * forwardVector.y)
                            
                            if dotProduct > 0 then
                                closest = obj.obj
                                closestDistance = distance
                            end
                        end
                    end
                    
                    if closest and DoesEntityExist(closest) then
                        DeleteEntity(closest)
                        Washing.Required = Washing.Required - 1
                        
                        for i, obj in pairs(Washing.Created_Objects) do
                            if obj.obj == closest then
                                table.remove(Washing.Created_Objects, i)
                                break
                            end
                        end
                        
                        if Washing.Required <= 0 then
                            Washing.FinishedJob()
                            if handle then
                                StopParticleFxLooped(handle, 0)
                                RemoveParticleFxFromEntity(entity)
                                handle = nil
                            end
                            return
                        end
                    end
                else
                    if handle then
                        StopParticleFxLooped(handle, 0)
                        RemoveParticleFxFromEntity(entity)
                        handle = nil
                    end
                end
            end
            
            Wait(50)
        end
    end)
end

Washing.ShowProgressBar = function()
    CreateThread(function()
        
        TriggerServerEvent("Sanitation:Server:StartProgress", Washing.TotalRequired)
        
        local lastCleaned = 0
        while Washing.StartedJob do
            if Washing.TotalRequired and Washing.TotalRequired > 0 then
                local cleaned = Washing.TotalRequired - Washing.Required
                
                
                if cleaned ~= lastCleaned then
                    TriggerServerEvent("Sanitation:Server:UpdateProgress", cleaned)
                    lastCleaned = cleaned
                end
            end
            Wait(250)
        end
    end)
end

function GetRotationFromNormal(normal)
    local pitch = math.asin(-normal.y) * (180.0 / math.pi)
    local yaw = math.atan2(normal.x, normal.z) * (180.0 / math.pi)
    local roll = 0 

    return vector3(pitch, yaw, roll)
end

local dirt_prop = `dirty_plane`
Washing.CreateWashingJob = function(location)
    local ped = cache.ped
    Washing.Required = location.number + math.random (200, 300)
    Washing.TotalRequired = Washing.Required
    Washing.StartedJob = true
    Washing.Needed_Removed = 290
    local locationNormal = location.normal
    local locationRotation = GetRotationFromNormal(locationNormal)

    local model = GetHashKey("dirty_plane")
    RequestModel(model)
    while not HasModelLoaded(model) do
        Wait(10)
    end

    local normal = location.normal
    local top_left = location.top_left
    local top_right = location.top_right
    local bottom_left = top_left - vector3(0.0, 0.0, 2.0)
    local bottom_right = top_right - vector3(0.0, 0.0, 2.0)

    for i = 1, Washing.Required do
        local randomPoint = vector3(math.random() * (top_right.x - top_left.x) + top_left.x,
                math.random() * (bottom_left.y - top_left.y) + top_left.y,
                math.random() * (bottom_left.z - top_left.z) + top_left.z
        )

        local projection = ((randomPoint.x - bottom_left.x) * normal.x +
                (randomPoint.y - bottom_left.y) * normal.y +
                (randomPoint.z - bottom_left.z) * normal.z)

        local vector = randomPoint - normal * projection

        local object
        if  ( i % 2 ) == 0 then
            object = CreateObject(model, vector.x, vector.y, vector.z, true)
        else
            object = CreateObject(model, vector.x, vector.y, vector.z, false)
        end

        FreezeEntityPosition(object, true)
        SetEntityRotation(object, locationRotation, 0, 0)
        table.insert(Washing.Created_Objects, {
            obj = object,
            coords = vector,
        })
    end
end

Washing.FinishedJob = function()
    Washing.CleanUp()
    Callbacks:ServerCallback("Sanitation:FinishWashingJob", {}, function(success)
        
    end)
end

Washing.CleanUp = function()
    for k, v in pairs(Washing.Created_Objects) do
        DeleteEntity(v.obj)
    end
    if Washing.Blip then
        RemoveBlip(Washing.Blip)
        Washing.Blip = nil
    end
    Washing.Created_Objects = {}
    Washing.StartedJob = false
    Washing.Job = {}
    Washing.Zone = nil
    Washing.Required = 0
    Washing.TotalRequired = 0
    Washing.JobSearching = false
end


RegisterNetEvent('Sanitation:ResetWashingJob')
AddEventHandler('Sanitation:ResetWashingJob', function()
    Washing.CleanUp()
end)

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        for k, v in pairs(Washing.Created_Objects) do
            DeleteEntity(v.obj)
        end
    end
end)


exports('startWashingJob', function()
    startPressureWashingJob()
end)

exports('cancelWashingJob', function()
    if not Washing.StartedJob then
        Notification:Error("You don't have an active job to cancel.", 3000)
        return
    end
    
    Washing.StartedJob = false
    Washing.JobSearching = false
    Washing.Job = nil
    
    if Washing.Zone then
        Washing.Zone:remove()
        Washing.Zone = nil
    end
    
    if Washing.Blip then
        RemoveBlip(Washing.Blip)
        Washing.Blip = nil
    end
    
    for k, v in pairs(Washing.Created_Objects) do
        DeleteEntity(v.obj)
    end
    Washing.Created_Objects = {}
    
    TriggerServerEvent('Sanitation:Server:ResetWashingJob')
    
    Notification:Success("Pressure washing job cancelled successfully.", 3000)
end)

exports('hasActiveWashingJob', function()
    return Washing.StartedJob or false
end)
