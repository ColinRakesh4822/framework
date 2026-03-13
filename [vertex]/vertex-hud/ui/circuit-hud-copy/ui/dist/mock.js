// Mock NUI events
window.postMessage({
    type: "OPEN_SETTINGS",
    data: {}
});
window.postMessage({
    type: "SET_RADAR_STATE",
    data: { showing: true }
});
window.postMessage({
    type: "UPDATE_HP",
    data: { hp: 80, armor: 50, hunger: 70, thirst: 90, stress: 10 }
});
window.postMessage({
    type: "TOGGLE_HUD",
    data: { show: true }
});
window.postMessage({
    type: "TOGGLE_VEHICLE",
    data: { show: true }
});
window.postMessage({
    type: "UPDATE_SPEED",
    data: { speed: 120 }
});
window.postMessage({
    type: "SHOW_SEATBELT",
    data: { show: true }
});
window.postMessage({
    type: "UPDATE_RPM",
    data: { rpm: 60, gear: 4 }
});
window.postMessage({
    type: "UPDATE_NOS",
    data: { nos: 50, active: true }
});
window.postMessage({
    type: "DISPLAY_HUD",
    data: { show: true }
});
window.postMessage({
    action: "show",
    data: { show: true }
});
