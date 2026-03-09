AddEventHandler("Labor:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Logger = exports["vertex-base"]:FetchComponent("Logger")
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
	Game = exports["vertex-base"]:FetchComponent("Game")
	Phone = exports["vertex-base"]:FetchComponent("Phone")
	PedInteraction = exports["vertex-base"]:FetchComponent("PedInteraction")
	Interaction = exports["vertex-base"]:FetchComponent("Interaction")
	Progress = exports["vertex-base"]:FetchComponent("Progress")
	Minigame = exports["vertex-base"]:FetchComponent("Minigame")
	Notification = exports["vertex-base"]:FetchComponent("Notification")
	ListMenu = exports["vertex-base"]:FetchComponent("ListMenu")
	Blips = exports["vertex-base"]:FetchComponent("Blips")
	Polyzone = exports["vertex-base"]:FetchComponent("Polyzone")
	Targeting = exports["vertex-base"]:FetchComponent("Targeting")
	Hud = exports["vertex-base"]:FetchComponent("Hud")
	Inventory = exports["vertex-base"]:FetchComponent("Inventory")
	EmergencyAlerts = exports["vertex-base"]:FetchComponent("EmergencyAlerts")
	Status = exports["vertex-base"]:FetchComponent("Status")
	Labor = exports["vertex-base"]:FetchComponent("Labor")
	Sounds = exports["vertex-base"]:FetchComponent("Sounds")
	Properties = exports["vertex-base"]:FetchComponent("Properties")
	Action = exports["vertex-base"]:FetchComponent("Action")
	Sync = exports["vertex-base"]:FetchComponent("Sync")
	Confirm = exports["vertex-base"]:FetchComponent("Confirm")
	Utils = exports["vertex-base"]:FetchComponent("Utils")
	Keybinds = exports["vertex-base"]:FetchComponent("Keybinds")
	Reputation = exports["vertex-base"]:FetchComponent("Reputation")
	NetSync = exports["vertex-base"]:FetchComponent("NetSync")
	Vehicles = exports["vertex-base"]:FetchComponent("Vehicles")
	Animations = exports["vertex-base"]:FetchComponent("Animations")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Labor", {
		"Logger",
		"Callbacks",
		"Game",
		"Phone",
		"PedInteraction",
		"Interaction",
		"Progress",
		"Minigame",
		"Notification",
		"ListMenu",
		"Blips",
		"Polyzone",
		"Targeting",
		"Hud",
		"Inventory",
		"EmergencyAlerts",
		"Status",
		"Labor",
		"Sounds",
		"Properties",
		"Action",
		"Sync",
		"Confirm",
		"Utils",
		"Keybinds",
		"Reputation",
		"NetSync",
		"Vehicles",
		"Animations",
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveComponents()
		TriggerEvent("Labor:Client:Setup")
	end)
end)

function Draw3DText(x, y, z, text)
	local onScreen, _x, _y = World3dToScreen2d(x, y, z)
	local px, py, pz = table.unpack(GetGameplayCamCoords())

	SetTextScale(0.25, 0.25)
	SetTextFont(4)
	SetTextProportional(1)
	SetTextColour(255, 255, 255, 245)
	SetTextOutline(true)
	SetTextEntry("STRING")
	SetTextCentre(1)
	AddTextComponentString(text)
	DrawText(_x, _y)
end

function PedFaceCoord(pPed, pCoords)
	TaskTurnPedToFaceCoord(pPed, pCoords.x, pCoords.y, pCoords.z)

	Wait(100)

	while GetScriptTaskStatus(pPed, 0x574bb8f5) == 1 do
		Wait(0)
	end
end

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["vertex-base"]:RegisterComponent("Labor", LABOR)
end)

AddEventHandler("Labor:Client:AcceptRequest", function(data)
	Callbacks:ServerCallback("Labor:AcceptRequest", data)
end)

AddEventHandler("Labor:Client:DeclineRequest", function(data)
	Callbacks:ServerCallback("Labor:DeclineRequest", data)
end)

LABOR = {
	Get = {
		Jobs = function(self)
			local p = promise.new()
			Callbacks:ServerCallback("Labor:GetJobs", {}, function(jobs)
				p:resolve(jobs)
			end)
			return Citizen.Await(p)
		end,
		Groups = function(self)
			local p = promise.new()
			Callbacks:ServerCallback("Labor:GetGroups", {}, function(groups)
				p:resolve(groups)
			end)
			return Citizen.Await(p)
		end,
		Reputations = function(self)
			local p = promise.new()
			Callbacks:ServerCallback("Labor:GetReputations", {}, function(jobs)
				p:resolve(jobs)
			end)
			return Citizen.Await(p)
		end,
	},
}
