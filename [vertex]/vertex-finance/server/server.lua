AddEventHandler("Finance:Shared:DependencyUpdate", RetrieveComponents)
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
	Crypto = exports["vertex-base"]:FetchComponent("Crypto")
    Banking = exports["vertex-base"]:FetchComponent("Banking")
	Billing = exports["vertex-base"]:FetchComponent("Billing")
	Loans = exports["vertex-base"]:FetchComponent("Loans")
    Wallet = exports["vertex-base"]:FetchComponent("Wallet")
	Tasks = exports["vertex-base"]:FetchComponent("Tasks")
	Jobs = exports["vertex-base"]:FetchComponent("Jobs")
	Vehicles = exports["vertex-base"]:FetchComponent("Vehicles")
	Inventory = exports["vertex-base"]:FetchComponent("Inventory")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Finance", {
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
        "Wallet",
        "Banking",
		"Billing",
		"Loans",
		"Crypto",
		"Jobs",
		"Tasks",
		"Vehicles",
		"Inventory",
	}, function(error)
		if #error > 0 then
			exports["vertex-base"]:FetchComponent("Logger"):Critical("Finance", "Failed To Load All Dependencies")
			return
		end
		RetrieveComponents()

		TriggerEvent('Finance:Server:Startup')
	end)
end)