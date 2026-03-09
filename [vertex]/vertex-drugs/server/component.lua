_DRUGS = _DRUGS or {}
local _addictionTemplate = {
	Meth = {
		LastUse = false,
		Factor = 0.0,
	},
	Coke = {
		LastUse = false,
		Factor = 0.0,
	},
}

AddEventHandler("Drugs:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Fetch = exports["vertex-base"]:FetchComponent("Fetch")
	Logger = exports["vertex-base"]:FetchComponent("Logger")
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
	Middleware = exports["vertex-base"]:FetchComponent("Middleware")
	Execute = exports["vertex-base"]:FetchComponent("Execute")
	Chat = exports["vertex-base"]:FetchComponent("Chat")
	Inventory = exports["vertex-base"]:FetchComponent("Inventory")
	Crypto = exports["vertex-base"]:FetchComponent("Crypto")
	Vehicles = exports["vertex-base"]:FetchComponent("Vehicles")
	Drugs = exports["vertex-base"]:FetchComponent("Drugs")
	Vendor = exports["vertex-base"]:FetchComponent("Vendor")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Drugs", {
        "Fetch",
        "Logger",
        "Callbacks",
        "Middleware",
        "Execute",
        "Chat",
        "Inventory",
        "Crypto",
        "Vehicles",
        "Drugs",
		"Vendor",
	}, function(error)
		if #error > 0 then 
            exports["vertex-base"]:FetchComponent("Logger"):Critical("Drugs", "Failed To Load All Dependencies")
			return
		end
		RetrieveComponents()
        RegisterItemUse()
        RunDegenThread()

		Middleware:Add("Characters:Spawning", function(source)
            local plyr = Fetch:Source(source)
            if plyr ~= nil then
                local char = plyr:GetData("Character")
                if char ~= nil then
                    if char:GetData("Addiction") == nil then
                        char:SetData("Addiction", _addictionTemplate)
                    end
                end
            end
		end, 1)

        TriggerEvent("Drugs:Server:Startup")
	end)
end)

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["vertex-base"]:RegisterComponent("Drugs", _DRUGS)
end)