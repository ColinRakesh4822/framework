AddEventHandler("Billboards:Shared:DependencyUpdate", RetrieveComponents)
function RetrieveComponents()
    Logger = exports["vertex-base"]:FetchComponent("Logger")
    Fetch = exports["vertex-base"]:FetchComponent("Fetch")
    Callbacks = exports["vertex-base"]:FetchComponent("Callbacks")
    Game = exports["vertex-base"]:FetchComponent("Game")
    Targeting = exports["vertex-base"]:FetchComponent("Targeting")
    Utils = exports["vertex-base"]:FetchComponent("Utils")
    Animations = exports["vertex-base"]:FetchComponent("Animations")
    Notification = exports["vertex-base"]:FetchComponent("Notification")
    Polyzone = exports["vertex-base"]:FetchComponent("Polyzone")
    Jobs = exports["vertex-base"]:FetchComponent("Jobs")
    Weapons = exports["vertex-base"]:FetchComponent("Weapons")
    Progress = exports["vertex-base"]:FetchComponent("Progress")
    Vehicles = exports["vertex-base"]:FetchComponent("Vehicles")
    ListMenu = exports["vertex-base"]:FetchComponent("ListMenu")
    Action = exports["vertex-base"]:FetchComponent("Action")
    Sounds = exports["vertex-base"]:FetchComponent("Sounds")
    PedInteraction = exports["vertex-base"]:FetchComponent("PedInteraction")
    Blips = exports["vertex-base"]:FetchComponent("Blips")
    Keybinds = exports["vertex-base"]:FetchComponent("Keybinds")
    Minigame = exports["vertex-base"]:FetchComponent("Minigame")
    Input = exports["vertex-base"]:FetchComponent("Input")
    Interaction = exports["vertex-base"]:FetchComponent("Interaction")
    Inventory = exports["vertex-base"]:FetchComponent("Inventory")
end

AddEventHandler("Core:Shared:Ready", function()
    exports["vertex-base"]:RequestDependencies("Billboards", {
        "Logger",
        "Fetch",
        "Callbacks",
        "Game",
        "Menu",
        "Targeting",
        "Notification",
        "Utils",
        "Animations",
        "Polyzone",
        "Jobs",
        "Weapons",
        "Progress",
        "Vehicles",
        "Targeting",
        "ListMenu",
        "Action",
        "Sounds",
        "PedInteraction",
        "Blips",
        "Keybinds",
        "Minigame",
        "Input",
        "Interaction",
        "Inventory",
    }, function(error)
        if #error > 0 then return; end
        RetrieveComponents()

        -- print('testing biatch')
        -- local dui = CreateBillboardDUI('https://i.imgur.com/Zlf40QZ.png', 1024, 512)
        -- AddReplaceTexture('ch2_03b_cg2_03b_bb', 'ch2_03b_bb_lowdown', dui.dictionary, dui.texture)

        -- Wait(10000)

        -- print(dui.id)

        -- ReleaseBillboardDUI(dui.id)
        -- RemoveReplaceTexture('ch2_03b_cg2_03b_bb', 'ch2_03b_bb_lowdown')

        StartUp()
    end)
end)

local started = false
local _billboardDUIs = {}

function StartUp()
    if started then
        return
    end

    started = true

    for k,v in pairs(_billboardConfig) do
        v.url = GlobalState[string.format("Billboards:%s", k)]
    end
end

AddEventHandler('Characters:Client:Spawn', function()
    CreateThread(function()
        while LocalPlayer.state.loggedIn do
            for k,v in pairs(_billboardConfig) do
                local dist = #(GetEntityCoords(LocalPlayer.state.ped) - v.coords)
                if dist <= v.range then
                    if not _billboardDUIs[k] and v.url then
                        local createdDui = CreateBillboardDUI(v.url, v.width, v.height)
                        AddReplaceTexture(v.originalDictionary, v.originalTexture, createdDui.dictionary, createdDui.texture)

                        _billboardDUIs[k] = createdDui
                    end
                elseif _billboardDUIs[k] then
                    ReleaseBillboardDUI(_billboardDUIs[k].id)
                    RemoveReplaceTexture(v.originalDictionary, v.originalTexture)
                    _billboardDUIs[k] = nil
                end
            end
            Wait(1500)
        end
    end)
end)


RegisterNetEvent('Characters:Client:Logout')
AddEventHandler('Characters:Client:Logout', function()
    for k,v in pairs(_billboardConfig) do
        if _billboardDUIs[k] then

            ReleaseBillboardDUI(_billboardDUIs[k].id)
            RemoveReplaceTexture(v.originalDictionary, v.originalTexture)
            _billboardDUIs[k] = nil
        end
    end
end)

RegisterNetEvent("Billboards:Client:UpdateBoardURL", function(id, url)
    if not _billboardConfig[id] then
        return
    end

    if _billboardDUIs[id] then
        if url then
            UpdateBillboardDUI(_billboardDUIs[id].id, url)
            AddReplaceTexture(_billboardConfig[id].originalDictionary, _billboardConfig[id].originalTexture, _billboardDUIs[id].dictionary, _billboardDUIs[id].texture)
        else
            ReleaseBillboardDUI(_billboardDUIs[id].id)
            RemoveReplaceTexture(_billboardConfig[id].originalDictionary, _billboardConfig[id].originalTexture)
            _billboardDUIs[id] = nil
        end
    end

    _billboardConfig[id].url = url
end)