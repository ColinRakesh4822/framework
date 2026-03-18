<div align="center">

![Banner](https://r2.fivemanage.com/b8BG4vav9CjKMUdz6iKnY/vertex_banner_old.png)

# vertex-admin

### *In-game staff administration panel for managing players, vehicles, and items*

**Management • Moderation • Oversight**

![Lua](https://img.shields.io/badge/-Lua_5.4-2C2D72?style=for-the-badge&logo=lua&logoColor=white)
![FiveM](https://img.shields.io/badge/-FiveM-F40552?style=for-the-badge)
![React](https://img.shields.io/badge/-React_17-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/-Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![MUI](https://img.shields.io/badge/-Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Webpack](https://img.shields.io/badge/-Webpack_5-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black)

[Features](#-features) • [Commands](#-commands) • [Development](#-development)

</div>

---

## 📖 Overview

A full-featured in-game admin panel that gives staff the tools to manage players, inspect vehicles, browse the items database, and monitor server activity. Opens as a draggable NUI window with sidebar navigation, dashboard stats, and per-player detail views with moderation actions.

---

> **New Addition:** The admin panel now includes a **Door Lock Tool** and **Elevator Tool** for creating, editing, and deleting doors and elevators at runtime. These tools require `vertex-doors` to be running with database support. Run `/migratedoors` and `/migrateelevators` in-game before using these pages. See the [vertex-doors README](https://github.com/vertex-Framework/vertex-doors/blob/main/README.md) for details.

---

## ✨ Features

<div align="center">
<table>
<tr>
<td width="50%">

### Player Management
- **Player List** — Live searchable list with filter by logged-in status
- **Goto / Bring** — Teleport to or summon players
- **Heal** — Restore a player's health
- **Spectate** — Attach to and observe a player
- **Kick / Ban** — Remove players with reason tracking and configurable ban lengths
- **GPS Marker** — Place a map marker on a player's location

</td>
<td width="50%">

### Server Tools
- **Dashboard** — Live player count, queue count, and player history chart
- **Items Database** — Browse, search, and filter all server items with give-to-player functionality
- **Vehicle Inspector** — View current vehicle info, repair, fuel, explode, and more
- **Disconnected Players** — Track recently disconnected players and reconnection status
- **Door Lock Tool** — Create, edit, delete, and toggle doors with restrictions, lockpick settings, and in-game capture
- **Elevator Tool** — Create and manage multi-floor elevators with zone and position capture
- **Noclip** — Freecam with dev mode and info overlays
- **Staff Camera** — Dedicated observation camera

</td>
</tr>
</table>
</div>

---

## 🎮 Commands

| Command | Description |
|---------|-------------|
| `/admin` | Open the admin panel |
| `/noclip` | Toggle noclip freecam |
| `/noclip:dev` | Toggle noclip dev mode |
| `/noclip:info` | Toggle noclip info overlay |
| `/marker` | Place a GPS marker |
| `/setped` | Change player ped model |
| `/staffcam` | Toggle staff observation camera |
| `/cpproperty` | Copy property info |

---

## 👨‍💻 Development

```bash
cd ui
bun install
bun run dev      # dev server with hot reload
bun run build    # production build
```

---

## 📦 Dependencies

| Resource | Why |
|----------|-----|
| `vertex-base` | Core framework (components, callbacks, fetch) |
| `vertex-pwnzor` | Anti-cheat |
| `vertex-inventory` | Items database exports |
| `vertex-doors` | Door lock and elevator management exports |

---

<div align="center">

[![Made for FiveM](https://img.shields.io/badge/Made_for-FiveM-F40552?style=for-the-badge)](https://fivem.net)
[![vertex Framework](https://img.shields.io/badge/vertex-Framework-208692?style=for-the-badge)](https://github.com/vertex-framework)

</div>
