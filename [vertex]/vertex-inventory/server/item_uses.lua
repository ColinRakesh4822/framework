local _partsTable = {
	{ 15, { name = "repair_part_electronics", min = 3, max = 5 } },
	{ 15, { name = "repair_part_axle", min = 3, max = 5 } },
	{ 15, { name = "repair_part_injectors", min = 3, max = 5 } },
	{ 15, { name = "repair_part_clutch", min = 3, max = 5 } },
	{ 15, { name = "repair_part_brakes", min = 3, max = 5 } },
	{ 15, { name = "repair_part_transmission", min = 3, max = 5 } },
	{ 10, { name = "repair_part_rad", min = 3, max = 5 } },
}

local _partsTableHG = {
	{ 20, { name = "repair_part_injectors_hg" } },
	{ 20, { name = "repair_part_clutch_hg" } },
	{ 20, { name = "repair_part_brakes_hg" } },
	{ 20, { name = "repair_part_transmission_hg" } },
	{ 20, { name = "repair_part_rad_hg" } },
}

local _materialsTable = {
	{ 19, { name = "electronic_parts", min = 20, max = 120 } },
	{ 19, { name = "plastic", min = 20, max = 120 } },
	{ 19, { name = "rubber", min = 20, max = 120 } },
	{ 19, { name = "copperwire", min = 50, max = 250 } },
	{ 19, { name = "glue", min = 10, max = 55 } },
	{ 5, { name = "ironbar", min = 10, max = 50 } },
}

function RegisterRandomItems()
	Inventory.Items:RegisterUse("cigarette", "RandomItems", function(source, item)
		if GetVehiclePedIsIn(GetPlayerPed(source)) == 0 then
			Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
			refreshShit(item.Owner, true)
			Player(source).state.stressTicks = { "3", "3", "3", "3", "3", "3", "3", "3" }
		else
			Execute:Client(source, "Notification", "Error", "Cannot Be Used In A Vehicle")
		end
	end)

	Inventory.Items:RegisterUse("cigarette_pack", "RandomItems", function(source, item)
		if (item.MetaData.Count and tonumber(item.MetaData.Count) or 0) > 0 then
			Inventory:AddItem(item.Owner, "cigarette", 1, {}, 1)
			if tonumber(item.MetaData.Count) - 1 <= 0 then
				Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
			else
				Inventory:SetMetaDataKey(item.id, "Count", tonumber(item.MetaData.Count) - 1)
			end
			refreshShit(item.Owner, true)
		else
			Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
			refreshShit(item.Owner, true)
			Execute:Client(source, "Notification", "Error", "Pack Has No More Cigarettes In It")
		end
	end)

	Inventory.Items:RegisterUse("armor", "RandomItems", function(source, item)
		Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
		refreshShit(item.Owner, true)
		SetPedArmour(GetPlayerPed(source), 50)
	end)

	Inventory.Items:RegisterUse("heavyarmor", "RandomItems", function(source, item)
		Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
		refreshShit(item.Owner, true)
		SetPedArmour(GetPlayerPed(source), 100)
	end)

	Inventory.Items:RegisterUse("pdarmor", "RandomItems", function(source, item)
		Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
		refreshShit(item.Owner, true)
		SetPedArmour(GetPlayerPed(source), 100)
	end)

	Inventory.Items:RegisterUse("parts_box", "RandomItems", function(source, item)
		local plyr = Fetch:Source(source)
		if plyr ~= nil then
			local char = plyr:GetData("Character")
			if char ~= nil then
				Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
				if item.MetaData.Items then
					for k, v in ipairs(item.MetaData.Items) do
						Inventory:AddItem(item.Owner, v.name, v.count, {}, 1)
					end
				end
				refreshShit(item.Owner, true)
			end
		end
	end)

	Inventory.Items:RegisterUse("birthday_cake", "RandomItems", function(source, item)
		Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
		refreshShit(item.Owner, true)
		TriggerClientEvent('Inventory:Client:RandomItems:BirthdayCake', source)
	end)

	Inventory.Items:RegisterUse("parachute", "RandomItems", function(source, item)
		Callbacks:ClientCallback(source, "Weapons:CanEquipParachute", {}, function(canEquip)
			if canEquip then
				local char = Fetch:Source(source):GetData("Character")
				if char then
					local states = char:GetData("States") or {}
					if not hasValue(states, "SCRIPT_PARACHUTE") then
						Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
						refreshShit(item.Owner, true)

						table.insert(states, "SCRIPT_PARACHUTE")
						char:SetData("States", states)
					else
						Execute:Client(source, "Notification", "Error", "Already Have Parachute Equipped")
					end
				end
			else
				Execute:Client(source, "Notification", "Error", "Cannot Equip Parachute")
			end
		end)
	end)


	Inventory.Items:RegisterUse("shop_bag", "RandomItems", function(source, item)
		local plyr = Fetch:Source(source)
		if plyr ~= nil then
			local char = plyr:GetData("Character")
			if char ~= nil then
				if item.MetaData and item.MetaData.Items and #item.MetaData.Items > 0 then
					-- Add all items from the bag to inventory
					for k, v in ipairs(item.MetaData.Items) do
						Inventory:AddItem(item.Owner, v.name, v.count, {}, 1)
					end
					-- Remove the bag after successfully retrieving items
					Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
					refreshShit(item.Owner, true)
					Execute:Client(source, "Notification", "Success", "Items retrieved from shop bag")
				else
					-- Bag is empty, remove it
					Inventory.Items:RemoveSlot(item.Owner, item.Name, 1, item.Slot, item.invType)
					refreshShit(item.Owner, true)
					Execute:Client(source, "Notification", "Error", "Shop bag is empty")
				end
			end
		end
	end)

	Callbacks:RegisterServerCallback("Inventory:UsedParachute", function(source, data, cb)
		local char = Fetch:Source(source):GetData("Character")
		if char then
			local states = char:GetData("States") or {}
			if hasValue(states, "SCRIPT_PARACHUTE") then
				for k, v in ipairs(states) do
					if v == "SCRIPT_PARACHUTE" then
						table.remove(states, k)
						char:SetData("States", states)
						break
					end
				end
			end
		end
	end)

	
	Callbacks:RegisterServerCallback("Inventory:GetPhonesForSim", function(source, data, cb)
		local plyr = Fetch:Source(source)
		if plyr == nil then
			cb({})
			return
		end
		
		local char = plyr:GetData("Character")
		if char == nil then
			cb({})
			return
		end
		
		local SID = char:GetData("SID")
		local phoneItems = Inventory.Items:GetAll(SID, "phone", 1)
		local phones = {}
		
		for k, v in ipairs(phoneItems) do
			-- GetAll already decodes MetaData, but handle both cases
			local metadata = v.MetaData or {}
			if type(metadata) == "string" then
				metadata = json.decode(metadata) or {}
			end
			
			local phoneNumber = metadata.number
			
			-- Only include phones WITHOUT SIM cards
			-- Include if: no metadata, no number field, or number is "No Sim Card"
			if not phoneNumber or phoneNumber == "No Sim Card" then
				table.insert(phones, v.Slot)
			end
		end
		cb(phones)
	end)

	
	-- Cooldown tracking to prevent duplicate SIM card operations
	local _simCardCooldowns = {}
	local _simCardInProgress = {}
	
	RegisterNetEvent("Inventory:InsertSimCard", function(simSlot, phoneSlot)
		local source = source
		
		-- Prevent duplicate calls - check cooldown and if already in progress
		local cooldownKey = source .. "_insert_" .. tostring(simSlot) .. "_" .. tostring(phoneSlot)
		if _simCardInProgress[cooldownKey] then
			return -- Already processing, ignore duplicate call
		end
		if _simCardCooldowns[cooldownKey] and (GetGameTimer() - _simCardCooldowns[cooldownKey]) < 3000 then
			return -- Still on cooldown, ignore duplicate call
		end
		_simCardInProgress[cooldownKey] = true
		_simCardCooldowns[cooldownKey] = GetGameTimer()
		
		local plyr = Fetch:Source(source)
		if plyr == nil then
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		local char = plyr:GetData("Character")
		if char == nil then
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		local SID = char:GetData("SID")
		
		-- Get sim card item
		local simItem = Inventory:GetSlot(SID, simSlot, 1)
		if not simItem or simItem.Name ~= "sim_card" then
			Execute:Client(source, "Notification", "Error", "Invalid SIM Card")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		-- Get phone item
		local phoneItem = Inventory:GetSlot(SID, phoneSlot, 1)
		if not phoneItem or phoneItem.Name ~= "phone" then
			Execute:Client(source, "Notification", "Error", "Invalid Phone")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		local phoneMeta = phoneItem.MetaData or {}
		local simMeta = simItem.MetaData or {}
		
		-- Validate metadata exists (matching reference framework)
		if not phoneMeta or not simMeta then
			Execute:Client(source, "Notification", "Error", "Invalid metadata")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		-- Check if sim card has number (matching reference framework)
		if not simMeta.number then
			Execute:Client(source, "Notification", "Error", "SIM card has no number")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		-- Validate phone number format (should be 10 digits with optional dashes)
		local phoneNumber = simMeta.number
		local cleanNumber = string.gsub(phoneNumber, "-", "")
		if not string.match(cleanNumber, "^%d%d%d%d%d%d%d%d%d%d$") then
			Execute:Client(source, "Notification", "Error", "Invalid phone number format")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		-- Check if phone number is already in use
		local needsNewNumber = false
		local reason = ""
		
		-- Check if this SIM card number is already in another phone (local check first - faster)
		local allPhones = Inventory.Items:GetAll(SID, "phone", 1)
		for _, v in ipairs(allPhones) do
			if v.Slot ~= phoneSlot then
				local vMeta = v.MetaData or {}
				if vMeta.number == phoneNumber then
					needsNewNumber = true
					reason = "This SIM card was already in another phone"
					break
				end
			end
		end
		
		-- Check if phone number is in use by another character (database check)
		if not needsNewNumber then
			local isInUse = false
			local queryComplete = false
			
			Database.Game:findOne({
				collection = 'characters',
				query = {
					Phone = phoneNumber,
					SID = { ["$ne"] = SID }
				},
			}, function(success, results)
				if success and results and #results > 0 then
					isInUse = true
				end
				queryComplete = true
			end)
			
			-- Wait for database query (max 1 second)
			local waitCount = 0
			while not queryComplete and waitCount < 100 do
				Wait(10)
				waitCount = waitCount + 1
			end
			
			if isInUse then
				needsNewNumber = true
				reason = "This SIM card's number was already in use"
			end
		end
		
		-- Generate new number if needed and update SIM card metadata
		if needsNewNumber then
			local newNumber = GeneratePhoneNumber(source)
			simMeta.number = newNumber
			Inventory:UpdateMetaData(simItem.id, simMeta)
			phoneNumber = newNumber
			Execute:Client(source, "Notification", "Info", string.format("%s. Assigned new number: %s", reason, newNumber))
		end
		
		-- Initialize phone number to "No Sim Card" if not set (phones should have this by default, but handle edge case)
		if not phoneMeta.number then
			phoneMeta.number = "No Sim Card"
		end
		
		
		if phoneMeta.number == "No Sim Card" then
			-- Transfer number from sim card to phone
			phoneMeta.number = phoneNumber
			Inventory:UpdateMetaData(phoneItem.id, phoneMeta)
			
			-- Update character Phone data and active phone slot
			char:SetData("ActivePhoneSlot", phoneSlot)
			char:SetData("Phone", phoneNumber)
		else
			-- Phone already has a SIM card
			Execute:Client(source, "Notification", "Error", "Phone already has a SIM card")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		-- Remove SIM card and verify it was removed
		if not Inventory.Items:RemoveSlot(SID, "sim_card", 1, simSlot, 1) then
			Execute:Client(source, "Notification", "Error", "Failed to remove SIM card")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		-- Clear in-progress flag
		_simCardInProgress[cooldownKey] = nil
	end)

	
	RegisterNetEvent("Inventory:EjectSimCard", function(phoneSlot)
		local source = source
		
		-- Prevent duplicate calls - check cooldown and if already in progress
		local cooldownKey = source .. "_eject_" .. tostring(phoneSlot)
		if _simCardInProgress[cooldownKey] then
			return -- Already processing, ignore duplicate call
		end
		if _simCardCooldowns[cooldownKey] and (GetGameTimer() - _simCardCooldowns[cooldownKey]) < 3000 then
			return -- Still on cooldown, ignore duplicate call
		end
		_simCardInProgress[cooldownKey] = true
		_simCardCooldowns[cooldownKey] = GetGameTimer()
		
		local plyr = Fetch:Source(source)
		if plyr == nil then
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		local char = plyr:GetData("Character")
		if char == nil then
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		local SID = char:GetData("SID")
		
		-- Get phone item
		local phoneItem = Inventory:GetSlot(SID, phoneSlot, 1)
		if not phoneItem or phoneItem.Name ~= "phone" then
			Execute:Client(source, "Notification", "Error", "Invalid Phone")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		local phoneMeta = phoneItem.MetaData or {}
		
		
		if not phoneMeta.number or phoneMeta.number == "No Sim Card" then
			Execute:Client(source, "Notification", "Error", "Phone does not have a SIM card")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		local phoneNumber = phoneMeta.number
		
		-- Double-check: Verify phone still has SIM card (prevent duplicate ejects)
		-- Re-fetch phone item to ensure we have latest data
		local verifyPhoneItem = Inventory:GetSlot(SID, phoneSlot, 1)
		if not verifyPhoneItem then
			Execute:Client(source, "Notification", "Error", "Phone item no longer exists")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		local verifyPhoneMeta = verifyPhoneItem.MetaData or {}
		if not verifyPhoneMeta.number or verifyPhoneMeta.number == "No Sim Card" or verifyPhoneMeta.number ~= phoneNumber then
			Execute:Client(source, "Notification", "Error", "Phone SIM card state changed")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		-- Check if a SIM card with this number already exists in inventory (prevent duplicates)
		local existingSimCards = Inventory.Items:GetAll(SID, "sim_card", 1)
		for _, existingSim in ipairs(existingSimCards) do
			local existingMeta = existingSim.MetaData or {}
			if existingMeta.number == phoneNumber then
				-- SIM card with this number already exists, don't create duplicate
				Execute:Client(source, "Notification", "Error", "SIM card with this number already exists in your inventory")
				_simCardInProgress[cooldownKey] = nil
				return
			end
		end
		
		-- Check if inventory has space for SIM card
		local freeSlots = Inventory:GetFreeSlotNumbers(SID, 1)
		if #freeSlots < 1 then
			Execute:Client(source, "Notification", "Error", "Not enough inventory space")
			_simCardInProgress[cooldownKey] = nil
			return
		end
		
		Inventory:AddItem(SID, "sim_card", 1, {
			number = phoneNumber,
			description = "Insert this into your phone",
		}, 1)
		
		
		phoneMeta.number = "No Sim Card"
		Inventory:UpdateMetaData(phoneItem.id, phoneMeta)
		
		
		local activeSlot = char:GetData("ActivePhoneSlot")
		if activeSlot == phoneSlot then
			
			local phoneItems = Inventory.Items:GetAll(SID, "phone", 1)
			local newActivePhone = nil
			
			for k, v in ipairs(phoneItems) do
				if v.Slot ~= phoneSlot then
					local vMeta = v.MetaData or {}
					local vNumber = vMeta.number
					if vNumber and vNumber ~= "No Sim Card" then
						newActivePhone = {
							slot = v.Slot,
							number = vNumber
						}
						break
					end
				end
			end
			
			if newActivePhone then
				char:SetData("ActivePhoneSlot", newActivePhone.slot)
				char:SetData("Phone", newActivePhone.number)
			else
				char:SetData("ActivePhoneSlot", nil)
				char:SetData("Phone", nil)
			end
		end
		
		-- Clear in-progress flag
		_simCardInProgress[cooldownKey] = nil
		
		Execute:Client(source, "Notification", "Success", "SIM card ejected from phone")
	end)
end


function GeneratePhoneNumber(source)
	local number = "555"
	for i = 1, 7 do
		number = number .. tostring(math.random(0, 9))
	end
	
	-- Check if number exists in characters table
	local isInUse = false
	local queryComplete = false
	
	Database.Game:findOne({
		collection = 'characters',
		query = { Phone = number },
	}, function(success, results)
		if success and results and #results > 0 then
			isInUse = true
		end
		queryComplete = true
	end)
	
	-- Wait for database query (max 0.5 seconds)
	local waitCount = 0
	while not queryComplete and waitCount < 50 do
		Wait(10)
		waitCount = waitCount + 1
	end
	
	if isInUse then
		return GeneratePhoneNumber(source)
	end
	
	-- Check if number exists in inventory metadata
	local results = MySQL.query.await('SELECT information FROM inventory WHERE item_id IN (?, ?)', {
		'phone',
		'sim_card'
	})
	
	if results then
		for _, row in ipairs(results) do
			if row.information then
				local metadata = json.decode(row.information or "{}")
				if metadata.number == number then
					return GeneratePhoneNumber(source)
				end
			end
		end
	end
	
	return number
end
