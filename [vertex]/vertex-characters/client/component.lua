Characters = nil

AddEventHandler('Characters:Shared:DependencyUpdate', RetrieveComponents)
function RetrieveComponents()
	Callbacks = exports['vertex-base']:FetchComponent('Callbacks')
	Characters = exports['vertex-base']:FetchComponent('Characters')
	Action = exports['vertex-base']:FetchComponent('Action')
	Ped = exports['vertex-base']:FetchComponent('Ped')
end

AddEventHandler('Core:Shared:Ready', function()
	exports['vertex-base']:RequestDependencies('Characters', {
		'Callbacks',
		'Characters',
		'Action',
		'Ped',
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveComponents()
	end)
end)

AddEventHandler('Characters:Client:Spawn', function()
	Characters:Update()
end)

RegisterNetEvent('Characters:Client:SetData', function(key, data, cb)
	if key ~= -1 then
        LocalPlayer.state.Character:SetData(key, data)
	else
        LocalPlayer.state.Character = exports['vertex-base']:FetchComponent('DataStore'):CreateStore(1, 'Character', data)
	end
    
    exports['vertex-base']:FetchComponent('Player').LocalPlayer:SetData('Character', LocalPlayer.state.Character)
	TriggerEvent('Characters:Client:Updated', key)

	if cb then
		cb()
	end
end)

CHARACTERS = {
	Updating = true,
	Logout = function(self)
		Callbacks:ServerCallback('Characters:Logout', {}, function()
			LocalPlayer.state.Char = nil
			LocalPlayer.state.Character = nil
			LocalPlayer.state.loggedIn = false
			Action:Hide()
			exports['vertex-base']:FetchComponent('Spawn'):InitCamera()
			SendNUIMessage({
				type = 'APP_RESET',
			})
			Wait(500)
			exports['vertex-base']:FetchComponent('Spawn'):Init()
		end)
	end,
	Update = function(self)
		CreateThread(function()
			while self.Updating do
				TriggerServerEvent('Characters:Server:StoreUpdate')
				Wait(180000)
			end
		end)
	end,
}

AddEventHandler('Proxy:Shared:RegisterReady', function()
	exports['vertex-base']:RegisterComponent('Characters', CHARACTERS)
end)
