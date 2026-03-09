AddEventHandler("Robbery:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Logger = exports["vertex-base"]:FetchComponent("Logger")
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
	PedInteraction = exports["vertex-base"]:FetchComponent("PedInteraction")
	Progress = exports["vertex-base"]:FetchComponent("Progress")
	Phone = exports["vertex-base"]:FetchComponent("Phone")
	Notification = exports["vertex-base"]:FetchComponent("Notification")
	Polyzone = exports["vertex-base"]:FetchComponent("Polyzone")
	Targeting = exports["vertex-base"]:FetchComponent("Targeting")
	Progress = exports["vertex-base"]:FetchComponent("Progress")
	Minigame = exports["vertex-base"]:FetchComponent("Minigame")
	Keybinds = exports["vertex-base"]:FetchComponent("Keybinds")
	Properties = exports["vertex-base"]:FetchComponent("Properties")
	Sounds = exports["vertex-base"]:FetchComponent("Sounds")
	Interaction = exports["vertex-base"]:FetchComponent("Interaction")
	Inventory = exports["vertex-base"]:FetchComponent("Inventory")
	Action = exports["vertex-base"]:FetchComponent("Action")
	Blips = exports["vertex-base"]:FetchComponent("Blips")
	EmergencyAlerts = exports["vertex-base"]:FetchComponent("EmergencyAlerts")
	Doors = exports["vertex-base"]:FetchComponent("Doors")
	ListMenu = exports["vertex-base"]:FetchComponent("ListMenu")
	Input = exports["vertex-base"]:FetchComponent("Input")
	Game = exports["vertex-base"]:FetchComponent("Game")
	NetSync = exports["vertex-base"]:FetchComponent("NetSync")
	Damage = exports["vertex-base"]:FetchComponent("Damage")
	Lasers = exports["vertex-base"]:FetchComponent("Lasers")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Robbery", {
		"Logger",
		"Callbacks",
		"PedInteraction",
		"Progress",
		"Phone",
		"Notification",
		"Polyzone",
		"Targeting",
		"Progress",
		"Minigame",
		"Keybinds",
		"Properties",
		"Sounds",
		"Interaction",
		"Inventory",
		"Action",
		"Blips",
		"EmergencyAlerts",
		"Doors",
		"ListMenu",
		"Input",
		"Game",
		"NetSync",
		"Damage",
		"Lasers",
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveComponents()
		RegisterGamesCallbacks()
		TriggerEvent("Robbery:Client:Setup")

		CreateThread(function()
			PedInteraction:Add(
				"RobToolsPickup",
				GetHashKey("csb_anton"),
				vector3(393.724, -831.028, 28.292),
				228.358,
				25.0,
				{
					{
						icon = "hand",
						text = "Pickup Items",
						event = "Robbery:Client:PickupItems",
					},
				},
				"box-dollar"
			)
		end)
	end)
end)

AddEventHandler("Robbery:Client:PickupItems", function()
	Callbacks:ServerCallback("Robbery:Pickup", {})
end)

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["vertex-base"]:RegisterComponent("Robbery", _ROBBERY)
end)

RegisterNetEvent("Robbery:Client:State:Init", function(states)
	_bankStates = states

	for k, v in pairs(states) do
		TriggerEvent(string.format("Robbery:Client:Update:%s", k))
	end
end)

RegisterNetEvent("Robbery:Client:State:Set", function(bank, state)
	_bankStates[bank] = state
	TriggerEvent(string.format("Robbery:Client:Update:%s", bank))
end)

RegisterNetEvent("Robbery:Client:State:Update", function(bank, key, value, tableId)
	if tableId then
		_bankStates[bank][tableId] = _bankStates[bank][tableId] or {}
		_bankStates[bank][tableId][key] = value
	else
		_bankStates[bank][key] = value
	end
	TriggerEvent(string.format("Robbery:Client:Update:%s", bank))
end)

AddEventHandler("Robbery:Client:Holdup:Do", function(entity, data)
	Progress:ProgressWithTickEvent({
		name = "holdup",
		duration = 5000,
		label = "Robbing",
		useWhileDead = false,
		canCancel = true,
		ignoreModifier = true,
		controlDisables = {
			disableMovement = true,
			disableCarMovement = true,
			disableMouse = false,
			disableCombat = true,
		},
		animation = {
			animDict = "random@shop_robbery",
			anim = "robbery_action_b",
			flags = 49,
		},
	}, function()
		if
			#(
				GetEntityCoords(LocalPlayer.state.ped)
				- GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(entity.serverId)))
			) <= 3.0
		then
			return
		end
		Progress:Cancel()
	end, function(cancelled)
		if not cancelled then
			Callbacks:ServerCallback("Robbery:Holdup:Do", entity.serverId, function(s)
				Inventory.Dumbfuck:Open(s)

				while not LocalPlayer.state.inventoryOpen do
					Wait(1)
				end

				CreateThread(function()
					while LocalPlayer.state.inventoryOpen do
						if
							#(
								GetEntityCoords(LocalPlayer.state.ped)
								- GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(entity.serverId)))
							) > 3.0
						then
							Inventory.Close:All()
						end
						Wait(2)
					end
				end)
			end)
		end
	end)
end)

_ROBBERY = {}
