labor resource server startup.lua

```lua
	Labor.Jobs:Register("Sanitation", "Sanitation", 0, 1200, 100, false, {
		{ label = "Level 0", value = 0 },
		{ label = "Level 1", value = 100 },
		{ label = "Level 2", value = 200 },
		{ label = "Level 3", value = 300 },
	}, false, nil)
```

inventory item

	{
		name = "WEAPON_PRESSURE1",
		label = "Pressure Washer",
		weapon = "WEAPON_PRESSURE1",	
		ammoType = "NONE",
		requiresLicense = false,
		price = 500,
		isUsable = true,
		isRemoved = false,
		isStackable = false,
		isDestroyed = false,
		durability = (60 * 60 * 24 * 30),
		type = 2,
		rarity = 1,
		closeUi = true,
		metalic = false,
		weight = 3,
		noSerial = true,
	},

