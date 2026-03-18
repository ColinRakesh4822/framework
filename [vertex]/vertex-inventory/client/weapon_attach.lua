--[[

    Init Code Credits to @DemiAutomatic / @SleeplessDevelopment
    Fixed for vertex by @i2v | Return
]]

local Config = BACKITEMS_CONFIG
local disabled = false
local currentlyEquipped = nil
local hideInVehicle = false

local BackItems = {}
local SlotCounts = {}

for group, slots in pairs(Config.defaultSlots) do
    SlotCounts[group] = #slots
end

--- may as well class it, just in case we decide to rework the inventory system later.
---@class BackItem : OxClass
local BackItem = lib.class('BackItem')

function BackItem:constructor(invItem, config, slotData)
    self.itemName = invItem.Name
    self.invItem = invItem
    self.config = config
    self.slotData = slotData
    self.object = nil
    self.visible = false
    self.isWeapon = not config.model and invItem.Name:find('WEAPON_') ~= nil
end

function BackItem:create()
    if self.object and DoesEntityExist(self.object) then
        self:destroy()
    end

    if self.isWeapon then
        return self:createWeapon()
    end

    return self:createObject()
end

function BackItem:createObject()
    local model = self.config.model
    if not model then return false end

    if type(model) == 'string' then
        model = joaat(model)
    end

    pcall(lib.requestModel, model, 1000)
    if not HasModelLoaded(model) then return false end

    self.object = CreateObject(model, 0.0, 0.0, 0.0, false, false, false)
    SetModelAsNoLongerNeeded(model)

    if not self.object or self.object == 0 then return false end

    SetEntityCompletelyDisableCollision(self.object, false, false)
    self:attach()
    return true
end

function BackItem:createWeapon()
    local itemDef = Inventory.Items:GetData(self.itemName)
    if not itemDef then return self:createObject() end

    local weaponHash = joaat(itemDef.weapon or itemDef.name)

    pcall(lib.requestWeaponAsset, weaponHash, 1000, 31, 0)
    if not HasWeaponAssetLoaded(weaponHash) then
        RequestWeaponAsset(weaponHash, 31, 0)
        local timeout = GetGameTimer() + 1000
        while not HasWeaponAssetLoaded(weaponHash) and GetGameTimer() < timeout do
            Wait(0)
        end
    end

    if not HasWeaponAssetLoaded(weaponHash) then
        return self:createObject()
    end

    self.object = CreateWeaponObject(weaponHash, 0, 0.0, 0.0, 0.0, true, 1.0, 0)

    if not self.object or self.object == 0 then
        RemoveWeaponAsset(weaponHash)
        return false
    end

    self:applyComponents(weaponHash)
    self:applyTint()

    RemoveWeaponAsset(weaponHash)
    SetEntityCompletelyDisableCollision(self.object, false, false)
    self:attach()
    return true
end

function BackItem:applyComponents(weaponHash)
    local components = self.invItem.MetaData?.WeaponComponents
    if not components then
        return
    end

    for compType, compData in pairs(components) do
        if compData.attachment then
            local compHash = GetHashKey(compData.attachment)
            GiveWeaponComponentToWeaponObject(self.object, compHash)
        end
    end
end

function BackItem:applyTint()
    local tint = self.invItem.MetaData?.WeaponTint
    if tint and self.object then
        SetWeaponObjectTintIndex(self.object, tint)
    end
end

function BackItem:attach()
    if not self.object or not DoesEntityExist(self.object) then return false end

    local ped = cache.ped
    local slot = self.slotData
    local customPos = self.config.customPos

    local bone = customPos?.bone or slot.bone
    local pos = slot.pos
    local rot = slot.rot

    if customPos then
        if customPos.pos then
            pos = vec3(
                customPos.pos.x or pos.x,
                customPos.pos.y or pos.y,
                customPos.pos.z or pos.z
            )
        end
        if customPos.rot then
            rot = vec3(
                customPos.rot.x or rot.x,
                customPos.rot.y or rot.y,
                customPos.rot.z or rot.z
            )
        end
    end

    AttachEntityToEntity(
        self.object, ped,
        GetPedBoneIndex(ped, bone),
        pos.x, pos.y, pos.z,
        rot.x, rot.y, rot.z,
        true, false, false, true, 2, true
    )
    return true
end

function BackItem:setVisible(toggle)
    if not self.object then
        if toggle then self:create() end
        return
    end

    if not DoesEntityExist(self.object) then
        self.object = nil
        if toggle then self:create() end
        return
    end

    if toggle == self.visible then return end

    SetEntityVisible(self.object, toggle, false)
    self.visible = toggle
end

function BackItem:destroy()
    if self.object and DoesEntityExist(self.object) then
        DeleteEntity(self.object)
    end
    self.object = nil
    self.visible = false
end

local function destroyAll()
    for _, backItem in pairs(BackItems) do
        backItem:destroy()
    end
    table.wipe(BackItems)
end

local function hideAll()
    for _, backItem in pairs(BackItems) do
        backItem:setVisible(false)
    end
end

local function showAll()
    for _, backItem in pairs(BackItems) do
        if backItem.itemName ~= currentlyEquipped then
            backItem:setVisible(true)
        end
    end
end

local function getEquippedWeaponName()
    if not Weapons then return nil end
    local equipped = Weapons:GetEquippedItem()
    return equipped?.Name
end

local function formatInventoryItems()
    if not _cachedInventory or not _cachedInventory.inventory then return {} end

    local items = {}
    local equippedName = getEquippedWeaponName()

    for _, invItem in ipairs(_cachedInventory.inventory) do
        local config = Config.BackItems[invItem.Name]
        if config then
            local shouldHide = invItem.Name == equippedName or hideInVehicle
            items[#items + 1] = {
                invItem = invItem,
                config = config,
                prio = config.prio or 1,
                group = config.group or 'back',
                hide = shouldHide,
            }
        end
    end

    table.sort(items, function(a, b)
        return a.prio > b.prio
    end)

    return items
end

local function refreshBackItems()
    if not LocalPlayer.state.loggedIn or disabled then return end

    local items = formatInventoryItems()
    local takenSlots = {}
    local newBackItems = {}

    currentlyEquipped = getEquippedWeaponName()

    for _, data in ipairs(items) do
        local group = data.group
        local config = data.config
        local invItem = data.invItem

        takenSlots[group] = takenSlots[group] or 0

        local canShow = false
        local slotData = nil

        if config.ignoreLimits and config.customPos then
            canShow = true
            slotData = {
                bone = config.customPos.bone or 24818,
                pos = config.customPos.pos or vec3(0, 0, 0),
                rot = config.customPos.rot or vec3(0, 0, 0),
            }
        elseif takenSlots[group] < (SlotCounts[group] or 0) then
            takenSlots[group] += 1
            slotData = Config.defaultSlots[group][takenSlots[group]]
            canShow = true
        end

        if canShow and slotData then
            local existing = BackItems[invItem.Name]

            if existing then
                existing.invItem = invItem
                existing.slotData = slotData
                newBackItems[invItem.Name] = existing

                if data.hide then
                    existing:setVisible(false)
                else
                    if not existing.object or not DoesEntityExist(existing.object) then
                        existing:create()
                    end
                    existing:setVisible(true)
                end
            else
                local backItem = BackItem:new(invItem, config, slotData)
                newBackItems[invItem.Name] = backItem

                if not data.hide then
                    backItem:create()
                    backItem:setVisible(true)
                end
            end
        end
    end

    for itemName, backItem in pairs(BackItems) do
        if not newBackItems[itemName] then
            backItem:destroy()
        end
    end

    BackItems = newBackItems
end

local function onWeaponSwitch(newWeaponName)
    local prevEquipped = currentlyEquipped
    currentlyEquipped = newWeaponName

    if prevEquipped and prevEquipped ~= newWeaponName then
        local prevItem = BackItems[prevEquipped]
        if prevItem then
            prevItem:setVisible(true)
        end
    end

    if newWeaponName then
        local newItem = BackItems[newWeaponName]
        if newItem then
            newItem:setVisible(false)
        end
    end
end

lib.onCache('ped', function()
    if LocalPlayer.state.loggedIn and not disabled then
        for _, backItem in pairs(BackItems) do
            if backItem.visible and backItem.object and DoesEntityExist(backItem.object) then
                backItem:attach()
            end
        end
    end
end)

lib.onCache('vehicle', function(vehicle)
    local inVehicle = vehicle ~= false

    if inVehicle and Config.allowedVehicleClasses[GetVehicleClass(vehicle)] then
        inVehicle = false
    end

    if hideInVehicle ~= inVehicle then
        hideInVehicle = inVehicle
        if hideInVehicle then
            hideAll()
        else
            showAll()
        end
    end
end)

RegisterNetEvent('Weapons:Client:AttachToggle', function(state)
    disabled = state
    if disabled then
        hideAll()
    else
        refreshBackItems()
    end
end)

RegisterNetEvent('Weapons:Client:Attach', function()
    refreshBackItems()
end)

AddEventHandler('Weapons:Client:SwitchedWeapon', function(weaponName, weaponData)
    if not LocalPlayer.state.loggedIn or disabled then return end
    onWeaponSwitch(weaponData?.Name)
end)

RegisterNetEvent('Inventory:Client:Cache', function(_, refresh)
    if refresh then
        SetTimeout(50, refreshBackItems)
    end
end)

RegisterNetEvent('Characters:Client:Spawn', function()
    CreateThread(function()
        while not _cachedInventory do
            Wait(100)
        end
        Wait(1000)
        refreshBackItems()
    end)
end)

RegisterNetEvent('Characters:Client:Logout', function()
    destroyAll()
    currentlyEquipped = nil
    hideInVehicle = false
end)

AddEventHandler('onResourceStop', function(resource)
    if resource == GetCurrentResourceName() then
        destroyAll()
    end
end)

CreateThread(function()
    while true do
        Wait(3000)
        if LocalPlayer.state.loggedIn and not disabled then
            local ped = cache.ped
            for _, backItem in pairs(BackItems) do
                if backItem.object then
                    if not DoesEntityExist(backItem.object) then
                        backItem.object = nil
                        backItem.visible = false
                    elseif backItem.visible and not IsEntityAttachedToEntity(backItem.object, ped) then
                        backItem:attach()
                    end
                end
            end
        end
    end
end)
