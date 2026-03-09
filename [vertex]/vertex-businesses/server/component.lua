_pickups = {}

AddEventHandler("Businesses:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Fetch = exports["vertex-base"]:FetchComponent("Fetch")
	Utils = exports["vertex-base"]:FetchComponent("Utils")
    Execute = exports["vertex-base"]:FetchComponent("Execute")
	Database = exports["vertex-base"]:FetchComponent("Database")
	Middleware = exports["vertex-base"]:FetchComponent("Middleware")
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
    Chat = exports["vertex-base"]:FetchComponent("Chat")
	Logger = exports["vertex-base"]:FetchComponent("Logger")
	Generator = exports["vertex-base"]:FetchComponent("Generator")
	Phone = exports["vertex-base"]:FetchComponent("Phone")
	Jobs = exports["vertex-base"]:FetchComponent("Jobs")
	Vehicles = exports["vertex-base"]:FetchComponent("Vehicles")
    Inventory = exports["vertex-base"]:FetchComponent("Inventory")
	Wallet = exports["vertex-base"]:FetchComponent("Wallet")
	Crafting = exports["vertex-base"]:FetchComponent("Crafting")
	Banking = exports["vertex-base"]:FetchComponent("Banking")
	MDT = exports["vertex-base"]:FetchComponent("MDT")
	Laptop = exports["vertex-base"]:FetchComponent("Laptop")
	StorageUnits = exports["vertex-base"]:FetchComponent("StorageUnits")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Businesses", {
		"Fetch",
		"Utils",
        "Execute",
        "Chat",
		"Database",
		"Middleware",
		"Callbacks",
		"Logger",
		"Generator",
		"Phone",
		"Jobs",
		"Vehicles",
        "Inventory",
		"Wallet",
		"Crafting",
		"Banking",
		"MDT",
		"StorageUnits",
		"Laptop",
	}, function(error)
		if #error > 0 then 
            exports["vertex-base"]:FetchComponent("Logger"):Critical("Businesses", "Failed To Load All Dependencies")
			return
		end
		RetrieveComponents()

        TriggerEvent("Businesses:Server:Startup")

		Middleware:Add("Characters:Spawning", function(source)
			TriggerClientEvent("Businesses:Client:CreatePoly", source, _pickups)
		end, 2)

		Startup()
	end)
end)

function Startup()
	for k, v in ipairs(Config.Businesses) do
		Logger:Trace("Businesses", string.format("Registering Business ^3%s^7", v.Name))
		if v.Benches then
			for benchId, bench in pairs(v.Benches) do
				Logger:Trace("Businesses", string.format("Registering Crafting Bench ^2%s^7 For ^3%s^7", bench.label, v.Name))

				if bench.targeting.manual then
					Crafting:RegisterBench(string.format("%s-%s", v.Job, benchId), bench.label, bench.targeting, {}, {
						job = {
							id = v.Job,
							onDuty = true,
						},
					}, bench.recipes)
				else
					Crafting:RegisterBench(string.format("%s-%s", k, benchId), bench.label, bench.targeting, {
						x = 0,
						y = 0,
						z = bench.targeting.poly.coords.z,
						h = bench.targeting.poly.options.heading,
					}, {
						job = {
							id = v.Job,
							onDuty = true,
						},
					}, bench.recipes)
				end
			end
		end

		if v.Storage then
			for _, storage in pairs(v.Storage) do
				Logger:Trace("Businesses", string.format("Registering Poly Inventory ^2%s^7 For ^3%s^7", storage.id, v.Name))
				Inventory.Poly:Create(storage)
			end
		end

		if v.Pickups then
			for num, pickup in pairs(v.Pickups) do
				table.insert(_pickups, pickup.id)
				pickup.num = num
				pickup.job = v.Job
				pickup.jobName = v.Name
				GlobalState[string.format("Businesses:Pickup:%s", pickup.id)] = pickup
			end
		end
	end
end
