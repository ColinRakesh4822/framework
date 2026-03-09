AddEventHandler("Damage:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
	Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
	Damage = exports["vertex-base"]:FetchComponent("Damage")
	Logger = exports["vertex-base"]:FetchComponent("Logger")
	Notification = exports["vertex-base"]:FetchComponent("Notification")
	Hud = exports["vertex-base"]:FetchComponent("Hud")
	Targeting = exports["vertex-base"]:FetchComponent("Targeting")
	Status = exports["vertex-base"]:FetchComponent("Status")
	--Hospital = exports["vertex-base"]:FetchComponent("Hospital")
	Progress = exports["vertex-base"]:FetchComponent("Progress")
	EmergencyAlerts = exports["vertex-base"]:FetchComponent("EmergencyAlerts")
	PedInteraction = exports["vertex-base"]:FetchComponent("PedInteraction")
	Keybinds = exports["vertex-base"]:FetchComponent("Keybinds")
	Jail = exports["vertex-base"]:FetchComponent("Jail")
	Sounds = exports["vertex-base"]:FetchComponent("Sounds")
	Animations = exports["vertex-base"]:FetchComponent("Animations")
	Weapons = exports["vertex-base"]:FetchComponent("Weapons")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["vertex-base"]:RequestDependencies("Damage", {
		"Callbacks",
		"Damage",
		"Logger",
		"Notification",
		"Hud",
		"Targeting",
		"Status",
		--"Hospital",
		"Progress",
		"EmergencyAlerts",
		"PedInteraction",
		"Keybinds",
		"Jail",
		"Sounds",
		"Animations",
        "Weapons",
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveComponents()

        Callbacks:RegisterClientCallback("Damage:Heal", function(s)
            if s then
                LocalPlayer.state.deadData = {}
            end
            Damage:Revive()
        end)

        Callbacks:RegisterClientCallback("Damage:FieldStabalize", function(s)
            Damage:Revive(true)
        end)

        Callbacks:RegisterClientCallback("Damage:Kill", function()
            ApplyDamageToPed(LocalPlayer.state.ped, 10000)
        end)

        Callbacks:RegisterClientCallback("Damage:Admin:Godmode", function(s)
            TriggerEvent("Status:Client:Update", "godmode", s and 100 or 0)
        end)
	end)
end)

AddEventHandler("Proxy:Shared:RegisterReady", function()
	exports["vertex-base"]:RegisterComponent("Damage", DAMAGE)
end)

RegisterNetEvent("Characters:Client:Spawned", function()
    StartThreads()
    Hud:RegisterStatus("godmode", 0, 100, "shield-virus", "#FFBB04", false, false, {
        hideZero = true,
    })
end)

RegisterNetEvent("Characters:Client:Logout", function()
    Damage:Revive()
end)

RegisterNetEvent("Damage:Client:Heal", function()
    Damage:Revive()
end)

RegisterNetEvent('UI:Client:Reset', function(apps)
    if not LocalPlayer.state.isDead and not LocalPlayer.state.isHospitalized then
        Hud.DeathTexts:Hide()
        Hud:Dead(false)
    end
end)

DAMAGE = {
    Revive = function(self, fieldTreat)
        local player = PlayerPedId()

        if LocalPlayer.state.isDead then
            DoScreenFadeOut(1000)
            while not IsScreenFadedOut() do
                Wait(10)
            end
        end

        local wasDead = LocalPlayer.state.isDead
        local wasMinor = LocalPlayer.state.deadData?.isMinor

        LocalPlayer.state:set("isDead", false, true)
        LocalPlayer.state:set("deadData", false, true)
        LocalPlayer.state:set("isDeadTime", false, true)
        LocalPlayer.state:set("releaseTime", false, true)

        if IsPedDeadOrDying(player) then
            local playerPos = GetEntityCoords(player, true)
            NetworkResurrectLocalPlayer(playerPos, true, true, false)
        end

        TriggerServerEvent("Damage:Server:Revived", wasMinor, fieldTreat)
        Hud:Dead(false)

        if not LocalPlayer.state.isHospitalized and wasDead then
            Hud.DeathTexts:Hide()
            ClearPedTasksImmediately(player)
            SetEntityInvincible(player, LocalPlayer.state.isAdmin and LocalPlayer.state.isGodmode or false)
        end

        if wasMinor or fieldTreat then
            SetEntityHealth(player, 125)
        else
            SetEntityHealth(player, GetEntityMaxHealth(player))
        end
        SetPlayerSprint(PlayerId(), true)
        ClearPedBloodDamage(player)
        Status:Reset()

        DoScreenFadeIn(1000)

        if not LocalPlayer.state.isHospitalized and wasDead then
            Animations.Emotes:Play("reviveshit", false, 1750, true)
        end
    end,
	Died = function(self)

	end,
	Apply = {
		StandardDamage = function(self, value, armorFirst, forceKill)
            if forceKill and not _hasKO then
                _hasKO = true
            end
            
			ApplyDamageToPed(LocalPlayer.state.ped, value, armorFirst)
		end,
    }
}