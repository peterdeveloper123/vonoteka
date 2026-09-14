import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Link as RouterLink } from "react-router";

import AppleIcon from "@mui/icons-material/Apple";
import GoogleIcon from "@mui/icons-material/Google";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

export function LoginForm() {
  const [phone, setPhone] = useState("");

  const handleAppleLogin = () => {
    console.log("Apple login");
  };

  const handleGoogleLogin = () => {
    console.log("Google login");
  };

  const handlePhoneLogin = () => {
    console.log("Phone login:", phone);
  };

  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "60vh" },
        display: "flex",
        justifyContent: "center",
        alignItems: { xs: "flex-start", md: "center" },
        py: { xs: 4, sm: 6, md: 8 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 460,
          border: "1px solid",
          borderColor: "text.primary",
          borderRadius: 2,
          boxShadow: 3,
          p: { xs: 3, sm: 4 },
          backgroundColor: "background.paper",
        }}
      >
        <Stack spacing={3}>
          <Typography
            sx={{
              textAlign: "center",
              color: "#333",
              fontFamily: "Georgia, serif",
              fontSize: { xs: "1rem", sm: "1.15rem" },
              letterSpacing: "0.15em",
              fontWeight: 400,
              whiteSpace: "nowrap",
            }}
          >
            SIGN IN TO YOUR ACCOUNT
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<AppleIcon />}
            onClick={handleAppleLogin}
            sx={{
              color: "text.primary",
              borderColor: "divider",
              borderRadius: 1,
              py: 1.5,
              px: 3,
              justifyContent: "flex-start",
              textTransform: "none",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",

              "&:hover": {
                borderColor: "text.primary",
                backgroundColor: "action.hover",
              },
            }}
          >
            Continue with Apple
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              color: "text.primary",
              borderColor: "divider",
              borderRadius: 1,
              py: 1.5,
              px: 3,
              justifyContent: "flex-start",
              textTransform: "none",
              fontFamily: "Georgia, serif",
              fontSize: "1rem",

              "&:hover": {
                borderColor: "text.primary",
                backgroundColor: "action.hover",
              },
            }}
          >
            Continue with Google
          </Button>

          <Divider>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontFamily: "Georgia, serif",
                letterSpacing: "0.15em",
              }}
            >
              OR
            </Typography>
          </Divider>

          <TextField
            fullWidth
            label="Phone number"
            placeholder="+421 900 000 000"
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIphoneIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
              },

              "& .MuiInputLabel-root": {
                fontFamily: "Georgia, serif",
              },

              "& .MuiInputBase-input": {
                fontFamily: "Georgia, serif",
              },
            }}
          />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textAlign: "center",
              fontFamily: "Georgia, serif",
              lineHeight: 1.6,
            }}
          >
            By continuing, you agree to our{" "}
            <MuiLink
              component={RouterLink}
              to="/terms"
              sx={{
                color: "#333",
                fontFamily: "Georgia, serif",
                fontWeight: 600,
                textUnderlineOffset: 3,

                "&:hover": {
                  color: "#b28a45",
                },
              }}
            >
              Terms of Service
            </MuiLink>{" "}
            and{" "}
            <MuiLink
              component={RouterLink}
              to="/privacy"
              sx={{
                color: "#333",
                fontFamily: "Georgia, serif",
                fontWeight: 600,
                textUnderlineOffset: 3,

                "&:hover": {
                  color: "#b28a45",
                },
              }}
            >
              Privacy Policy
            </MuiLink>
            .
          </Typography>

          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!phone.trim()}
            onClick={handlePhoneLogin}
            sx={{
              borderRadius: 1,
              py: 1.5,
              boxShadow: "none",
              backgroundColor: "text.primary",
              color: "background.paper",
              fontFamily: "Georgia, serif",
              letterSpacing: "0.15em",

              "&:hover": {
                backgroundColor: "text.secondary",
                boxShadow: "none",
              },

              "&.Mui-disabled": {
                backgroundColor: "action.disabledBackground",
                color: "action.disabled",
              },
            }}
          >
            CONTINUE
          </Button>

          <Divider />

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              textAlign: "center",
              fontFamily: "Georgia, serif",
              lineHeight: 1.6,
              letterSpacing: "0.08em",
            }}
          >
            <MuiLink
              component={RouterLink}
              to="/register"
              sx={{
                color: "#333",
                fontFamily: "Georgia, serif",
                fontWeight: 600,
                textUnderlineOffset: 3,

                "&:hover": {
                  color: "#b28a45",
                },
              }}
            >
              REGISTER
            </MuiLink>{" "}
            TO CREATE A NEW ACCOUNT.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
