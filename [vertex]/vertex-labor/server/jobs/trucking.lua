local _JOB = "Trucking"
local _joiners = {}
local _Trucking = {}
-- Config variables moved to configs/trucking.lua

local function shuffleTable(t)
	local copy = {}
	for i = 1, #t do copy[i] = t[i] end
	for i = #copy, 2, -1 do
		local j = math.random(i)
		copy[i], copy[j] = copy[j], copy[i]
	end
	return copy
end

local function pickDeliveryRoutes(count)
	count = math.max(1, math.min(count, #_truckingDeliveryLocations))
	local shuffled = shuffleTable(_truckingDeliveryLocations)
	local picked = {}
	for i = 1, count do
		local r = shuffled[i]
		picked[i] = {
			coords = r.coords,
			heading = r.heading,
			locationName = r.locationName,
		}
	end
	return picked
end

local function deleteJobVehicles(joiner)
	if _Trucking[joiner] == nil then return end
	local truckRef = _Trucking[joiner].truck
	local trailerRef = _Trucking[joiner].trailer
	_Trucking[joiner].truck = nil
	_Trucking[joiner].trailer = nil
	if trailerRef and DoesEntityExist(trailerRef) then
		Vehicles:Delete(trailerRef, function() end)
	end
	if truckRef and DoesEntityExist(truckRef) then
		Vehicles:Delete(truckRef, function() end)
	end
end

AddEventHandler("Labor:Server:Startup", function()
	Callbacks:RegisterServerCallback("Trucking:StartJob", function(source, data, cb)
		local joiner = _joiners[source]
		if joiner == nil or _Trucking[joiner] == nil then cb(false) return end
		if _Trucking[joiner].state ~= 0 then cb(false) return end
		_Trucking[joiner].state = 1
		Labor.Offers:Task(joiner, _JOB, "Get a truck and trailer from the manager")
		TriggerClientEvent(string.format("Trucking:Client:%s:Startup", joiner), -1)
		cb(true)
	end)

	Callbacks:RegisterServerCallback("Trucking:SpawnVehicles", function(source, data, cb)
		local joiner = _joiners[source]
		if joiner == nil or _Trucking[joiner] == nil then cb(false) return end
		if _Trucking[joiner].state ~= 1 then cb(false) return end
		if _Trucking[joiner].truck ~= nil then cb(false) return end

		local truckModel = _truckingTruckModels[data.truck] or _truckingTruckModels.phantom
		local trailerModel = _truckingTrailerModels[data.trailer] or _truckingTrailerModels.trailers

		Vehicles:SpawnTemp(source, truckModel, _truckingTruckSpawnPos, _truckingTruckSpawnHeading, function(truckVeh, truckVIN)
			Vehicles.Keys:Add(source, truckVIN)
			_Trucking[joiner].truck = truckVeh

			Vehicles:SpawnTemp(source, trailerModel, _truckingTrailerSpawnPos, _truckingTrailerSpawnHeading, function(trailerVeh, trailerVIN)
				_Trucking[joiner].trailer = trailerVeh

				local deliveryCount = math.random(1, 10)
				_Trucking[joiner].routes = pickDeliveryRoutes(deliveryCount)
				_Trucking[joiner].currentIndex = 1
				_Trucking[joiner].state = 3

				Labor.Offers:Start(joiner, _JOB, "Make deliveries", #_Trucking[joiner].routes)

				local routesForClient = {}
				for i, r in ipairs(_Trucking[joiner].routes) do
					routesForClient[i] = {
						coords = r.coords,
						heading = r.heading,
						locationName = r.locationName,
					}
				end
				TriggerClientEvent(string.format("Trucking:Client:%s:Deliveries", joiner), -1, routesForClient)
				cb(true)
			end)
		end)
	end)

	Callbacks:RegisterServerCallback("Trucking:CompleteDelivery", function(source, data, cb)
		local joiner = _joiners[source]
		if joiner == nil or _Trucking[joiner] == nil then cb(false) return end
		if _Trucking[joiner].state ~= 3 then cb(false) return end

		local idx = tonumber(data.routeIndex)
		if not idx or idx ~= _Trucking[joiner].currentIndex then cb(false) return end

		_Trucking[joiner].currentIndex = _Trucking[joiner].currentIndex + 1
		local routes = _Trucking[joiner].routes
		local nextIdx = _Trucking[joiner].currentIndex

		if nextIdx > #routes then
			_Trucking[joiner].state = 4
			Labor.Offers:Task(joiner, _JOB, "Return to manager")
			TriggerClientEvent(string.format("Trucking:Client:%s:AllDeliveriesDone", joiner), -1)
		else
			local nextRoute = routes[nextIdx]
			TriggerClientEvent(string.format("Trucking:Client:%s:NextDelivery", joiner), -1, nextIdx, {
				coords = nextRoute.coords,
				heading = nextRoute.heading,
				locationName = nextRoute.locationName,
			})
		end
		Labor.Offers:Update(joiner, _JOB, 1, true)
		cb(true)
	end)

	Callbacks:RegisterServerCallback("Trucking:ReturnTruck", function(source, data, cb)
		local joiner = _joiners[source]
		if joiner == nil or _Trucking[joiner] == nil then cb(false) return end
		if _Trucking[joiner].state ~= 4 then cb(false) return end
		if _Trucking[joiner].truck == nil then cb(false) return end

		local truckCoords = GetEntityCoords(_Trucking[joiner].truck)
		local dist = #(truckCoords - _truckingManagerCoords)
		if dist > 50.0 then
			Execute:Client(source, "Notification", "Error", "Bring the truck and trailer back to the depot")
			cb(false)
			return
		end

		local truckRef = _Trucking[joiner].truck
		local trailerRef = _Trucking[joiner].trailer
		_Trucking[joiner].truck = nil
		_Trucking[joiner].trailer = nil

		local function onReturnDone()
			_Trucking[joiner].state = 5
			TriggerClientEvent(string.format("Trucking:Client:%s:ReturnDone", joiner), -1)
			Labor.Offers:Task(joiner, _JOB, "Finish the job with the manager")
			cb(true)
		end

		if trailerRef and DoesEntityExist(trailerRef) then
			Vehicles:Delete(trailerRef, function()
				if truckRef and DoesEntityExist(truckRef) then
					Vehicles:Delete(truckRef, onReturnDone)
				else
					onReturnDone()
				end
			end)
		elseif truckRef and DoesEntityExist(truckRef) then
			Vehicles:Delete(truckRef, onReturnDone)
		else
			onReturnDone()
		end
	end)

	Callbacks:RegisterServerCallback("Trucking:TurnIn", function(source, data, cb)
		local joiner = _joiners[source]
		if joiner == nil or _Trucking[joiner] == nil then cb(false) return end
		if _Trucking[joiner].state ~= 5 then cb(false) return end
		local char = Fetch:Source(source):GetData("Character")
		if char and char:GetData("TempJob") == _JOB then
			Labor.Offers:ManualFinish(joiner, _JOB)
			cb(true)
		else
			Execute:Client(source, "Notification", "Error", "Unable to finish job")
			cb(false)
		end
	end)
end)

AddEventHandler("Trucking:Server:OnDuty", function(joiner, members, isWorkgroup)
	_joiners[joiner] = joiner
	_Trucking[joiner] = {
		state = 0,
		truck = nil,
		trailer = nil,
		routes = {},
		currentIndex = 1,
	}
	local char = Fetch:Source(joiner):GetData("Character")
	char:SetData("TempJob", _JOB)
	Phone.Notification:Add(joiner, "Labor Activity", "You started a job", os.time() * 1000, 6000, "labor", {})
	TriggerClientEvent("Trucking:Client:OnDuty", joiner, joiner, os.time())
	Labor.Offers:Task(joiner, _JOB, "Go to the trucking manager")
	if #members > 0 then
		for _, v in ipairs(members) do
			_joiners[v.ID] = joiner
			local member = Fetch:Source(v.ID):GetData("Character")
			member:SetData("TempJob", _JOB)
			Phone.Notification:Add(v.ID, "Labor Activity", "You started a job", os.time() * 1000, 6000, "labor", {})
			TriggerClientEvent("Trucking:Client:OnDuty", v.ID, joiner, os.time())
		end
	end
end)

AddEventHandler("Trucking:Server:OffDuty", function(source, joiner)
	local j = _joiners[source]
	if j and _Trucking[j] then
		deleteJobVehicles(j)
		_Trucking[j] = nil
	end
	_joiners[source] = nil
	TriggerClientEvent("Trucking:Client:OffDuty", source)
end)

AddEventHandler("Trucking:Server:CancelJob", function(joiner)
	if _Trucking[joiner] then
		deleteJobVehicles(joiner)
		_Trucking[joiner] = nil
	end
end)

AddEventHandler("Trucking:Server:FinishJob", function(joiner)
	_Trucking[joiner] = nil
end)
