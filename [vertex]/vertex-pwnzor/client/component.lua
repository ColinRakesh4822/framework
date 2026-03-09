AddEventHandler('Proxy:Shared:RegisterReady', function()
    exports['vertex-base']:RegisterComponent('Pwnzor', PWNZOR)
end)

PWNZOR = PWNZOR or {}