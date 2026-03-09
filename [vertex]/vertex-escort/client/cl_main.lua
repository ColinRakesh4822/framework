AddEventHandler("Escort:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
	Utils = exports["vertex-base"]:FetchComponent("Utils")
	Logger = exports["vertex-base"]:FetchComponent("Logger")
	Game = exports["vertex-base"]:FetchComponent("Game")
	Stream = exports["vertex-base"]:FetchComponent("Stream")
	Keybinds = exports["vertex-base"]:FetchComponent("Keybinds")
	Notification = exports["vertex-base"]:FetchComponent("Notification")
	Targeting = exports["vertex-base"]:FetchComponent("Targeting")
	Progress = exports["vertex-base"]:FetchComponent("Progress")
	Hud = exports["vertex-base"]:FetchComponent("Hud")
	Escort = exports["vertex-base"]:FetchComponent("Escort")
	Vehicles = exports["vertex-base"]:FetchComponent("Vehicles")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Escort", {
		"Callbacks",
		"Utils",
		"Logger",
		"Game",
		"Stream",
		"Keybinds",
		"Notification",
		"Targeting",
		"Progress",
		"Hud",
		"Escort",
		"Vehicles",
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveComponents()

		Keybinds:Add("escort", "k", "keyboard", "Escort", function()
			DoEscort()
		end)

		Callbacks:RegisterClientCallback("Escort:StopEscort", function(data, cb)
			DetachEntity(LocalPlayer.state.ped, true, true)
			cb(true)
		end)
	end)
end)

ESCORT = {
	DoEscort = function(self, target, tPlayer)
		if target ~= nil then
			Callbacks:ServerCallback("Escort:DoEscort", {
				target = target,
				inVeh = IsPedInAnyVehicle(GetPlayerPed(tPlayer))
			}, function(state)
				if state then
					StartEscortThread(tPlayer)
				end
			end)
		end
	end,
	StopEscort = function(self)
		Callbacks:ServerCallback("Escort:StopEscort", function()

		end)
	end,
}

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["vertex-base"]:RegisterComponent("Escort", ESCORT)
end)

AddEventHandler('Interiors:Exit', function()
	if LocalPlayer.state.isEscorting ~= nil then
		Escort:StopEscort()
	end
end)

--[[ TODO 
Add Dragging When Dead 
Place In vehicle while Dead Slump Animation
Police Drag Maybe Cuff Also
Get In Trunk or Place in trunk???
]]
