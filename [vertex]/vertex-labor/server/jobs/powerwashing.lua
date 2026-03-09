local Washing = {}




AddEventHandler("Sanitation:Server:OnDuty", function(joiner, members, isWorkgroup)
    local success, activeJob = Washing.JobManager.StartJob(joiner)

    if not success or not activeJob or not activeJob.job then
        return
    end

    local Fetch = exports['vertex-base']:FetchComponent("Fetch")
    local Phone = exports['vertex-base']:FetchComponent("Phone")
    local Labor = exports['vertex-base']:FetchComponent("Labor")

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
    local Labor = exports['vertex-base']:FetchComponent("Labor")

    Washing.JobManager.RemoveActiveJob(joiner)
    TriggerClientEvent("Sanitation:Client:StopJobFromLabor", source)

    if Labor and Labor.Offers then
        Labor.Offers:Cancel(joiner, "Sanitation")
    end
end)


RegisterNetEvent("Sanitation:Server:StartProgress", function(maxProgress)
    local _source = source
    local Labor = exports['vertex-base']:FetchComponent("Labor")
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
    local Labor = exports['vertex-base']:FetchComponent("Labor")
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


Washing.Jobs = _sanitationJobs

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

AddEventHandler("Labor:Server:Startup", function()
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


        local moneyReward, repReward = GetSanitationPayment(repLevel)


        Reputation.Modify:Add(_source, "Sanitation", repReward)
        Logger:Info("Sanitation",
            string.format("Added %.1f reputation to player %s (Level %d)", repReward, _source, repLevel))


        local cashAdded = Wallet:Modify(_source, moneyReward, true)
        if cashAdded == false then
            Logger:Error("Sanitation", string.format("Failed to add $%d to player %s", moneyReward, _source))
            cb(false)
            return
        end

        Logger:Info("Sanitation",
            string.format("Player %s (Level %d) received $%d for completing pressure washing job", _source, repLevel,
                moneyReward))


        if Labor and Labor.Offers then
            Labor.Offers:ManualFinish(_source, "Sanitation")
        end


        Phone.Notification:Add(_source, "Labor Activity",
            string.format("You received $%d in cash for completing the pressure washing job! (Level %d)", moneyReward,
                repLevel),
            os.time() * 1000, 6000, "labor", {})


        Washing.JobManager.FinishJob(_source)

        cb(true)
    end)
end)



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
