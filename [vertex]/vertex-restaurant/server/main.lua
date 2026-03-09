AddEventHandler("Restaurant:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Database = exports["vertex-base"]:FetchComponent("Database")
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
	Middleware = exports["vertex-base"]:FetchComponent("Middleware")
	Logger = exports["vertex-base"]:FetchComponent("Logger")
	Fetch = exports["vertex-base"]:FetchComponent("Fetch")
	Inventory = exports["vertex-base"]:FetchComponent("Inventory")
	Crafting = exports["vertex-base"]:FetchComponent("Crafting")
	Jobs = exports["vertex-base"]:FetchComponent("Jobs")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Restaurant", {
		"Database",
		"Callbacks",
		"Middleware",
		"Logger",
		"Fetch",
		"Inventory",
		"Crafting",
		"Jobs",
	}, function(error)
		if error then
		end

		RetrieveComponents()
		Startup()

		Middleware:Add("Characters:Spawning", function(source)
			RunRestaurantJobUpdate(source, true)
		end, 2)
	end)
end)

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["vertex-base"]:RegisterComponent("Restaurant", _RESTAURANT)
end)

_RESTAURANT = {}

function RunRestaurantJobUpdate(source, onSpawn)
	local charJobs = Jobs.Permissions:GetJobs(source)
	local warmersList = {}
	for k, v in ipairs(charJobs) do
		local jobWarmers = _warmers[v.Id]
		if jobWarmers then
			table.insert(warmersList, jobWarmers)
		end
	end
	TriggerClientEvent(
		"Restaurant:Client:CreatePoly",
		source,
		_pickups,
		warmersList,
		onSpawn
	)
end

AddEventHandler('Jobs:Server:JobUpdate', function(source)
	RunRestaurantJobUpdate(source)
end)