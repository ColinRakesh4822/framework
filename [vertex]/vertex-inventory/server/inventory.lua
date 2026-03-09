LoadedEntitys = {}
ItemCallbacks = {}
createdInventories = {}

GlobalState["Dropzones"] = {}
_polyInvs = {}
_openInvs = {}
_doingThings = {}
_exitSaving = {}
_govAccount = nil
_hasAttchs = {}

_refreshAttchs = {}

_dropzones = {}

local GivingItemInProgress = {}

local _defInvSettings = {
	muted = false,
	useBank = true,
}

function split(pString, pPattern)
	local Table = {}  
	local fpat = "(.-)" .. pPattern
	local last_end = 1
	local s, e, cap = pString:find(fpat, 1)
	while s do
	   if s ~= 1 or cap ~= "" then
	  table.insert(Table,cap)
	   end
	   last_end = e+1
	   s, e, cap = pString:find(fpat, last_end)
	end
	if last_end <= #pString then
	   cap = pString:sub(last_end)
	   table.insert(Table, cap)
	end
	return Table
end

function BuildMetaDataTable(cData, item)
	local itemExist = itemsDatabase[item]
	local MetaData = {}

	if itemExist.type == 2 then
		if not MetaData.SerialNumber and not itemExist.noSerial then
			if MetaData.Scratched then
				MetaData.ScratchedSerialNumber = Weapons:Purchase(Owner, itemExist, true, MetaData.Company)
				MetaData.Scratched = nil
			else
				MetaData.SerialNumber = Weapons:Purchase(Owner, itemExist, false, MetaData.Company)
			end
			MetaData.Company = nil
		end
	elseif itemExist.type == 10 and not MetaData.Container then
		MetaData.Container = string.format("container:%s", Sequence:Get("Container"))
	elseif itemExist.type == 11 and not MetaData.Quality then
		MetaData.Quality = math.random(100)
	elseif itemExist.name == "govid" then
		local genStr = "Male"
		if cData.Gender == 1 then
			genStr = "Female"
		end
		MetaData.Name = string.format("%s %s", cData.First, cData.Last)
		MetaData.Gender = genStr
		MetaData.PassportID = cData.User
		MetaData.StateID = cData.SID
		MetaData.DOB = cData.DOB
	elseif itemExist.name == "moneybag" and not MetaData.Finish then
		MetaData.Finished = os.time() + (60 * 60 * 24 * math.random(1, 3))
	elseif itemExist.name == "crypto_voucher" and not MetaData.CryptoCoin and not MetaData.Quantity then
		MetaData.CryptoCoin = "PLEB"
		MetaData.Quantity = math.random(25, 50)
	elseif itemExist.name == "vpn" then
		MetaData.VpnName = {
			First = Generator.Name:First(),
			Last = Generator.Name:Last(),
		}
	elseif itemExist.name == "cigarette_pack" then
		MetaData.Count = 30
	elseif itemExist.name == "choplist" and not MetaData.ChopList then
		MetaData.ChopList = Phone.LSUnderground.Chopping:GenerateList(math.random(4, 8), math.random(3, 5))
	elseif itemExist.name == "meth_bag" or itemExist.name == "meth_brick" or itemExist.name == "coke_bag" or itemExist.name == "coke_brick" then
		if not quality then
			quality = math.random(1, 100)
		end
		if itemExist.name == "meth_brick" then
			MetaData.Finished = os.time() + (60 * 60 * 24)
		end
	elseif itemExist.name == "paleto_access_codes" and not MetaData.AccessCodes then
		MetaData.AccessCodes = {
			Robbery:GetAccessCodes('paleto')[1]
		}
	end

	return MetaData
end

AddEventHandler("Inventory:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Database = exports["vertex-base"]:FetchComponent("Database")
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
	Sequence = exports["vertex-base"]:FetchComponent("Sequence")
	Logger = exports["vertex-base"]:FetchComponent("Logger")
	Utils = exports["vertex-base"]:FetchComponent("Utils")
	Fetch = exports["vertex-base"]:FetchComponent("Fetch")
	Default = exports["vertex-base"]:FetchComponent("Default")
	Inventory = exports["vertex-base"]:FetchComponent("Inventory")
	EntityTypes = exports["vertex-base"]:FetchComponent("EntityTypes")
	Chat = exports["vertex-base"]:FetchComponent("Chat")
	Wallet = exports["vertex-base"]:FetchComponent("Wallet") 
	Execute = exports["vertex-base"]:FetchComponent("Execute")
	Middleware = exports["vertex-base"]:FetchComponent("Middleware")
	Crafting = exports["vertex-base"]:FetchComponent("Crafting")
	Animations = exports["vertex-base"]:FetchComponent("Animations")
	Weapons = exports["vertex-base"]:FetchComponent("Weapons")
	Jobs = exports["vertex-base"]:FetchComponent("Jobs")
	Reputation = exports["vertex-base"]:FetchComponent("Reputation")
	Vehicles = exports["vertex-base"]:FetchComponent("Vehicles")
	Generator = exports["vertex-base"]:FetchComponent("Generator")
	Phone = exports["vertex-base"]:FetchComponent("Phone")
	Banking = exports["vertex-base"]:FetchComponent("Banking")
	Drugs = exports["vertex-base"]:FetchComponent("Drugs")
	Robbery = exports["vertex-base"]:FetchComponent("Robbery")
	Laptop = exports["vertex-base"]:FetchComponent("Laptop")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Inventory", {
		"Database",
		"Callbacks",
		"Sequence",
		"Fetch",
		"Logger",
		"Utils",
		"Inventory",
		"Chat",
		"EntityTypes",
		"Default",
		"Wallet",
		"Middleware",
		"Crafting",
		"Execute",
		"Animations",
		"Weapons",
		"Jobs",
		"Reputation",
		"Vehicles",
		"Generator",
		"Phone",
		"Banking",
		"Drugs",
		"Robbery",
		"Laptop"
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveComponents()

		LoadItems()
		LoadSchematics()
		RegisterCallbacks()
		LoadEntityTypes()
		LoadShops()
		SetupGarbage()

		ClearDropZones()
		ClearBrokenItems()
		CleanupExpiredCooldowns()
		LoadCraftingCooldowns()

		RegisterCommands()
		RegisterStashCallbacks()
		RegisterTestBench()
		RegisterCraftingCallbacks()

        local f = Banking.Accounts:GetOrganization("government")
        _govAccount = f.Account

		Callbacks:RegisterServerCallback("KRScript:Pickup", function(source, data, cb)
			local plyr = Fetch:Source(source)
			if plyr ~= nil then
				local char = plyr:GetData("Character")
				if char ~= nil then
					local SID = char:GetData("SID")
					if not SID then
						return
					end

					if Crypto.Exchange:Remove("PLEB", char:GetData("CryptoWallet"), 60) then
						Inventory:AddItem(char:GetData("SID"), itemName, 1, {}, 1)
					end
				end
			end
		end)

		Middleware:Add("Characters:Spawning", function(source)
			TriggerClientEvent("Inventory:Client:PolySetup", source, _polyInvs)

			local player = Fetch:Source(source)
			local char = player:GetData("Character")
			local sid = char:GetData("SID")
			Player(source).state.pSID = sid

			refreshShit(sid, true)

			if char:GetData("InventorySettings") == nil then
				char:SetData("InventorySettings", _defInvSettings)
			end
		end, 1)

		Middleware:Add("Characters:Spawning", function(source)
			local benches = {}
			for k, v in pairs(_types) do
				table.insert(benches, {
					id = v.id,
					label = v.label,
					targeting = v.targeting,
					location = v.location,
					restrictions = v.restrictions,
					canUseSchematics = v.canUseSchematics,
				})
			end
			Player(source).state.isGivingItem = nil
			TriggerClientEvent("Crafting:Client:CreateBenches", source, benches)
			TriggerClientEvent("Inventory:Client:DropzoneForceUpdate", source, _dropzones)
		end, 2)

		Middleware:Add("Characters:Logout", function(source)
			local p = promise.new()

			for k, v in pairs(_openInvs) do
				if v[source] then
					v[source] = nil  
					if next(v) == nil then
						_openInvs[k] = nil
					end
				end
			end

			Player(source).state.isGivingItem = nil
			Player(source).state.pSID = nil
			
			Callbacks:ClientCallback(source, "Weapons:Logout", {}, function(data)
				if data ~= nil then
					Weapons:Save(source, data.slot, data.ammo, data.clip)
				end
				p:resolve(true)
			end)
			return Citizen.Await(p)
		end, 1)

		Middleware:Add("playerDropped", function(source)
			for k, v in pairs(_openInvs) do
				if v[source] then
					v[source] = nil  
					if next(v) == nil then
						_openInvs[k] = nil
					end
				end
			end

			return true
		end, 1)

		Middleware:Add("Characters:Created", function(source, cData)
			local player = Fetch:Source(source)
			local docs = {}

			local slot = 1
			for k, v in ipairs(Config.StartItems) do
				local metadata = BuildMetaDataTable(cData, v.name)
				Inventory:CreateItemWithNoMeta(cData.SID, v.name, v.count, slot, metadata, 1, true)
				slot += 1
			end

			return true
		end, 2)
	end)
end)

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["vertex-base"]:RegisterComponent("Inventory", INVENTORY)
end)

RegisterServerEvent("Inventory:server:closePlayerInventory", function()
	local src = source
	local char = Fetch:Source(src):GetData("Character")
	if char ~= nil then
		local invKey = string.format("%s-%s", char:GetData("SID"), 1)
		_openInvs[invKey] = _openInvs[invKey] or {}
		_openInvs[invKey][source] = true
		refreshShit(char:GetData("SID"), true)
	end
end)

-- Global function to update a slot for clients
function UpdateSlotForClients(_src, owner, invType, slot)
    local slotData = Inventory:GetSlot(owner, slot, invType)
    TriggerClientEvent("Inventory:Client:UpdateSlot", _src, owner, invType, slot, slotData)
end

-- Keep old function name for backwards compatibility
function updateSlotForClients(_src, owner, invType, slot)
    UpdateSlotForClients(_src, owner, invType, slot)
end

function sendRefreshForClient(_src, owner, invType, slot)
	
	TriggerClientEvent("Inventory:Client:SetSlot", _src, owner, invType, slot)
end

function refreshShit(sid, adding)
	local plyr = Fetch:SID(tonumber(sid))
	if plyr ~= nil then
		local source = plyr:GetData("Source")
		local char = plyr:GetData("Character")
		if char ~= nil then
			local inventory = getInventory(source, sid, 1)

			UpdateCharacterItemStates(source, inventory, true)
			UpdateCharacterGangChain(source, inventory)

			local inventoryData = {
				size = (LoadedEntitys[1].slots or 10),
				name = char:GetData("First") .. " " .. char:GetData("Last"),
				inventory = inventory,
				invType = 1,
				capacity = LoadedEntitys[1].capacity,
				owner = sid,
				isWeaponEligble = Weapons:IsEligible(source),
				qualifications = char:GetData("Qualifications") or {},
			}

			TriggerClientEvent("Inventory:Client:Cache", source, inventoryData, _refreshAttchs[sid] ~= nil)
			_refreshAttchs[sid] = nil
		end
	end
end

RegisterNetEvent("Admin:refreshShit", function(sid,adding)
	local plyr = Fetch:SID(tonumber(sid))
	if plyr ~= nil then
		local source = plyr:GetData("Source")
		local char = plyr:GetData("Character")
		if char ~= nil then
			local inventory = getInventory(source, sid, 1)

			UpdateCharacterItemStates(source, inventory, true)
			UpdateCharacterGangChain(source, inventory)

			TriggerClientEvent("Inventory:Client:Cache", source, {
				size = (LoadedEntitys[1].slots or 10),
				name = char:GetData("First") .. " " .. char:GetData("Last"),
				inventory = inventory,
				invType = 1,
				capacity = LoadedEntitys[1].capacity,
				owner = sid,
				isWeaponEligble = Weapons:IsEligible(source),
				qualifications = char:GetData("Qualifications") or {},
			}, _refreshAttchs[sid] ~= nil)

			_refreshAttchs[sid] = nil
		end
	end
end)

RegisterNetEvent("inventory:addMoreEntityTypes")
AddEventHandler("inventory:addMoreEntityTypes", function(entityList)
    if entityList and type(entityList) == "table" then
        for _, entity in ipairs(entityList) do
            if entity.id then
                LoadedEntitys[tonumber(entity.id)] = entity
            end
        end
    else
    end
end)

function entityPermCheck(source, invType)
	local plyr = Fetch:Source(source)
	local char = plyr:GetData("Character")

	local shittyInvData = LoadedEntitys[tonumber(invType)]

	if shittyInvData then

		return (
				shittyInvData.restriction == nil
				or (shittyInvData.restriction.job ~= nil and Jobs.Permissions:HasJob(
					source,
					shittyInvData.restriction.job.id,
					shittyInvData.restriction.job.workplace or false,
					shittyInvData.restriction.job.grade or false,
					false,
					false,
					shittyInvData.restriction.job.permissionKey or "JOB_STORAGE"
				) and (not shittyInvData.restriction.job.duty or Player(source).state.onDuty == shittyInvData.restriction.job.id))
				or (shittyInvData.restriction.state and hasValue(
					char:GetData("States"),
					shittyInvData.restriction.state
				))
				or (
					shittyInvData.restriction.rep ~= nil
					and Reputation:GetLevel(source, shittyInvData.restriction.rep.id) >= shittyInvData.restriction.rep.level
				)
				or (shittyInvData.restriction.character ~= nil and shittyInvData.restriction.character == char:GetData(
					"ID"
				))
				or (shittyInvData.restriction.admin and plyr.Permissions:IsAdmin())
				or (shittyInvData.restriction.IsOwnedHouse and shittyInvData.restriction.IsOwnedHouse.id and exports['ahs']:CheckPermForHouse(char:GetData("SID"), shittyInvData.restriction.IsOwnedHouse.id))
			)
	else
		return false
	end
end

function getInventory(src, Owner, Type, limit)
	if src and LoadedEntitys[tonumber(Type)].shop then
		local char = Fetch:Source(src):GetData("Character")
		if LoadedEntitys[Type].itemSet == 1 or LoadedEntitys[Type].itemSet == 13 or LoadedEntitys[Type].itemSet == 18 then
			if GlobalState["OneOnline"] then
				LoadedEntitys[Type].itemSet = LoadedEntitys[Type].itemSet * 1000
			end
		end	
		local items = {}
		if entityPermCheck(src, Type) then
			for k, v in ipairs(Config.ShopItemSets[LoadedEntitys[Type].itemSet]) do
				if itemsDatabase[v] ~= nil then
					local stack = itemsDatabase[v].storeStack or itemsDatabase[v].isStackable

					if not itemsDatabase[v].isStackable then
						stack = 1
					end

					if itemsDatabase[v].isStackable and stack > itemsDatabase[v].isStackable then
						stack = itemsDatabase[v].isStackable
					end

					local doc = {
						Slot = #items + 1,
						Label = itemsDatabase[v].label,
						Count = stack,
						Name = v,
						invType = 11,
						Quality = nil,
						MetaData = {},
						Owner = tostring(Owner),
						Price = itemsDatabase[v].price,
					}

					table.insert(items, doc)
				end
			end
		end
		return items
	else
		return MySQL.query.await('SELECT id, count(id) as Count, name as Owner, item_id as Name, dropped as Temp, MAX(quality) as Quality, information as MetaData, slot as Slot, MIN(creationDate) AS CreateDate FROM inventory WHERE NAME = ? GROUP BY slot ORDER BY slot ASC', {
			string.format("%s-%s", Owner, Type)
		}) or {}
	end
end

function getSlotCount(invType, vehClass, vehModel, override)
	if override then
		return override
	end

	if LoadedEntitys[tonumber(invType)].isTrunk and (vehClass or vehModel) then
		if vehModel and _modelOverride[vehModel] ~= nil then
			return _modelOverride[vehModel].trunk.slots
		else
			return _trunkSizes[vehClass].slots
		end
	elseif LoadedEntitys[tonumber(invType)].isGlovebox and (vehClass or vehModel) then
		if vehModel and _modelOverride[vehModel] ~= nil then
			return _modelOverride[vehModel].glovebox.slots
		else
			return _gloveboxSizes[vehClass].slots
		end
	elseif LoadedEntitys[tonumber(invType)].shop and LoadedEntitys[tonumber(invType)].itemSet ~= nil and Config.ShopItemSets[LoadedEntitys[tonumber(invType)].itemSet] ~= nil then
		return #Config.ShopItemSets[LoadedEntitys[tonumber(invType)].itemSet]
	else
		return LoadedEntitys[tonumber(invType)].slots
	end
end

function getCapacity(invType, vehClass, vehModel, override)
    if override then
        return override
    end

    local invTypeNum = tonumber(invType)
    local entity = LoadedEntitys[invTypeNum]
    if not entity then
        return 0
    end

    if entity.isTrunk and (vehClass or vehModel) then
        if vehModel and _modelOverride[vehModel] then
            return _modelOverride[vehModel].trunk and _modelOverride[vehModel].trunk.capacity or 0
        elseif _trunkSizes[vehClass] then
            return _trunkSizes[vehClass].capacity
        else
            return 0
        end
    elseif entity.isGlovebox and (vehClass or vehModel) then
        if vehModel and _modelOverride[vehModel] then
            return _modelOverride[vehModel].glovebox and _modelOverride[vehModel].glovebox.capacity or 0
        elseif _gloveboxSizes[vehClass] then
            return _gloveboxSizes[vehClass].capacity
        else
            return 0
        end
    else
        return entity.capacity
    end
end

function CreateStoreLog(inventory, item, count, buyer, metadata, itemId)
	local logMetadata = {}
	if metadata and metadata.Items then
		logMetadata.summary = {}
		for i, bagItem in ipairs(metadata.Items) do
			table.insert(logMetadata.summary, {
				name = bagItem.name,
				count = bagItem.count,
				label = bagItem.label
			})
		end
		if #logMetadata.summary > 20 then
			logMetadata.summary = {unpack(logMetadata.summary, 1, 20)}
			logMetadata.truncated = true
			logMetadata.totalItems = #metadata.Items
		end
	else
		local metadataStr = json.encode(metadata)
		if #metadataStr > 1000 then
			logMetadata = { truncated = true, preview = string.sub(metadataStr, 1, 1000) }
		else
			logMetadata = metadata
		end
	end
	
	MySQL.insert('INSERT INTO inventory_shop_logs (inventory, item, count, buyer, metadata, itemId) VALUES(?, ?, ?, ?, ?, ?)', {
		inventory, item, count, buyer, json.encode(logMetadata), itemId
	})
end

function DoMerge(source, data, cb)
	CreateThread(function()
		local player = Fetch:Source(source)
		local char = player:GetData("Character")
	
		local item = itemsDatabase[data.name]
		local cash = char:GetData("Cash")
	
		local entityFrom = LoadedEntitys[tonumber(data.invTypeFrom)]
		local entityTo = LoadedEntitys[tonumber(data.invTypeTo)]
	
		local invWeight = Inventory.Items:GetWeights(data.ownerTo, data.invTypeTo)
		local itemWeight = (itemsDatabase[data.name] and itemsDatabase[data.name].weight) or 0
		local totWeight = invWeight + (data.countTo * itemWeight)
	
		if data.ownerFrom == nil or data.slotFrom == nil or data.invTypeFrom == nil or data.ownerTo == nil or data.slotTo == nil or data.invTypeTo == nil then
			cb({ reason = "Invalid Move Data" })
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
			return
		end
	
		if totWeight > getCapacity(data.invTypeTo, data.vehClassTo, data.vehModelTo, data.capacityOverrideTo) and data.ownerFrom ~= data.ownerTo then
			cb({ reason = "Inventory Over Weight" })
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			return
		end
	
		if data.countTo <= 0 then
			cb({ reason = "Can't Move 0 - Naughty Boy" })
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
			return
		end
	
		-- Only allow purchases from shops (check if source inventory is actually a shop)
		local isShopInventory = entityFrom and entityFrom.shop == true
		if isShopInventory and item.price and item.price > 0 then
			local cost = math.ceil((item.price * tonumber(data.countTo)))
			local paymentType = (cash >= cost and 'cash' or (Banking.Balance:Has(char:GetData("BankAccount"), cost) and 'bank' or nil))
			local isFree = (entityFrom and entityFrom.free) or false
			if isFree or paymentType ~= nil then
				if 
					(item.type ~= 2
					or (
						item.type == 2
						and (not item.requiresLicense or item.requiresLicense and Weapons:IsEligible(source))
					))
					and (not item.qualification or hasValue(char:GetData("Qualifications"), item.qualification))
				then
					local paid = isFree
	
					if not paid then
						if paymentType == 'cash' then
							paid = Wallet:Modify(source, -(math.abs(cost)))
						else
							paid = Banking.Balance:Charge(char:GetData("BankAccount"), cost, {
								type = 'bill',
								title = 'Store Purchase',
								description = string.format('Bought x%s %s', data.countTo, item.label),
								data = {}
							})
							Phone.Notification:Add(source, "Bill Payment Successful", false, os.time() * 1000, 3000, "bank", {})
						end
	
						if paid and entityFrom and entityFrom.id and storeBankAccounts[entityFrom.id] then
							pendingShopDeposits[storeBankAccounts[entityFrom.id]] = pendingShopDeposits[storeBankAccounts[entityFrom.id]] or { amount = 0, transactions = 0 }
							pendingShopDeposits[storeBankAccounts[entityFrom.id]].amount += math.floor( (cost * STORE_SHARE_AMOUNT) )
							pendingShopDeposits[storeBankAccounts[entityFrom.id]].transactions += 1
	
							pendingShopDeposits[_govAccount] = pendingShopDeposits[_govAccount] or { amount = 0, transactions = 0, tax = true }
							pendingShopDeposits[_govAccount].amount += math.ceil(cost * (1.0 - STORE_SHARE_AMOUNT))
							pendingShopDeposits[_govAccount].transactions += 1
						end
					end
	
					if paid then
						local sid = char:GetData("SID")
						
						-- Create shop_bag if entity has IsShop = true, otherwise add items directly
						if entityFrom and entityFrom.IsShop == true then
							-- Check if player already has a shop_bag (prevents duplicates)
							local existingBag = Inventory.Items:GetFirst(sid, "shop_bag", 1)
							
							if existingBag then
								-- Add items to existing bag
								local bagMetadata = existingBag.MetaData or {}
								if not bagMetadata.Items then
									bagMetadata.Items = {}
								end
								table.insert(bagMetadata.Items, {
									name = data.name,
									count = data.countTo,
									label = item.label or data.name
								})
								
								Inventory:UpdateMetaData(existingBag.id, bagMetadata)
								CreateStoreLog(data.ownerFrom, data.name, data.countTo or 1, sid, bagMetadata, existingBag.id)
							else
								-- Create new bag only if one doesn't exist
								local bagMetadata = {
									Items = {
										{
											name = data.name,
											count = data.countTo,
											label = item.label or data.name
										}
									}
								}
								-- Double-check no bag exists before creating (race condition protection)
								local checkBag = Inventory.Items:GetFirst(sid, "shop_bag", 1)
								if not checkBag then
									local insData = Inventory:CreateItem(sid, "shop_bag", 1, data.slotTo, bagMetadata, data.invTypeTo, false)
									if insData then
										CreateStoreLog(data.ownerFrom, data.name, data.countTo or 1, sid, insData.metadata, insData.id)
									end
								else
									-- Bag was created between checks, add to existing one
									local bagMetadata2 = checkBag.MetaData or {}
									if not bagMetadata2.Items then
										bagMetadata2.Items = {}
									end
									table.insert(bagMetadata2.Items, {
										name = data.name,
										count = data.countTo,
										label = item.label or data.name
									})
									Inventory:UpdateMetaData(checkBag.id, bagMetadata2)
									CreateStoreLog(data.ownerFrom, data.name, data.countTo or 1, sid, bagMetadata2, checkBag.id)
								end
							end
						else
							-- For non-shop entities (armories, vending machines, etc.), add item directly to inventory
							Inventory:CreateItem(sid, data.name, data.countTo, data.slotTo, {}, data.invTypeTo, false)
						end
					end
	
					sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
					sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
					return cb({ success = true })
				else
					sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
					sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
					cb({ reason = "Ineligible To Purchase Item" })
				end
			else
				sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
				sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
				cb({ reason = "Not Enough Cash" })
			end
		else
			local slotFrom = Inventory:GetSlot(data.ownerFrom, data.slotFrom, data.invTypeFrom)
			local slotTo = Inventory:GetSlot(data.ownerTo, data.slotTo, data.invTypeTo)

			if slotFrom == nil or slotTo == nil then
				cb({ reason = "Item No Longer In That Slot" })
				sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
				sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
				CloseUIAndClearThing(source)
				return
			end

			MySQL.query.await('UPDATE inventory SET slot = ?, name = ?, dropped = ? WHERE name = ? AND slot = ? AND item_id = ?', {
				data.slotTo,
				string.format("%s-%s", data.ownerTo, data.invTypeTo),
				data.invTypeTo == 10 and 1 or 0,
				string.format("%s-%s", data.ownerFrom, data.invTypeFrom),
				data.slotFrom,
				data.name,
			})
			
			
			if data.ownerFrom ~= data.ownerTo then
				local route = Player(source).state.currentRoute
				
				if data.invTypeFrom == 10 then
					local hasItems = Inventory:HasItems(data.ownerFrom, 10)
					if not hasItems then
						Inventory:RemoveDropzone(route, data.ownerFrom)
					end
				end
				
				if data.invTypeTo == 10 then
					if data.inventory and data.inventory.position then
						local dz = Inventory:CheckDropZones(route, data.inventory.position)
						if dz and dz.id ~= data.ownerTo then
							MySQL.query.await('UPDATE inventory SET name = ? WHERE name = ? AND slot = ?', {
								string.format("%s-%s", dz.id, data.invTypeTo),
								string.format("%s-%s", data.ownerTo, data.invTypeTo),
								data.slotTo
							})
							data.ownerTo = dz.id
							TriggerClientEvent("Inventory:Client:DropzoneForceUpdate", -1, _dropzones)
						else
							local exists = Inventory:DropExists(route, data.ownerTo)
							if not exists then
								Inventory:CreateDropzone(route, data.inventory.position)
							else
								TriggerClientEvent("Inventory:Client:DropzoneForceUpdate", -1, _dropzones)
							end
						end
					end
				end
			end
			
			if data.ownerFrom ~= data.ownerTo then
				if data.invTypeFrom == 1 then
					local plyr = Fetch:SID(data.ownerFrom)
	
					if data.ownerFrom == data.ownerTo then
						if item.type == 2 then
							if (not item.isStackable and item.isStackable ~= -1) or data.countTo == slotFrom.Count then
								TriggerClientEvent(
									"Weapons:Client:Move",
									plyr:GetData("Source"),
									data.slotFrom,
									data.slotTo
								)
							end
							
							if item.isThrowable then
								TriggerClientEvent(
									"Weapons:Client:UpdateCount",
									plyr:GetData("Source"),
									data.slotFrom,
									(slotFrom.Count - data.countTo)
								)
								TriggerClientEvent(
									"Weapons:Client:UpdateCount",
									plyr:GetData("Source"),
									data.slotTo,
									((slotTo?.Count or 0) + data.countTo)
								)
							end
						elseif item.type == 10 then
							TriggerClientEvent(
								"Inventory:Container:Move",
								plyr:GetData("Source"),
								data.slotFrom,
								data.slotTo
							)
						end
					else
						if not item.isStackable or data.countTo == slotFrom.Count then
							if item.type == 2 then
								TriggerClientEvent(
									"Weapons:Client:Remove",
									plyr:GetData("Source"),
									slotFrom,
									data.slotFrom,
									{
										owner = data.ownerTo,
										type = data.invTypeTo,
										slot = data.slotTo,
									}
								)
							elseif item.type == 10 then
								TriggerClientEvent(
									"Inventory:Container:Remove",
									plyr:GetData("Source"),
									slotFrom,
									data.slotFrom
								)
							end
						else
							if item.isThrowable then
								TriggerClientEvent(
									"Weapons:Client:UpdateCount",
									plyr:GetData("Source"),
									data.slotFrom,
									(slotFrom.Count - data.countTo)
								)
							end
						end
					end
				end
		
				if data.invTypeTo == 1 then
					local plyr = Fetch:SID(data.ownerTo)
					if item.isThrowable then
						TriggerClientEvent(
							"Weapons:Client:UpdateCount",
							plyr:GetData("Source"),
							data.slotTo,
							((slotTo?.Count or 0) + data.countTo)
						)
					end
				end

				if data.inventory.position ~= nil then
					CreateDZIfNotExist(source, data.inventory.position)
				end
			end

			if data.ownerFrom ~= data.ownerTo and WEAPON_PROPS[item.name] ~= nil then
				_refreshAttchs[data.ownerFrom] = source
				_refreshAttchs[data.ownerTo] = source
			end

			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)

			if data.IsGiveItemBoi and data.ownerFrom ~= data.ownerTo then
				local targetPlayer = Fetch:SID(data.ownerTo)
				if targetPlayer then
					local targetSource = targetPlayer:GetData("Source")
					local itemLabel = item.label or data.name
					local message = string.format("You received x%s %s", data.countTo, itemLabel)
					Execute:Client(targetSource, "Notification", "Success", message)
				end
			end

			if not data.IsGiveItemBoi then
				local srcOpenTo = _openInvs[string.format("%s-%s", data.ownerTo, data.invTypeTo)]
				local srcOpenFrom = _openInvs[string.format("%s-%s", data.ownerFrom, data.invTypeFrom)]
				if srcOpenTo then
					for src, _ in pairs(srcOpenTo) do
						updateSlotForClients(src, data.ownerTo, data.invTypeTo, data.slotTo)
					end
				end
				if srcOpenFrom then
					for src, _ in pairs(srcOpenFrom) do
						updateSlotForClients(src, data.ownerFrom, data.invTypeFrom, data.slotFrom)
					end
				end

			end

			return cb({ success = true })
		end
	end)
end

function DoSwap(source, data, cb)
	CreateThread(function()
		local player = Fetch:Source(source)
		local char = player:GetData("Character")
	
		local item = itemsDatabase[data.name]
		local cash = char:GetData("Cash")
	
		local entityFrom = LoadedEntitys[tonumber(data.invTypeFrom)]
		local entityTo = LoadedEntitys[tonumber(data.invTypeTo)]
	
		local invWeight = Inventory.Items:GetWeights(data.ownerTo, data.invTypeTo)
		local itemWeight = (itemsDatabase[data.name] and itemsDatabase[data.name].weight) or 0
		local totWeight = invWeight + (data.countTo * itemWeight)
	
		if data.ownerFrom == nil or data.slotFrom == nil or data.invTypeFrom == nil or data.ownerTo == nil or data.slotTo == nil or data.invTypeTo == nil then
			cb({ reason = "Invalid Move Data" })
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
			return
		end
	
		if totWeight > getCapacity(data.invTypeTo, data.vehClassTo, data.vehModelTo, data.capacityOverrideTo) and data.ownerFrom ~= data.ownerTo then
			cb({ reason = "Inventory Over Weight" })
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			return
		end
	
		if data.countTo <= 0 then
			cb({ reason = "Can't Move 0 - Naughty Boy" })
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
			return
		end
	
		if entityFrom.shop then
			cb({ reason = "Illegal Operation" })
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
			return
		else
			local slotFrom = Inventory:GetSlot(data.ownerFrom, data.slotFrom, data.invTypeFrom)
			local slotTo = Inventory:GetSlot(data.ownerTo, data.slotTo, data.invTypeTo)

			if slotFrom == nil or slotTo == nil then
				cb({ reason = "Item No Longer In That Slot" })
				sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
				sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
				CloseUIAndClearThing(source)
				return
			end
	
			MySQL.query.await('UPDATE inventory SET slot = ?, name = ?, dropped = ? WHERE name = ? AND slot = ?', {
				data.slotTo,
				string.format("%s-%s-PH-%s", data.ownerTo, data.invTypeTo, data.slotTo),
				data.invTypeTo == 10 and 1 or 0,
				string.format("%s-%s", data.ownerFrom, data.invTypeFrom),
				data.slotFrom,
			})

			MySQL.query.await('UPDATE inventory SET slot = ?, name = ?, dropped = ? WHERE name = ? AND slot = ?', {
				data.slotFrom,
				string.format("%s-%s", data.ownerFrom, data.invTypeFrom),
				data.invTypeFrom == 10 and 1 or 0,
				string.format("%s-%s", data.ownerTo, data.invTypeTo),
				data.slotTo,
			})
			
			MySQL.query.await('UPDATE inventory SET name = ? WHERE name = ?', {
				string.format("%s-%s", data.ownerTo, data.invTypeTo),
				string.format("%s-%s-PH-%s", data.ownerTo, data.invTypeTo, data.slotTo),
			})
			
			
			if data.ownerFrom ~= data.ownerTo then
				local route = Player(source).state.currentRoute
				
				if data.invTypeFrom == 10 then
					local hasItems = Inventory:HasItems(data.ownerFrom, 10)
					if not hasItems then
						Inventory:RemoveDropzone(route, data.ownerFrom)
					end
				end
				
				if data.invTypeTo == 10 then
					if data.inventory and data.inventory.position then
						local dz = Inventory:CheckDropZones(route, data.inventory.position)
						if dz and dz.id ~= data.ownerTo then
							MySQL.query.await('UPDATE inventory SET name = ? WHERE name = ? AND slot = ?', {
								string.format("%s-%s", dz.id, data.invTypeTo),
								string.format("%s-%s", data.ownerTo, data.invTypeTo),
								data.slotTo
							})
							data.ownerTo = dz.id
							TriggerClientEvent("Inventory:Client:DropzoneForceUpdate", -1, _dropzones)
						else
							local exists = Inventory:DropExists(route, data.ownerTo)
							if not exists then
								Inventory:CreateDropzone(route, data.inventory.position)
							else
								TriggerClientEvent("Inventory:Client:DropzoneForceUpdate", -1, _dropzones)
							end
						end
					end
				end
			end

			if data.ownerFrom ~= data.ownerTo then

				if data.invTypeFrom == 1 then
					local plyr = Fetch:SID(data.ownerFrom)
	
					if data.ownerFrom == data.ownerTo then
						if item.type == 2 then
							if (not item.isStackable and item.isStackable ~= -1) or data.countTo == slotFrom.Count then
								TriggerClientEvent(
									"Weapons:Client:Move",
									plyr:GetData("Source"),
									data.slotFrom,
									data.slotTo
								)
							end
							
							if item.isThrowable then
								TriggerClientEvent(
									"Weapons:Client:UpdateCount",
									plyr:GetData("Source"),
									data.slotFrom,
									(slotFrom.Count - data.countTo)
								)
								TriggerClientEvent(
									"Weapons:Client:UpdateCount",
									plyr:GetData("Source"),
									data.slotTo,
									((slotTo?.Count or 0) + data.countTo)
								)
							end
						elseif item.type == 10 then
							TriggerClientEvent(
								"Inventory:Container:Move",
								plyr:GetData("Source"),
								data.slotFrom,
								data.slotTo
							)
						end
					else
						if not item.isStackable or data.countTo == slotFrom.Count then
							if item.type == 2 then
								TriggerClientEvent(
									"Weapons:Client:Remove",
									plyr:GetData("Source"),
									slotFrom,
									data.slotFrom,
									{
										owner = data.ownerTo,
										type = data.invTypeTo,
										slot = data.slotTo,
									}
								)
							elseif item.type == 10 then
								TriggerClientEvent(
									"Inventory:Container:Remove",
									plyr:GetData("Source"),
									slotFrom,
									data.slotFrom
								)
							end
						else
							if item.isThrowable then
								TriggerClientEvent(
									"Weapons:Client:UpdateCount",
									plyr:GetData("Source"),
									data.slotFrom,
									(slotFrom.Count - data.countTo)
								)
							end
						end
					end
				end
		
				if data.invTypeTo == 1 then
					local plyr = Fetch:SID(data.ownerTo)
					if item.isThrowable then
						TriggerClientEvent(
							"Weapons:Client:UpdateCount",
							plyr:GetData("Source"),
							data.slotTo,
							((slotTo?.Count or 0) + data.countTo)
						)
					end
				end

				if data.inventory.position ~= nil then
					CreateDZIfNotExist(source, data.inventory.position)
				end
			end

			if data.ownerFrom ~= data.ownerTo and WEAPON_PROPS[item.name] ~= nil then
				_refreshAttchs[data.ownerFrom] = source
				_refreshAttchs[data.ownerTo] = source
			end

			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)

			if not data.IsGiveItemBoi then
				local srcOpenTo = _openInvs[string.format("%s-%s", data.ownerTo, data.invTypeTo)]
				local srcOpenFrom = _openInvs[string.format("%s-%s", data.ownerFrom, data.invTypeFrom)]
				if srcOpenTo then
					for src, _ in pairs(srcOpenTo) do
						updateSlotForClients(src, data.ownerTo, data.invTypeTo, data.slotTo)
					end
				end
				if srcOpenFrom then
					for src, _ in pairs(srcOpenFrom) do
						updateSlotForClients(src, data.ownerFrom, data.invTypeFrom, data.slotFrom)
					end
				end

			end

			return cb({ success = true })
		end
	end)
end

function DoMove(source, data, cb)
	CreateThread(function()
		local player = Fetch:Source(source)
		local char = player:GetData("Character")
	
		local item = itemsDatabase[data.name]
		local cash = char:GetData("Cash")
	
		local entityFrom = LoadedEntitys[tonumber(data.invTypeFrom)]
		local entityTo = LoadedEntitys[tonumber(data.invTypeTo)]
	
		local invWeight = Inventory.Items:GetWeights(data.ownerTo, data.invTypeTo)
		local itemWeight = (itemsDatabase[data.name] and itemsDatabase[data.name].weight) or 0
		local totWeight = invWeight + (data.countTo * itemWeight)
	
		if data.ownerFrom == nil or data.slotFrom == nil or data.invTypeFrom == nil or data.ownerTo == nil or data.slotTo == nil or data.invTypeTo == nil then
			cb({ reason = "Invalid Move Data" })
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
			return
		end
	
		if totWeight > getCapacity(data.invTypeTo, data.vehClassTo, data.vehModelTo, data.capacityOverrideTo) and data.ownerFrom ~= data.ownerTo then
			cb({ reason = "Inventory Over Weight" })
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			return
		end
	
		if data.countTo <= 0 then
			cb({ reason = "Can't Move 0 - Naughty Boy" })
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
			return
		end
	
		-- Only allow purchases from shops (check if source inventory is actually a shop)
		local isShopInventory = entityFrom and entityFrom.shop == true
		if isShopInventory and item.price and item.price > 0 then
			local cost = math.ceil((item.price * tonumber(data.countTo)))
			local paymentType = (cash >= cost and 'cash' or (Banking.Balance:Has(char:GetData("BankAccount"), cost) and 'bank' or nil))
			local isFree = (entityFrom and entityFrom.free) or false
			if isFree or paymentType ~= nil then
				if 
					(item.type ~= 2
					or (
						item.type == 2
						and (not item.requiresLicense or item.requiresLicense and Weapons:IsEligible(source))
					))
					and (not item.qualification or hasValue(char:GetData("Qualifications"), item.qualification))
				then
					local paid = isFree
					if not paid then
						if paymentType == 'cash' then
							paid = Wallet:Modify(source, -(math.abs(cost)))
						else
							paid = Banking.Balance:Charge(char:GetData("BankAccount"), cost, {
								type = 'bill',
								title = 'Store Purchase',
								description = string.format('Bought x%s %s', data.countTo, item.label),
								data = {}
							})
							Phone.Notification:Add(source, "Bill Payment Successful", string.format('Bought x%s %s', data.countTo, item.label), os.time() * 1000, 3000, "bank", {})
						end

						if paid and entityFrom and entityFrom.id and storeBankAccounts[entityFrom.id] then
							pendingShopDeposits[storeBankAccounts[entityFrom.id]] = pendingShopDeposits[storeBankAccounts[entityFrom.id]] or { amount = 0, transactions = 0 }
							pendingShopDeposits[storeBankAccounts[entityFrom.id]].amount += math.floor( (cost * STORE_SHARE_AMOUNT) )
							pendingShopDeposits[storeBankAccounts[entityFrom.id]].transactions += 1
	
							pendingShopDeposits[_govAccount] = pendingShopDeposits[_govAccount] or { amount = 0, transactions = 0, tax = true }
							pendingShopDeposits[_govAccount].amount += math.ceil(cost * (1.0 - STORE_SHARE_AMOUNT))
							pendingShopDeposits[_govAccount].transactions += 1
						end
					end
	
					if paid then
						local sid = char:GetData("SID")
						
						-- Create shop_bag if entity has IsShop = true, otherwise add items directly
						if entityFrom and entityFrom.IsShop == true then
							-- Check if player already has a shop_bag (prevents duplicates)
							local existingBag = Inventory.Items:GetFirst(sid, "shop_bag", 1)
							
							if existingBag then
								-- Add items to existing bag
								local bagMetadata = existingBag.MetaData or {}
								if not bagMetadata.Items then
									bagMetadata.Items = {}
								end
								table.insert(bagMetadata.Items, {
									name = data.name,
									count = data.countTo,
									label = item.label or data.name
								})
								
								Inventory:UpdateMetaData(existingBag.id, bagMetadata)
								CreateStoreLog(data.ownerFrom, data.name, data.countTo or 1, sid, bagMetadata, existingBag.id)
							else
								-- Create new bag only if one doesn't exist
								local bagMetadata = {
									Items = {
										{
											name = data.name,
											count = data.countTo,
											label = item.label or data.name
										}
									}
								}
								-- Double-check no bag exists before creating (race condition protection)
								local checkBag = Inventory.Items:GetFirst(sid, "shop_bag", 1)
								if not checkBag then
									local insData = Inventory:CreateItem(sid, "shop_bag", 1, data.slotTo, bagMetadata, data.invTypeTo, false)
									if insData then
										CreateStoreLog(data.ownerFrom, data.name, data.countTo or 1, sid, insData.metadata, insData.id)
									end
								else
									-- Bag was created between checks, add to existing one
									local bagMetadata2 = checkBag.MetaData or {}
									if not bagMetadata2.Items then
										bagMetadata2.Items = {}
									end
									table.insert(bagMetadata2.Items, {
										name = data.name,
										count = data.countTo,
										label = item.label or data.name
									})
									Inventory:UpdateMetaData(checkBag.id, bagMetadata2)
									CreateStoreLog(data.ownerFrom, data.name, data.countTo or 1, sid, bagMetadata2, checkBag.id)
								end
							end
						else
							-- For non-shop entities (armories, vending machines, etc.), add item directly to inventory
							Inventory:CreateItem(sid, data.name, data.countTo, data.slotTo, {}, data.invTypeTo, false)
						end
					end

					if data.ownerFrom ~= data.ownerTo and WEAPON_PROPS[item.name] ~= nil then
						_refreshAttchs[data.ownerFrom] = source
						_refreshAttchs[data.ownerTo] = source
					end
	
					sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
					sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
					return cb({ success = true })
				else
					sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
					sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
					cb({ reason = "Ineligible To Purchase Item" })
				end
			else
				sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
				sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
				cb({ reason = "Not Enough Cash" })
			end
		else
			local slotFrom = Inventory:GetSlot(data.ownerFrom, data.slotFrom, data.invTypeFrom)
			local slotTo = Inventory:GetSlot(data.ownerTo, data.slotTo, data.invTypeTo)

			if slotFrom == nil then
				cb({ reason = "Item No Longer In That Slot" })
				sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
				sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
				TriggerClientEvent("Inventory:CloseUI", source)
				return
			end
			
			if slotTo ~= nil and slotTo.Name ~= data.name then
				cb({ reason = "This Slot In Use By Another Item" })
				sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
				sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)
				CloseUIAndClearThing(source)
				return
			end

			if data.isSplit then
				local itemIds = MySQL.query.await('SELECT id FROM inventory WHERE name = ? AND slot = ? AND item_id = ? ORDER BY id ASC LIMIT ?', {
					string.format("%s-%s", data.ownerFrom, data.invTypeFrom),
					data.slotFrom,
					data.name,
					data.countTo
				})

				local params = {}
				for k, v in ipairs(itemIds) do
					table.insert(params, v.id)
				end
				
				MySQL.query.await(string.format('UPDATE inventory SET slot = ?, name = ?, dropped = ? WHERE id IN (%s)', table.concat(params, ',')), {
					data.slotTo,
					string.format("%s-%s", data.ownerTo, data.invTypeTo),
					data.invTypeTo == 10 and 1 or 0
				})
			else
				MySQL.query.await('UPDATE inventory SET slot = ?, name = ?, dropped = ? WHERE name = ? AND slot = "?" AND item_id = ?', {
					data.slotTo,
					string.format("%s-%s", data.ownerTo, data.invTypeTo),
					(data.invTypeTo == 10 and 1 or 0),
					string.format("%s-%s", data.ownerFrom, data.invTypeFrom),
					data.slotFrom,
					data.name,
				})
			end
			
			if data.ownerFrom ~= data.ownerTo then
				if data.invTypeFrom == 1 then
					local plyr = Fetch:SID(data.ownerFrom)
	
					if data.ownerFrom == data.ownerTo then
						if item.type == 2 then
							if (not item.isStackable and item.isStackable ~= -1) or data.countTo == slotFrom.Count then
								TriggerClientEvent(
									"Weapons:Client:Move",
									plyr:GetData("Source"),
									data.slotFrom,
									data.slotTo
								)
							end
							
							if item.isThrowable then
								TriggerClientEvent(
									"Weapons:Client:UpdateCount",
									plyr:GetData("Source"),
									data.slotFrom,
									(slotFrom.Count - data.countTo)
								)
								TriggerClientEvent(
									"Weapons:Client:UpdateCount",
									plyr:GetData("Source"),
									data.slotTo,
									((slotTo?.Count or 0) + data.countTo)
								)
							end
						elseif item.type == 10 then
							TriggerClientEvent(
								"Inventory:Container:Move",
								plyr:GetData("Source"),
								data.slotFrom,
								data.slotTo
							)
						end
					else
						if not item.isStackable or data.countTo == slotFrom.Count then
							if item.type == 2 then
								TriggerClientEvent(
									"Weapons:Client:Remove",
									plyr:GetData("Source"),
									slotFrom,
									data.slotFrom,
									{
										owner = data.ownerTo,
										type = data.invTypeTo,
										slot = data.slotTo,
									}
								)
							elseif item.type == 10 then
								TriggerClientEvent(
									"Inventory:Container:Remove",
									plyr:GetData("Source"),
									slotFrom,
									data.slotFrom
								)
							end
						else
							if item.isThrowable then
								TriggerClientEvent(
									"Weapons:Client:UpdateCount",
									plyr:GetData("Source"),
									data.slotFrom,
									(slotFrom.Count - data.countTo)
								)
							end
						end
					end
				end
		
				if data.invTypeTo == 1 then
					local plyr = Fetch:SID(data.ownerTo)
					if item.isThrowable then
						TriggerClientEvent(
							"Weapons:Client:UpdateCount",
							plyr:GetData("Source"),
							data.slotTo,
							((slotTo?.Count or 0) + data.countTo)
						)
					end
				end			

				if data.inventory and data.inventory.position ~= nil then
					CreateDZIfNotExist(source, data.inventory.position)
				end
			end


			if data.ownerFrom ~= data.ownerTo and WEAPON_PROPS[item.name] ~= nil then
				_refreshAttchs[data.ownerFrom] = source
				_refreshAttchs[data.ownerTo] = source
			end
		
			
			if data.ownerFrom ~= data.ownerTo then
				local route = Player(source).state.currentRoute
				
				if data.invTypeFrom == 10 then
					local hasItems = Inventory:HasItems(data.ownerFrom, 10)
					if not hasItems then
						Inventory:RemoveDropzone(route, data.ownerFrom)
					end
				end
				
				if data.invTypeTo == 10 then
					if data.inventory and data.inventory.position then
						local dz = Inventory:CheckDropZones(route, data.inventory.position)
						if dz and dz.id ~= data.ownerTo then
							MySQL.query.await('UPDATE inventory SET name = ? WHERE name = ? AND slot = ?', {
								string.format("%s-%s", dz.id, data.invTypeTo),
								string.format("%s-%s", data.ownerTo, data.invTypeTo),
								data.slotTo
							})
							data.ownerTo = dz.id
							TriggerClientEvent("Inventory:Client:DropzoneForceUpdate", -1, _dropzones)
						else
							local exists = Inventory:DropExists(route, data.ownerTo)
							if not exists then
								Inventory:CreateDropzone(route, data.inventory.position)
							else
								TriggerClientEvent("Inventory:Client:DropzoneForceUpdate", -1, _dropzones)
							end
						end
					end
				end
			end
		
			sendRefreshForClient(source, data.ownerFrom, data.invTypeFrom, data.slotFrom)
			sendRefreshForClient(source, data.ownerTo, data.invTypeTo, data.slotTo)

			if data.IsGiveItemBoi and data.ownerFrom ~= data.ownerTo then
				local targetPlayer = Fetch:SID(data.ownerTo)
				if targetPlayer then
					local targetSource = targetPlayer:GetData("Source")
					local itemLabel = item.label or data.name
					local message = string.format("You received x%s %s", data.countTo, itemLabel)
					Execute:Client(targetSource, "Notification", "Success", message)
				end
			end

			if not data.IsGiveItemBoi then
				local srcOpenTo = _openInvs[string.format("%s-%s", data.ownerTo, data.invTypeTo)]
				local srcOpenFrom = _openInvs[string.format("%s-%s", data.ownerFrom, data.invTypeFrom)]
				if srcOpenTo then
					for src, _ in pairs(srcOpenTo) do
						updateSlotForClients(src, data.ownerTo, data.invTypeTo, data.slotTo)
					end
				end
				if srcOpenFrom then
					for src, _ in pairs(srcOpenFrom) do
						updateSlotForClients(src, data.ownerFrom, data.invTypeFrom, data.slotFrom)
					end
				end

			end

			return cb({ success = true })
		end
	end)
end

function CreateDZIfNotExist(source, coords)
	local route = Player(source).state.currentRoute
	local dz = Inventory:CheckDropZones(route, coords)
	if dz == nil then
		Inventory:CreateDropzone(route, coords)
	end
end

function RegisterCallbacks()
	Callbacks:RegisterServerCallback("Inventory:MergeItem", DoMerge)
	Callbacks:RegisterServerCallback("Inventory:SwapItem", DoSwap)
	Callbacks:RegisterServerCallback("Inventory:MoveItem", DoMove)

	Callbacks:RegisterServerCallback("Inventory:OpenTrunk", function(source, data, cb)
		local myCoords = GetEntityCoords(GetPlayerPed(source))
		local veh = NetworkGetEntityFromNetworkId(data.netId)

		if Entity(veh).state.VIN == nil then
			return cb(false)
		end

		local vehCoords = GetEntityCoords(veh)
		local dist = #(vector3(myCoords.x, myCoords.y, myCoords.z) - vector3(vehCoords.x, vehCoords.y, vehCoords.z))
		local lock = GetVehicleDoorLockStatus(veh)
		if dist < 8 and (lock == 0 or lock == 1) then
			Inventory:OpenSecondary(source, 4, Entity(veh).state.VIN, data.class or false, data.model or false)
			cb(true)
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Inventory:UseItem", function(source, data, cb)
		if entityPermCheck(source, data.invType) then
			local slot = Inventory:GetSlot(data.owner, data.slot, data.invType)
			if slot ~= nil then
				Inventory.Items:Use(source, slot, cb)
			else
				sendRefreshForClient(source, data.owner, data.invType, data.slot)
				cb(false)
			end
		end
	end)

	Callbacks:RegisterServerCallback("Inventory:UseSlot", function(source, data, cb)
		if data and data.slot then
			local player = Fetch:Source(source)
			local char = player:GetData("Character")
			if player and char then
				local slotFrom = Inventory:GetSlot(char:GetData("SID"), data.slot, 1)
				if slotFrom ~= nil then
					if slotFrom.Count or 0 > 0 then
						Inventory.Items:Use(source, slotFrom, function(yea)
							if not yea then
								sendRefreshForClient(source, char:GetData("SID"), 1, slotFrom)
							end
							cb(yea)
						end)
					else
						sendRefreshForClient(source, char:GetData("SID"), 1, slotFrom)
						cb(false)
					end
				else
					sendRefreshForClient(source, char:GetData("SID"), 1, slotFrom)
					cb(false)
				end
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Inventory:CheckIfNearDropZone", function(source, data, cb)
		local playerPed = GetPlayerPed(source)
		local playerCoords = GetEntityCoords(playerPed)
		local route = Player(source).state.currentRoute
		cb(Inventory:CheckDropZones(route, vector3(playerCoords.x, playerCoords.y, playerCoords.z)))
	end)

	Callbacks:RegisterServerCallback("Inventory:GetDropzoneItems", function(source, data, cb)
		if data and data.dropzoneId then
			local inventory = getInventory(source, data.dropzoneId, 10)
			if inventory and #inventory > 0 then
				local items = {}
				for _, item in ipairs(inventory) do
					table.insert(items, {
						name = item.Name,
						count = item.Count or 1
					})
				end
				cb(items)
			else
				cb({})
			end
		else
			cb({})
		end
	end)

	Callbacks:RegisterServerCallback("Inventory:Server:retreiveStores", function(source, data, cb)
		cb(shopLocations)
	end)

	Callbacks:RegisterServerCallback("Inventory:Search", function(source, data, cb)
		local plyr = Fetch:Source(data.serverId)
		if plyr ~= nil then
			local dest = plyr:GetData("Character")
			if dest ~= nil then
				Inventory.Search:Character(source, data.serverId, dest:GetData("SID"))
				cb(dest:GetData("SID"))
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Inventory:Raid", function(source, data, cb)
		local dest = Fetch:Source(source):GetData("Character")
		local pState = Player(source).state

		if pState.onDuty ~= nil and pState.onDuty == "police" and Jobs.Permissions:HasPermissionInJob(source, 'police', 'PD_RAID') then
			Inventory:OpenSecondary(source, data.invType, data.owner, data.class or false, data.model or false, true)
		end
	end)

	Callbacks:RegisterServerCallback("Inventory:CloseSecondary", function(source, inventory, cb)
		if inventory.invType == 1 then
			refreshShit(inventory.owner)
		elseif inventory.invType == 10 then
			local route = Player(source).state.currentRoute
			local exists = Inventory:DropExists(route, inventory.owner)
			local hasItems = Inventory:HasItems(inventory.owner, 10)
			
			
			local position = inventory.position
			if not position then
				for k, v in ipairs(_dropzones) do
					if v.id == inventory.owner and v.route == route then
						position = v.coords
						break
					end
				end
				
				if not position then
					local playerPed = GetPlayerPed(source)
					local playerCoords = GetEntityCoords(playerPed)
					position = vector3(playerCoords.x, playerCoords.y, playerCoords.z)
				end
			end
			
			
			
			if position ~= nil and hasItems then
				
				local dz = Inventory:CheckDropZones(route, position)
				if dz then
					
					if dz.id ~= inventory.owner then
						
						MySQL.query.await('UPDATE inventory SET name = ? WHERE name = ? AND dropped = 1', {
							string.format("%s-%s", dz.id, 10),
							string.format("%s-%s", inventory.owner, 10)
						})
						TriggerClientEvent("Inventory:Client:DropzoneForceUpdate", -1, _dropzones)
					end
				elseif not exists then
					local newDzId = Inventory:CreateDropzone(route, position)
					if newDzId ~= inventory.owner then
						MySQL.query.await('UPDATE inventory SET name = ? WHERE name = ? AND dropped = 1', {
							string.format("%s-%s", newDzId, 10),
							string.format("%s-%s", inventory.owner, 10)
						})
					end
				end
			end
		else
			if _refreshAttchs[inventory.owner] then
				TriggerClientEvent("Weapons:Client:Attach", source)
				_refreshAttchs[inventory.owner] = false
			end
		end

		local invKey = string.format("%s-%s", inventory.owner, inventory.invType)
		_openInvs[invKey] = _openInvs[invKey] or {}
		_openInvs[invKey][source] = false

		cb()
	end)

	Callbacks:RegisterServerCallback("Inventory:ShopPay", function(source, data, cb)
		local player = Fetch:Source(source)
		local char = player:GetData("Character")
		if not player or not char then
			cb({ success = false, reason = "Player not found" })
			return
		end

		local invType = tonumber(data.shopId)
		if not invType then
			cb({ success = false, reason = "Invalid shop type" })
			return
		end

		local entity = LoadedEntitys[invType]
		if not entity then
			cb({ success = false, reason = "Entity not found" })
			return
		end
		
		local entityId = entity.id
		if not entityId then
			cb({ success = false, reason = "Entity has no id field" })
			return
		end

		local cash = char:GetData("Cash")
		local totalCost = tonumber(data.total) or 0
		
		if totalCost <= 0 then
			cb({ success = false, reason = "Invalid total" })
			return
		end

		local paymentType = data.paymentType or (cash >= totalCost and 'cash' or 'bank')
		if paymentType == 'card' then
			paymentType = 'bank'
		end
		
		if paymentType == 'bank' and not Banking.Balance:Has(char:GetData("BankAccount"), totalCost) then
			cb({ success = false, reason = "Not enough money" })
			return
		end

		if not entity.free and paymentType ~= 'cash' and paymentType ~= 'bank' then
			cb({ success = false, reason = "Invalid payment method" })
			return
		end

		for _, cartItem in ipairs(data.items) do
			local item = itemsDatabase[cartItem.name]
			if not item then
				cb({ success = false, reason = "Item not found: " .. cartItem.name })
				return
			end

			if item.type == 2 and item.requiresLicense and not Weapons:IsEligible(source) then
				cb({ success = false, reason = "Weapon license required for " .. (item.label or cartItem.name) })
				return
			end

			if item.qualification and not hasValue(char:GetData("Qualifications"), item.qualification) then
				cb({ success = false, reason = "Qualification required for " .. (item.label or cartItem.name) })
				return
			end
		end

		local paid = entity.free
		if not paid then
			if paymentType == 'cash' then
				paid = Wallet:Modify(source, -(math.abs(totalCost)))
			else
				paid = Banking.Balance:Charge(char:GetData("BankAccount"), totalCost, {
					type = 'bill',
					title = 'Store Purchase',
					description = string.format('Bought %d items', #data.items),
					data = {}
				})
				Phone.Notification:Add(source, "Bill Payment Successful", false, os.time() * 1000, 3000, "bank", {})
			end

			if paid then
				pendingShopDeposits[storeBankAccounts[entityId]] = pendingShopDeposits[storeBankAccounts[entityId]] or { amount = 0, transactions = 0 }
				pendingShopDeposits[storeBankAccounts[entityId]].amount += math.floor((totalCost * STORE_SHARE_AMOUNT))
				pendingShopDeposits[storeBankAccounts[entityId]].transactions += 1

				pendingShopDeposits[_govAccount] = pendingShopDeposits[_govAccount] or { amount = 0, transactions = 0, tax = true }
				pendingShopDeposits[_govAccount].amount += math.ceil(totalCost * (1.0 - STORE_SHARE_AMOUNT))
				pendingShopDeposits[_govAccount].transactions += 1
			end
		end

		if paid then
			local sid = char:GetData("SID")
			
			-- Check if entity has IsShop = true to create shop_bag
			if entity and entity.IsShop == true then
				-- Create or update shop_bag with all purchased items
				local existingBag = Inventory.Items:GetFirst(sid, "shop_bag", 1)
				
				if existingBag then
					-- Add items to existing bag
					local bagMetadata = existingBag.MetaData or {}
					if not bagMetadata.Items then
						bagMetadata.Items = {}
					end
					for _, cartItem in ipairs(data.items) do
						local item = itemsDatabase[cartItem.name]
						table.insert(bagMetadata.Items, {
							name = cartItem.name,
							count = cartItem.quantity,
							label = (item and item.label) or cartItem.name
						})
					end
					Inventory:UpdateMetaData(existingBag.id, bagMetadata)
					for _, cartItem in ipairs(data.items) do
						local item = itemsDatabase[cartItem.name]
						CreateStoreLog(data.shopOwner or "shop", cartItem.name, cartItem.quantity or 1, sid, bagMetadata, existingBag.id)
					end
				else
					-- Create new bag
					local bagMetadata = {
						Items = {}
					}
					for _, cartItem in ipairs(data.items) do
						local item = itemsDatabase[cartItem.name]
						table.insert(bagMetadata.Items, {
							name = cartItem.name,
							count = cartItem.quantity,
							label = (item and item.label) or cartItem.name
						})
					end
					local insData = Inventory:CreateItem(sid, "shop_bag", 1, nil, bagMetadata, 1, false)
					if insData then
						for _, cartItem in ipairs(data.items) do
							local item = itemsDatabase[cartItem.name]
							CreateStoreLog(data.shopOwner or "shop", cartItem.name, cartItem.quantity or 1, sid, insData.metadata, insData.id)
						end
					end
				end
			else
				-- For non-shop entities, add items directly to inventory
				for _, cartItem in ipairs(data.items) do
					Inventory:CreateItem(sid, cartItem.name, cartItem.quantity, nil, {}, 1, false)
				end
			end
			
			refreshShit(sid, true)
			cb({ success = true })
		else
			cb({ success = false, reason = "Payment failed" })
		end
	end)

	Callbacks:RegisterServerCallback("Inventory:Server:TryGiveItem2", function(source, targetId, cb)
		if GivingItemInProgress[source] then
			cb(nil)
			return
		end
	
		GivingItemInProgress[source] = true
	
		local success, err = pcall(function()
			local ItemGivin = Player(source).state.isGivingItem
			Player(source).state.isGivingItem = nil
	
			if not ItemGivin then
				error("No item to give.")
			end
	
			local targetPlayer = Fetch:Source(tonumber(targetId))
			if not targetPlayer then
				error("Invalid target player.")
			end
	
			local targetCharacter = targetPlayer:GetData("Character")
			if not targetCharacter then
				error("Target has no character.")
			end
	
			ItemGivin.ownerTo = targetCharacter:GetData("SID")
			ItemGivin.invTypeTo = 1
			ItemGivin.IsGiveItemBoi = true

			local itemExist = itemsDatabase[ItemGivin.name]
			if not itemExist then
				error("Item not found in database: " .. tostring(ItemGivin.name))
			end

			local invWeight = Inventory.Items:GetWeights(ItemGivin.ownerTo, ItemGivin.invTypeTo)
			local totWeight = invWeight + (ItemGivin.countTo * itemExist.weight)
	
			if totWeight < getCapacity(ItemGivin.invTypeTo) and ItemGivin.ownerFrom ~= ItemGivin.ownerTo then
				local freeSlots = Inventory:GetFreeSlotNumbers(ItemGivin.ownerTo, ItemGivin.invTypeTo)
				if #freeSlots >= 1 then
					ItemGivin.slotTo = freeSlots[1]
					cb(ItemGivin)
					return
				end
			end
			cb(nil)
		end)
	
		if not success then
			cb(nil)
		end
		GivingItemInProgress[source] = nil
	end)

end

RegisterNetEvent("Inventory:Server:UpdateSettings", function(data)
	local src = source
	local player = Fetch:Source(src)
	if player ~= nil then
		local char = player:GetData("Character")
		if char ~= nil then
			local settings = char:GetData("InventorySettings") or _defInvSettings
			for k, v in pairs(data) do
				settings[k] = v
			end
			char:SetData("InventorySettings", settings)
		end
	end
end)

RegisterNetEvent("Inventory:Server:TriggerAction", function(data)
	local src = source
	local plyr = Fetch:Source(src)
	if plyr ~= nil then
		local char = plyr:GetData("Character")
		if char ~= nil then
			if LoadedEntitys[data.invType] ~= nil and LoadedEntitys[data.invType].action ~= nil then
				TriggerEvent(LoadedEntitys[data.invType].action.event, src, data)
			end
		end
	end
end)

RegisterNetEvent("Inventory:Server:Request", function(secondary)
	local src = source
	local player = Fetch:Source(src)
	local char = player:GetData("Character")


	local plyrInvData = {
		size = (LoadedEntitys[1].slots or 10),
		name = char:GetData("First") .. " " .. char:GetData("Last"),
		inventory = plyrInv,
		invType = 1,
		capacity = LoadedEntitys[1].capacity,
		owner = char:GetData("SID"),
		isWeaponEligble = Weapons:IsEligible(src),
		qualifications = char:GetData("Qualifications") or {},
		loaded = false,
	}
	TriggerClientEvent("Inventory:Client:Open", src, plyrInvData, secondary and Inventory:GetSecondaryData(src, secondary.invType, secondary.owner, secondary.class or false, secondary.model or false) or nil)

	plyrInvData.inventory = getInventory(src, char:GetData("SID"), 1)
	plyrInvData.loaded = true

	TriggerClientEvent("Inventory:Client:Cache", src, plyrInvData)
	TriggerClientEvent("Inventory:Client:Load", src, plyrInvData, secondary and Inventory:GetSecondary(src, secondary.invType, secondary.owner, secondary.class or false, secondary.model or false) or nil)
end)

local _inUse = {}
INVENTORY = {
	CreateDropzone = function(self, routeId, coords)
		local area = {
			id = string.format("%s:%s", math.ceil(coords.x), math.ceil(coords.y)),
			route = routeId,
			coords = {
				x = coords.x,
				y = coords.y,
				z = coords.z,
			},
		}

		table.insert(_dropzones, area)
		TriggerClientEvent("Inventory:Client:AddDropzone", -1, area)

		return area.id
	end,
	CheckDropZones = function(self, routeId, coords)
		local found = nil

		for k, v in ipairs(_dropzones) do
			if v.route == routeId then
				local dz = v.coords
				local distance = #(vector3(coords.x, coords.y, coords.z) - vector3(dz.x, dz.y, dz.z))
				if distance < 5.0 and (found == nil or distance < found.distance) then
					found = {
						id = v.id,
						position = v.coords,
						distance = distance,
						route = v.route,
					}
				end
			end
		end

		return found
	end,
	RemoveDropzone = function(self, routeId, id)
		for k, v in ipairs(_dropzones) do
			if v.id == id and v.route == routeId then
				if not _doingThings[string.format("%s-%s", id, 10)] then
					table.remove(_dropzones, k)
					TriggerClientEvent("Inventory:Client:RemoveDropzone", -1, id)
				end
				break
			end
		end
	end,
	DropExists = function(self, routeId, id)
		for k, v in ipairs(_dropzones) do
			if v.id == id and v.route == routeId then
				return true
			end
		end

		return false
	end,
	GetInventory = function(self, source, owner, invType)
		return getInventory(source, owner, invType)
	end,
	GetSecondaryData = function(self, _src, invType, Owner, vehClass, vehModel, isRaid, nameOverride, slotOverride, capacityOverride)	
		if _src and invType and Owner then	
			if entityPermCheck(_src, invType) or (isRaid and Player(_src).state.onDuty == "police") then
				local invKey = string.format("%s-%s", Owner, invType)	
				if not _openInvs[invKey] then
					_openInvs[invKey] = {}
				end
	
				if not _openInvs[invKey][_src] then
					_openInvs[invKey][_src] = true
					local name = nameOverride or (LoadedEntitys[invType].name or "Unknown")	
					if LoadedEntitys[tonumber(invType)].shop and shopLocations[Owner] ~= nil then
						name = string.format(
							"%s (%s)",
							shopLocations[Owner].name,
							LoadedEntitys[tonumber(invType)].name
						)
					end
					local requestedInventory = {
						size = getSlotCount(invType, vehClass, vehModel, slotOverride),
						name = name,
						class = vehClass,
						model = vehModel,
						capacity = getCapacity(invType, vehClass, vehModel, capacityOverride),
						shop = LoadedEntitys[tonumber(invType)].shop or false,
						free = LoadedEntitys[tonumber(invType)].free or false,
						inventory = {},
						invType = invType,
						owner = Owner,
						loaded = false,
						slotOverride = slotOverride,
						capacityOverride = capacityOverride,
					}
					return requestedInventory
				else
					return nil
				end
			end
		end
		return nil
	end,
	GetSecondary = function(self, _src, invType, Owner, vehClass, vehModel, isRaid, nameOverride, slotOverride, capacityOverride)
		if invType and Owner then
			if _src == nil then
				local requestedInventory = {
					size = getSlotCount(invType, vehClass, vehModel, slotOverride),
					name = nameOverride or (LoadedEntitys[invType].name or "Unknown"),
					class = vehClass,
					model = vehModel,
					capacity = getCapacity(invType, vehClass, vehModel, capacityOverride),
					shop = LoadedEntitys[tonumber(invType)].shop or false,
					free = LoadedEntitys[tonumber(invType)].free or false,
					action = LoadedEntitys[tonumber(invType)].action or false,
					inventory = getInventory(_src, Owner, invType),
					invType = invType,
					owner = Owner,
					loaded = true,
					slotOverride = slotOverride,
					capacityOverride = capacityOverride,
				}
				return requestedInventory
			end
			local invKey = string.format("%s-%s", Owner, invType)
			if not _openInvs[invKey] then
				_openInvs[invKey] = {}
			end
			if _src ~= nil then
				if not entityPermCheck(_src, invType) and not (isRaid and Player(_src).state.onDuty == "police") then
					return nil
				end
			end
			_openInvs[invKey][_src] = true
			local name = nameOverride or (LoadedEntitys[invType].name or "Unknown")
			if LoadedEntitys[tonumber(invType)].shop and shopLocations[Owner] ~= nil then
				name = string.format(
					"%s (%s)",
					shopLocations[Owner].name,
					LoadedEntitys[tonumber(invType)].name
				)
			end
	
			local requestedInventory = {
				size = getSlotCount(invType, vehClass, vehModel, slotOverride),
				name = name,
				class = vehClass,
				model = vehModel,
				capacity = getCapacity(invType, vehClass, vehModel, capacityOverride),
				shop = LoadedEntitys[tonumber(invType)].shop or false,
				free = LoadedEntitys[tonumber(invType)].free or false,
				action = LoadedEntitys[tonumber(invType)].action or false,
				inventory = getInventory(_src, Owner, invType),
				invType = invType,
				owner = Owner,
				loaded = true,
				slotOverride = slotOverride,
				capacityOverride = capacityOverride,
			}
			return requestedInventory
		else
			return nil
		end
	end,	
	OpenSecondary = function(self, _src, invType, Owner, vehClass, vehModel, isRaid, nameOverride, slotOverride, capacityOverride)		
		if _src and invType and Owner then	
			local player = Fetch:Source(_src)
			if not player then
				return
			end
			
			local char = player:GetData("Character")
			if not char then
				return
			end	
			local plyrInvData = {
				size = (LoadedEntitys[1].slots or 10),
				name = char:GetData("First") .. " " .. char:GetData("Last"),
				inventory = {},
				invType = 1,
				capacity = LoadedEntitys[1].capacity,
				owner = char:GetData("SID"),
				isWeaponEligble = Weapons:IsEligible(_src),
				qualifications = char:GetData("Qualifications") or {},
			}			
			TriggerEvent("Inventory:Server:Opened", _src, Owner, invType)
			if invType == 10 then
				TriggerClientEvent("Inventory:Client:DropzoneForceUpdate", -1, _dropzones)
			end
			local secondaryData = Inventory:GetSecondaryData(_src, invType, Owner, vehClass, vehModel, isRaid, nameOverride, slotOverride, capacityOverride)	
			TriggerClientEvent("Inventory:Client:Open", _src, plyrInvData, secondaryData)			
			plyrInvData.inventory = getInventory(_src, char:GetData("SID"), 1)	
			plyrInvData.loaded = true	
			TriggerClientEvent("Inventory:Client:Cache", _src, plyrInvData)			
			TriggerClientEvent("Inventory:Client:Load", _src, plyrInvData, Inventory:GetSecondary(_src, invType, Owner, vehClass, vehModel, isRaid, nameOverride, slotOverride, capacityOverride))
		end
	end,	
	GetSlots = function(self, Owner, Type)
		local db = MySQL.query.await('SELECT slot as Slot FROM inventory WHERE name = ? GROUP BY slot ORDER BY slot', {
			string.format("%s-%s", Owner, Type)
		})

		local slots = {}
		for k, v in ipairs(db) do
			table.insert(slots, v.Slot)
		end
		return slots
	end,
	HasItems = function(self, Owner, Type)
		local result = MySQL.single.await('SELECT COUNT(id) as count FROM inventory WHERE name = ?', {
			string.format("%s-%s", Owner, Type)
		})
		return result and result.count and result.count > 0 or false
	end,
	GetMatchingSlot = function(self, Owner, Name, Count, Type)
		if not itemsDatabase[Name].isStackable then
			return nil
		end

		return (MySQL.single.await('SELECT slot as Slot FROM inventory WHERE name = ? AND item_id = ? GROUP BY slot HAVING COUNT(item_id) <= ?', {
			string.format("%s-%s", Owner, Type),
			Name,
			itemsDatabase[Name].isStackable - Count
		}))?.Slot
	end,
	GetFreeSlotNumbers = function(self, Owner, invType, vehClass, vehModel)
		local result = Inventory:GetSlots(Owner, invType)
		local occupiedTable = {}
		local unOccupiedSlots = {}
		for k, v in ipairs(result) do
			occupiedTable[v] = true
		end
	
		local total = 8
		if LoadedEntitys[invType] ~= nil then
			total = getSlotCount(invType, vehClass or false, vehModel or false)
		else
			Logger:Error("Inventory", string.format("Entity Type ^2%s^7 Was Attempted To Be Loaded", invType))
		end

		for i = 1, total do
			if not occupiedTable[i] then
				table.insert(unOccupiedSlots, i)
			end
		end
	
		table.sort(unOccupiedSlots)
	
		return unOccupiedSlots
	end,
	GetSlot = function(self, Owner, Slot, Type)
		local item = MySQL.single.await('SELECT id, count(Name) as Count, name as Owner, item_id as Name, dropped as Temp, MAX(quality) as Quality, information as MetaData, slot as Slot, MIN(creationDate) as CreateDate FROM inventory WHERE name = ? AND slot = ? GROUP BY slot ORDER BY slot ASC', {
			string.format("%s-%s", Owner, Type),
			Slot
		})

		if item ~= nil then
			item.MetaData = json.decode(item.MetaData or "{}")
			item.Owner = Owner
			item.invType = Type
		end

		return item
	end,
	GetProvidedSlots = function(self, Owner, Type, Slots)
		return MySQL.single.await('SELECT id, count(Name) as Count, name as Owner, item_id as Name, dropped as Temp, MAX(quality) as Quality, information as MetaData, slot as Slot, MIN(creationDate) as CreateDate FROM inventory WHERE name = ? AND slot IN (?) GROUP BY slot ORDER BY slot ASC', {
			string.format("%s-%s", Owner, Type),
			Slots
		})
	end,
	GetItem = function(self, id)
		return MySQL.single.await('SELECT id, count(Name) as Count, name as Owner, item_id as Name, dropped as Temp, quality as Quality, information as MetaData, slot as Slot, creationDate as CreateDate FROM inventory WHERE id = ?', {
			id
		})
	end,
	CreateItemWithNoMeta = function(self, Owner, Name, Count, Slot, MetaData, invType, isRecurse)
        if not Count or not tonumber(Count) or Count <= 0 then
            Count = 1
        end
    
        local itemExist = itemsDatabase[Name]
        if itemExist then
            if not isRecurse then
                if (not itemExist.isStackable and Count > 1)
                    or Count > 50
                    or (type(itemExist.isStackable) == "number" and Count > itemExist.isStackable and itemExist.isStackable > 0)
                then
                    while Count > 0 do
                        local s = math.min(Count, (type(itemExist.isStackable) == "number" and itemExist.isStackable > 0) and itemExist.isStackable or 50)
                        self:CreateItemWithNoMeta(Owner, Name, s, Slot, MetaData, invType, true)
                        Count = Count - s
                    end
                    return true
                end
            end
            return Inventory:AddSlot(Owner, Name, Count, MetaData, Slot, invType)
        else
            return false
        end
    end,
	CreateItem = function(self, Owner, Name, Count, Slot, md, invType, isRecurse, forceCreateDate, quality)
		local MetaData = table.copy(md or {})

		if not Count or not tonumber(Count) or Count <= 0 then
			Count = 1
		end

		local itemExist = itemsDatabase[Name]
		if itemExist then
			local p = promise.new()

			if
				not itemExist.isStackable and Count > 1
				or Count > 10000
				or (type(itemExist.isStackable) == "number" and Count > itemExist.isStackable and itemExist.isStackable > 0)
			then
				while
					not itemExist.isStackable and itemExist.isStackable ~= -1 and Count > 1
					or Count > 10000
					or (type(itemExist.isStackable) == "number" and Count > itemExist.isStackable and itemExist.isStackable > 0)
				do
					local s = Count > 10000 and 10000 or itemExist.isStackable or 1
					self:CreateItem(Owner, Name, Count, Slot, MetaData, invType, true, quality)
					Count = Count - s
				end
			end

			if itemExist.type == 2 then
				if not MetaData.SerialNumber and not itemExist.noSerial then
					if MetaData.Scratched then
						MetaData.ScratchedSerialNumber = Weapons:Purchase(Owner, itemExist, true, MetaData.Company)
						MetaData.Scratched = nil
					else
						MetaData.SerialNumber = Weapons:Purchase(Owner, itemExist, false, MetaData.Company)
					end
					MetaData.Company = nil
				end
			elseif itemExist.type == 10 and not MetaData.Container then
				MetaData.Container = string.format("container:%s", Sequence:Get("Container"))
			elseif itemExist.type == 11 and not MetaData.Quality then
				MetaData.Quality = math.random(100)
			elseif itemExist.name == "govid" and invType == 1 then
				local plyr = Fetch:SID(Owner)
				local char = plyr:GetData("Character")
				local genStr = "Male"
				if char:GetData("Gender") == 1 then
					genStr = "Female"
				end
				MetaData.Name = string.format("%s %s", char:GetData("First"), char:GetData("Last"))
				MetaData.Gender = genStr
				MetaData.PassportID = plyr:GetData("AccountID")
				MetaData.StateID = char:GetData("SID")
				MetaData.DOB = char:GetData("DOB")
			elseif itemExist.name == "moneybag" and not MetaData.Finish then
				MetaData.Finished = os.time() + (60 * 60 * 24 * math.random(1, 3))
			elseif itemExist.name == "crypto_voucher" and not MetaData.CryptoCoin and not MetaData.Quantity then
				MetaData.CryptoCoin = "PLEB"
				MetaData.Quantity = math.random(25, 50)
			elseif itemExist.name == "vpn" then
				MetaData.VpnName = {
					First = Generator.Name:First(),
					Last = Generator.Name:Last(),
				}
			elseif itemExist.name == "WEAPON_PETROLCAN" then
				MetaData.ammo = 4500
			elseif itemExist.name == "cigarette_pack" then
				MetaData.Count = 30
			elseif itemExist.name == "choplist" and not MetaData.ChopList then
				MetaData.ChopList = Phone.LSUnderground.Chopping:GenerateList(math.random(4, 8), math.random(3, 5))
			elseif itemExist.name == "meth_table" and not MetaData.MethTable then
				MetaData.MethTable = Drugs.Meth:GenerateTable(1)
			elseif itemExist.name == "adv_meth_table" and not MetaData.MethTable then
				MetaData.MethTable = Drugs.Meth:GenerateTable(2)
			elseif itemExist.name == "moonshine_still" and not MetaData.Still then
				MetaData.Still = Drugs.Moonshine.Still:Generate(1)
			elseif itemExist.name == "meth_bag" or itemExist.name == "meth_brick" or itemExist.name == "coke_bag" or itemExist.name == "coke_brick" then
				if not quality then
					quality = math.random(1, 100)
				end
				if itemExist.name == "meth_brick" then
					MetaData.Finished = os.time() + (60 * 60 * 24)
				end
			elseif itemExist.name == "paleto_access_codes" and not MetaData.AccessCodes then
				MetaData.AccessCodes = {
					Robbery:GetAccessCodes('paleto')[1]
				}
			end

			return Inventory:AddSlot(Owner, Name, Count, MetaData, Slot, invType, forceCreateDate or false, quality or false)
		else
			return false
		end
	end,
	AddItem = function(self, Owner, Name, Count, md, invType, vehClass, vehModel, entity, isRecurse, Slot, forceCreateDate, quality)
		local MetaData = table.copy(md or {})

		if vehClass == nil then
			vehClass = false
		end

		if vehModel == nil then
			vehModel = false
		end

		if entity == nil then
			entity = false
		end

		if not Count or not tonumber(Count) or Count <= 0 then
			Count = 1
		end

		if invType == 1 then
			if not isRecurse then
				local plyr = Fetch:SID(Owner)
				TriggerClientEvent("Inventory:Client:Changed", plyr:GetData("Source"), "add", Name, Count)
			end
		end

		local itemExist = itemsDatabase[Name]
		if itemExist then
			local invWeight = Inventory.Items:GetWeights(Owner, invType)
			local totWeight = invWeight + (Count * itemExist.weight)

			if
				not itemExist.isStackable and Count > 1
				or Count > 10000
				or (type(itemExist.isStackable) == "number" and Count > itemExist.isStackable and itemExist.isStackable > 0)
			then
				while
					not itemExist.isStackable and Count > 1
					or Count > 10000
					or (type(itemExist.isStackable) == "number" and Count > itemExist.isStackable and itemExist.isStackable > 0)
				do
					local s = Count > 10000 and 10000 or itemExist.isStackable or 1
					self:AddItem(Owner, Name, s, MetaData, invType, vehClass, vehModel or false, entity or false, true, Slot or false, forceCreateDate or false, quality or false)
					Count = Count - s
				end
			end

			local slots = Inventory:GetFreeSlotNumbers(Owner, invType, vehClass, vehModel)
			if
				(totWeight > getCapacity(invType, vehClass, vehmodel) and itemExist.weight > 0)
				or (#slots == 0 or slots[1] > getSlotCount(invType, vehClass or false, vehModel or false))
			then
				local plyr = Fetch:SID(Owner)
				local coords = { x = 900.441, y = -1757.186, z = 21.359 }
				local route = 0

				if plyr ~= nil then
					local x, y, z = table.unpack(GetEntityCoords(GetPlayerPed(plyr:GetData("Source"))))
					coords = { x = x, y = y, z = z - 0.98 }
					route = Player(plyr:GetData("Source")).state.currentRoute
				elseif entity ~= nil then
					local x, y, z = table.unpack(GetEntityCoords(entity))
					coords = { x = x, y = y, z = z }
					route = GetEntityRoutingBucket(entity)
				end

				invType = 10
			local dz = Inventory:CheckDropZones(route, coords)
				if dz == nil then
					Owner = Inventory:CreateDropzone(route, coords)
				else
					Owner = dz.id
				end

				slots = Inventory:GetFreeSlotNumbers(Owner, invType, vehClass, vehModel)
			end

			if itemExist.staticMetadata ~= nil then
				for k, v in pairs(itemExist.staticMetadata) do
					if MetaData[k] == nil then
						MetaData[k] = v
					end
				end
			end

			if itemExist.type == 2 then
				if not MetaData.SerialNumber and not itemExist.noSerial then
					if MetaData.Scratched then
						MetaData.ScratchedSerialNumber = Weapons:Purchase(Owner, itemExist, true, MetaData.Company)
						MetaData.Scratched = nil
					else
						MetaData.SerialNumber = Weapons:Purchase(Owner, itemExist, false, MetaData.Company)
					end
					MetaData.Company = nil
				end
			elseif itemExist.type == 10 and not MetaData.Container then
				MetaData.Container = string.format("container:%s", Sequence:Get("Container"))
			elseif itemExist.type == 11 and not MetaData.Quality then
				MetaData.Quality = math.random(100)
			elseif itemExist.name == "govid" and invType == 1 then
				local plyr = Fetch:SID(Owner)
				local char = plyr:GetData("Character")
				local genStr = "Male"
				if char:GetData("Gender") == 1 then
					genStr = "Female"
				end
				MetaData.Name = string.format("%s %s", char:GetData("First"), char:GetData("Last"))
				MetaData.Gender = genStr
				MetaData.PassportID = plyr:GetData("AccountID")
				MetaData.StateID = char:GetData("SID")
				MetaData.DOB = char:GetData("DOB")
			elseif itemExist.name == "moneybag" and not MetaData.Finish then
				MetaData.Finished = os.time() + (60 * 60 * 24 * math.random(1, 3))
			elseif itemExist.name == "crypto_voucher" and not MetaData.CryptoCoin and not MetaData.Quantity then
				MetaData.CryptoCoin = "PLEB"
				MetaData.Quantity = math.random(25, 50)
			elseif itemExist.name == "vpn" then
				MetaData.VpnName = {
					First = Generator.Name:First(),
					Last = Generator.Name:Last(),
				}
			elseif itemExist.name == "WEAPON_PETROLCAN" then
				MetaData.ammo = 4500
			elseif itemExist.name == "cigarette_pack" then
				MetaData.Count = 30
			elseif itemExist.name == "choplist" and not MetaData.ChopList then
				MetaData.ChopList = Phone.LSUnderground.Chopping:GenerateList(math.random(4, 8), math.random(3, 5))
			elseif itemExist.name == "meth_table" and not MetaData.MethTable then
				MetaData.MethTable = Drugs.Meth:GenerateTable(1)
			elseif itemExist.name == "adv_meth_table" and not MetaData.MethTable then
				MetaData.MethTable = Drugs.Meth:GenerateTable(2)
			elseif itemExist.name == "moonshine_still" and not MetaData.Still then
				MetaData.Still = Drugs.Moonshine.Still:Generate(1)
			elseif itemExist.name == "meth_bag" or itemExist.name == "meth_brick" or itemExist.name == "coke_bag" or itemExist.name == "coke_brick" then
				if not quality then
					quality = math.random(1, 100)
				end
				if itemExist.name == "meth_brick" then
					MetaData.Finished = os.time() + (60 * 60 * 24)
				end
			elseif itemExist.name == "paleto_access_codes" and not MetaData.AccessCodes then
				MetaData.AccessCodes = {
					Robbery:GetAccessCodes('paleto')[1]
				}
			elseif itemExist.name == "sim_card" and not MetaData.number then
				local number = "555"
				for i = 1, 7 do
					number = number .. tostring(math.random(0, 9))
				end
				MetaData.number = number
			elseif itemExist.name == "phone" and not MetaData.number then
				-- Initialize phone with "No Sim Card" if no number is set
				MetaData.number = "No Sim Card"
			end

			local retval = nil
			local addedSlot = nil

			if not itemExist.isStackable then
				retval = Inventory:AddSlot(Owner, Name, 1, MetaData, slots[1], invType, forceCreateDate or false, quality or false)
				addedSlot = slots[1]
			else
				local mSlot = Inventory:GetMatchingSlot(Owner, Name, Count, invType)
				if mSlot == nil then
					retval = Inventory:AddSlot(Owner, Name, Count, MetaData, slots[1], invType, forceCreateDate or false, quality or false)
					addedSlot = slots[1]
				else
					retval = Inventory:AddSlot(Owner, Name, Count, MetaData, mSlot, invType, forceCreateDate or false, quality or false)
					addedSlot = mSlot
				end
			end

			if invType == 1 then
				local plyr = Fetch:SID(Owner)
				if plyr ~= nil then
					local source = plyr:GetData("Source")
				if WEAPON_PROPS[Name] ~= nil then
					_refreshAttchs[Owner] = true
				end
					-- Always update the slot for clients to refresh context menu options
					if addedSlot then
						UpdateSlotForClients(source, Owner, invType, addedSlot)
					end
					local invKey = string.format("%s-%s", Owner, invType)
					if not (_openInvs[invKey] and _openInvs[invKey][source]) then
				refreshShit(Owner, true)
					end
				end
			end

			return retval
		else
			return false
		end
	end,
	AddSlot = function(self, Owner, Name, Count, MetaData, Slot, Type, forceCreateDate, quality)
		if Count <= 0 then
			Logger:Error("Inventory", "[AddSlot] Cannot Add " .. Count .. " of an Item (" .. Owner .. ":" .. Type .. ")")
			return false
		end

		if Slot == nil then
			local freeSlots = Inventory:GetFreeSlotNumbers(Owner, Type)
			if #freeSlots == 0 then
				Logger:Error("Inventory", "[AddSlot] No Available Slots For " .. Owner .. ":" .. Type .. " And Passed Slot Was Nil")
				return false
			end
			Slot = freeSlots[1]
		end

		if itemsDatabase[Name] == nil then
			Logger:Error(
				"Inventory",
				string.format("Slot %s in %s-%s has invalid item %s", Slot, Owner, Type, Name)
			)
			return false
		end

		local qry = 'INSERT INTO inventory (name, item_id, slot, quality, information, creationDate, expiryDate, dropped) VALUES '
		local params = {}

		local created = forceCreateDate or os.time()
		local expiry = -1
		if itemsDatabase[Name].durability ~= nil and itemsDatabase[Name].isDestroyed then
			expiry = created + itemsDatabase[Name].durability
		end

		for i = 1, Count do
			table.insert(params, string.format("%s-%s", Owner, Type))
			table.insert(params, Name)
			table.insert(params, Slot)
			table.insert(params, quality or 0)
			table.insert(params, json.encode(MetaData))
			table.insert(params, created)
			table.insert(params, expiry)
			table.insert(params, Type == 10 and 1 or 0)
			qry = qry .. '(?, ?, ?, ?, ?, ?, ?, ?)'
			if i < Count then
				qry = qry .. ','
			end
		end

		qry = qry .. ';'

		local ids = MySQL.insert.await(qry, params)

		return { id = ids, metadata = MetaData}
	end,
	SetItemCreateDate = function(self, id, value)
		MySQL.query.await('UPDATE inventory SET creationDate = ? WHERE id = ?', {
			value,
			id,
		})
	end,
	SetMetaDataKey = function(self, id, key, value)
		local slot = Inventory:GetItem(id)
		if slot ~= nil then
			local md = json.decode(slot.MetaData or "{}")
			md[key] = value
			MySQL.query.await('UPDATE inventory SET information = ? WHERE id = ?', {
				json.encode(md),
				id,
			})
			return md
		else
			return {}
		end
	end,
	UpdateMetaData = function(self, id, updatingMeta)
		if type(updatingMeta) ~= "table" then
			return false
		end
		
		local slot = Inventory:GetItem(id)
		if slot ~= nil then
			local md = json.decode(slot.MetaData or "{}")

			for k, v in pairs(updatingMeta) do
				md[k] = v
			end

			MySQL.query.await('UPDATE inventory SET information = ? WHERE id = ?', {
				json.encode(md),
				id,
			})

			return md
		else
			return {}
		end
	end,
	Items = {
		GetData = function(self, item)
			return itemsDatabase[item]
		end,
		GetCount = function(self, owner, invType, item)
			local counts = Inventory.Items:GetCounts(owner, invType)
			return counts[item] or 0
		end,
		GetCounts = function(self, owner, invType)
			local counts = {}

			local qry = MySQL.query.await('SELECT COUNT(id) as Count, item_id as Name FROM inventory WHERE name = ? GROUP BY item_id', {
				string.format("%s-%s", owner, invType)
			})

			for k, v in ipairs(qry) do
				counts[v.Name] = v.Count
			end

			return counts
		end,
		GetWeights = function(self, owner, invType)
			local items = MySQL.query.await('SELECT id, count(id) as Count, item_id as Name FROM inventory WHERE NAME = ? GROUP BY item_id', {
				string.format('%s-%s', owner, invType)
			})

			local weights = 0
			for k, slot in ipairs(items) do
				if itemsDatabase[slot.Name] and itemsDatabase[slot.Name].weight then
					weights += (slot.Count * itemsDatabase[slot.Name].weight)
				end
			end

			return weights
		end,
		GetFirst = function(self, Owner, Name, invType)
			local item = MySQL.single.await("SELECT id, name as Owner, item_id as Name, dropped as Temp, quality as Quality, information as MetaData, slot as Slot, creationDate as CreateDate FROM inventory WHERE NAME = ? AND item_id = ? ORDER BY quality DESC, creationDate ASC LIMIT 1", {
				string.format("%s-%s", Owner, invType),
				Name,
			})

			if item ~= nil then
				item.MetaData = json.decode(item.MetaData or "{}")
				item.Owner = Owner
				item.invType = invType
			end
			
			return item
		end,
		GetAll = function(self, Owner, Name, invType)
			local items = MySQL.query.await("SELECT id, name as Owner, item_id as Name, dropped as Temp, quality as Quality, information as MetaData, slot as Slot, creationDate as CreateDate FROM inventory WHERE NAME = ? AND item_id = ? ORDER BY quality DESC, creationDate ASC", {
				string.format("%s-%s", Owner, invType),
				Name,
			})

			if #items > 0 then
				for k, v in ipairs(items) do
					items[k].MetaData = json.decode(items[k].MetaData or "{}")
					local t = split(items[k].Owner, '-')
					items[k].Owner = tonumber(t[1]) or t[1]
					items[k].invType = tonumber(t[2])
				end
			end

			return items
		end,
		Has = function(self, owner, invType, item, count)
			return (MySQL.single.await('SELECT id, count(id) as Count FROM inventory WHERE name = ? AND item_id = ? GROUP BY item_id', {
				string.format("%s-%s", owner, invType),
				item
			})?.Count or 0) >= (count or 1)
		end,
		HasId = function(self, owner, invType, id)
			return MySQL.single.await('SELECT id, count(Name) as Count FROM inventory WHERE id = ? AND name = ?', {
				id,
				string.format("%s-%s", owner, invType),
			}) ~= nil
		end,
		HasItems = function(self, source, items)
			local player = Fetch:Source(source)
			local char = player:GetData("Character")
			local charId = char:GetData("SID")
			for k, v in ipairs(items) do
				if not Inventory.Items:Has(charId, 1, v.item, v.count) then
					return false
				end
			end
			return true
		end,
		HasAnyItems = function(self, source, items)
			local player = exports["vertex-base"]:FetchComponent("Fetch"):Source(source)
			local char = player:GetData("Character")
			local charId = char:GetData("SID")

			for k, v in ipairs(items) do
				if Inventory.Items:Has(charId, 1, v.item, v.count) then
					return true
				end
			end

			return false
		end,
		GetAllOfType = function(self, owner, invType, itemType)
			local f = {}
			local params = {}

			for k, v in pairs(itemsDatabase) do
				if v.type == itemType then
					table.insert(f, string.format('"%s"', v.name))
				end
			end

			local qry = string.format(
				'SELECT id, count(id) as Count, name as Owner, item_id as Name, dropped as Temp, quality as Quality, information as MetaData, slot as Slot, creationDate as CreateDate FROM inventory WHERE name = ? AND item_id IN (%s) GROUP BY item_id ORDER BY creationDate ASC',
				table.concat(f, ',')
			)
			return MySQL.query.await(qry, { string.format("%s-%s", owner, invType) })
		end,
		GetAllOfTypeNoStack = function(self, owner, invType, itemType)
			local f = {}
			local params = {}

			for k, v in pairs(itemsDatabase) do
				if v.type == itemType then
					table.insert(f, string.format('"%s"', v.name))
				end
			end

			local qry = string.format(
				'SELECT id, name as Owner, item_id as Name, dropped as Temp, quality as Quality, information as MetaData, slot as Slot, creationDate as CreateDate FROM inventory WHERE name = ? AND item_id IN (%s)',
				table.concat(f, ',')
			)
			return MySQL.query.await(qry, { string.format("%s-%s", owner, invType) })
		end,
		RegisterUse = function(self, item, id, cb)
			if ItemCallbacks[item] == nil then
				ItemCallbacks[item] = {}
			end
			ItemCallbacks[item][id] = cb
		end,
		Use = function(self, source, item, cb)
			if item == nil then
				return cb(false)
			end

			if not itemsDatabase[item.Name]?.isUsable or _inUse[source] then
				return cb(false)
			end

			local itemData = itemsDatabase[item.Name]
			if
				not itemData.durability
				or item ~= nil
					and item.CreateDate ~= nil
					and item.CreateDate + itemData.durability > os.time()
			then
				if itemData.closeUi then
					TriggerClientEvent("Inventory:CloseUI", source)
				end

				if
					itemData.useRestrict == nil
					or (itemData.useRestrict.job ~= nil and Jobs.Permissions:HasJob(
						source,
						itemData.useRestrict.job.id,
						itemData.useRestrict.job.workplace or false,
						itemData.useRestrict.job.grade or false,
						false,
						false,
						itemData.useRestrict.job.permissionKey or false
					) and (not itemData.useRestrict.job.duty or Player(source).state.onDuty == itemData.useRestrict.job.id))
					or (itemData.useRestrict.state and hasValue(char:GetData("States"), itemData.useRestrict.state))
					or (itemData.useRestrict.rep ~= nil and Reputation:GetLevel(source, itemData.useRestrict.rep.id) >= itemData.useRestrict.rep.level)
					or (itemData.useRestrict.character ~= nil and itemData.useRestrict.character == char:GetData("ID"))
					or (itemData.useRestrict.admin and plyr.Permissions:IsAdmin())
				then
					_inUse[source] = true
					TriggerClientEvent("Inventory:Client:InUse", source, _inUse[source])
					TriggerClientEvent("Inventory:Client:Changed", source, itemData.type == 2 and "holster" or "used", item.Name, 0, item.Slot)

					local used = true
					if itemData.animConfig ~= nil then
						used = false
						local p = promise.new()
						Callbacks:ClientCallback(source, "Inventory:ItemUse", itemData.animConfig, function(state)
							p:resolve(state)
						end)
						used = Citizen.Await(p)
					end

					if used then
						local retard = false
						if ItemCallbacks[item.Name] ~= nil then
							for k, callback in pairs(ItemCallbacks[item.Name]) do
								retard = true
								callback(source, item, itemsDatabase[item.Name])
							end
						elseif itemData.imitate and ItemCallbacks[itemData.imitate] ~= nil then
							for k, callback in pairs(ItemCallbacks[itemData.imitate]) do
								retard = true
								callback(source, item, itemsDatabase[item.Name])
							end
						end

						if retard then
							TriggerClientEvent("Markers:ItemAction", source, item)
						end
					end

					local char = Fetch:Source(source):GetData("Character")
					sendRefreshForClient(source, char:GetData("SID"), 1, item.Slot)
					_inUse[source] = false
					TriggerClientEvent("Inventory:Client:InUse", source, _inUse[source])
					cb(used)
				else
					Execute:Client(source, "Notification", "Error", "You Can't Use That")
					cb(false)
				end

			else
				cb(false)
			end
		end,
		Remove = function(self, owner, invType, item, count, skipUpdate)
			local results = MySQL.query.await("DELETE FROM inventory WHERE name = ? AND item_id = ? ORDER BY slot ASC, creationDate ASC LIMIT ?", {
				string.format("%s-%s", owner, invType),
				item,
				count,
			})

			if not skipUpdate then
				if invType == 1 then
					local plyr = Fetch:SID(owner)
					if plyr ~= nil then
						local source = plyr:GetData("Source")
						local char = plyr:GetData("Character")
						TriggerClientEvent("Inventory:Client:Changed", source, "removed", item, count)
						if WEAPON_PROPS[item] ~= nil then
							_refreshAttchs[owner] = source
						end
						-- Always refresh inventory when item is removed
						refreshShit(owner, true)
					end
				end
			end

			return results.affectedRows >= count
		end,
		RemoveId = function(self, owner, invType, item)
			MySQL.query.await("DELETE FROM inventory WHERE id = ?", { item.id })

			if invType == 1 then
				local plyr = Fetch:SID(tonumber(owner))
				if plyr ~= nil then
					local source = plyr:GetData("Source")
					TriggerClientEvent("Inventory:Client:Changed", source, "removed", item.Name, 1)
					if WEAPON_PROPS[item.Name] ~= nil then
						_refreshAttchs[owner] = source
					end
					-- Always refresh inventory when item is removed
					refreshShit(owner, true)
				end
			end

			return true
		end,
		RemoveAll = function(self, owner, type, item)
			if type == 1 then
				local plyr = Fetch:SID(owner)
				if plyr ~= nil then
					local count = MySQL.scalar.await('SELECT COUNT(item_id) as count FROM inventory WHERE name = ? and item_id = ?', {
						string.format("%s-%s", owner, type),
						item,
					})

					if count > 0 then
						TriggerClientEvent("Inventory:Client:Changed", plyr:GetData("Source"), "removed", item, count)
					end
				end
			end

			MySQL.query.await('DELETE FROM inventory WHERE name = ? AND item_id = ?', {
				string.format("%s-%s", owner, type),
				item,
			})
			return true
		end,
		RemoveSlot = function(self, Owner, Name, Count, Slot, invType)
			local slot = Inventory:GetSlot(Owner, Slot, invType)
			if slot == nil then
				Logger:Error(
					"Inventory",
					"Failed to remove " .. Count .. " from Slot " .. Slot .. " for " .. Owner,
					{ console = false }
				)
				return false
			else
				if slot.Count >= Count then
					MySQL.query.await('DELETE FROM inventory WHERE name = ? AND slot = "?" AND item_id = ? ORDER BY creationDate ASC LIMIT ?', {
						string.format("%s-%s", Owner, invType),
						Slot,
						Name,
						Count,
					})
	
					if invType == 1 then
						local plyr = Fetch:SID(Owner)
						if plyr ~= nil then
							local source = plyr:GetData("Source")
							local char = plyr:GetData("Character")
							TriggerClientEvent("Inventory:Client:Changed", source, "removed", Name, Count)
							if WEAPON_PROPS[Name] ~= nil then
								_refreshAttchs[Owner] = source
							end
							-- Always update the slot for clients to refresh context menu options (will be nil if removed)
							UpdateSlotForClients(source, Owner, invType, Slot)
							-- Only refresh cache if inventory is not open (to avoid closing it)
							local invKey = string.format("%s-%s", Owner, invType)
							if not (_openInvs[invKey] and _openInvs[invKey][source]) then
								refreshShit(Owner, true)
							end
						end
					end
	
					return true
				else
					return false
				end
			end
		end,
		RemoveList = function(self, owner, invType, items)
			for k, v in ipairs(items) do
				Inventory.Items:Remove(owner, invType, v.name, v.count)
			end
		end,
		GetWithStaticMetadata = function(self, masterKey, mainIdName, textureIdName, gender, data)
			for k, v in pairs(itemsDatabase) do
				if v.staticMetadata ~= nil
					and v.staticMetadata[masterKey] ~= nil
					and v.staticMetadata[masterKey][gender] ~= nil
					and v.staticMetadata[masterKey][gender][mainIdName] == data[mainIdName]
					and v.staticMetadata[masterKey][gender][textureIdName] == data[textureIdName]
				then
					return k
				end
			end

			return nil
		end,
	},
	Holding = {
		Put = function(self, source)
			CreateThread(function()
				local p = promise.new()
				local plyr = Fetch:Source(source)
				if plyr ~= nil then
					local char = plyr:GetData("Character")
					if char ~= nil then
						local inv = getInventory(source, char:GetData("SID"), 1)

						if #inv > 0 then
							local freeSlots = Inventory:GetFreeSlotNumbers(char:GetData("SID"), 2)

							if #inv <= #freeSlots then
								local queries = {}

								for k, v in ipairs(inv) do
									table.insert(queries, {
										query = "UPDATE inventory SET name = ?, slot = ? WHERE name = ? AND slot = ?", 
										values = {
											string.format("%s-%s", char:GetData("SID"), 2),
											freeSlots[k],
											string.format("%s-%s", char:GetData("SID"), 1),
											v.Slot
										}
									})
								end

								MySQL.transaction.await(queries)
								refreshShit(char:GetData("SID"))

								Execute:Client(source, "Notification", "Success", "Retreived Items")
							else
								Execute:Client(source, "Notification", "Error", "Not Enough Slots Available")
							end
						else
							Execute:Client(source, "Notification", "Error", "No Items To Retreive")
						end
					end
					
					p:resolve(true)
				end
				Citizen.Await(p)
			end)
		end,
		Take = function(self, source)
			CreateThread(function()
				local p = promise.new()
				local plyr = Fetch:Source(source)
				if plyr ~= nil then
					local char = plyr:GetData("Character")
					if char ~= nil then
						local inv = getInventory(source, char:GetData("SID"), 2)

						if #inv > 0 then
							local freeSlots = Inventory:GetFreeSlotNumbers(char:GetData("SID"), 1)

							if #inv <= #freeSlots then
								local queries = {}

								for k, v in ipairs(inv) do
									table.insert(queries, {
										query = "UPDATE inventory SET name = ?, slot = ? WHERE name = ? AND slot = ?", 
										values = {
											string.format("%s-%s", char:GetData("SID"), 1),
											freeSlots[k],
											string.format("%s-%s", char:GetData("SID"), 2),
											v.Slot
										}
									})
								end

								MySQL.transaction.await(queries)
								refreshShit(char:GetData("SID"), true)

								Execute:Client(source, "Notification", "Success", "Retreived Items")
							else
								Execute:Client(source, "Notification", "Error", "Not Enough Slots Available")
							end
						else
							Execute:Client(source, "Notification", "Error", "No Items To Retreive")
						end
					end
					
					p:resolve(true)
				end
				Citizen.Await(p)
			end)
		end,
	},
	Container = {
		Open = function(self, src, item, identifier)
			Callbacks:ClientCallback(src, "Inventory:Container:Open", {
				item = item,
				container = ("container:%s"):format(identifier),
			}, function()
				Inventory:OpenSecondary(src, itemsDatabase[item.Name].container, ("container:%s"):format(identifier))
			end)
		end,
	},
	Stash = {
		Open = function(self, src, invType, identifier)
			Inventory:OpenSecondary(src, invType, ("stash:%s"):format(identifier))
		end,
	},
	Shop = {
		Open = function(self, src, identifier)
			Inventory:OpenSecondary(src, 11, ("shop:%s"):format(identifier))
		end,
	},
	Search = {
		Character = function(self, src, tSrc, id)
			Callbacks:ClientCallback(tSrc, "Inventory:ForceClose", {}, function(state)
				Execute:Client(tSrc, "Notification", "Info", "You Were Searched")
				Inventory:OpenSecondary(src, 1, id)
			end)
		end,
	},
	Rob = function(self, src, tSrc, id)
		Callbacks:ClientCallback(tSrc, "Inventory:ForceClose", {}, function(state)
			Inventory:OpenSecondary(src, 1, id)
		end)
	end,
	Poly = {
		Create = function(self, data)
			table.insert(_polyInvs, data.id)
			GlobalState[string.format("Inventory:%s", data.id)] = data
		end,
		
		

		
		
		
		
		Remove = function(self, id)

		end,
	},
	IsOpen = function(self, src, invType, id)
		
		return _openInvs[string.format("%s-%s", invType, id)][src]
	end,
}

function UpdateCharacterItemStates(source, inventory, adding)
	local player = Fetch:Source(source)
	local char = player:GetData("Character")
	if not player or not char then
		return
	end
	local changedState = false
	local playerStates = char:GetData("States") or {}

	local allInventoryStates = {}
	for k, v in ipairs(inventory) do
		local item = itemsDatabase[v.Name]
		if item ~= nil and item.state ~= nil and (item.durability == nil or (os.time() - v.CreateDate < item.durability)) then
			table.insert(allInventoryStates, item.state)
		end
	end

	if adding then
		for item, itemState in pairs(allInventoryStates) do
			if not Utils:DoesTableHaveValue(playerStates, itemState) then
				table.insert(playerStates, itemState)
				changedState = true
			end
		end
	end

	local s = {}
	for i = #playerStates, 1, -1 do
		if
			not Utils:DoesTableHaveValue(allInventoryStates, playerStates[i])
			and string.sub(playerStates[i], 1, string.len("SCRIPT")) ~= "SCRIPT"
			and string.sub(playerStates[i], 1, string.len("ACCESS")) ~= "ACCESS"
		then
			table.remove(playerStates, i)
			changedState = true
		end
	end

	if changedState then
		char:SetData("States", playerStates)
	end
end


function UpdateCharacterGangChain(source, inventory)
	local player = Fetch:Source(source)
	local char = player:GetData("Character")
	if not player or not char then
		return
	end

	local gangChains = {}
	for k, v in ipairs(inventory) do
		local item = itemsDatabase[v.Name]
		if item ~= nil and item.gangChain ~= nil then
			table.insert(gangChains, item.gangChain)
		end
	end

	local myGangChain = char:GetData("GangChain") or nil
	if myGangChain ~= nil and not Utils:DoesTableHaveValue(gangChains, myGangChain) then
		char:SetData("GangChain", "NONE")
	end
end


RegisterNetEvent("Inventory:Server:TryGiveItem", function(data)
    if not data then
        Player(source).state.isGivingItem = nil
        return
    end
  data.PropThing = false
    local itemExist = itemsDatabase[data.name]
    if itemExist and itemExist.animConfig then
        data.PropThing = itemExist.animConfig.anim
    end
   Player(source).state.isGivingItem = data
end) 

RegisterNetEvent("RefreshAfter:GiveItem", function(SID)
	local player = Fetch:SID(tonumber(SID))
	local char = player:GetData("Character")
	local src = player:GetData("Source")
	local plyrInvData = {
		size = (LoadedEntitys[1].slots or 10),
		name = char:GetData("First") .. " " .. char:GetData("Last"),
		inventory = plyrInv,
		invType = 1,
		capacity = LoadedEntitys[1].capacity,
		owner = char:GetData("SID"),
		isWeaponEligble = Weapons:IsEligible(src),
		qualifications = char:GetData("Qualifications") or {},
		loaded = false,
	}

	plyrInvData.inventory = getInventory(src, char:GetData("SID"), 1)
	plyrInvData.loaded = true

	TriggerClientEvent("Inventory:Client:Cache", src, plyrInvData)
	TriggerClientEvent("Inventory:Client:Load", src, plyrInvData)
end)


function CloseUIAndClearThing(source)
	TriggerClientEvent("Inventory:CloseUI", source)
	for k, v in pairs(_openInvs) do
		if v[source] then
			v[source] = nil  
			if next(v) == nil then
				_openInvs[k] = nil
			end
		end
	end
end
