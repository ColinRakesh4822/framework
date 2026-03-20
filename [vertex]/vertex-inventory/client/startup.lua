_startup = false
_items = {}

local _loading = false
function LoadItems()
	if _loading then
		return
	end
	_loading = true
	SendNUIMessage({
		type = "ITEMS_UNLOADED",
		data = {},
	})
	Wait(100)
	SendNUIMessage({
		type = "RESET_ITEMS",
		data = {},
	})

	Wait(1000)

	for _, its in pairs(_itemsSource) do
		for k, v in ipairs(its) do
			SendNUIMessage({
				type = "ADD_ITEM",
				data = {
					id = v.name,
					item = v,
				},
			})
			_items[v.name] = v
		end
	end

	Wait(1000)

	SendNUIMessage({
		type = "ITEMS_LOADED",
	})
	TriggerEvent("Inventory:Client:ItemsLoaded")
	
	-- Utility envanteri yükle
	Callbacks:ServerCallback("Inventory:GetUtilityInventory", {}, function(utilityData)
		if utilityData then
			_cachedUtilityInventory = utilityData
			
			-- Utility envanterinde backpack itemi varsa otomatik aç
			for _, slot in ipairs(utilityData.inventory or {}) do
				if slot and (slot.Name == "backpack" or slot.Name == "large_backpack" or slot.Name == "military_backpack" or slot.Name == "tactical_backpack") then
					-- Backpack envanterini aç
					Callbacks:ServerCallback("Inventory:OpenBackpackFromUtility", {slotId = slot.id, backpackName = slot.Name}, function(backpackData)
						if backpackData then
							_cachedBackpackInventory = backpackData
							SendNUIMessage({
								type = "SET_BACKPACK_INVENTORY",
								data = backpackData,
							})
						end
					end)
					break -- Sadece ilk backpack itemini aç
				end
			end
		end
	end)
	
	_startup = true
	_loading = false
end
