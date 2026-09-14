import { MenuButton } from "./MenuButton";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router";

export function Menu() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "#333",
        borderBottom: "1px solid #eeeeee",
      }}
    >
      <Box
        sx={{
          height: "min(140px, 26.415vw)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "#333",
            fontFamily: "Georgia, serif",
            fontSize: "min(2.4rem, 7.245vw)",
            letterSpacing: "0.15em",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          PARFUM STORE
        </Typography>
      </Box>

      <Toolbar
        sx={{
          justifyContent: "center",
          minHeight: "min(68px, 12.83vw) !important",
          borderTop: "1px solid #f2f2f2",
          gap: "min(48px, 9.057vw)",
        }}
      >
        <MenuButton to="/">HOME</MenuButton>
        <MenuButton to="/about">ABOUT</MenuButton>
        <MenuButton to="/parfums">PARFUMES</MenuButton>
        <MenuButton to="/profile">LOGIN</MenuButton>
      </Toolbar>
    </AppBar>
  );
}
