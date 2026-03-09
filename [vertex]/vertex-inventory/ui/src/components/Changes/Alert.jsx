import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { makeStyles } from "@mui/styles"
import { Fade } from "@mui/material"
import { getItemImage, getItemLabel } from "../Inventory/item"

const useStyles = makeStyles((theme) => ({
  container: {
    pointerEvents: "none",
    zIndex: 1,
  },
  label: {
    bottom: 0,
    left: 0,
    position: "absolute",
    textAlign: "left",
    padding: "4px 6px",
    fontWeight: 1000,
    fontSize: 11.2,
    letterSpacing: 0.5,
    lineHeight: 1.2,
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    background: "transparent",
    whiteSpace: "pre-line",
    wordSpacing: "normal",
    color: theme.palette.text.main,
    textTransform: "capitalize",
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    zIndex: 4,
  },
  slot: {
    width: '11.5vh',
    height: '11.5vh',
    background: '#222',
    border: '1px solid #949393',
    boxShadow: '0 0 40px 2px #94939338 inset',
    position: "relative",
    zIndex: 2,
    borderRadius: 1,
    overflow: 'hidden',
    // Common rarity (default)
    "&.rarity-1, &.rarity-common, &.rarity-unknown": {
      border: '1px solid #949393',
      boxShadow: '0 0 40px 2px #94939338 inset',
    },
    // Uncommon rarity
    "&.rarity-2, &.rarity-uncommon": {
      border: '1px solid #00c428',
      boxShadow: '0 0 40px 2px rgba(0, 196, 40, 0.22) inset',
    },
    // Rare rarity
    "&.rarity-3, &.rarity-rare": {
      border: '1px solid #3b82f6',
      boxShadow: '0 0 40px 2px rgba(59, 130, 246, 0.22) inset',
    },
    // Epic rarity
    "&.rarity-4, &.rarity-epic": {
      border: '1px solid #9C27B0',
      boxShadow: '0 0 40px 2px rgba(156, 39, 176, 0.22) inset',
    },
    // Legendary rarity
    "&.rarity-5, &.rarity-legendary": {
      border: '1px solid #FFD700',
      boxShadow: '0 0 40px 2px rgba(255, 215, 0, 0.22) inset',
    },
  },
  count: {
    top: 4,
    left: 4,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 4,
    gap: 4,
    borderRadius: 1,
    margin: 2,
    zIndex: 4,
    "&::after": {
      content: '"x"',
      marginLeft: 2,
    },
    color: theme.palette.text.main,
    fontSize: 11,
    fontWeight: 600,
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
  },
  img: {
    height: "100%",
    width: "100%",
    zIndex: 3,
    backgroundSize: "6.2vh",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    position: "relative",
    imageRendering: "-webkit-optimize-contrast",
  },
  type: {
    top: 0,
    right: 0,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: "4px 6px",
    borderRadius: 1,
    margin: 2,
    color: theme.palette.text.main,
    background: "transparent",
    fontSize: 11,
    fontWeight: 600,
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
    zIndex: 4,
  },
}))

export default ({ alert }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const itemData = useSelector((state) => state.inventory.items)[alert.item]
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false)
    }, 3000)

    return () => {
      clearTimeout(t)
    }
  }, [])

  const onAnimEnd = () => {
    dispatch({
      type: "DISMISS_ALERT",
      payload: {
        id: alert.id,
      },
    })
  }

  const getTypeLabel = () => {
    switch (alert.type) {
      case "add":
        return "Added"
      case "removed":
        return "Removed"
      case "used":
        return "Used"
      default:
        return alert.type
    }
  }

  const getRarityClass = () => {
    if (!itemData || !itemData.rarity) return ""
    return `rarity-${itemData.rarity}`
  }

  return (
    <Fade in={show} onExited={onAnimEnd}>
      <div className={classes.container}>
        <div className={`${classes.slot} ${alert.type} ${getRarityClass()}`}>
          <div
            className={classes.img}
            style={{
              backgroundImage: `url(${getItemImage(alert.item, itemData)})`,
            }}
          ></div>
          {Boolean(itemData) && (
            <div className={classes.label}>
              {getItemLabel(alert.item, itemData)
                .split(/\r?\n/)
                .filter(line => line.trim() !== '')
                .map((line, index) => (
                  <span key={index} style={{ display: 'block', marginBottom: '2px' }}>
                    {line.trim()}
                  </span>
                ))}
            </div>
          )}
          <div className={classes.type}>{getTypeLabel()}</div>
          {alert.count > 0 && (
            <div className={classes.count}>
              <span>{alert.count}</span>
            </div>
          )}
        </div>
      </div>
    </Fade>
  )
}
