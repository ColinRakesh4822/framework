function RegisterStashCallbacks()
	Callbacks:RegisterServerCallback("Stash:Server:Open", function(source, data, cb)
		if GlobalState[string.format("%s:Property", source)] ~= nil then
			local pid = GlobalState[string.format("%s:Property", source)]
			local invKey = string.format("%s-%s", 13, pid)
	
			_openInvs[invKey] = _openInvs[invKey] or {}
			-- Remove the check to allow opening again even if already open
			Inventory.Stash:Open(source, 13, pid)
			_openInvs[invKey][source] = true
			cb({ type = 13, owner = string.format("stash:%s", pid) })
		else
			cb(nil)
		end
	end)
	
	Callbacks:RegisterServerCallback("Shop:Server:Open", function(source, data, cb)
		local k = string.format("shop:%s", data.identifier)
		if shopLocations[k] ~= nil then
			local entId = shopLocations[k].entityId
			local invKey = string.format("%s-%s", entId, data.identifier)	
			_openInvs[invKey] = _openInvs[invKey] or {}
			-- Remove the check to allow opening again even if already open
			Inventory:OpenSecondary(source, entId, ("shop:%s"):format(data.identifier))
			_openInvs[invKey][source] = true
			cb(entId)
		else
			cb(false)
		end
	end)
	
	Callbacks:RegisterServerCallback("Inventory:Server:Open", function(source, data, cb)
		local inventoryKey = string.format("%s-%s", data.invType, data.owner)
	
		_openInvs[inventoryKey] = _openInvs[inventoryKey] or {}
		-- Remove the check to allow opening again even if already open
		if entityPermCheck(source, data.invType) then
			Inventory:OpenSecondary(source, data.invType, data.owner, data.class or false, data.model or false)
			_openInvs[inventoryKey][source] = true
			cb(true)
		else
			cb(false)
		end
	end)
end
