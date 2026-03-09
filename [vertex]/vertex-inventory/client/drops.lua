dIds = 1
dropzones = {}
local closerDrops = {}
local closerDropsIds = {}
local bagObjects = {}
local BAG_MODEL = `prop_paper_bag_01`

AddEventHandler("Inventory:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Targeting = exports["vertex-base"]:FetchComponent("Targeting")
	Inventory = exports["vertex-base"]:FetchComponent("Inventory")
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Inventory", {
		"Targeting",
		"Inventory",
		"Callbacks",
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveComponents()
	end)
end)

function runDropsUpdate(checkRemovals)
	if LocalPlayer.state.position ~= nil then
		closerDrops = {}
		closerDropsIds = {}
		if #dropzones > 0 then
			for k, v in ipairs(dropzones) do
				local distance = #(LocalPlayer.state.position - vector3(v.coords.x, v.coords.y, v.coords.z))
				if distance <= 25.0 then
					if not closerDropsIds[k] then
						table.insert(
							closerDrops,
							{ key = k, id = v.id, coords = vector3(v.coords.x, v.coords.y, v.coords.z + 0.35), route = v.route }
						)
						closerDropsIds[k] = #closerDrops
					end
				elseif closerDropsIds[k] then
					table.remove(closerDrops, closerDropsIds[k])
					closerDropsIds[k] = nil
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

	CreateThread(function()
		RequestModel(BAG_MODEL)
		while not HasModelLoaded(BAG_MODEL) do
			Wait(0)
		end

		while LocalPlayer.state.loggedIn do
			local active = {}
			
			if #closerDrops > 0 then
				for idx, v in ipairs(closerDrops) do
					if v.route == LocalPlayer.state.currentRoute then
						local dropzoneKey = v.key or v.id
						active[dropzoneKey] = true
						
						if not bagObjects[dropzoneKey] then
							local obj = CreateObject(
								BAG_MODEL,
								v.coords.x,
								v.coords.y,
								v.coords.z,
								true,  
								false, 
								false  
							)
							if DoesEntityExist(obj) then
								SetEntityAsMissionEntity(obj, true, true)
								PlaceObjectOnGroundProperly(obj)
								FreezeEntityPosition(obj, true)
								SetEntityCollision(obj, false, false)
								SetEntityAlpha(obj, 255, false)
								bagObjects[dropzoneKey] = {
									object = obj,
									id = v.id,
									coords = v.coords
								}
								
								
								if Targeting and Inventory and Callbacks then
									
									local defaultLabel = "Check Bag For Items"
									Targeting.Zones:AddBox(
										"dropzone_" .. v.id,
										"box",  
										v.coords,  
										1.0,  
										1.0,  
										{
											heading = 0,
											minZ = v.coords.z - 0.5,
											maxZ = v.coords.z + 1.0
										},  
										{
											{
												icon = "box",
												text = defaultLabel,
												event = "Inventory:Client:OpenDropzone",
												data = {
													dropzoneId = v.id,
													coords = v.coords
												}
											}
										},  
										3.0,  
										true  
									)
									Targeting.Zones:Refresh()
									
									
									Callbacks:ServerCallback("Inventory:GetDropzoneItems", { dropzoneId = v.id }, function(items)
										local label = "Check Bag For Items"
										
										if items and #items > 0 then
											
											local uniqueItems = {}
											for _, item in ipairs(items) do
												if not uniqueItems[item.name] then
													uniqueItems[item.name] = true
												end
											end
											
											local uniqueCount = 0
											for _ in pairs(uniqueItems) do
												uniqueCount = uniqueCount + 1
											end
											
											if uniqueCount == 1 then
												
												local itemName = items[1].name
												local itemData = Inventory.Items:GetData(itemName)
												if itemData and itemData.label then
													label = "Pick Up " .. itemData.label
												else
													label = "Pick Up " .. itemName
												end
											else
												
												label = "Check Bag For Items"
											end
										end
										
										
										if Targeting then
											Targeting.Zones:RemoveZone("dropzone_" .. v.id)
											Targeting.Zones:AddBox(
												"dropzone_" .. v.id,
												"box",
							v.coords,
												1.0,
												1.0,
												{
													heading = 0,
													minZ = v.coords.z - 0.5,
													maxZ = v.coords.z + 1.0
												},
												{
													{
														icon = "box",
														text = label,
														event = "Inventory:Client:OpenDropzone",
														data = {
															dropzoneId = v.id,
															coords = v.coords
														}
													}
												},
												3.0,
												true
											)
											Targeting.Zones:Refresh()
										end
									end)
								end
							end
						end
					end
				end
			end
			
			
			for objKey, objData in pairs(bagObjects) do
				if not active[objKey] then
					
					local dropzoneStillExists = false
					for _, dz in ipairs(dropzones) do
						if dz.id == objData.id then
							dropzoneStillExists = true
							break
						end
					end
					
					if not dropzoneStillExists then
						if DoesEntityExist(objData.object) then
							DeleteEntity(objData.object)
						end
						
						if Targeting and objData.id then
							Targeting.Zones:RemoveZone("dropzone_" .. objData.id)
							Targeting.Zones:Refresh()
						end
						bagObjects[objKey] = nil
					end
				end
			end
			
			Wait(200)
		end
	end)
end

RegisterNetEvent('Inventory:Client:DropzoneForceUpdate', function(dzs)
	if dzs then
		dropzones = dzs
	end
	
	for objKey, objData in pairs(bagObjects) do
		if DoesEntityExist(objData.object) then
			DeleteEntity(objData.object)
		end
		if Targeting and objData.id then
			Targeting.Zones:RemoveZone("dropzone_" .. objData.id)
		end
		bagObjects[objKey] = nil
	end
	
	closerDrops = {}
	closerDropsIds = {}
	if Targeting then
		Targeting.Zones:Refresh()
	end
end)

RegisterNetEvent('Inventory:Client:AddDropzone', function(data)
	table.insert(dropzones, data)
end)

RegisterNetEvent('Inventory:Client:RemoveDropzone', function(id)
	for k, v in ipairs(dropzones) do
		if v.id == id then
			table.remove(dropzones, k)
			
			
			for objKey, objData in pairs(bagObjects) do
				if objData.id == id then
					if DoesEntityExist(objData.object) then
						DeleteEntity(objData.object)
					end
					
					if Targeting then
						Targeting.Zones:RemoveZone("dropzone_" .. id)
						Targeting.Zones:Refresh()
					end
					bagObjects[objKey] = nil
					break
				end
			end
			
			break
		end
	end
end)

RegisterNetEvent('Inventory:Client:OpenDropzone', function(targetData, menuData)
	local dropzoneId = nil
	local coords = nil
	
	
	if menuData and menuData.data then
		dropzoneId = menuData.data.dropzoneId
		coords = menuData.data.coords
	end
	
	
	if not dropzoneId and targetData and targetData.id then
		local zoneId = targetData.id
		if string.find(zoneId, "dropzone_") == 1 then
			dropzoneId = string.sub(zoneId, 10) 
			
			for _, dz in ipairs(dropzones) do
				if dz.id == dropzoneId then
					coords = dz.coords
					break
				end
			end
		end
	end
	
	if dropzoneId and Inventory then
		SecondInventory = {
			invType = 10,
			owner = dropzoneId,
			position = coords
		}
		Inventory.Open:Player(true)
	end
end)
