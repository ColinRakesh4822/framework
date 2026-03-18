import "@babel/polyfill";

import React from "react";
import { useSelector } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { HashRouter } from "react-router-dom";

import "react-image-lightbox/style.css";

import Panel from "../Panel";

library.add(fab, fas);

export default () => {
  const theme = "dark";
  const job = useSelector((state) => state.app.govJob);

  const muiTheme = createTheme({
    typography: {
      fontFamily: ["Outfit", "Inter", "sans-serif"],
      fontWeightRegular: 400,
    },

    palette: {
      primary: {
        main: "#0ea5e9",
        light: "#38bdf8",
        dark: "#0284c7",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#0b0f19",
        light: "#1e293b",
        dark: "#030712",
        contrastText: "#ffffff",
      },
      error: {
        main: "#ef4444",
        light: "#f87171",
        dark: "#b91c1c",
      },
      success: {
        main: "#10b981",
        light: "#34d399",
        dark: "#047857",
      },
      warning: {
        main: "#f59e0b",
        light: "#fbbf24",
        dark: "#b45309",
      },
      info: {
        main: "#3b82f6",
        light: "#60a5fa",
        dark: "#1d4ed8",
      },
      text: {
        main: "#ffffff",
        alt: "#94a3b8", 
        info: "#64748b",
        light: "#ffffff",
        dark: "#000000",
      },
      alt: {
        green: "#10b981",
        greenDark: "#065f46",
      },
      border: {
        main: "rgba(14,165,233,0.15)",
        light: "#ffffff",
        dark: "#1e293b",
        input: "rgba(255, 255, 255, 0.2)",
        divider: "rgba(14,165,233,0.08)",
      },
      mode: "dark",
    },

    components: {
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: 14,
            fontFamily: "'Outfit', sans-serif",
            backgroundColor: "#0b0f19",
            border: "1px solid rgba(14,165,233,0.2)",
            boxShadow: "0 0 20px rgba(0,0,0,0.6)",
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: "#0b0f19",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            background: "#1e293b !important",
            border: "1px solid rgba(14,165,233,0.15)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            borderRadius: "8px !important",
            marginTop: 4,
          },
          list: {
            padding: "4px 0",
          },
        },
      },

      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: "#94a3b8",
            padding: "8px 16px",
            transition: "all 0.15s ease",
            "&:hover": {
              background: "rgba(14,165,233,0.08)",
              color: "#ffffff",
            },
            "&.Mui-selected": {
              background: "rgba(14,165,233,0.12)",
              color: "#0ea5e9",
              "&:hover": {
                background: "rgba(14,165,233,0.18)",
              },
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            background: "#1e293b",
            border: "1px solid rgba(14,165,233,0.15)",
            borderRadius: 8,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: "rgba(14,165,233,0.5)",
            transition: "color 0.2s ease",
          },
        },
      },

      MuiBackdrop: {
        styleOverrides: {
          root: {
            height: "90%",
            width: "60%",
            margin: "auto",
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          ".Toastify__toast-container--bottom-right": {
            bottom: "0.5em !important",
            right: "0.5em !important",
            position: "absolute !important",
          },
          ".Toastify__toast": {
            fontFamily: "'Outfit', sans-serif",
            background: "#0b0f19",
            border: "1px solid rgba(14,165,233,0.15)",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          },
          ".tox-dialog-wrap__backdrop": {
            height: "90% !important",
            width: "90% !important",
            margin: "auto !important",
            background: "rgba(11,15,25,0.75) !important",
          },
          ".tox-statusbar__branding": {
            display: "none !important",
          },
          "*": {
            "&::-webkit-scrollbar": {
              width: 4,
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(14,165,233,0.3)",
              borderRadius: 8,
              transition: "background ease-in 0.15s",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#0ea5e9",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
          },
          html: {
            background:
              process.env.NODE_ENV != "production" ? "#0b0f19" : "transparent",
            "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
              {
                WebkitAppearance: "none",
                margin: 0,
              },
          },
          body: {
            position: "relative",
            zIndex: -15,
            backgroundColor: "#0b0f19",

            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            margin: "auto",
            height: "90%",
            width: "60%",
            borderRadius: 2,
            overflowY: "auto",
            overflowX: "hidden",
            paddingRight: "0px !important",
            border: "none",
            boxShadow: "none",
            background: "transparent",

            ".item-enter": {
              opacity: 0,
            },
            ".item-enter-active": {
              opacity: 1,
              transition: "opacity 500ms ease-in",
            },
            ".item-exit": {
              opacity: 1,
            },
            ".item-exit-active": {
              opacity: 0,
              transition: "opacity 500ms ease-in",
            },
            ".fade-enter": {
              opacity: 0,
            },
            ".fade-exit": {
              opacity: 1,
            },
            ".fade-enter-active": {
              opacity: 1,
            },
            ".fade-exit-active": {
              opacity: 0,
            },
            ".fade-enter-active, .fade-exit-active": {
              transition: "opacity 500ms",
            },
          },
          a: {
            textDecoration: "none",
            color: "#fff",
          },
          "#root": {
            position: "relative",
            zIndex: -10,
          },
          "@keyframes bouncing": {
            "0%": {
              bottom: 0,
              opacity: 0.25,
            },
            "100%": {
              bottom: 50,
              opacity: 1.0,
            },
          },
          "@keyframes ripple": {
            "0%": {
              transform: "scale(.8)",
              opacity: 1,
            },
            "100%": {
              transform: "scale(2.4)",
              opacity: 0,
            },
          },
        },
      },
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <HashRouter>
          <Panel />
        </HashRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};
