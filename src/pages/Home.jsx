import React from "react";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import SearchBox from "../components/ChatBox";

function Home() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#4CAF50", // Green shade
      },
    },

    components: {
      MuiPaper: {
        styleOverrides: {
          elevation0: {
            boxShadow: "none",
          },
          elevation1: {
            boxShadow: "none",
          },
          // Add as many elevations as needed
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "none",
          },
        },
      },
      // Add other components as needed
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <SearchBox />
    </ThemeProvider>
  );
}

export default Home;
