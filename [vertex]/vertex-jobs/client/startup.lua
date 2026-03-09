AddEventHandler('Jobs:Shared:DependencyUpdate', RetrieveComponents)
function RetrieveComponents()
    Callbacks = exports['vertex-base']:FetchComponent('Callbacks')
    Logger = exports['vertex-base']:FetchComponent('Logger')
    Utils = exports['vertex-base']:FetchComponent('Utils')
    Notification = exports['vertex-base']:FetchComponent('Notification')
    Jobs = exports['vertex-base']:FetchComponent('Jobs')
end

AddEventHandler('Core:Shared:Ready', function()
    exports['vertex-base']:RequestDependencies('Jobs', {
        'Callbacks',
        'Logger',
        'Utils',
        'Notification',
        'Jobs',
    }, function(error)
        if #error > 0 then return; end
        RetrieveComponents()
    end)
end)