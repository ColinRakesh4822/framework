AddEventHandler('Characters:Shared:DependencyUpdate', RetrieveComponents)
function RetrieveComponents()
	Middleware = exports['vertex-base']:FetchComponent('Middleware')
	Database = exports['vertex-base']:FetchComponent('Database')
	Callbacks = exports['vertex-base']:FetchComponent('Callbacks')
	DataStore = exports['vertex-base']:FetchComponent('DataStore')
	Logger = exports['vertex-base']:FetchComponent('Logger')
	Database = exports['vertex-base']:FetchComponent('Database')
	Fetch = exports['vertex-base']:FetchComponent('Fetch')
	Logger = exports['vertex-base']:FetchComponent('Logger')
	Chat = exports['vertex-base']:FetchComponent('Chat')
	GlobalConfig = exports['vertex-base']:FetchComponent('Config')
	Routing = exports['vertex-base']:FetchComponent('Routing')
	Sequence = exports['vertex-base']:FetchComponent('Sequence')
	Reputation = exports['vertex-base']:FetchComponent('Reputation')
	Apartment = exports['vertex-base']:FetchComponent('Apartment')
	RegisterCommands()
	_spawnFuncs = {}
end

AddEventHandler('Core:Shared:Ready', function()
	exports['vertex-base']:RequestDependencies('Characters', {
		'Callbacks',
		'Database',
		'Middleware',
		'DataStore',
		'Logger',
		'Database',
		'Fetch',
		'Logger',
		'Chat',
		'Config',
		'Routing',
		'Sequence',
		'Reputation',
		'Apartment',
	}, function(error)
		if #error > 0 then return end -- Do something to handle if not all dependencies loaded
		RetrieveComponents()
		RegisterCallbacks()
		RegisterMiddleware()
		Startup()
	end)
end)