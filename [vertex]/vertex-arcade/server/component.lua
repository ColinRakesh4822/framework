AddEventHandler("Arcade:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Fetch = exports["vertex-base"]:FetchComponent("Fetch")
	Database = exports["vertex-base"]:FetchComponent("Database")
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
	Logger = exports["vertex-base"]:FetchComponent("Logger")
	Chat = exports["vertex-base"]:FetchComponent("Chat")
	Middleware = exports["vertex-base"]:FetchComponent("Middleware")
	Execute = exports["vertex-base"]:FetchComponent("Execute")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Arcade", {
		"Fetch",
		"Database",
		"Callbacks",
		"Logger",
		"Chat",
		"Middleware",
		"Execute",
	}, function(error)
		if #error > 0 then
			return
		end -- Do something to handle if not all dependencies loaded
		RetrieveComponents()
        
        Callbacks:RegisterServerCallback("Arcade:Open", function(source, data, cb)
            local plyr = Fetch:Source(source)
            if plyr ~= nil then
                local char = plyr:GetData("Character")
                if char ~= nil then
                    if Player(source).state.onDuty == "avast_arcade" then
                        GlobalState["Arcade:Open"] = true
                    end
                end
            end
        end)
        
        Callbacks:RegisterServerCallback("Arcade:Close", function(source, data, cb)
            local plyr = Fetch:Source(source)
            if plyr ~= nil then
                local char = plyr:GetData("Character")
                if char ~= nil then
                    if Player(source).state.onDuty == "avast_arcade" then
                        GlobalState["Arcade:Open"] = false
                    end
                end
            end
        end)
	end)
end)