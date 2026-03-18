import { CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { getItemData, itemDurability } from '../helpers';
import { Items } from '../store/items';
import { Inventory, State } from '../typings';

export const setupInventoryReducer: CaseReducer<
  State,
  PayloadAction<{
    leftInventory?: Inventory;
    rightInventory?: Inventory;
  }>
> = (state, action) => {
  const { leftInventory, rightInventory } = action.payload;
  const curTime = Math.floor(Date.now() / 1000);

  if (
    leftInventory &&
    rightInventory &&
    state.leftInventory &&
    state.rightInventory &&
    state.leftInventory.id === leftInventory.id &&
    state.rightInventory.id === rightInventory.id
  ) {
    return;
  }

  if (rightInventory && !leftInventory && state.rightInventory && state.rightInventory.id === rightInventory.id) {
    return;
  }

  if (leftInventory && !rightInventory && state.leftInventory && state.leftInventory.id === leftInventory.id) {
    return;
  }

  if (leftInventory) {
    const isShop = leftInventory.type === 'shop';
    const actualSlots = isShop ? Object.keys(leftInventory.items).length : leftInventory.slots;

    const isNewInventory = !state.leftInventory || state.leftInventory.id !== leftInventory.id;

    if (isNewInventory) {
      state.leftInventory = {
        ...leftInventory,
        slots: actualSlots,
        items: Array.from(Array(actualSlots), (_, index) => {
          const slotNumber = index + 1;

          let item;
          if (Array.isArray(leftInventory.items)) {
            item = leftInventory.items.find((item) => item && item.slot === slotNumber) || { slot: slotNumber };
          } else {
            item = leftInventory.items[slotNumber] || { slot: slotNumber };
          }

          if (!item.name) return item;

          if (typeof Items[item.name] === 'undefined') {
            getItemData(item.name);
          }

          item.durability = itemDurability(item.metadata, curTime);
          return item;
        }),
      };
    } else {
      state.leftInventory = {
        ...state.leftInventory,
        ...leftInventory,
        items: state.leftInventory.items,
      };
    }
  }

  if (rightInventory) {
    const isShop = rightInventory.type === 'shop';
    const actualSlots = isShop ? Object.keys(rightInventory.items).length : rightInventory.slots;

    const isNewInventory = !state.rightInventory || state.rightInventory.id !== rightInventory.id;

    const hasExistingItems =
      state.rightInventory &&
      state.rightInventory.items &&
      state.rightInventory.items.some((item) => item && item.name);

    const isInventoryTransition = state.rightInventory && state.rightInventory.type !== rightInventory.type;

    const shouldPreserve =
      !isNewInventory || (state.rightInventory && state.rightInventory.id === rightInventory.id && hasExistingItems);

    if (shouldPreserve) {
      const cleanedItems = Array.from(Array(actualSlots), (_, index) => {
        const slotNumber = index + 1;

        let item = state.rightInventory.items.find((item) => item && item.slot === slotNumber);

        if (!item && state.rightInventory.items[index]) {
          item = state.rightInventory.items[index];
        }

        if (!item || !item.name || item.name === '') {
          return { slot: slotNumber };
        }

        const cleanedItem = {
          ...item,
          slot: slotNumber,
          durability: itemDurability(item.metadata, curTime),
        };

        if (typeof Items[item.name] === 'undefined') {
          getItemData(item.name);
        }

        return cleanedItem;
      });

      state.rightInventory = {
        ...state.rightInventory,
        ...rightInventory,
        items: cleanedItems,
      };
    } else if (isNewInventory) {
      if (isInventoryTransition) {
        if (rightInventory.type === 'drop' && hasExistingItems) {
          const cleanedItems = Array.from(Array(actualSlots), (_, index) => {
            const slotNumber = index + 1;

            let item = state.rightInventory.items.find((item) => item && item.slot === slotNumber);

            if (!item && state.rightInventory.items[index]) {
              item = state.rightInventory.items[index];
            }

            if (!item || !item.name || item.name === '') {
              return { slot: slotNumber };
            }

            const cleanedItem = {
              ...item,
              slot: slotNumber,
              durability: itemDurability(item.metadata, curTime),
            };

            if (typeof Items[item.name] === 'undefined') {
              getItemData(item.name);
            }

            return cleanedItem;
          });

          state.rightInventory = {
            ...state.rightInventory,
            ...rightInventory,
            items: cleanedItems,
            slots: actualSlots,
          };

          return;
        }
      }

      state.rightInventory = {
        ...rightInventory,
        slots: actualSlots,
        items: Array.from(Array(actualSlots), (_, index) => {
          const slotNumber = index + 1;

          let item;
          if (Array.isArray(rightInventory.items)) {
            item = rightInventory.items.find((item) => item && item.slot === slotNumber) || { slot: slotNumber };
          } else {
            item = rightInventory.items[slotNumber] || { slot: slotNumber };
          }

          if (!item.name) return item;

          if (typeof Items[item.name] === 'undefined') {
            getItemData(item.name);
          }

          item.durability = itemDurability(item.metadata, curTime);
          return item;
        }),
      };
    } else {
      const cleanedItems = Array.from(Array(actualSlots), (_, index) => {
        const slotNumber = index + 1;

        let item = state.rightInventory.items.find((item) => item && item.slot === slotNumber);

        if (!item && state.rightInventory.items[index]) {
          item = state.rightInventory.items[index];
        }

        if (!item || !item.name || item.name === '') {
          return { slot: slotNumber };
        }

        const cleanedItem = {
          ...item,
          slot: slotNumber,
          durability: itemDurability(item.metadata, curTime),
        };

        if (typeof Items[item.name] === 'undefined') {
          getItemData(item.name);
        }

        return cleanedItem;
      });

      state.rightInventory = {
        ...state.rightInventory,
        ...rightInventory,
        items: cleanedItems,
      };
    }
  }

  if (leftInventory) {
    state.utilityInventory = {
      ...state.utilityInventory,
      id: leftInventory.id,
      type: leftInventory.type,
      items: Array.from(Array(9), (_, index) => {
        const slotNumber = index + 1;
        const item = leftInventory.items[slotNumber] || { slot: slotNumber };

        if (!item.name) return item;

        if (typeof Items[item.name] === 'undefined') {
          getItemData(item.name);
        }

        item.durability = itemDurability(item.metadata, curTime);
        return item;
      }),
    };
  }

  state.shiftPressed = false;
  state.isBusy = false;
};
