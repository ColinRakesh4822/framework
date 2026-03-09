_startup = false
_items = {}

local _loading = false
function LoadItems()
	if _loading then
		return
	end
	_loading = true
	SendNUIMessage({
		type = "ITEMS_UNLOADED",
		data = {},
	})
	Wait(100)
	SendNUIMessage({
		type = "RESET_ITEMS",
		data = {},
	})

	Wait(1000)

	for _, its in pairs(_itemsSource) do
		for k, v in ipairs(its) do
			SendNUIMessage({
				type = "ADD_ITEM",
				data = {
					id = v.name,
					item = v,
				},
			})
			_items[v.name] = v
		end
	end

	Wait(1000)

	SendNUIMessage({
		type = "ITEMS_LOADED",
	})
	TriggerEvent("Inventory:Client:ItemsLoaded")
	_startup = true
	_loading = false
end
-- Helper function to extract name and label pairs
local function ExtractItemNamesAndLabels()
    local itemList = {}
    for _, itemGroup in pairs(_itemsSource) do
        for _, item in ipairs(itemGroup) do
            table.insert(itemList, item.name)
        end
    end
    return itemList
end

-- Export the list of item names and labels for other resources
exports("GetItemNamesAndLabels", function()
    return ExtractItemNamesAndLabels()
end)