function GetHBItems()
    if (not _cachedUtilityInventory) then
        return {}
    else
        local ret = {}
        for k, v in ipairs(_cachedUtilityInventory.inventory) do
            if v.Slot >= 5 and v.Slot <= 9 then
                table.insert(ret, v)
            end
        end
        return ret
    end
end

local _openCd = false
function OpenHotBar()
    if not _openCd then
        _openCd = true
        SendNUIMessage({
            type = 'HOTBAR_SHOW',
			data = {
				items = GetHBItems(),
                equipped = Weapons:GetEquippedItem()
			},
        })
        CreateThread(function()
            Wait(5000)
            _openCd = false
        end)
    end
end

function CloseHotBar()
    SendNUIMessage({
        type = 'HOTBAR_HIDE'
    })
    -- SendNUIMessage({
    --     type = "RESET_INVENTORY",
    -- })
end