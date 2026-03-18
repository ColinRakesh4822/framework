local _joiner = nil
local _working = false
local _blip = nil
local _deliveryBlip = nil
local _state = 0
local eventHandlers = {}
local _deliveryPeds = {}
local _currentRouteIndex = 1
local _routes = {}
local _managerCoords = vector3(582.232, -2722.855, 6.187)
local _managerHeading = 180.0

local _constructionModels = {
	`s_m_y_construct_01`,
	`s_m_y_construct_02`,
}

local function DeleteWaypoint()
	SetWaypointOff()
end

local function SetWaypointTo(coords)
	DeleteWaypoint()
	SetNewWaypoint(coords.x, coords.y)
end

local function SpawnDeliveryPed(coords, heading, routeIndex)
	local model = _constructionModels[math.random(#_constructionModels)]
	RequestModel(model)
	while not HasModelLoaded(model) do
		Wait(10)
	end
	local ped = CreatePed(5, model, coords.x, coords.y, coords.z - 1.0, heading or 0.0, false, false)
	SetEntityAsMissionEntity(ped, true, true)
	FreezeEntityPosition(ped, true)
	SetBlockingOfNonTemporaryEvents(ped, true)
	SetEntityInvincible(ped, true)
	SetPedCanRagdoll(ped, false)
	SetModelAsNoLongerNeeded(model)
	Targeting:AddPed(ped, "truck", {
		{
			icon = "box",
			text = "Deliver",
			event = "Trucking:Client:Deliver",
			data = "Trucking",
			isEnabled = function()
				return _working and _state == 3
			end,
		},
	}, 3.0)
	_deliveryPeds[routeIndex] = ped
	return ped
end

local function RemoveDeliveryPed(routeIndex)
	if _deliveryPeds[routeIndex] and DoesEntityExist(_deliveryPeds[routeIndex]) then
		Targeting:RemovePed(_deliveryPeds[routeIndex])
		DeleteEntity(_deliveryPeds[routeIndex])
		_deliveryPeds[routeIndex] = nil
	end
end

local function ClearAllDeliveryPeds()
	for k, ped in pairs(_deliveryPeds) do
		if DoesEntityExist(ped) then
			Targeting:RemovePed(ped)
			DeleteEntity(ped)
		end
	end
	_deliveryPeds = {}
end

AddEventHandler("Labor:Client:Setup", function()
	PedInteraction:Add("TruckingManager", `s_m_y_construct_02`, _managerCoords, _managerHeading, 25.0, {
		{
			icon = "clipboard-list",
			text = "Start Job",
			event = "Trucking:Client:StartJob",
			tempjob = "Trucking",
			isEnabled = function()
				return _working and _state == 1
			end,
		},
		{
			icon = "truck",
			text = "Get Truck and Trailer",
			event = "Trucking:Client:GetTruck",
			tempjob = "Trucking",
			isEnabled = function()
				return _working and _state == 2
			end,
		},
		{
			icon = "truck",
			text = "Return Truck and Trailer",
			event = "Trucking:Client:ReturnTruck",
			tempjob = "Trucking",
			isEnabled = function()
				return _working and _state == 4
			end,
		},
		{
			icon = "check",
			text = "Finish Job",
			event = "Trucking:Client:FinishJob",
			tempjob = "Trucking",
			isEnabled = function()
				return _working and _state == 5
			end,
		},
	}, "truck")
end)

AddEventHandler("Trucking:Client:SpawnVehiclesFromUI", function(data)
	local truckId = type(data) == "table" and data.truck or data
	local trailerId = type(data) == "table" and data.trailer or "trailers"
	Callbacks:ServerCallback("Trucking:SpawnVehicles", { truck = truckId, trailer = trailerId }, function(success)
		if not success then
			Notification:Error("Could not spawn truck and trailer")
		end
	end)
end)

AddEventHandler("Trucking:Client:StartJob", function()
	Callbacks:ServerCallback("Trucking:StartJob", _joiner, function(success)
		if not success then
			Notification:Error("Unable to start job")
		end
	end)
end)

AddEventHandler("Trucking:Client:GetTruck", function()
	ListMenu:Show({
		main = {
			label = "Truck & Trailer",
			items = {
				{ label = "Phantom", description = "Heavy duty for long hauls", event = "Trucking:Client:SpawnVehiclesFromUI", data = { truck = "phantom", trailer = "trailers" } },
				{ label = "Hauler",  description = "Reliable workhorse",        event = "Trucking:Client:SpawnVehiclesFromUI", data = { truck = "hauler", trailer = "trailers" } },
				{ label = "Packer",  description = "Classic American rig",      event = "Trucking:Client:SpawnVehiclesFromUI", data = { truck = "packer", trailer = "trailers" } },
			},
		},
	})
end)

AddEventHandler("Trucking:Client:ReturnTruck", function()
	Callbacks:ServerCallback("Trucking:ReturnTruck", _joiner, function(success)
		if not success then
			Notification:Error("Could not return truck. Bring it back here.")
		end
	end)
end)

AddEventHandler("Trucking:Client:FinishJob", function()
	Callbacks:ServerCallback("Trucking:TurnIn", _joiner, function(success)
		if not success then
			Notification:Error("Unable to finish job")
		end
	end)
end)

AddEventHandler("Trucking:Client:Deliver", function(entityData, data)
	local targetEntity = (entityData and entityData.entity) or nil
	local routeIdx = nil
	if targetEntity and DoesEntityExist(targetEntity) then
		for idx, p in pairs(_deliveryPeds) do
			if p == targetEntity then
				routeIdx = idx
				break
			end
		end
	end
	if not routeIdx then return end
	Callbacks:ServerCallback("Trucking:CompleteDelivery", { routeIndex = routeIdx }, function(success)
		if success then
			RemoveDeliveryPed(routeIdx)
			if _deliveryBlip then
				Blips:Remove("TruckingDelivery")
				_deliveryBlip = nil
			end
		else
			Notification:Error("Delivery failed")
		end
	end)
end)

RegisterNetEvent("Trucking:Client:OnDuty", function(joiner, time)
	_joiner = joiner
	_working = true
	_state = 1
	DeleteWaypoint()
	SetWaypointTo(_managerCoords)
	_blip = Blips:Add("TruckingManager", "Trucking Manager", { x = _managerCoords.x, y = _managerCoords.y, z = 0 }, 67, 2,
		1.4)

	eventHandlers["startup"] = RegisterNetEvent(string.format("Trucking:Client:%s:Startup", joiner), function()
		_state = 2
	end)

	eventHandlers["deliveries"] = RegisterNetEvent(string.format("Trucking:Client:%s:Deliveries", joiner),
		function(routes)
			_routes = routes or {}
			_currentRouteIndex = 1
			_state = 3
			ClearAllDeliveryPeds()
			if #_routes > 0 then
				local first = _routes[1]
				SetWaypointTo(first.coords)
				if _deliveryBlip then Blips:Remove("TruckingDelivery") end
				_deliveryBlip = Blips:Add("TruckingDelivery", "Delivery Location",
					{ x = first.coords.x, y = first.coords.y, z = first.coords.z }, 477, 5, 0.9)
				SpawnDeliveryPed(first.coords, first.heading or 0.0, 1)
			end
		end)

	eventHandlers["nextDelivery"] = RegisterNetEvent(string.format("Trucking:Client:%s:NextDelivery", joiner),
		function(routeIndex, route)
			_currentRouteIndex = routeIndex
			if route then
				SetWaypointTo(route.coords)
				if _deliveryBlip then Blips:Remove("TruckingDelivery") end
				_deliveryBlip = Blips:Add("TruckingDelivery", "Delivery Location",
					{ x = route.coords.x, y = route.coords.y, z = route.coords.z }, 477, 5, 0.9)
				SpawnDeliveryPed(route.coords, route.heading or 0.0, routeIndex)
			end
		end)

	eventHandlers["allDeliveriesDone"] = RegisterNetEvent(string.format("Trucking:Client:%s:AllDeliveriesDone", joiner),
		function()
			ClearAllDeliveryPeds()
			if _deliveryBlip then
				Blips:Remove("TruckingDelivery")
				_deliveryBlip = nil
			end
			_state = 4
			DeleteWaypoint()
			SetWaypointTo(_managerCoords)
		end)

	eventHandlers["returnDone"] = RegisterNetEvent(string.format("Trucking:Client:%s:ReturnDone", joiner), function()
		_state = 5
	end)
end)

RegisterNetEvent("Trucking:Client:OffDuty", function()
	for _, h in pairs(eventHandlers) do
		RemoveEventHandler(h)
	end
	eventHandlers = {}
	ClearAllDeliveryPeds()
	if _blip then
		Blips:Remove("TruckingManager")
		_blip = nil
	end
	if _deliveryBlip then
		Blips:Remove("TruckingDelivery")
		_deliveryBlip = nil
	end
	DeleteWaypoint()
	_joiner = nil
	_working = false
	_state = 0
	_routes = {}
	_currentRouteIndex = 1
	_deliveryPeds = {}
end)
