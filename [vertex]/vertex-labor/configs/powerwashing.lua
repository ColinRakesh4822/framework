_sanitationReputation = {
    id = "Sanitation",
    label = "Sanitation",
    levels = {
        { label = "Level 0", value = 0 },
        { label = "Level 1", value = 100 },
        { label = "Level 2", value = 200 },
        { label = "Level 3", value = 300 },
    },
    hidden = false,
}

_sanitationPayment = {
    [0] = {
        minPay = 200,
        maxPay = 250,
        repReward = 1.5,
    },
    [1] = {
        minPay = 250,
        maxPay = 300,
        repReward = 1.5,
    },
    [2] = {
        minPay = 300,
        maxPay = 350,
        repReward = 1.5,
    },
    [3] = {
        minPay = 350,
        maxPay = 400,
        repReward = 1.5,
    },
}

function GetSanitationPayment(level)
    local paymentConfig = _sanitationPayment[level] or _sanitationPayment[0]
    local payment = math.random(paymentConfig.minPay, paymentConfig.maxPay)
    return payment, paymentConfig.repReward
end

_sanitationJobs = {
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
