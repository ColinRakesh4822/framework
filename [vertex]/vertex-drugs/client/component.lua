AddEventHandler("Drugs:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
	Inventory = exports["vertex-base"]:FetchComponent("Inventory")
	Targeting = exports["vertex-base"]:FetchComponent("Targeting")
	Progress = exports["vertex-base"]:FetchComponent("Progress")
	Hud = exports["vertex-base"]:FetchComponent("Hud")
	Notification = exports["vertex-base"]:FetchComponent("Notification")
	ObjectPlacer = exports["vertex-base"]:FetchComponent("ObjectPlacer")
	Minigame = exports["vertex-base"]:FetchComponent("Minigame")
	ListMenu = exports["vertex-base"]:FetchComponent("ListMenu")
	PedInteraction = exports["vertex-base"]:FetchComponent("PedInteraction")
	Polyzone = exports["vertex-base"]:FetchComponent("Polyzone")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Drugs", {
        "Callbacks",
        "Inventory",
        "Targeting",
        "Progress",
        "Hud",
        "Notification",
        "ObjectPlacer",
		"Minigame",
		"ListMenu",
		"PedInteraction",
		"Polyzone",
	}, function(error)
		if #error > 0 then 
            exports["vertex-base"]:FetchComponent("Logger"):Critical("Drugs", "Failed To Load All Dependencies")
			return
		end
		RetrieveComponents()

        TriggerEvent("Drugs:Client:Startup")
	end)
end)