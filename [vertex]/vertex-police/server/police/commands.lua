local _911Cds = {}
local _311Cds = {}

function RegisterCommands()
	Chat:RegisterCommand("911", function(source, args, rawCommand)
		if #rawCommand:sub(4) > 0 then
			if not Player(source).state.isCuffed and not Player(source).state.isDead then
				if _911Cds[source] == nil or os.time() >= _911Cds[source] then
					Chat.Send.Services:Emergency(source, rawCommand:sub(4))
					_911Cds[source] = os.time() + (60 * 1)
					TriggerClientEvent("Animations:Client:DoPDCallEmote", source)
				else
					Chat.Send.System:Single(source, "You've Called 911 Recently")
				end
			else
				Chat.Send.System:Single(source, "You Find It Difficult To Call 911")
			end
		end
	end, {
		help = "Make 911 Call",
		params = {
			{
				name = "Message",
				help = "The Message You Want To Send To 911",
			},
		},
	}, -1)

	Chat:RegisterCommand("911a", function(source, args, rawCommand)
		if #rawCommand:sub(5) > 0 then
			if not Player(source).state.isCuffed and not Player(source).state.isDead then
				if _911Cds[source] == nil or os.time() >= _911Cds[source] then
					Chat.Send.Services:EmergencyAnonymous(source, rawCommand:sub(5))
					_911Cds[source] = os.time() + (60 * 1)
					TriggerClientEvent("Animations:Client:DoPDCallEmote", source)
				else
					Chat.Send.System:Single(source, "You've Called 911 Recently")
				end
			else
				Chat.Send.System:Single(source, "You Find It Difficult To Call 911")
			end
		end
	end, {
		help = "Make Anonymous 911 Call",
		params = {
			{
				name = "Message",
				help = "The Message You Want To Send To 911",
			},
		},
	}, -1)

	Chat:RegisterCommand(
		"911r",
		function(source, args, rawCommand)
			if tonumber(args[1]) then
				local target = Fetch:SID(tonumber(args[1]))
				if target ~= nil then
					Chat.Send.Services:EmergencyRespond(source, target:GetData("Source"), args[2])
				else
					Chat.Send.System:Single(source, "Invalid Target 2")
				end
			else
				Chat.Send.System:Single(source, "Invalid Target 1")
			end
		end,
		{
			help = "Respond To 911 Caller",
			params = {
				{
					name = "Target",
					help = "State ID of the person you want to reply to",
				},
				{
					name = "Message",
					help = "[WRAP IN QUOTES] Message you want to send",
				},
			},
		},
		2,
		{
			{
				Id = "police",
			},
			{
				Id = "ems",
			},
		}
	)

	Chat:RegisterCommand("311", function(source, args, rawCommand)
		if #rawCommand:sub(4) > 0 then
			if not Player(source).state.isCuffed and not Player(source).state.isDead then
				if _311Cds[source] == nil or os.time() >= _311Cds[source] then
					Chat.Send.Services:NonEmergency(source, rawCommand:sub(4))
					_311Cds[source] = os.time() + (60 * 1)
					TriggerClientEvent("Animations:Client:DoPDCallEmote", source)
				else
					Chat.Send.System:Single(source, "You've Called 311 Recently")
				end
			else
				Chat.Send.System:Single(source, "You Find It Difficult To Call 311")
			end
		end
	end, {
		help = "Make 311 Call",
		params = {
			{
				name = "Message",
				help = "The Message You Want To Send To 311",
			},
		},
	}, -1)

	Chat:RegisterCommand("311a", function(source, args, rawCommand)
		if #rawCommand:sub(5) > 0 then
			if not Player(source).state.isCuffed and not Player(source).state.isDead then
				if _311Cds[source] == nil or os.time() >= _311Cds[source] then
					Chat.Send.Services:NonEmergencyAnonymous(source, rawCommand:sub(5))
					_311Cds[source] = os.time() + (60 * 1)
					TriggerClientEvent("Animations:Client:DoPDCallEmote", source)
				else
					Chat.Send.System:Single(source, "You've Called 311 Recently")
				end
			else
				Chat.Send.System:Single(source, "You Find It Difficult To Call 311")
			end
		end
	end, {
		help = "Make Anonymous 311 Call",
		params = {
			{
				name = "Message",
				help = "The Message You Want To Send To 311",
			},
		},
	}, -1)

	Chat:RegisterCommand("tems", function(source, args, rawCommand)
		TriggerClientEvent("EMS:Client:Test", source, source)
	end, {
		help = "Test",
	}, -1)

	Chat:RegisterCommand(
		"311r",
		function(source, args, rawCommand)
			if tonumber(args[1]) then
				local target = Fetch:SID(tonumber(args[1]))
				if target ~= nil then
					Chat.Send.Services:NonEmergencyRespond(source, target:GetData("Source"), args[2])
				else
					Chat.Send.System:Single(source, "Invalid Target 2")
				end
			else
				Chat.Send.System:Single(source, "Invalid Target 1")
			end
		end,
		{
			help = "Respond To 311 Caller",
			params = {
				{
					name = "Target",
					help = "State ID of the person you want to reply to",
				},
				{
					name = "Message",
					help = "[WRAP IN QUOTES] Message you want to send",
				},
			},
		},
		2,
		{
			{
				Id = "police",
			},
			{
				Id = "ems",
			},
		}
	)
	Chat:RegisterCommand(
		"rto",
		function(source, args, rawCommand)
			local message = rawCommand:sub(5)
			if message ~= nil then
				message = message:gsub("^%s+", "")
			end

			if not message or #message <= 0 then
				Chat.Send.System:Single(source, "You must provide a message to send")
				return
			end

			local plyr = Fetch:Source(source)
			if plyr == nil then
				return
			end

			local char = plyr:GetData("Character")
			if char == nil then
				return
			end

			local callsign = char:GetData("Callsign")
			local officerLabel = string.format("%s %s", char:GetData("First"), char:GetData("Last"))
			if callsign ~= nil and tostring(callsign) ~= "" then
				officerLabel = string.format("%s [%s]", officerLabel, callsign)
			end

			local formattedMessage = message:gsub("\n", "<br />")
			local chatMessage = string.format("<strong>[RTO]</strong> %s<br />%s", officerLabel, formattedMessage)

			for _, v in pairs(Fetch:All()) do
				local targetSrc = v:GetData("Source")
				if targetSrc ~= nil then
					local duty = Player(targetSrc).state.onDuty
					if duty == "police" then
						TriggerClientEvent("chat:addMessage", targetSrc, {
							time = os.time(),
							type = "dispatch",
							message = chatMessage,
						})
					end
				end
			end

                                        local function sendAlert(location)
                                                if EmergencyAlerts ~= nil then
                                                        local alertDetails = { officerLabel }

                                                        EmergencyAlerts:Create(
                                                                        "RTO",
                                                                        "RTO Announcement",
                                                                        1,
                                                                        location or false,
                                                                        {
                                                                                        icon = "broadcast-tower",
                                                                                        details = table.concat(alertDetails, "\n"),
                                                                        },
                                                                        false,
                                                                        false,
                                                                        1
                                                        )
                                                end
                                        end

					local ped = GetPlayerPed(source)
					if ped ~= 0 then
						local coords = GetEntityCoords(ped)
						if coords ~= nil and Callbacks ~= nil then
							Callbacks:ClientCallback(source, "EmergencyAlerts:GetStreetName", coords, function(location)
								sendAlert(location)
							end)
							return
						end
					end

					sendAlert(false)
		end,
		{
			help = "Send an RTO announcement to on-duty officers",
			params = {
				{
					name = "Message",
					help = "The announcement you want to send",
				},
			},
		},
		-1,
		{
			{
				Id = "police",
			},
		}
	)
end