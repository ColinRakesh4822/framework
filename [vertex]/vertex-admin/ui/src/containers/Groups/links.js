export default (type) => {
	switch (type) {
	  case "Owner":
	  case "Admin":
		return admin;
	  case "Developer":
		return developer;
	  default:
		return staff;
	}
  };

const staff = [
	{
		name: 'home',
		icon: ['fas', 'house'],
		label: 'Dashboard',
		path: '/',
		exact: true,
	},
	{
		name: 'players',
		icon: ['fas', 'user-large'],
		label: 'Players',
		path: '/players',
		exact: true,
	},
	{
		name: 'disconnected-players',
		icon: ['fas', 'user-large-slash'],
		label: 'Disconnected Players',
		path: '/disconnected-players',
		exact: true,
	},
	// {
	// 	name: 'current-vehicle',
	// 	icon: ['fas', 'car-side'],
	// 	label: 'Current Vehicle',
	// 	path: '/current-vehicle',
	// 	exact:  true,
	// }
];

const admin = [
	{
		name: 'home',
		icon: ['fas', 'house'],
		label: 'Dashboard',
		path: '/',
		exact: true,
	},
    {
		name: 'players',
		icon: ['fas', 'user-large'],
		label: 'Players',
		path: '/players',
		exact: true,
	},
	{
		name: 'disconnected-players',
		icon: ['fas', 'user-large-slash'],
		label: 'Disconnected Players',
		path: '/disconnected-players',
		exact: true,
	},
	{
		name: 'current-vehicle',
		icon: ['fas', 'car-side'],
		label: 'Current Vehicle',
		path: '/current-vehicle',
		exact:  true,
	},
	{
		name: 'items-database',
		icon: ['fas', 'box-open'],
		label: 'Items Database',
		path: '/items-database',
		exact: true,
	},
	{
		name: 'door-lock-tool',
		icon: ['fas', 'door-open'],
		label: 'Door Lock Tool',
		path: '/door-lock-tool',
		exact: true,
	},
	{
		name: 'elevator-tool',
		icon: ['fas', 'elevator'],
		label: 'Elevator Tool',
		path: '/elevator-tool',
		exact: true,
	},
	{
		name: 'ped-management',
		icon: ['fas', 'person'],
		label: 'Ped Management',
		path: '/ped-management',
		exact: true,
	}
];

const developer = [
	{
		name: 'home',
		icon: ['fas', 'house'],
		label: 'Dashboard',
		path: '/',
		exact: true,
	},
    {
		name: 'players',
		icon: ['fas', 'user-large'],
		label: 'Players',
		path: '/players',
		exact: true,
	},
	{
		name: 'disconnected-players',
		icon: ['fas', 'user-large-slash'],
		label: 'Disconnected Players',
		path: '/disconnected-players',
		exact: true,
	},
	{
		name: 'current-vehicle',
		icon: ['fas', 'car-side'],
		label: 'Current Vehicle',
		path: '/current-vehicle',
		exact:  true,
	},
	{
		name: 'items-database',
		icon: ['fas', 'box-open'],
		label: 'Items Database',
		path: '/items-database',
		exact: true,
	},
	{
		name: 'door-lock-tool',
		icon: ['fas', 'door-open'],
		label: 'Door Lock Tool',
		path: '/door-lock-tool',
		exact: true,
	},
	{
		name: 'elevator-tool',
		icon: ['fas', 'elevator'],
		label: 'Elevator Tool',
		path: '/elevator-tool',
		exact: true,
	},
	{
		name: 'ped-management',
		icon: ['fas', 'person'],
		label: 'Ped Management',
		path: '/ped-management',
		exact: true,
	}
];