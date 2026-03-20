dIds = 1
dropzones = {}
local closerDrops = {}
local closerDropsIds = {}
local spawnedProps = {}
local dropzoneItems = {} -- store dropzone items
local lastCacheUpdate = {} -- track last cache update time

function getPropForDropzone(dropzoneId)
    local items = dropzoneItems[dropzoneId]
    if not items or #items == 0 then
        print("No items found for dropzone " .. dropzoneId .. ", using default prop")
        return ITEM_PROPS_CONFIG["default"]
    end
    
    print("Dropzone " .. dropzoneId .. " has " .. #items .. " items")
    
    -- if there is more than one item, use the default prop
    if #items > 1 then
        print("Multiple items detected, using default prop: " .. ITEM_PROPS_CONFIG["default"])
        return ITEM_PROPS_CONFIG["default"]
    end
    
    -- if there is only one item, use the prop for that item
    local itemName = items[1].Name
    local selectedProp = ITEM_PROPS_CONFIG[itemName] or ITEM_PROPS_CONFIG["default"]
    print("Single item " .. itemName .. ", using prop: " .. selectedProp)
    return selectedProp
end

function runDropsUpdate(checkRemovals)
	if LocalPlayer.state.position ~= nil then
		closerDrops = {}
		closerDropsIds = {}
		if #dropzones > 0 then
			for k, v in ipairs(dropzones) do
				local distance = #(LocalPlayer.state.position - vector3(v.coords.x, v.coords.y, v.coords.z))
				if distance <= 25.0 then
					if not closerDrops[k] then
						table.insert(
							closerDrops,
							{ coords = vector3(v.coords.x, v.coords.y, v.coords.z), route = v.route, id = v.id }
						)
						closerDropsIds[k] = #closerDrops
						
						if not spawnedProps[v.id] then
							-- Dropzone item'larını al ve prop spawn et
							TriggerServerEvent("Inventory:Server:GetDropzoneItems", v.id)
						end
					end
					
					if spawnedProps[v.id] and not dropzoneItems[v.id] then
						TriggerServerEvent("Inventory:Server:GetDropzoneItems", v.id)
					end
					
					-- Dropzone'a yaklaştığımızda cache'i temizle (güncel item listesi için)
					-- Sadece 5 saniyede bir cache'i temizle (performans için)
					local currentTime = GetGameTimer()
					if dropzoneItems[v.id] and (not lastCacheUpdate[v.id] or currentTime - lastCacheUpdate[v.id] > 5000) then
						-- Cache'i temizle ama prop'u silme, sadece item listesini güncelle
						dropzoneItems[v.id] = nil
						lastCacheUpdate[v.id] = currentTime
						TriggerServerEvent("Inventory:Server:GetDropzoneItems", v.id)
					end
				elseif closerDropsIds[k] then
					table.remove(closerDrops, closerDropsIds[k])
					closerDropsIds[k] = nil
					
					-- Delete prop when out of range
					if spawnedProps[v.id] then
						DeleteObject(spawnedProps[v.id])
						spawnedProps[v.id] = nil
					end
				end
			end
		end
	end
end

function startDropsTick()
	CreateThread(function()
		while LocalPlayer.state.loggedIn do
			runDropsUpdate()
			Wait(1000)
		end
	end)
end

RegisterNetEvent("Inventory:Client:DropzoneForceUpdate", function(dzs)
	dropzones = dzs
end)

RegisterNetEvent("Inventory:Client:AddDropzone", function(data)
	table.insert(dropzones, data)
end)

RegisterNetEvent("Inventory:Client:RemoveDropzone", function(id)
	for k, v in ipairs(dropzones) do
		if v.id == id then
			table.remove(dropzones, k)
			-- delete prop when dropzone is removed
			if spawnedProps[id] then
				DeleteObject(spawnedProps[id])
				spawnedProps[id] = nil
			end
			-- clear dropzone items
			dropzoneItems[id] = nil
			break
		end
	end
end)

-- Server'dan dropzone item'larını al
RegisterNetEvent("Inventory:Client:ReceiveDropzoneItems", function(dropzoneId, items)
	dropzoneItems[dropzoneId] = items
	
	-- Debug: Item'ları listele
	print("Received items for dropzone " .. dropzoneId .. ":")
	for i, item in ipairs(items) do
		print("  " .. i .. ": " .. item.Name .. " (Count: " .. item.Count .. ")")
	end
	
	-- Doğru prop'u belirle
	local correctProp = getPropForDropzone(dropzoneId)
	local propHash = correctProp
	
	-- Eğer string ise hash'e çevir, değilse direkt kullan
	if type(correctProp) == "string" then
		propHash = GetHashKey(correctProp)
	end
	
	-- Debug: Hash kodunu kontrol et
	print("Trying to spawn prop with hash: " .. propHash .. " (type: " .. type(correctProp) .. ")")
	
	-- Eğer prop zaten spawn edilmişse ve aynı prop ise, yeni prop spawn etme
	if spawnedProps[dropzoneId] then
		-- Mevcut prop'un hash'ini kontrol et
		local currentPropHash = GetEntityModel(spawnedProps[dropzoneId])
		if currentPropHash == propHash then
			print("Same prop already exists, skipping spawn")
			return
		else
			-- Farklı prop ise eski prop'u sil
			DeleteObject(spawnedProps[dropzoneId])
			spawnedProps[dropzoneId] = nil
		end
	end
	
	RequestModel(propHash)
	local timeout = 0
	while not HasModelLoaded(propHash) and timeout < 100 do
		Wait(10)
		timeout = timeout + 1
	end
	
	if timeout >= 100 then
		print("Model load timeout for hash: " .. propHash)
		return
	end
	
	local coords = nil
	for k, v in ipairs(dropzones) do
		if v.id == dropzoneId then
			coords = vector3(v.coords.x, v.coords.y, v.coords.z)
			break
		end
	end
	
	if coords then
		local playerPed = PlayerPedId()
		local playerCoords = GetEntityCoords(playerPed)
		local playerHeading = GetEntityHeading(playerPed)
		
		local forwardX = math.sin(math.rad(-playerHeading)) * 0.8
		local forwardY = math.cos(math.rad(-playerHeading)) * 0.8
		
		local spawnX = playerCoords.x + forwardX
		local spawnY = playerCoords.y + forwardY
		local spawnZ = playerCoords.z - 0.3
		
		local prop = CreateObject(propHash, spawnX, spawnY, spawnZ, false, false, false)
		SetEntityAsMissionEntity(prop, true, true)
		SetEntityInvincible(prop, true)
		
		-- Fizik ayarları
		SetEntityDynamic(prop, true)
		SetEntityHasGravity(prop, true)
		SetEntityCollision(prop, true, true)
		
		-- Hafif yukarıdan düşme efekti
		ApplyForceToEntity(prop, 1, 0.0, 0.0, -2.0, 0.0, 0.0, 0.0, 0, true, true, true, false, true)
		
		-- 2 saniye sonra dondur (yere düştükten sonra)
		CreateThread(function()
			Wait(2000)
			if DoesEntityExist(prop) then
				FreezeEntityPosition(prop, true)
				SetEntityDynamic(prop, false)
			end
		end)
		
		spawnedProps[dropzoneId] = prop
	end
end)