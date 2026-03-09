local Washing = {}


local Callbacks = nil
local Logger = nil
local Fetch = nil
local Wallet = nil
local Reputation = nil
local Execute = nil
local Labor = nil
local Phone = nil

AddEventHandler("Sanitation:Shared:DependencyUpdate", RetrieveComponents)

function RetrieveComponents()
    Callbacks = exports['mythic-base']:FetchComponent("Callbacks")
    Logger = exports['mythic-base']:FetchComponent("Logger")
    Fetch = exports['mythic-base']:FetchComponent("Fetch")
    Wallet = exports['mythic-base']:FetchComponent("Wallet")
    Reputation = exports['mythic-base']:FetchComponent("Reputation")
    Execute = exports['mythic-base']:FetchComponent("Execute")
    Labor = exports['mythic-base']:FetchComponent("Labor")
    Phone = exports['mythic-base']:FetchComponent("Phone")
end

local setupEvent = nil
setupEvent = AddEventHandler("Core:Shared:Ready", function()
    exports['mythic-base']:RequestDependencies("Sanitation", {
        "Callbacks",
        "Logger",
        "Fetch",
        "Wallet",
        "Reputation",
        "Execute",
        "Labor",
        "Phone"
    }, function(error)
        if #error > 0 then
            Logger:Error("Sanitation", "Failed to load dependencies: " .. table.concat(error, ", "))
            return
        end
        RetrieveComponents()
        
        
        Reputation:Create(Config.Reputation.id, Config.Reputation.label, Config.Reputation.levels, Config.Reputation.hidden)
        
        RegisterCallbacks()
        RemoveEventHandler(setupEvent)
    end)
end)


AddEventHandler("Sanitation:Server:OnDuty", function(joiner, members, isWorkgroup)
    local success, activeJob = Washing.JobManager.StartJob(joiner)
    
    if not success or not activeJob or not activeJob.job then
        return
    end
    
    local Fetch = exports['mythic-base']:FetchComponent("Fetch")
    local Phone = exports['mythic-base']:FetchComponent("Phone")
    local Labor = exports['mythic-base']:FetchComponent("Labor")
    
    local char = Fetch:Source(joiner):GetData("Character")
    if char then
        char:SetData("TempJob", "Sanitation")
    end
    
    Phone.Notification:Add(joiner, "Labor Activity", "You started a job", os.time() * 1000, 6000, "labor", {})
    
    
    TriggerClientEvent("Sanitation:Client:StartJobFromLabor", joiner, activeJob)
    
    
    if Labor and Labor.Offers then
        Labor.Offers:Task(joiner, "Sanitation", "Head to the marked location")
    end
end)


AddEventHandler("Sanitation:Server:OffDuty", function(source, joiner)
    local Labor = exports['mythic-base']:FetchComponent("Labor")
    
    Washing.JobManager.RemoveActiveJob(joiner)
    TriggerClientEvent("Sanitation:Client:StopJobFromLabor", source)
    
    if Labor and Labor.Offers then
        Labor.Offers:Cancel(joiner, "Sanitation")
    end
end)


RegisterNetEvent("Sanitation:Server:StartProgress", function(maxProgress)
    local _source = source
    local Labor = exports['mythic-base']:FetchComponent("Labor")
    if Labor and Labor.Offers then
        
        Washing.JobManager.ProgressTracker[_source] = {
            actualMax = maxProgress,
            scaledCurrent = 0,
            actualCurrent = 0
        }
        
        Labor.Offers:Start(_source, "Sanitation", "Pressure Washing", 100)
    end
end)


RegisterNetEvent("Sanitation:Server:UpdateProgress", function(cleaned)
    local _source = source
    local Labor = exports['mythic-base']:FetchComponent("Labor")
    if Labor and Labor.Offers then
        local tracker = Washing.JobManager.ProgressTracker[_source]
        if tracker then
            local lastActual = tracker.actualCurrent or 0
            local change = cleaned - lastActual
            
            if change > 0 then
                tracker.actualCurrent = cleaned
                
                
                local scaledCurrent = math.floor((cleaned / tracker.actualMax) * 100)
                local lastScaled = tracker.scaledCurrent or 0
                local scaledChange = scaledCurrent - lastScaled
                
                if scaledChange > 0 then
                    
                    Labor.Offers:Update(_source, "Sanitation", scaledChange, true)
                    tracker.scaledCurrent = scaledCurrent
                end
            end
        end
    end
end)


Washing.Jobs = {
    {
        id = 1,
        number = 400,
        active = false,
        normal = vector3(0.6428123, 0.7660238, 1.875947e-08),
        top_left = vector3(4.796479, -1812.404, 27.14234),
        top_right = vector3(1.239473, -1809.419, 27.17391),
    },
    {
        id = 2,
        number = 400,
        active = false,
        normal = vector3(0, 1, 0),
        top_left = vector3(177.0191, -1089.551, 31.10608),
        top_right = vector3(180.1038, -1089.551, 31.06399),
    },
    {
        id = 3,
        number = 400,
        active = false,
        normal = vector3(5.525121e-06, 0.9999999, 1.839647e-05),
        top_left = vector3(358.3693, -1170.505, 31.094),
        top_right = vector3(353.2865, -1170.505, 31.12812),
    },
    {
        id = 4,
        number = 400,
        active = false,
        normal = vector3(-0, 1, -6.279741e-08),
        top_left = vector3(-303.2265, -1263.643, 32.84874),
        top_right = vector3(-308.6342, -1263.643, 32.8085),
    },
    {
        id = 5,
        number = 400,
        active = false,
        normal = vector3(0.3419764, 0.9397085, 0),
        top_left = vector3(-22.04973, -576.0497, 40.32553),
        top_right = vector3(-25.79311, -574.6874, 40.29335),
    },
    {
        id = 6,
        number = 400,
        active = false,
        normal = vector3(0.3420732, 0.9396732, 1.752186e-06),
        top_left = vector3(147.4655, -610.3481, 49.04719),
        top_right = vector3(143.1537, -608.7785, 49.03281),
    },
    {
        id = 7,
        number = 400,
        active = false,
        normal = vector3(0.008407774, 0.9999647, -1.973205e-06),
        top_left = vector3(-1028.557, 243.4483, 66.79952),
        top_right = vector3(-1032.586, 243.4822, 66.83713),
    },
    {
        id = 8,
        number = 400,
        active = false,
        normal = vector3(0.3417394, 0.9397947, 8.019108e-06),
        top_left = vector3(-299.3962, -1027.616, 32.55412),
        top_right = vector3(-303.0261, -1026.296, 32.51296),
    },
    {
        id = 9,
        number = 400,
        active = false,
        normal = vector3(0.3417394, 0.9397947, 8.019108e-06),
        top_left = vector3(-299.3962, -1027.616, 32.55412),
        top_right = vector3(-303.0261, -1026.296, 32.51296),
    },
    {
        id = 10,
        number = 400,
        active = false,
        normal = vector3(0.325884, 0.9454103, 0),
        top_left = vector3(-217.2907, -189.1051, 46.02393),
        top_right = vector3(-221.1705, -187.7677, 46.04627),
    },
    {
        id = 11,
        number = 400,
        active = false,
        normal = vector3(0.642777, 0.7660533, -5.486821e-05),
        top_left = vector3(299.1496, -1337.23, 33.80934),
        top_right = vector3(295.7375, -1334.367, 33.88903),
    },
    {
        id = 12,
        number = 400,
        active = false,
        normal = vector3(0.642763, 0.7660651, 2.344055e-07),
        top_left = vector3(78.56794, -1447.578, 31.0815),
        top_right = vector3(76.06629, -1445.479, 31.13297),
    },
    {
        id = 13,
        number = 400,
        active = false,
        normal = vector3(0.5298674, 0.8480806, 0.0001205094),
        top_left = vector3(1093.635, 240.1376, 82.83965),
        top_right = vector3(1090.7, 241.9825, 82.7776),
    },
    {
        id = 14,
        number = 400,
        active = false,
        normal = vector3(0.4225979, 0.9063173, -2.566608e-08),
        top_left = vector3(402.8473, -2012.927, 24.73296),
        top_right = vector3(400.1744, -2011.681, 24.80918),
    },
    {
        id = 15,
        number = 400,
        active = false,
        normal = vector3(2.857935e-06, 1, 1.052344e-05),
        top_left = vector3(834.8087, -1277.01, 28.13576),
        top_right = vector3(831.0789, -1277.01, 28.26916),
    },
}

Washing.JobManager = {}
Washing.JobManager.ActiveJobs = {}
Washing.JobManager.ProgressTracker = {} 

Washing.JobManager.StartJob = function(source)
    local formatted_player = source
    if Washing.JobManager.ActiveJobs[formatted_player] then
        return false, {}, 'You already have an active job.'
    end

    local job_insert = Washing.JobManager.CreateActiveJob(formatted_player, source)

    if not job_insert then
        return false, {}, 'There are currently no jobs available, try again later.'
    end

    return true, job_insert
end

Washing.JobManager.FinishJob = function(player)
    local formatted_player = player
    Washing.JobManager.RemoveActiveJob(formatted_player)
end

Washing.JobManager.GetActiveJob = function(formatted_player)
    for k, v in pairs(Washing.JobManager.ActiveJobs) do
        if v.player == formatted_player then
            return Washing.JobManager.ActiveJobs[k]
        end
    end
end

Washing.JobManager.RemoveActiveJob = function(formatted_player)
    if not formatted_player or not Washing.JobManager.ActiveJobs[formatted_player] then
        return false
    end

    local activeJob = Washing.JobManager.ActiveJobs[formatted_player]
    local _source = activeJob.source
    
    if not activeJob.job or not _source then
        Washing.JobManager.ActiveJobs[formatted_player] = nil
        if Washing.JobManager.ProgressTracker[_source] then
            Washing.JobManager.ProgressTracker[_source] = nil
        end
        return false
    end
    
    TriggerClientEvent('Sanitation:ResetWashingJob', _source)
    
    for key, job in pairs(Washing.Jobs) do
        if job.id == activeJob.job.id then
            Washing.Jobs[key].active = false
            break
        end
    end

    Washing.JobManager.ActiveJobs[formatted_player] = nil
    if Washing.JobManager.ProgressTracker[_source] then
        Washing.JobManager.ProgressTracker[_source] = nil
    end

    return true
end

Washing.JobManager.GetAvailableJob = function()
    local available_jobs = {}
    for job, data in pairs(Washing.Jobs) do
        if not data['active'] then
            table.insert(available_jobs, job)
        end
    end

    if #available_jobs == 0 then
        return false
    end

    local job = available_jobs[math.random(#available_jobs)]
    Washing.Jobs[job].active = true

    return Washing.Jobs[job]
end

Washing.JobManager.CreateActiveJob = function(formatted_player, source)
    if Washing.JobManager.ActiveJobs[formatted_player] then
        return nil
    end

    Washing.JobManager.ActiveJobs[formatted_player] = {
        ['player'] = formatted_player,
        ['source'] = source,
        ['job'] = Washing.JobManager.GetAvailableJob()
    }

    if not Washing.JobManager.ActiveJobs[formatted_player].job then
        return nil
    end

    Washing.JobManager.ExpireJob(formatted_player)
    return Washing.JobManager.ActiveJobs[formatted_player]
end

Washing.JobManager.ExpireJob = function(formatted_player)
    
end

function RegisterCallbacks()
    
    Callbacks:RegisterServerCallback("Sanitation:StartWashingJob", function(source, data, cb)
        local _source = source
        local success, job, message = Washing.JobManager.StartJob(_source)
        if not success then
            cb(false, {})
            return
        end
        cb(true, job)
    end)

    Callbacks:RegisterServerCallback("Sanitation:FinishWashingJob", function(source, data, cb)
        local _source = source
        local Player = Fetch:Source(_source)
        if not Player then
            Logger:Error("Sanitation", string.format("Failed to get player for source %s", _source))
            cb(false)
            return
        end
        
        local Char = Player:GetData('Character')
        if not Char then
            Logger:Error("Sanitation", string.format("Failed to get character for source %s", _source))
            cb(false)
            return
        end
        
        
        local repLevel = Reputation:GetLevel(_source, "Sanitation") or 0
        
        
        local moneyReward, repReward = Config.GetPayment(repLevel)
        
        
        Reputation.Modify:Add(_source, "Sanitation", repReward)
        Logger:Info("Sanitation", string.format("Added %.1f reputation to player %s (Level %d)", repReward, _source, repLevel))
        
        
        local cashAdded = Wallet:Modify(_source, moneyReward, true)
        if cashAdded == false then
            Logger:Error("Sanitation", string.format("Failed to add $%d to player %s", moneyReward, _source))
            cb(false)
            return
        end
        
        Logger:Info("Sanitation", string.format("Player %s (Level %d) received $%d for completing pressure washing job", _source, repLevel, moneyReward))
        
        
        if Labor and Labor.Offers then
            Labor.Offers:ManualFinish(_source, "Sanitation")
        end
        
        
        Phone.Notification:Add(_source, "Labor Activity", 
            string.format("You received $%d in cash for completing the pressure washing job! (Level %d)", moneyReward, repLevel),
            os.time() * 1000, 6000, "labor", {})
        
        
        Washing.JobManager.FinishJob(_source)
        
        cb(true)
    end)
end



RegisterNetEvent('Sanitation:Server:ResetWashingJob', function()
    local _source = source
    Washing.JobManager.RemoveActiveJob(_source)
end)

AddEventHandler('playerDropped', function()
    local _source = source
    if Washing.JobManager.ActiveJobs[_source] then
        Washing.JobManager.RemoveActiveJob(_source)
    end
    if Washing.JobManager.ProgressTracker[_source] then
        Washing.JobManager.ProgressTracker[_source] = nil
    end
end)

AddEventHandler("Proxy:Shared:RegisterReady", function()
    exports["base"]:RegisterComponent("Sanitation", {})
end)
