<div align="center">

#  vertex Inventory

### *Next-Generation Inventory System for FiveM*

**High-performance • Beautiful • Feature-rich**
<div align="center">

![React](https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/-Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![MUI](https://img.shields.io/badge/-Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

</div>

[Screenshots](#-screenshots) • [Features](#-features) • [Documentation](https://vertexframework.mintlify.app/api/inventory/exports)

</div>

## 📸 Screenshots

<div align="center">

### Inventory Interface
![Inventory](https://github.com/user-attachments/assets/faf87c69-d87c-44d3-9fe2-07b7a7a23ce8)

### Shop System
![Shop](https://github.com/user-attachments/assets/b98b7a4b-71e6-486e-b4d4-0f3e72d02377)

### Crafting System
![Crafting](https://github.com/user-attachments/assets/cf98959f-8158-48a5-a6d9-42f872979079)

</div>

---

## ✨ Features
<div align="center">
<table>
<tr>
<td width="50%">

### 🎮 Core Gameplay
- 🎯 **Drag & Drop Interface** - Smooth, intuitive item management
- ⚡ **Hotbar System** - Quick access slots (1-5)
- 🛡️ **Equipment Slots** - Dedicated gear management
- 📦 **Container Support** - Vehicles, stashes, and more
- 🏪 **Shop System** - Buy/sell with dynamic pricing
- 🔨 **Crafting System** - Recipe-based item creation
- 🎁 **Player Trading** - Give items to nearby players
- 📊 **Weight System** - Visual capacity indicators

</td>
<td width="50%">

### 🚀 Advanced Features
- 🎨 **Rarity System** - Color-coded item tiers
- 💎 **Item Metadata** - Custom labels, serial numbers
- ⏱️ **Durability System** - Time-based item degradation
- 🔫 **Weapon Attachments** - Component tracking
- 📱 **Multi-Resolution** - 1080p, 2K, 4K optimized
- 🎵 **Sound Effects** - Immersive audio feedback
- 🌙 **Dark Theme** - Easy on the eyes
- ⚡ **60 FPS Performance** - Buttery smooth experience

</td>
</tr>
</table>
</div>

## 🎮 Usage

### Keyboard Controls

| Key | Action |
|-----|--------|
| <kbd>F2</kbd> | Toggle Inventory |
| <kbd>Drag & Drop</kbd> | Move items |
| <kbd>Shift</kbd> + <kbd>Click</kbd> | Quick transfer |
| <kbd>Ctrl</kbd> + <kbd>Click</kbd> | Drag half stack |
| <kbd>Right Click</kbd> | Drag half stack |
| <kbd>Ctrl</kbd> + <kbd>Right Click</kbd> | Drag single item |
| <kbd>Shift</kbd> + <kbd>Right Click</kbd> | Split stack dialog |
| <kbd>Middle Click</kbd> | Use item (hotbar) |

## 👨‍💻 Development

> 💡 **Tip:** Use `bun` instead of `npm` for faster installs and builds!

### Run Development Server

```bash
cd ui
bun run dev  # Vite dev server on http://localhost:5173
```

### Build for Production

```bash
cd ui
bun run build  # Optimized production build
```
---

## 🎨 Customization

### Theme Colors

Edit `ui/src/styles/theme.ts`:

```typescript
export const colors = {
  primary: {
    main: '#0FC6A6',  // Teal accent
  },
  secondary: {
    main: '#0C1826',  // Dark background
  },
  // Rarity colors
  rarityColors: {
    1: '#8685EF',  // Common
    2: '#4A90E2',  // Uncommon
    3: '#9C27B0',  // Rare
    4: '#FF9800',  // Epic
    5: '#F44336',  // Legendary
  }
}
```

## 🤝 Credits

<div align="center">

<table>
<tr>
<td align="center" width="25%">
<h3>🎨 Design</h3>
<b>Blake</b><br/>
<i>FiveForge Studios</i>
</td>
<td align="center" width="25%">
<h3>💎 UI/UX</h3>
<b>Tyh & Yarn</b><br/>
<i>Interface Design</i>
</td>
<td align="center" width="25%">
<h3>⚙️ Development</h3>
<b>Alzar</b><br/>
<i>vertex Framework</i>
</td>
</tr>
</table>

</div>

---

<div align="center">

### ⭐ If you like this project, give it a star!

**Built with ❤️ for the FiveM Community**

[![Made for FiveM](https://img.shields.io/badge/Made_for-FiveM-F40552?style=for-the-badge)](https://fivem.net)

</div>
