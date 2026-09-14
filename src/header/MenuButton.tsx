import { Button } from "@mui/material";
import { Link, useLocation } from "react-router";

export function MenuButton({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  const location = useLocation();

  const isActive = location.pathname === to;

  return (
    <Button
      component={Link}
      to={to}
      disableRipple
      sx={{
        color: isActive ? "#b28a45" : "#333",
        fontFamily: "Georgia, serif",
        fontSize: "min(0.9rem, 2.717vw)",
        letterSpacing: "0.15em",
        fontWeight: 400,
        px: "min(8px, 1.509vw)",
        py: "min(16px, 3.019vw)",
        whiteSpace: "nowrap",
        minWidth: 0,

        transition: "text-shadow 180ms ease",

        "&:hover": {
          bgcolor: "transparent",
          color: isActive ? "#b28a45" : "#333",
          textShadow: "0 0 0.35px currentColor",
        },
      }}
    >
      {children}
    </Button>
  );
}
