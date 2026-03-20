
export const initialState = process.env.NODE_ENV === 'production' ? {
	player: {
		loaded: false,
		size: 0,
		invType: 1,
		name: 'Player',
		inventory: [],
		disabled: {},
		owner: 0,
		capacity: 200,
		isWeaponEligble: false,
	},
	equipment: {
		inventory: [],
	},
	secondary: {
		loaded: false,
		size: 10,
		name: 'Dropzone',
		invType: 2,
		inventory: [],
		disabled: {},
		owner: 0,
		capacity: 200,
	},
	utility: {
		loaded: true,
		size: 6,
		name: 'Utility',
		invType: 3,
		inventory: [
			{
				Name: 'bread',
				Slot: 1,
				Count: 3,
				CreateDate: Date.now() / 1000,
			},
			{
				Name: 'water',
				Slot: 5,
				Count: 2,
				CreateDate: Date.now() / 1000,
			},
		],
		disabled: {},
		owner: 'utility',
		capacity: 200,
	},
	backpack: {
		loaded: false,
		size: 20,
		name: 'Backpack',
		invType: 6,
		inventory: [],
		disabled: {},
		owner: 'backpack',
		capacity: 100,
	},
	showSecondary: true,
	hover: false,
	hoverOrigin: null,
	contextItem: null,
	splitItem: null,
	inUse: false,
	items: {},
	itemsLoaded: false,
	staticTooltip: false,
} : {
	player: {
		size: 40,
		invType: 1,
		name: 'Pockets',
		isWeaponEligble: true,
		capacity: 200,
		disabled: Object({
			2: true,
		}),
		loaded: true,
		inventory: [
			{
				Name: 'WEAPON_ADVANCEDRIFLE',
				Slot: 1,
				Count: 1,
				CreateDate: Date.now() / 1000,
				MetaData: {
					SerialNumber: '123-456',
				},
			},
			{
				Name: 'WEAPON_ADVANCEDRIFLE',
				Slot: 2,
				Count: 1,
				CreateDate: 1625461797,
				MetaData: {
					SerialNumber: '123-456',
				},
			},
			{
				Name: 'WEAPON_ADVANCEDRIFLE',
				Slot: 3,
				Count: 1,
				CreateDate: Date.now() / 1000 - 80000,
				MetaData: {
					SerialNumber: '123-456',
				},
			},
			{
				Name: 'WEAPON_ADVANCEDRIFLE',
				Slot: 4,
				Count: 1,
				CreateDate: 1225441797,
				MetaData: {
					SerialNumber: '123-456',
				},
			},
			{
				Name: 'bread',
				Slot: 5,
				Count: 10,
				CreateDate: 1225441797,
			},
			{
				Name: 'water',
				Slot: 6,
				Count: 10,
				CreateDate: Math.floor(Date.now() / 1000) - (60 * 60 * 24 * 2), // 2 gün önce oluşturuldu
			},
		],
		owner: '12214124',
	},
	equipment: {
		inventory: [],
	},
	utility: {
		loaded: true,
		size: 6,
		name: 'Utility',
		invType: 3,
		inventory: [
			{
				Name: 'bread',
				Slot: 1,
				Count: 3,
				CreateDate: Date.now() / 1000,
			},
			{
				Name: 'water',
				Slot: 5,
				Count: 2,
				CreateDate: Date.now() / 1000,
			},
		],
		disabled: {},
		owner: 'utility',
		capacity: 200,
	},
	backpack: {
		loaded: false,
		size: 20,
		name: 'Backpack',
		invType: 6,
		inventory: [],
		disabled: {},
		owner: 'backpack',
		capacity: 100,
	},
	secondary: {
		size: 10,
		name: 'Dropzone',
		invType: 2,
		capacity: 200,
		disabled: Object(),
		shop: false,
		loaded: true,
		inventory: [
			{
				Name: 'water',
				Slot: 1,
				Count: 10,
				CreateDate: 1225441797,
			},
			{
				Name: 'bread',
				Slot: 2,
				Count: 5,
				CreateDate: 1225441797,
			},
		],
		owner: '0',
	},
	showSecondary: true,
	hover: false,
	hoverOrigin: null,
	contextItem: null,
	splitItem: null,
	inUse: false,
	items: {
		bread: {
			name: 'bread',
			label: 'Bread',
			price: 0,
			isUsable: true,
			isRemoved: true,
			isStackable: 100,
			type: 1,
			rarity: 1,
			metalic: false,
			weight: 1,
		},
		water: {
			name: 'water',
			label: 'Water',
			price: 0,
			isUsable: true,
			isRemoved: true,
			isStackable: 10,
			type: 1,
			rarity: 2,
			metalic: false,
			weight: 1,
			durability: (60 * 60 * 24 * 5), // 5 gün
		},
		WEAPON_ADVANCEDRIFLE: {
			name: 'WEAPON_ADVANCEDRIFLE',
			label: 'Advanced Rifle',
			requiresLicense: true,
			price: 15000,
			isUsable: true,
			isRemoved: false,
			isStackable: false,
			type: 2,
			rarity: 3,
			metalic: false,
			weight: 1,
			durability: 86400,
		},
	},
	itemsLoaded: true,

		// staticTooltip: {
		// 	Name: 'WEAPON_ADVANCEDRIFLE',
		// 	Slot: 1,
		// 	Count: 1,
		// 	CreateDate: Date.now() / 1000,
		// 	MetaData: {
		// 		SerialNumber: '123-456',
		// 	},
		// },
}

const appReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_DRAGGING_AMOUNT':
			return {
				...state,
				draggingAmount: action.payload.amount
			}
		case 'UNLOAD_ITEMS':
			return {
				...state,
				items: {},
			};
		case 'RESET_ITEMS':
			return {
				...state,
				items: Object(),
				itemsLoaded: false,
			};
		case 'ADD_ITEM': {
			return {
				...state,
				items: {
					...state.items,
					[action.payload.id]: action.payload.item,
				},
			};
		}
		case 'ITEMS_LOADED':
			return {
				...state,
				itemsLoaded: true,
			};
		case 'ITEMS_UNLOADED':
			return {
				...state,
				itemsLoaded: false,
			};
		case 'OPEN_STATIC_TOOLTIP':
			return {
				...state,
				staticTooltip: action.payload.item,
			};

		case 'CLOSE_STATIC_TOOLTIP':
			return {
				...state,
				staticTooltip: false,
			};
		case 'RESET_INVENTORY':
			return {
				...state,
				player: {
					...initialState.player,
					disabled: { ...state.player.disabled },
				},
				secondary: {
					...initialState.secondary,
					disabled: { ...state.secondary.disabled },
				},
			};
		case 'SET_PLAYER_INVENTORY': {
			return {
				...state,
				player: {
					...action.payload,
					invType: 1,
					disabled: state.player.disabled,
				},
			};
		}
		case 'USE_IN_PROGRESS': {
			return {
				...state,
				inUse: action.payload.state,
			};
		}
		case 'SET_SECONDARY_INVENTORY': {
			return {
				...state,
				secondary: {
					...action.payload,
					disabled:
						state.secondary.owner == action.payload.owner &&
						state.secondary.invType == action.payload.invType
							? state.secondary.disabled
							: Object(),
				},
			};
		}
		case 'SET_UTILITY_INVENTORY': {
			return {
				...state,
				utility: {
					...action.payload,
					disabled:
						state.utility.owner == action.payload.owner &&
						state.utility.invType == action.payload.invType
							? state.utility.disabled
							: Object(),
				},
			};
		}
		case 'SET_BACKPACK_INVENTORY': {
			return {
				...state,
				backpack: {
					...action.payload,
					disabled:
						state.backpack.owner == action.payload.owner &&
						state.backpack.invType == action.payload.invType
							? state.backpack.disabled
							: Object(),
				},
			};
		}
		case 'CLOSE_BACKPACK_INVENTORY': {
			return {
				...state,
				backpack: {
					...initialState.backpack,
				},
			};
		}
		case 'SET_AVALIABLE_ITEMS': {
			return {
				...state,
				items: action.payload,
			};
		}
		case 'SET_EQUIPMENT': {
			return {
				...state,
				equipment: action.payload,
			};
		}
		case 'SHOW_SECONDARY_INVENTORY': {
			return {
				...state,
				showSecondary: true,
			};
		}
		case 'HIDE_SECONDARY_INVENTORY': {
			return {
				...state,
				showSecondary: false,
				secondary: { ...initialState.secondary },
			};
		}
		case 'SET_HOVER': {
			return {
				...state,
				hover: action.payload,
			};
		}
		case 'SET_HOVER_ORIGIN': {
			return {
				...state,
				hoverOrigin: action.payload,
			};
		}
		case 'SET_CONTEXT_ITEM': {
			return {
				...state,
				contextItem: action.payload,
			};
		}
		case 'SET_PLAYER_SLOT': {
			return {
				...state,
				player: {
					...state.player,
					disabled: {
						...state.player.disabled,
						[action.payload.slot]: false,
					},
					inventory: [
						...state.player.inventory.map((slot) => {
							if (slot?.Slot == action.payload.slot)
								return { ...action.payload.data };
							else return slot;
						}),
					],
				},
			};
		}
		case 'SLOT_NOT_USED': {
			const slot = action.payload.slot;
			const invType = action.payload.invType;
			
			if (invType === 1) {
				// Player inventory
				const disabled = state.player.disabled;
				disabled[slot] = false;
				return {
					...state,
					player: {
						...state.player,
						disabled,
					},
				};
			} else if (invType === 2) {
				// Secondary inventory
				const disabled = state.secondary.disabled;
				disabled[slot] = false;
				return {
					...state,
					secondary: {
						...state.secondary,
						disabled,
					},
				};
			} else if (invType === 6) {
				// Backpack inventory
				const disabled = state.backpack.disabled;
				disabled[slot] = false;
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled,
					},
				};
			} else if (invType === 3) {
				// Utility inventory
				const disabled = state.utility.disabled;
				disabled[slot] = false;
				return {
					...state,
					utility: {
						...state.utility,
						disabled,
					},
				};
			}
			
			return state;
		}
		case 'SET_SECONDARY_SLOT': {
			return {
				...state,
				secondary: {
					...state.secondary,
					disabled: {
						...state.secondary.disabled,
						[action.payload.slot]: false,
					},
					inventory: [
						...state.secondary.inventory.map((slot) => {
							if (slot?.Slot == action.payload.slot)
								return { ...action.payload.data };
							else return slot;
						}),
					],
				},
			};
		}
		case 'SET_UTILITY_SLOT': {
			return {
				...state,
				utility: {
					...state.utility,
					disabled: {
						...state.utility.disabled,
						[action.payload.slot]: false,
					},
					inventory: [
						...state.utility.inventory.map((slot) => {
							if (slot?.Slot == action.payload.slot)
								return { ...action.payload.data };
							else return slot;
						}),
					],
				},
			};
		}
		case 'SET_BACKPACK_SLOT': {
			return {
				...state,
				backpack: {
					...state.backpack,
					disabled: {
						...state.backpack.disabled,
						[action.payload.slot]: false,
					},
					inventory: [
						...state.backpack.inventory.map((slot) => {
							if (slot?.Slot == action.payload.slot)
								return { ...action.payload.data };
							else return slot;
						}),
					],
				},
			};
		}
		case 'SET_SPLIT_ITEM': {
			return {
				...state,
				splitItem: action.payload,
			};
		}
		case 'MERGE_ITEM_PLAYER_SAME': {
			let pInv = [
				...state.player.inventory
					.filter((slot) => slot?.Slot != action.payload.originSlot)
					.map((slot) => {
						if (slot?.Slot == action.payload.destSlot) {
							let originItem = state.player.inventory.filter(
								(slot) =>
									slot?.Slot == action.payload.originSlot,
							)[0];
							return {
								...slot,
								Count: slot.Count + originItem.Count,
							};
						} else return slot;
					}),
			];

			return {
				...state,
				player: {
					...state.player,
					disabled: {
						...state.player.disabled,
						[action.payload.originSlot]: true,
						[action.payload.destSlot]: true,
					},
					inventory: pInv,
				},
			};
		}
		case 'SPLIT_ITEM_PLAYER_SAME': {
			let pInv =
				state.player.inventory.filter(
					(s) => s?.Slot == action.payload.destSlot,
				).length > 0
					? [
							...state.player.inventory.map((slot) => {
								if (slot?.Slot == action.payload.originSlot) {
									return {
										...slot,
										Count:
											slot.Count -
											action.payload.origin.Count,
									};
								} else if (
									slot?.Slot == action.payload.destSlot
								) {
									return {
										...slot,
										Count:
											slot.Count +
											action.payload.origin.Count,
									};
								}
								return slot;
							}),
					  ]
					: [
							...state.player.inventory.map((slot) => {
								if (slot?.Slot == action.payload.originSlot) {
									return {
										...slot,
										Count:
											slot.Count -
											action.payload.origin.Count,
									};
								}
								return slot;
							}),
							{
								...action.payload.origin,
								Slot: action.payload.destSlot,
							},
					  ];

			return {
				...state,
				player: {
					...state.player,
					inventory: pInv,
				},
			};
		}
		case 'SWAP_ITEM_PLAYER_SAME': {
			let pInv = [
				...state.player.inventory.map((slot) => {
					if (slot?.Slot == action.payload.originSlot) {
						return {
							...slot,
							Slot: action.payload.destSlot,
						};
					} else if (slot?.Slot == action.payload.destSlot) {
						return {
							...slot,
							Slot: action.payload.originSlot,
						};
					} else return slot;
				}),
			];

			return {
				...state,
				player: {
					...state.player,
					disabled: {
						...state.player.disabled,
						[action.payload.originSlot]: true,
						[action.payload.destSlot]: true,
					},
					inventory: pInv,
				},
			};
		}
		case 'MOVE_ITEM_PLAYER_SAME': {
			let pInv = [
				...state.player.inventory.map((slot) => {
					if (slot?.Slot == action.payload.originSlot) {
						return {
							...slot,
							Slot: action.payload.destSlot,
						};
					} else return slot;
				}),
			];

			return {
				...state,
				player: {
					...state.player,
					disabled: {
						...state.player.disabled,
						[action.payload.originSlot]: true,
						[action.payload.destSlot]: true,
					},
					inventory: pInv,
				},
			};
		}
		case 'MERGE_ITEM_SECONDARY_SAME': {
			let sInv = [
				...state.secondary.inventory
					.filter((slot) => slot?.Slot != action.payload.originSlot)
					.map((slot) => {
						if (slot?.Slot == action.payload.destSlot) {
							let originItem = state.secondary.inventory.filter(
								(slot) =>
									slot?.Slot == action.payload.originSlot,
							)[0];
							return {
								...slot,
								Count: slot.Count + originItem.Count,
							};
						} else return slot;
					}),
			];

			return {
				...state,
				secondary: {
					...state.secondary,
					disabled: {
						...state.secondary.disabled,
						[action.payload.originSlot]: true,
						[action.payload.destSlot]: true,
					},
					inventory: sInv,
				},
			};
		}
		case 'SPLIT_ITEM_SECONDARY_SAME': {
			let sInv =
				state.secondary.inventory.filter(
					(s) => s?.Slot == action.payload.destSlot,
				).length > 0
					? [
							...state.secondary.inventory.map((slot) => {
								if (slot?.Slot == action.payload.originSlot) {
									return {
										...slot,
										Count:
											slot.Count -
											action.payload.origin.Count,
									};
								} else if (
									slot?.Slot == action.payload.destSlot
								) {
									return {
										...slot,
										Count:
											slot.Count +
											action.payload.origin.Count,
									};
								}
								return slot;
							}),
					  ]
					: [
							...state.secondary.inventory.map((slot) => {
								if (slot?.Slot == action.payload.originSlot) {
									return {
										...slot,
										Count:
											slot.Count -
											action.payload.origin.Count,
									};
								}
								return slot;
							}),
							{
								...action.payload.origin,
								Slot: action.payload.destSlot,
							},
					  ];

			return {
				...state,
				secondary: {
					...state.secondary,
					inventory: sInv,
				},
			};
		}
		case 'SWAP_ITEM_SECONDARY_SAME': {
			let sInv = [
				...state.secondary.inventory.map((slot) => {
					if (slot?.Slot == action.payload.originSlot) {
						return {
							...slot,
							Slot: action.payload.destSlot,
						};
					} else if (slot?.Slot == action.payload.destSlot) {
						return {
							...slot,
							Slot: action.payload.originSlot,
						};
					} else return slot;
				}),
			];

			return {
				...state,
				secondary: {
					...state.secondary,
					disabled: {
						...state.secondary.disabled,
						[action.payload.originSlot]: true,
						[action.payload.destSlot]: true,
					},
					inventory: sInv,
				},
			};
		}
		case 'MOVE_ITEM_SECONDARY_SAME': {
			let sInv = [
				...state.secondary.inventory.map((slot) => {
					if (slot?.Slot == action.payload.originSlot) {
						return {
							...slot,
							Slot: action.payload.destSlot,
						};
					} else return slot;
				}),
			];

			return {
				...state,
				secondary: {
					...state.secondary,
					disabled: {
						...state.secondary.disabled,
						[action.payload.originSlot]: true,
						[action.payload.destSlot]: true,
					},
					inventory: sInv,
				},
			};
		}
		case 'MERGE_ITEM_PLAYER_TO_SECONDARY': {
			let pInv = [
				...state.player.inventory.filter(
					(slot) => slot?.Slot != action.payload.originSlot,
				),
			];
			let sInv = [
				...state.secondary.inventory.map((s) => {
					if (s?.Slot == action.payload.destSlot)
						return {
							...s,
							Count: s.Count + action.payload.origin.Count,
						};
					else return s;
				}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(sInv, state.items) <= state.secondary.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'SPLIT_ITEM_PLAYER_TO_SECONDARY': {
			let pInv = [
				...state.player.inventory.map((slot) => {
					if (slot?.Slot == action.payload.originSlot) {
						return {
							...slot,
							Count: slot.Count - action.payload.origin.Count,
						};
					} else return slot;
				}),
			];
			let sInv =
				state.secondary.inventory.filter(
					(s) => s?.Slot == action.payload.destSlot,
				).length > 0
					? [
							...state.secondary.inventory.map((s) => {
								if (s?.Slot == action.payload.destSlot)
									return {
										...s,
										Count:
											s.Count +
											action.payload.origin.Count,
									};
								else return s;
							}),
					  ]
					: [
							...state.secondary.inventory,
							{
								...action.payload.origin,
								Slot: action.payload.destSlot,
							},
					  ];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(sInv, state.items) <= state.secondary.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_PLAYER_TO_SECONDARY': {
			let pInv = [
				...state.player.inventory.filter(
					(slot) => slot?.Slot != action.payload.originSlot,
				),
				...state.secondary.inventory
					.filter((s) => s?.Slot == action.payload.destSlot)
					.map((s) => ({
						...s,
						Slot: action.payload.originSlot,
					})),
			];
			let sInv = [
				...state.secondary.inventory.filter(
					(slot) => slot?.Slot != action.payload.destSlot,
				),
				...state.player.inventory
					.filter((s) => s?.Slot == action.payload.originSlot)
					.map((s) => ({
						...s,
						Slot: action.payload.destSlot,
					})),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(sInv, state.items) <= state.secondary.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'MOVE_ITEM_PLAYER_TO_SECONDARY': {
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let sInv = [
				...state.secondary.inventory,
				...state.player.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return { ...s, Slot: action.payload.destSlot };
					}),
				,
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(sInv, state.items) <= state.secondary.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'MERGE_ITEM_SECONDARY_TO_PLAYER': {
			let pInv = [
				...state.player.inventory.map((s) => {
					if (s?.Slot == action.payload.destSlot)
						return {
							...s,
							Count: s.Count + action.payload.origin.Count,
						};
					else return s;
				}),
			];
			let sInv = !Boolean(action.payload.origin.shop)
				? [
						...state.secondary.inventory.filter(
							(slot) =>
								Boolean(slot) &&
								slot?.Slot != action.payload.originSlot,
						),
				  ]
				: state.secondary.inventory;

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				(calcWeight(sInv, state.items) <= state.secondary.capacity ||
					action.payload.origin.shop)
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'SPLIT_ITEM_SECONDARY_TO_PLAYER': {
			let pInv =
				state.player.inventory.filter(
					(s) => s?.Slot == action.payload.destSlot,
				).length > 0
					? [
							...state.player.inventory.map((s) => {
								if (s?.Slot == action.payload.destSlot)
									return {
										...s,
										Count:
											s.Count +
											action.payload.origin.Count,
									};
								else return s;
							}),
					  ]
					: [
							...state.player.inventory,
							{
								...action.payload.origin,
								Slot: action.payload.destSlot,
							},
					  ];
			let sInv = !Boolean(action.payload.origin.shop)
				? [
						...state.secondary.inventory.map((slot) => {
							if (slot?.Slot == action.payload.originSlot) {
								return {
									...slot,
									Count:
										slot.Count -
										action.payload.origin.Count,
								};
							} else return slot;
						}),
				  ]
				: state.secondary.inventory;
			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				(calcWeight(sInv, state.items) <= state.secondary.capacity ||
					action.payload.origin.shop)
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_SECONDARY_TO_PLAYER': {
			let pInv = !Boolean(action.payload.origin.shop)
				? [
						...state.player.inventory.filter(
							(slot) => slot?.Slot != action.payload.destSlot,
						),
						...state.secondary.inventory
							.filter((s) => s?.Slot == action.payload.originSlot)
							.map((s) => ({
								...s,
								Slot: action.payload.destSlot,
							})),
				  ]
				: state.player.inventory;
			let sInv = !Boolean(action.payload.origin.shop)
				? [
						...state.secondary.inventory.filter(
							(slot) => slot?.Slot != action.payload.originSlot,
						),
						...state.player.inventory
							.filter((s) => s?.Slot == action.payload.destSlot)
							.map((s) => ({
								...s,
								Slot: action.payload.originSlot,
							})),
				  ]
				: state.secondary.inventory;

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				(calcWeight(sInv, state.items) <= state.secondary.capacity ||
					action.payload.origin.shop)
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'MOVE_ITEM_SECONDARY_TO_PLAYER': {
			let pInv = [
				...state.player.inventory,
				...state.secondary.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
							CreateDate: action.payload.origin.shop
								? Date.now() / 1000
								: s.CreateDate,
						};
					}),
			];
			let sInv = !action.payload.origin.shop
				? [
						...state.secondary.inventory.filter(
							(s) =>
								Boolean(s) &&
								s?.Slot != action.payload.originSlot,
						),
				  ]
				: state.secondary.inventory;

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				(calcWeight(sInv, state.items) <= state.secondary.capacity ||
					action.payload.origin.shop)
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'MOVE_ITEM_PLAYER_TO_UTILITY': {
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.player.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'MOVE_ITEM_UTILITY_TO_PLAYER': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
				};
			} else return state;
		}
		case 'MOVE_ITEM_UTILITY_SAME': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
			];

			if (calcWeight(uInv, state.items) <= state.utility.capacity) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'MOVE_ITEM_UTILITY_TO_SECONDARY': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let sInv = [
				...state.secondary.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
			];

			if (
				calcWeight(sInv, state.items) <= state.secondary.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'MERGE_ITEM_UTILITY_TO_SECONDARY': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let sInv = [
				...state.secondary.inventory.map((s) => {
					if (s?.Slot == action.payload.destSlot)
						return {
							...s,
							Count: s.Count + action.payload.origin.Count,
						};
					else return s;
				}),
			];

			if (
				calcWeight(sInv, state.items) <= state.secondary.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_UTILITY_TO_SECONDARY': {
			let uInv = [
				...state.utility.inventory.map((s) => {
					if (s?.Slot == action.payload.originSlot)
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					else return s;
				}),
			];
			let sInv = [
				...state.secondary.inventory.map((s) => {
					if (s?.Slot == action.payload.destSlot)
						return {
							...s,
							Slot: action.payload.originSlot,
						};
					else return s;
				}),
			];

			if (
				calcWeight(sInv, state.items) <= state.secondary.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'SPLIT_ITEM_UTILITY_TO_SECONDARY': {
			let uInv = [
				...state.utility.inventory.map((slot) => {
					if (slot?.Slot == action.payload.originSlot) {
						return {
							...slot,
							Count: slot.Count - action.payload.origin.Count,
						};
					} else return slot;
				}),
			];
			let sInv =
				state.secondary.inventory.filter(
					(s) => s?.Slot == action.payload.destSlot,
				).length > 0
					? [
							...state.secondary.inventory.map((s) => {
								if (s?.Slot == action.payload.destSlot)
									return {
										...s,
										Count:
											s.Count +
											action.payload.origin.Count,
									};
								else return s;
							}),
					  ]
					: [
							...state.secondary.inventory,
							{
								...action.payload.origin,
								Slot: action.payload.destSlot,
							},
					  ];

			if (
				calcWeight(sInv, state.items) <= state.secondary.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					secondary: {
						...state.secondary,
						disabled: {
							...state.secondary.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: sInv,
					},
				};
			} else return state;
		}
		case 'MERGE_ITEM_UTILITY_SAME': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
							Count: s.Count + action.payload.origin.Count,
						};
					}),
			];

			if (calcWeight(uInv, state.items) <= state.utility.capacity) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_UTILITY_SAME': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot && s?.Slot != action.payload.destSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.destSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.originSlot,
						};
					}),
			];

			if (calcWeight(uInv, state.items) <= state.utility.capacity) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'MOVE_ITEM_UTILITY_TO_BACKPACK': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let bInv = [
				...state.backpack.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
			];

			if (
				calcWeight(bInv, state.items) <= state.backpack.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'MERGE_ITEM_UTILITY_TO_BACKPACK': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let bInv = [
				...state.backpack.inventory.map((s) => {
					if (s?.Slot == action.payload.destSlot)
						return {
							...s,
							Count: s.Count + action.payload.origin.Count,
						};
					else return s;
				}),
			];

			if (
				calcWeight(bInv, state.items) <= state.backpack.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_UTILITY_TO_BACKPACK': {
			let uInv = [
				...state.utility.inventory.map((s) => {
					if (s?.Slot == action.payload.originSlot)
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					else return s;
				}),
			];
			let bInv = [
				...state.backpack.inventory.map((s) => {
					if (s?.Slot == action.payload.destSlot)
						return {
							...s,
							Slot: action.payload.originSlot,
						};
					else return s;
				}),
			];

			if (
				calcWeight(bInv, state.items) <= state.backpack.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'SPLIT_ITEM_UTILITY_TO_BACKPACK': {
			let uInv = [
				...state.utility.inventory.map((slot) => {
					if (slot?.Slot == action.payload.originSlot) {
						return {
							...slot,
							Count: slot.Count - action.payload.origin.Count,
						};
					} else return slot;
				}),
			];
			let bInv =
				state.backpack.inventory.filter(
					(s) => s?.Slot == action.payload.destSlot,
				).length > 0
					? [
							...state.backpack.inventory.map((s) => {
								if (s?.Slot == action.payload.destSlot)
									return {
										...s,
										Count:
											s.Count +
											action.payload.origin.Count,
									};
								else return s;
							}),
					  ]
					: [
							...state.backpack.inventory,
							{
								...action.payload.origin,
								Slot: action.payload.destSlot,
							},
					  ];

			if (
				calcWeight(bInv, state.items) <= state.backpack.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'MOVE_ITEM_BACKPACK_TO_UTILITY': {
			let bInv = [
				...state.backpack.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.backpack.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
			];

			if (
				calcWeight(uInv, state.items) <= state.utility.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: bInv,
					},
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'MERGE_ITEM_BACKPACK_TO_UTILITY': {
			let bInv = [
				...state.backpack.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let uInv = [
				...state.utility.inventory.map((s) => {
					if (s?.Slot == action.payload.destSlot)
						return {
							...s,
							Count: s.Count + action.payload.origin.Count,
						};
					else return s;
				}),
			];

			if (
				calcWeight(uInv, state.items) <= state.utility.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: bInv,
					},
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_BACKPACK_TO_UTILITY': {
			let bInv = [
				...state.backpack.inventory.map((s) => {
					if (s?.Slot == action.payload.originSlot)
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					else return s;
				}),
			];
			let uInv = [
				...state.utility.inventory.map((s) => {
					if (s?.Slot == action.payload.destSlot)
						return {
							...s,
							Slot: action.payload.originSlot,
						};
					else return s;
				}),
			];

			if (
				calcWeight(uInv, state.items) <= state.utility.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: bInv,
					},
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'SPLIT_ITEM_BACKPACK_TO_UTILITY': {
			let bInv = [
				...state.backpack.inventory.map((slot) => {
					if (slot?.Slot == action.payload.originSlot) {
						return {
							...slot,
							Count: slot.Count - action.payload.origin.Count,
						};
					} else return slot;
				}),
			];
			let uInv =
				state.utility.inventory.filter(
					(s) => s?.Slot == action.payload.destSlot,
				).length > 0
					? [
							...state.utility.inventory.map((s) => {
								if (s?.Slot == action.payload.destSlot)
									return {
										...s,
										Count:
											s.Count +
											action.payload.origin.Count,
									};
								else return s;
							}),
					  ]
					: [
							...state.utility.inventory,
							{
								...action.payload.origin,
								Slot: action.payload.destSlot,
							},
					  ];

			if (
				calcWeight(uInv, state.items) <= state.utility.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: bInv,
					},
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'SPLIT_ITEM_UTILITY_SAME': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
							Count: action.payload.origin.Count,
						};
					}),
			];

			if (calcWeight(uInv, state.items) <= state.utility.capacity) {
				return {
					...state,
					utility: {
						...state.utility,
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'MERGE_ITEM_PLAYER_TO_UTILITY': {
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.player.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
							Count: s.Count + action.payload.origin.Count,
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_PLAYER_TO_UTILITY': {
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.destSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.originSlot,
						};
					}),
			];
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.player.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'SPLIT_ITEM_PLAYER_TO_UTILITY': {
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.player.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
							Count: action.payload.origin.Count,
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: uInv,
					},
				};
			} else return state;
		}
		case 'MERGE_ITEM_UTILITY_TO_PLAYER': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
							Count: s.Count + action.payload.origin.Count,
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_UTILITY_TO_PLAYER': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
				...state.player.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.destSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.originSlot,
						};
					}),
			];
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
				};
			} else return state;
		}
		case 'SPLIT_ITEM_UTILITY_TO_PLAYER': {
			let uInv = [
				...state.utility.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.utility.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
							Count: action.payload.origin.Count,
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(uInv, state.items) <= state.utility.capacity
			) {
				return {
					...state,
					utility: {
						...state.utility,
						disabled: {
							...state.utility.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: uInv,
					},
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
				};
			} else return state;
		}
		case 'MOVE_ITEM_BACKPACK_TO_PLAYER': {
			let bInv = [
				...state.backpack.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.backpack.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: bInv,
					},
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
				};
			} else return state;
		}
		case 'MERGE_ITEM_BACKPACK_TO_PLAYER': {
			let bInv = [
				...state.backpack.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let pInv = [
				...state.player.inventory.map((s) => {
					if (s?.Slot == action.payload.destSlot)
						return {
							...s,
							Count: s.Count + action.payload.origin.Count,
						};
					else return s;
				}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: bInv,
					},
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_BACKPACK_TO_PLAYER': {
			
			// Backpack inventory'den origin slot'u çıkar, player'dan dest slot'u ekle
			let bInv = [
				...state.backpack.inventory.filter(
					(slot) => slot?.Slot != action.payload.originSlot,
				),
				...state.player.inventory
					.filter((s) => s?.Slot == action.payload.destSlot)
					.map((s) => ({
						...s,
						Slot: action.payload.originSlot,
					})),
			];
			
			// Player inventory'den dest slot'u çıkar, backpack'ten origin slot'u ekle
			let pInv = [
				...state.player.inventory.filter(
					(slot) => slot?.Slot != action.payload.destSlot,
				),
				...state.backpack.inventory
					.filter((s) => s?.Slot == action.payload.originSlot)
					.map((s) => ({
						...s,
						Slot: action.payload.destSlot,
					})),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: bInv,
					},
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
				};
			} else return state;
		}
		case 'SPLIT_ITEM_BACKPACK_TO_PLAYER': {
			let bInv = [
				...state.backpack.inventory.map((slot) => {
					if (slot?.Slot == action.payload.originSlot) {
						return {
							...slot,
							Count: slot.Count - action.payload.origin.Count, // Kalan miktar
						};
					}
					return slot;
				}),
			];
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.backpack.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
							Count: action.payload.origin.Count, // Split edilen miktar
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: bInv,
					},
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
				};
			} else return state;
		}
		case 'MOVE_ITEM_PLAYER_TO_BACKPACK': {
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let bInv = [
				...state.backpack.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.player.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'MERGE_ITEM_PLAYER_TO_BACKPACK': {
			let pInv = [
				...state.player.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.originSlot,
				),
			];
			let bInv = [
				...state.backpack.inventory.map((s) => {
					if (s?.Slot == action.payload.destSlot)
						return {
							...s,
							Count: s.Count + action.payload.origin.Count,
						};
					else return s;
				}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_PLAYER_TO_BACKPACK': {
			
			// Player inventory'den origin slot'u çıkar, backpack'ten dest slot'u ekle
			let pInv = [
				...state.player.inventory.filter(
					(slot) => slot?.Slot != action.payload.originSlot,
				),
				...state.backpack.inventory
					.filter((s) => s?.Slot == action.payload.destSlot)
					.map((s) => ({
						...s,
						Slot: action.payload.originSlot,
					})),
			];
			
			// Backpack inventory'den dest slot'u çıkar, player'dan origin slot'u ekle
			let bInv = [
				...state.backpack.inventory.filter(
					(slot) => slot?.Slot != action.payload.destSlot,
				),
				...state.player.inventory
					.filter((s) => s?.Slot == action.payload.originSlot)
					.map((s) => ({
						...s,
						Slot: action.payload.destSlot,
					})),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: pInv,
					},
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else {
				return state;
			}
		}
		case 'SPLIT_ITEM_PLAYER_TO_BACKPACK': {
			let pInv = [
				...state.player.inventory.map((slot) => {
					if (slot?.Slot == action.payload.originSlot) {
						return {
							...slot,
							Count: slot.Count - action.payload.origin.Count, // Kalan miktar
						};
					}
					return slot;
				}),
			];
			let bInv = [
				...state.backpack.inventory.filter(
					(s) => Boolean(s) && s?.Slot != action.payload.destSlot,
				),
				...state.player.inventory
					.filter(
						(s) =>
							Boolean(s) && s?.Slot == action.payload.originSlot,
					)
					.map((s) => {
						return {
							...s,
							Slot: action.payload.destSlot,
							Count: action.payload.origin.Count, // Split edilen miktar
						};
					}),
			];

			if (
				calcWeight(pInv, state.items) <= state.player.capacity &&
				calcWeight(bInv, state.items) <= state.backpack.capacity
			) {
				return {
					...state,
					player: {
						...state.player,
						disabled: {
							...state.player.disabled,
							[action.payload.originSlot]: true,
						},
						inventory: pInv,
					},
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.destSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'USE_ITEM_PLAYER':
			const player = state.player.inventory;
			const disabled = state.player.disabled;
			useItem(action.payload, player, disabled);
			return {
				...state,
				player: {
					...state.player,
					disabled,
					inventory: player,
				},
			};
		case 'USE_ITEM_UTILITY':
			const utility = state.utility.inventory;
			const utilityDisabled = state.utility.disabled;
			useItem(action.payload, utility, utilityDisabled);
			return {
				...state,
				utility: {
					...state.utility,
					disabled: utilityDisabled,
					inventory: utility,
				},
			};
		case 'SLOT_NOT_USED_UTILITY':
			const utilityDisabled2 = state.utility.disabled;
			utilityDisabled2[action.payload.originSlot] = false;
			return {
				...state,
				utility: {
					...state.utility,
					disabled: utilityDisabled2,
				},
			};
		case 'MOVE_ITEM_BACKPACK_SAME': {
			let bInv = [
				...state.backpack.inventory.filter(
					(slot) => slot?.Slot != action.payload.originSlot,
				),
				...state.backpack.inventory
					.filter((s) => s?.Slot == action.payload.originSlot)
					.map((s) => ({
						...s,
						Slot: action.payload.destSlot,
					})),
			];

			if (calcWeight(bInv, state.items) <= state.backpack.capacity) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
							[action.payload.destSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'MERGE_ITEM_BACKPACK_SAME': {
			let bInv = [...state.backpack.inventory];
			let originSlot = bInv.find((s) => s?.Slot == action.payload.originSlot);
			let destSlot = bInv.find((s) => s?.Slot == action.payload.destSlot);

			if (originSlot && destSlot) {
				destSlot.Count += originSlot.Count;
				bInv = bInv.filter((s) => s?.Slot != action.payload.originSlot);
			}

			if (calcWeight(bInv, state.items) <= state.backpack.capacity) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
							[action.payload.destSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'SWAP_ITEM_BACKPACK_SAME': {
			let bInv = [...state.backpack.inventory];
			let originSlot = bInv.find((s) => s?.Slot == action.payload.originSlot);
			let destSlot = bInv.find((s) => s?.Slot == action.payload.destSlot);

			if (originSlot && destSlot) {
				originSlot.Slot = action.payload.destSlot;
				destSlot.Slot = action.payload.originSlot;
			}

			if (calcWeight(bInv, state.items) <= state.backpack.capacity) {
				return {
					...state,
					backpack: {
						...state.backpack,
						disabled: {
							...state.backpack.disabled,
							[action.payload.originSlot]: true,
							[action.payload.destSlot]: true,
						},
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'SPLIT_ITEM_BACKPACK_SAME': {
			let bInv = [...state.backpack.inventory];
			let originSlot = bInv.find((s) => s?.Slot == action.payload.originSlot);
			let destSlot = bInv.find((s) => s?.Slot == action.payload.destSlot);
			
			// Split count'u hesapla
			const splitCount = action.payload.origin.Count;

			if (originSlot && !destSlot) {
				// Boş slota split
				originSlot.Count -= splitCount;
				bInv.push({
					...originSlot,
					Slot: action.payload.destSlot,
					Count: splitCount,
				});
			} else if (originSlot && destSlot) {
				// Dolu slota split (merge)
				originSlot.Count -= splitCount;
				destSlot.Count += splitCount;
			}

			if (calcWeight(bInv, state.items) <= state.backpack.capacity) {
				return {
					...state,
					backpack: {
						...state.backpack,
						inventory: bInv,
					},
				};
			} else return state;
		}
		case 'APP_HIDE':
			return {
				...state,
				hover: null,
				hoverOrigin: null,
			};
		default:
			return state;
	}
};

// Actually what the fuck is this reducer code at this point
const calcWeight = (inv, items) => {
	return inv
		.filter((a) => Boolean(a))
		.reduce((a, b) => {
			return a + (items[b.Name]?.weight || 0) * b.Count;
		}, 0);
};

const useItem = (payload, origin, disabled) => {
	disabled[payload.originSlot] = true;
	// if (origin[payload.originSlot].Count > 1) {
	// 	origin[payload.originSlot].Count = origin[payload.originSlot].Count - 1;
	// } else {
	// 	delete origin[payload.originSlot];
	// }
};

export default appReducer;
