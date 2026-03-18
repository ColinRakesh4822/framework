import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { AppBar, Toolbar, Divider } from "@material-ui/core";
import { Link, useHistory, useLocation } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Logo from "../../assets/img/logo.png";

import Nui from "../../util/Nui";
import Account from "./Account";

const useStyles = makeStyles((theme) => ({
  navbar: {
    backgroundColor: theme.palette.secondary.dark,
    width: "100%",
    borderBottom: `1px solid rgba(32,134,146,0.15)`,
    position: 'relative',
  },
  navbarAccent: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(32,134,146,0.5), transparent)',
  },
  logo: {
    height: 86,
    padding: 12,
    userSelect: "none",
    filter: 'drop-shadow(0 0 8px rgba(32,134,146,0.3))',
  },
  branding: {
    marginLeft: 14,
    marginRight: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  brandLabel: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'rgba(32,134,146,0.7)',
    fontFamily: "'Rajdhani', sans-serif",
    marginBottom: 1,
  },
  brandTitle: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: 16,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '0.08em',
  },
  title: {
    flexGrow: 1,
  },
  navLinks: {
    display: "inline-flex",
    alignItems: "center",
    width: "100%",
  },
  right: {
    display: "inline-flex",
    alignItems: "center",
    marginRight: 10,
    gap: 2,
  },
  user: {
    marginRight: 10,
    textAlign: "right",
    "& small": {
      display: "block",
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: 'rgba(32,134,146,0.7)',
    },
    "& span": {
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: 13,
      color: 'rgba(255,255,255,0.8)',
    },
  },
  iconBtn: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: '1px solid transparent',
    borderRadius: 2,
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    '&:hover': {
      color: '#208692',
      borderColor: 'rgba(32,134,146,0.3)',
      background: 'rgba(32,134,146,0.08)',
    },
  },
  divider: {
    backgroundColor: 'rgba(32,134,146,0.15)',
    margin: '8px 6px',
  },
}));

export default () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const hidden = useSelector((state) => state.app.hidden);
  const user = useSelector((state) => state.app.user);
  const permissionLevel = useSelector((state) => state.app.permissionLevel);

  const onClose = () => {
    Nui.send("Close");
  };

  const onDetach = () => {
    Nui.send("StopAllAttach");
  };

  const viewSelf = () => {
    history.push(`/player/${user?.Source}`);
  };

  const goInvisible = () => {
    Nui.send("ToggleInvisible");
  };

  const toggleIds = () => {
    Nui.send("ToggleIDs");
  };

  const hoverChange = (state) => {
    if (!hidden) {
      dispatch({
        type: "SET_OPACITY_MODE",
        payload: {
          state,
        },
      });
    }
  };

  return (
    <AppBar
      elevation={0}
      position="relative"
      color="secondary"
      className={classes.navbar}
    >
      <Toolbar disableGutters>
        <div
          className={classes.title}
          onMouseEnter={() => hoverChange(true)}
          onMouseLeave={() => hoverChange(false)}
        >
          <div className={classes.navLinks}>
            <Link to="/">
              <img src={Logo} className={classes.logo} />
            </Link>
            <Divider orientation="vertical" flexItem className={classes.divider} />
            <div className={classes.branding}>
              <span className={classes.brandLabel}>Admin Panel</span>
              <span className={classes.brandTitle}>Admin System</span>
            </div>
          </div>
        </div>
        <div className={classes.right}>
          <div className={classes.user}>
            <Account />
          </div>
          <Divider orientation="vertical" flexItem className={classes.divider} />
          {permissionLevel >= 100 && (
            <button className={classes.iconBtn} onClick={goInvisible}>
              <FontAwesomeIcon icon={["fas", "eye-slash"]} />
            </button>
          )}
          <button className={classes.iconBtn} onClick={toggleIds}>
            <FontAwesomeIcon icon={["fas", "id-badge"]} />
          </button>
          <button className={classes.iconBtn} onClick={viewSelf}>
            <FontAwesomeIcon icon={["fas", "user-large"]} />
          </button>
          <button className={classes.iconBtn} onClick={onDetach}>
            <FontAwesomeIcon icon={["fas", "link-slash"]} />
          </button>
          <button className={classes.iconBtn} onClick={history.goBack}>
            <FontAwesomeIcon icon={["fas", "chevron-left"]} />
          </button>
          <button className={classes.iconBtn} onClick={history.goForward}>
            <FontAwesomeIcon icon={["fas", "chevron-right"]} />
          </button>
          <button className={classes.iconBtn} onClick={onClose} style={{ color: 'rgba(255,255,255,0.5)' }}>
            <FontAwesomeIcon icon={["fas", "xmark"]} />
          </button>
        </div>
      </Toolbar>
      <div className={classes.navbarAccent} />
    </AppBar>
  );
};
