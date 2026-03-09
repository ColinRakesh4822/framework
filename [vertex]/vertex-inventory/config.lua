Config = Config or {}
_itemsSource = _itemsSource or {}

function hasValue(tbl, value)
	for k, v in ipairs(tbl or {}) do
		if v == value or (type(v) == "table" and hasValue(v, value)) then
			return true
		end
	end
	return false
end

Config.StartItems = {
	{ name = "govid", count = 1 },
	{ name = "phone", count = 1 },
	{ name = "water", count = 5 },
	{ name = "sandwich_blt", count = 5 },
	{ name = "bandage", count = 5 },
	{ name = "coffee", count = 2 },
}

Config.ShopItemSets = {
	[1] = {
		"sandwich",
		"sandwich_egg",
		"water",
		"bandage",
		"cigarette_pack",
		"coffee",
		"soda",
		"energy_pepe",
		"chocolate_bar",
		"donut",
		"crisp",
		"rolling_paper",
	}, -- General Stores like 24/7 etc..
	[2] = {
		"screwdriver",
		"WEAPON_HAMMER",
		"WEAPON_CROWBAR",
		"WEAPON_GOLFCLUB",
		"repairkit",
		"fertilizer_nitrogen",
		"fertilizer_phosphorus",
		"fertilizer_potassium",
		"camping_chair",
		"beanbag",
		"plastic_wrap",
		"baggy",
		"binoculars",
		"WEAPON_SHOVEL",
		"cloth",
		"pipe",
		"nails",
		"drill",
	}, -- Hardware
	[3] = { "cup", "bun", "patty", "pickle" }, -- Burger Shot Supplies
	[4] = { "armor", "heavyarmor", "WEAPON_PISTOL", "WEAPON_FNX", "AMMO_PISTOL", "WEAPON_BAT" }, -- Ammunation
	[5] = { -- Electronics Store
		"phone",
		"sim_card",
		"radio_shitty",
		"camera",
		"electronics_kit",
	},
	[6] = {
		"pdarmor",
		"ifak",
		"pdhandcuffs",
		"spikes",
		"WEAPON_FLASHLIGHT",
		"WEAPON_TASER",
		"WEAPON_BEANBAG",
		"WEAPON_G17",
		"WEAPON_HKUMP",
		"WEAPON_HK416B",
		"AMMO_PISTOL_PD",
		"AMMO_SHOTGUN_PD",
		"AMMO_SMG_PD",
		"AMMO_RIFLE_PD",
		"AMMO_STUNGUN",
		"radio",
		"binoculars",
		"camera",
		"phone",
		"WEAPON_FLASHBANG",
		"WEAPON_SMOKEGRENADE",
	}, -- Police Armory
	[7] = { "traumakit", "medicalkit", "firstaid", "bandage", "morphine", "radio", "phone", "scuba_gear" },
	[8] = {
		"WEAPON_SNIPERRIFLE2",
		"AMMO_SNIPER",
		"WEAPON_KNIFE",
		"hunting_bait",
		-- "deer_bait",
		-- "boar_bait",
		-- "pig_bait",
		-- "chicken_bait",
		-- "rabbit_bait",
		-- "exotic_bait",
	},
	[9] = {
		"pdarmor",
		"pdarmor",
		"traumakit",
		"ifak",
		"pdhandcuffs",
		-- "spikes",
		"WEAPON_TASER",
		"WEAPON_G17",
		--"WEAPON_HK416B",
		"AMMO_PISTOL_PD",
		"AMMO_RIFLE_PD",
		"AMMO_SHOTGUN_PD",
		"AMMO_STUNGUN",
		"radio",
		"phone",
	}, -- DOC Armory
	[10] = { "water" }, -- Water Machine
	[11] = { "coffee" }, -- Coffee Machine
	[12] = { -- Drinks Vending Machines
		"water",
		"soda",
		"energy_pepe",
	},
	[13] = { -- Food Vending Machines
		"chocolate_bar",
		"donut",
		"crisp",
	},
	[14] = {
		"firstaid",
		"bandage",
		"water",
		"sandwich_blt",
	},
	[15] = {
		"WEAPON_PETROLCAN",
	},
	[16] = {
		"dough",
		"eggs",
		"loaf",
		"sugar",
		"flour",
		"rice",
		"icing",
		"milk_can",
		"tea_leaf",
		"plastic_cup",
		"coffee_beans",
		"coffee_holder",
		"foodbag",
		"cardboard_box",
		"paper_bag",
		"burgershot_bag",
		"burgershot_cup",
		"bun",
		"water",
		"cheese",
		"jaeger",
		"raspberry_liqueur",
		"sparkling_wine",
		"rum",
		"whiskey",
		"tequila",
		"pineapple",
		"raspberry",
		"peach_juice",
		"coconut_milk",
		"bento_box",
		"keg",
	},
	[17] = {
		"weed_joint",
		"rolling_paper",
	},
	[18] = { -- Liquor Stores
		"vodka",
		"beer",
		"water",
		"bandage",
		"cigarette_pack",
		"coffee",
		"soda",
		"energy_pepe",
		"chocolate_bar",
		"donut",
		"crisp",
		"rolling_paper",
	},
	[19] = {
		"wine_bottle",
	},
	[20] = {
		"fishing_rod",
		"fishing_bait_worm",
		"fishing_bait_lugworm",
		"WEAPON_KNIFE",
	},
	[21] = {
		"fishing_rod",
		"fishing_net",
		"fishing_bait_worm",
		"fishing_bait_lugworm",
		"WEAPON_KNIFE",
	},
	[22] = {
		"personal_plates",
	},
}


Config.itemProps = {
    ["umbrella"] = {
        Prop = "p_amb_brolly_01",
    },
    ["notepad"] = {
        Prop = "prop_notepad_01",
    },
    ["newspaper"] = {
        Prop = "prop_cliff_paper",
    },
    ["box"] = {
        Prop = "hei_prop_heist_box",
    },
    ["weed"] = {
        Prop = "ba_prop_battle_weed_bigbag_01a",
    },
    ["bigbox"] = {
        Prop = "v_serv_abox_1",
    },
    ["chest"] = {
        Prop = "h4_prop_h4_chest_01a",
    },
    ["goldchest"] = {
        Prop = "prop_ld_gold_chest",
    },
    ["tv"] = {
        Prop = "prop_tv_06",
    },
    ["bigtv"] = {
        Prop = "prop_tv_flat_01",
    },
    ["boombox"] = {
        Prop = "prop_boombox_01",
    },
    ["microwave"] = {
        Prop = "prop_microwave_1",
    },
    ["golfclubs"] = {
        Prop = "prop_golf_bag_01b",
    },
    ["house_art"] = {
        Prop = "h4_prop_h4_painting_01e",
    },
    ["pc"] = {
        Prop = "prop_dyn_pc_02",
    },
    ["rose"] = {
        Prop = "prop_single_rose",
    },
    ["smoke2"] = {
        Prop = "prop_cs_ciggy_01",
    },
    ["smoke3"] = {
        Prop = "prop_cs_ciggy_01",
    },
    ["smoke4"] = {
        Prop = "prop_cs_ciggy_01",
    },
    ["smoke5"] = {
        Prop = "prop_cigar_02",
    },
    ["bong"] = {
        Prop = "hei_heist_sh_bong_01",
    },
    ["crack"] = {
        Prop = "prop_cs_crackpipe",
    },
    ["suitcase"] = {
        Prop = "prop_ld_suitcase_01",
    },
    ["suitcase2"] = {
        Prop = "prop_security_case_01",
    },
    ["mugshot"] = {
        Prop = "prop_police_id_board",
    },
    ["coffee"] = {
        Prop = "p_amb_coffeecup_01",
    },
    ["whiskey"] = {
        Prop = "p_whiskey_bottle_s",
    },
    ["vodka"] = {
        Prop = "prop_vodka_bottle",
    },
    ["tequila"] = {
        Prop = "prop_tequila_bottle",
    },
    ["beer"] = {
        Prop = "prop_beer_bottle",
    },
    ["glass"] = {
        Prop = "prop_sh_tall_glass",
    },
    ["water"] = {
        Prop = "prop_ld_flow_bottle",
    },
    ["energydrink"] = {
        Prop = "prop_energy_drink",
    },
    ["cup"] = {
        Prop = "prop_plastic_cup_02",
    },
    ["cup2"] = {
        Prop = "prop_plastic_cup_02",
    },
    ["donut"] = {
        Prop = "prop_amb_donut",
    },
    ["burger"] = {
        Prop = "prop_cs_burger_01",
    },
    ["bshot_heartstopper"] = {
        Prop = "nels_burger_fabulous_6lb_prop",
    },
    ["bshot_glorious"] = {
        Prop = "nels_burger_glorious_prop",
    },
    ["bshot_prickly"] = {
        Prop = "nels_burger_prickly_prop",
    },
    ["bshot_simply"] = {
        Prop = "nels_burger_simply_prop",
    },
    ["bshot_doubleshot"] = {
        Prop = "nels_burger_double_shot_prop",
    },
    ["bshot_bleeder"] = {
        Prop = "nels_burger_bleeder_prop",
    },
    ["bshot_fries"] = {
        Prop = "nels_fries_box_prop",
    },
    ["bshot_wrap1"] = {
        Prop = "nels_goat_wrap_prop",
    },
    ["bshot_wrap2"] = {
        Prop = "nels_chicken_wrap_prop",
    },
    ["bshot_tacos"] = {
        Prop = "nels_tacos_prop",
    },
    ["bshot_drink"] = {
        Prop = "nels_soda_prop",
    },
    ["bshot_icecream"] = {
        Prop = "nels_ice_cream_meteorite_prop",
    },
    ["bshot_icecream2"] = {
        Prop = "nels_ice_cream_orang_otan_prop",
    },
    ["taco"] = {
        Prop = "prop_taco_01",
    },
    ["pizza"] = {
        Prop = "knjgh_pizzaslice1",
    },
    ["sandwich"] = {
        Prop = "prop_sandwich_01",
    },
    ["soda"] = {
        Prop = "prop_ecola_can",
    },
    ["egobar"] = {
        Prop = "prop_choc_ego",
    },
    ["wine"] = {
        Prop = "prop_drink_redwine",
    },
    ["cocktail"] = {
        Prop = "prop_cocktail",
    },
    ["shotglass"] = {
        Prop = "prop_cs_shot_glass",
    },
    ["flute"] = {
        Prop = "prop_champ_flute",
    },
    ["champagne"] = {
        Prop = "prop_drink_champ",
    },
    ["cigar"] = {
        Prop = "prop_cigar_02",
    },
    ["cigar2"] = {
        Prop = "prop_cigar_01",
    },
    ["cigar3"] = {
        Prop = "prop_cigar_01",
    },
    ["guitar"] = {
        Prop = "prop_acc_guitar_01",
    },
    ["guitar2"] = {
        Prop = "prop_acc_guitar_01",
    },
    ["guitarelectric"] = {
        Prop = "prop_el_guitar_01",
    },
    ["guitarelectric2"] = {
        Prop = "prop_el_guitar_03",
    },
    ["book"] = {
        Prop = "prop_novel_01",
    },
    ["bouquet"] = {
        Prop = "prop_snow_flower_02",
    },
    ["teddy"] = {
        Prop = "v_ilev_mr_rasberryclean",
    },
    ["backpack"] = {
        Prop = "p_michael_backpack_s",
    },
    ["clipboard"] = {
        Prop = "p_amb_clipboard_01",
    },
    ["clipboard_still"] = {
        Prop = "p_amb_clipboard_01",
    },
    ["shopbag"] = {
        Prop = "vw_prop_casino_shopping_bag_01a",
    },
    ["old"] = {
        Prop = "prop_cs_walking_stick",
    },
    ["surfboard"] = {
        Prop = "prop_surf_board_01",
    },
    ["beachring"] = {
        Prop = "prop_beach_ring_01",
    },
    ["conehead"] = {
        Prop = "prop_roadcone02b",
    },
    ["map"] = {
        Prop = "prop_tourist_map_01",
    },
    ["beg"] = {
        Prop = "prop_beggers_sign_03",
    },
    ["makeitrain"] = {
        Prop = "prop_anim_cash_pile_01",
    },
    ["camera"] = {
        Prop = "prop_pap_camera_01",
    },
    ["champagne2"] = {
        Prop = "ba_prop_battle_champ_open",
    },
    ["cig"] = {
        Prop = "prop_amb_ciggy_01",
    },
    ["brief"] = {
        Prop = "prop_ld_case_01",
    },
    ["toolbox"] = {
        Prop = "prop_tool_box_04",
    },
    ["tablet"] = {
        Prop = "prop_cs_tablet",
    },
    ["tablet2"] = {
        Prop = "prop_cs_tablet",
    },
    ["phone"] = {
        Prop = "prop_npc_phone_02",
    },
    ["megaphone"] = {
        Prop = "prop_megaphone_01",
    },
    ["clean"] = {
        Prop = "prop_sponge_01",
    },
    ["clean2"] = {
        Prop = "prop_sponge_01",
    },
    ["ifak"] = {
        Prop = "prop_stat_pack_01",
    },
    ["firstaid"] = {
        Prop = "prop_stat_pack_01",
    },
    ["bandage"] = {
        Prop = "prop_stat_pack_01",
    },
    ["campchair"] = {
        Prop = "prop_skid_chair_03",
    },
    ["beanbag"] = {
        Prop = "v_corp_facebeanbagc",
    },
    ["mop"] = {
        Prop = "prop_cs_mop_s",
    },
    ["mop2"] = {
        Prop = "prop_cs_mop_s",
    },
    ["binoculars"] = {
        Prop = "prop_binoc_01",
    },
    ["camera_item"] = {
        Prop = "prop_pap_camera_01",
    }
}


function kprint(...)
    local args = {...}
    local messageToPrint = "[DEBUG] "

    -- Iterate through all arguments and convert tables to strings
    for i, v in ipairs(args) do
        if type(v) == "table" then
            -- Convert tables to a string representation (you can modify this as needed)
            messageToPrint = messageToPrint .. tostring(v) .. " "
        else
            messageToPrint = messageToPrint .. tostring(v) .. " "
        end
    end

    print(messageToPrint)
end