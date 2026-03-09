Config = Config or {}

-- Reputation system configuration
Config.Reputation = {
    id = "Sanitation",
    label = "Sanitation",
    levels = {
        { label = "Level 0", value = 0 },
        { label = "Level 1", value = 100 },
        { label = "Level 2", value = 200 },
        { label = "Level 3", value = 300 },
    },
    hidden = false, -- Shows in Labor app
}

-- Payment configuration based on reputation level
-- Each level has: minPay (minimum random amount), maxPay (maximum random amount), repReward (reputation gained)
Config.Payment = {
    [0] = { -- Level 0
        minPay = 200,
        maxPay = 250,
        repReward = 1.5,
    },
    [1] = { -- Level 1
        minPay = 250,
        maxPay = 300,
        repReward = 1.5,
    },
    [2] = { -- Level 2
        minPay = 300,
        maxPay = 350,
        repReward = 1.5,
    },
    [3] = { -- Level 3
        minPay = 350,
        maxPay = 400,
        repReward = 1.5,
    },
}

-- Function to get payment based on reputation level
function Config.GetPayment(level)
    local paymentConfig = Config.Payment[level] or Config.Payment[0]
    local payment = math.random(paymentConfig.minPay, paymentConfig.maxPay)
    return payment, paymentConfig.repReward
end

