import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  LocalShippingOutlined,
  LockOutlined,
  ReplayOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";

import { Link } from "react-router";

export function Footer() {
  const footerLinkSx = {
    width: "fit-content",
    color: "#c7c7c7",
    textDecoration: "none",
    fontFamily: "Georgia, serif",
    fontSize: "0.72rem",
    letterSpacing: "0.07em",
    lineHeight: 1.8,
    transition: "color 180ms ease",

    "&:hover": {
      color: "#b28a45",
    },
  };

  const sectionTitleSx = {
    color: "#b28a45",
    fontFamily: "Georgia, serif",
    fontSize: "0.72rem",
    letterSpacing: "0.16em",
    fontWeight: 400,
    mb: 2.5,
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#2f2f2f",
        color: "white",
        mt: { xs: 6, md: 10 },
      }}
    >
      {/* SERVICE BENEFITS */}
      <Box
        sx={{
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Box
          sx={{
            maxWidth: 1536,
            mx: "auto",
            px: { xs: 3, sm: 5, md: 8 },
            py: { xs: 4, md: 5 },
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: { xs: 3, md: 4 },
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: { xs: "flex-start", lg: "center" },
            }}
          >
            <LocalShippingOutlined
              sx={{
                color: "#b28a45",
                fontSize: 30,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  mb: 0.5,
                }}
              >
                RELIABLE DELIVERY
              </Typography>

              <Typography
                sx={{
                  color: "#aaa",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.7rem",
                }}
              >
                Carefully packed and delivered
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: { xs: "flex-start", lg: "center" },
            }}
          >
            <LockOutlined
              sx={{
                color: "#b28a45",
                fontSize: 30,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  mb: 0.5,
                }}
              >
                SECURE SHOPPING
              </Typography>

              <Typography
                sx={{
                  color: "#aaa",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.7rem",
                }}
              >
                Safe checkout and payments
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: { xs: "flex-start", lg: "center" },
            }}
          >
            <ReplayOutlined
              sx={{
                color: "#b28a45",
                fontSize: 30,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  mb: 0.5,
                }}
              >
                EASY RETURNS
              </Typography>

              <Typography
                sx={{
                  color: "#aaa",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.7rem",
                }}
              >
                Simple and transparent process
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{
              alignItems: "center",
              justifyContent: { xs: "flex-start", lg: "center" },
            }}
          >
            <SupportAgentOutlined
              sx={{
                color: "#b28a45",
                fontSize: 30,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.72rem",
                  letterSpacing: "0.1em",
                  mb: 0.5,
                }}
              >
                CUSTOMER CARE
              </Typography>

              <Typography
                sx={{
                  color: "#aaa",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.7rem",
                }}
              >
                We're here when you need us
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* NEWSLETTER */}
      <Box
        sx={{
          borderBottom: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
            px: 3,
            py: { xs: 6, md: 7 },
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: "#b28a45",
              fontFamily: "Georgia, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              mb: 1.5,
            }}
          >
            STAY IN THE KNOW
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: { xs: "1.4rem", md: "1.8rem" },
              letterSpacing: "0.08em",
              fontWeight: 400,
              mb: 1.5,
            }}
          >
            DISCOVER WHAT&apos;S NEW
          </Typography>

          <Typography
            sx={{
              maxWidth: 600,
              mx: "auto",
              color: "#aaa",
              fontFamily: "Georgia, serif",
              fontSize: "0.8rem",
              lineHeight: 1.8,
              mb: 3,
            }}
          >
            New fragrances, curated selections and special offers delivered
            directly to your inbox.
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{
              maxWidth: 620,
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              placeholder="Your email address"
              type="email"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  minHeight: 48,
                  borderRadius: 1,
                  bgcolor: "white",

                  "& fieldset": {
                    borderColor: "white",
                  },

                  "&:hover fieldset": {
                    borderColor: "#b28a45",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#b28a45",
                  },
                },

                "& .MuiInputBase-input": {
                  fontFamily: "Georgia, serif",
                  fontSize: "0.8rem",
                },
              }}
            />

            <Button
              variant="outlined"
              sx={{
                minWidth: { sm: 150 },
                minHeight: 48,
                borderRadius: 1,
                borderColor: "#b28a45",
                color: "#b28a45",
                fontFamily: "Georgia, serif",
                fontSize: "0.7rem",
                letterSpacing: "0.14em",

                "&:hover": {
                  borderColor: "white",
                  color: "white",
                  bgcolor: "transparent",
                },
              }}
            >
              SUBSCRIBE
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* MAIN FOOTER LINKS */}
      <Box
        sx={{
          maxWidth: 1536,
          mx: "auto",
          px: { xs: 3, sm: 5, md: 8 },
          py: { xs: 6, md: 8 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "1.4fr repeat(4, 1fr)",
            },
            gap: {
              xs: 5,
              md: 4,
              lg: 6,
            },
          }}
        >
          {/* BRAND */}
          <Box>
            <Typography
              component={Link}
              to="/"
              sx={{
                display: "inline-block",
                color: "white",
                textDecoration: "none",
                fontFamily: "Georgia, serif",
                fontSize: { xs: "1.4rem", md: "1.6rem" },
                letterSpacing: "0.15em",
                fontWeight: 400,
                mb: 2.5,
              }}
            >
              PARFUM STORE
            </Typography>

            <Typography
              sx={{
                maxWidth: 320,
                color: "#aaa",
                fontFamily: "Georgia, serif",
                fontSize: "0.78rem",
                lineHeight: 1.9,
              }}
            >
              Luxury fragrances in smaller sizes. Discover more scents,
              experience more styles and build a collection that changes with
              you.
            </Typography>
          </Box>

          {/* SHOP */}
          <Stack spacing={1}>
            <Typography sx={sectionTitleSx}>SHOP</Typography>

            <Typography component={Link} to="/parfums" sx={footerLinkSx}>
              ALL PARFUMES
            </Typography>

            <Typography component={Link} to="/parfums" sx={footerLinkSx}>
              FOR HER
            </Typography>

            <Typography component={Link} to="/parfums" sx={footerLinkSx}>
              FOR HIM
            </Typography>

            <Typography component={Link} to="/parfums" sx={footerLinkSx}>
              UNISEX
            </Typography>

            <Typography component={Link} to="/parfums" sx={footerLinkSx}>
              NICHE
            </Typography>

            <Typography component={Link} to="/parfums" sx={footerLinkSx}>
              BESTSELLERS
            </Typography>

            <Typography component={Link} to="/parfums" sx={footerLinkSx}>
              NEW IN
            </Typography>
          </Stack>

          {/* CUSTOMER CARE */}
          <Stack spacing={1}>
            <Typography sx={sectionTitleSx}>CUSTOMER CARE</Typography>

            <Typography component={Link} to="/contact" sx={footerLinkSx}>
              CONTACT US
            </Typography>

            <Typography component={Link} to="/shipping" sx={footerLinkSx}>
              SHIPPING
            </Typography>

            <Typography component={Link} to="/returns" sx={footerLinkSx}>
              RETURNS
            </Typography>

            <Typography component={Link} to="/faq" sx={footerLinkSx}>
              FAQ
            </Typography>

            <Typography component={Link} to="/profile" sx={footerLinkSx}>
              MY ACCOUNT
            </Typography>
          </Stack>

          {/* ABOUT */}
          <Stack spacing={1}>
            <Typography sx={sectionTitleSx}>ABOUT</Typography>

            <Typography component={Link} to="/about" sx={footerLinkSx}>
              OUR STORY
            </Typography>

            <Typography component={Link} to="/about" sx={footerLinkSx}>
              WHY SMALLER SIZES
            </Typography>

            <Typography component={Link} to="/about" sx={footerLinkSx}>
              OUR FRAGRANCES
            </Typography>

            <Typography component={Link} to="/about" sx={footerLinkSx}>
              PERFUME GUIDE
            </Typography>
          </Stack>

          {/* LEGAL */}
          <Stack spacing={1}>
            <Typography sx={sectionTitleSx}>INFORMATION</Typography>

            <Typography component={Link} to="/terms" sx={footerLinkSx}>
              TERMS OF SERVICE
            </Typography>

            <Typography component={Link} to="/privacy" sx={footerLinkSx}>
              PRIVACY POLICY
            </Typography>

            <Typography component={Link} to="/cookies" sx={footerLinkSx}>
              COOKIE POLICY
            </Typography>

            <Typography component={Link} to="/payment" sx={footerLinkSx}>
              PAYMENT METHODS
            </Typography>
          </Stack>
        </Box>

        <Divider
          sx={{
            my: { xs: 5, md: 7 },
            borderColor: "rgba(255,255,255,0.12)",
          }}
        />

        {/* FINAL BRAND LINE */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 5, md: 6 },
          }}
        >
          <Typography
            sx={{
              color: "#777",
              fontFamily: "Georgia, serif",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              mb: 1,
            }}
          >
            DISCOVER · EXPERIENCE · WEAR
          </Typography>

          <Typography
            sx={{
              color: "#aaa",
              fontFamily: "Georgia, serif",
              fontSize: "0.72rem",
            }}
          >
            Luxury doesn&apos;t have to come in a full-size bottle.
          </Typography>
        </Box>

        <Divider
          sx={{
            mb: 3,
            borderColor: "rgba(255,255,255,0.12)",
          }}
        />

        {/* COPYRIGHT */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              color: "#777",
              fontFamily: "Georgia, serif",
              fontSize: "0.65rem",
              letterSpacing: "0.07em",
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} PARFUM STORE. ALL RIGHTS RESERVED.
          </Typography>

          <Typography
            sx={{
              color: "#777",
              fontFamily: "Georgia, serif",
              fontSize: "0.65rem",
              letterSpacing: "0.12em",
              textAlign: "center",
            }}
          >
            LUXURY IN EVERY DROP
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
