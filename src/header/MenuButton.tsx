import { Button } from "@mui/material";
import { Link } from "react-router";

export function MenuButton({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      component={Link}
      to={to}
      disableRipple
      sx={{
        color: "#333",
        fontFamily: "Georgia, serif",
        fontSize: "min(0.9rem, 2.717vw)",
        letterSpacing: "0.15em",
        fontWeight: 400,
        px: "min(8px, 1.509vw)",
        py: "min(16px, 3.019vw)",
        whiteSpace: "nowrap",
        minWidth: 0,
        "&:hover": {
          bgcolor: "transparent",
          color: "#b28a45",
        },
      }}
    >
      {children}
    </Button>
  );
}
