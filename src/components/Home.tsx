import {
  AllInclusiveOutlined,
  BakeryDiningOutlined,
  DiamondOutlined,
  FemaleOutlined,
  ForestOutlined,
  LocalFloristOutlined,
  MaleOutlined,
  WaterDropOutlined,
} from "@mui/icons-material";

import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import { Link } from "react-router";

export function Home() {
  const categories = [
    {
      title: "FOR HER",
      icon: FemaleOutlined,
    },
    {
      title: "FOR HIM",
      icon: MaleOutlined,
    },
    {
      title: "UNISEX",
      icon: AllInclusiveOutlined,
    },
    {
      title: "NICHE",
      icon: DiamondOutlined,
    },
    {
      title: "FRESH",
      icon: WaterDropOutlined,
    },
    {
      title: "FLORAL",
      icon: LocalFloristOutlined,
    },
    {
      title: "WOODY",
      icon: ForestOutlined,
    },
    {
      title: "GOURMAND",
      icon: BakeryDiningOutlined,
    },
  ];

  const bestsellers = [
    {
      brand: "YVES SAINT LAURENT",
      name: "Libre",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/yves-saint-laurent/3614272648418_01-o/libre___190828.jpg",
    },
    {
      brand: "DIOR",
      name: "Sauvage",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/dior/3348901368247_01/sauvage___260811.jpg",
    },
    {
      brand: "PRADA",
      name: "Paradoxe",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/prada/3614273760713_01-o/paradoxe___220825.jpg",
    },
    {
      brand: "JEAN PAUL GAULTIER",
      name: "Le Male Le Parfum",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/jean-paul-gaultier/8435415032315_01-o/le-male-le-parfum___250411.jpg",
    },
  ];

  const moods = [
    {
      title: "CLEAN & FRESH",
      description: "Citrus · Aquatic · Green",
    },
    {
      title: "SOFT & ELEGANT",
      description: "Floral · Powdery · Musk",
    },
    {
      title: "WARM & SENSUAL",
      description: "Vanilla · Amber · Tonka",
    },
    {
      title: "DARK & MYSTERIOUS",
      description: "Wood · Leather · Spice",
    },
  ];

  const newArrivals = [
    {
      brand: "TOM FORD",
      name: "Lost Cherry",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/tom-ford/888066082341_01-o/private-blend-lost-cherry___250311.jpg",
    },
    {
      brand: "CAROLINA HERRERA",
      name: "Good Girl",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/carolina-herrera/8411061823514_01-o/good-girl___210901.jpg",
    },
    {
      brand: "GIORGIO ARMANI",
      name: "Sì",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/armani/3605521816511_01-o/si___241007.jpg",
    },
    {
      brand: "NARCISO RODRIGUEZ",
      name: "For Her",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/narciso-rodriguez/3423470890129_01/for-her___130904.jpg",
    },
  ];

  return (
    <Box sx={{ pb: { xs: 6, md: 10 } }}>
      {/* HERO */}
      <Box
        sx={{
          minHeight: { xs: 520, md: 450 },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          bgcolor: "#f3eee7",
          borderRadius: 2,
          overflow: "hidden",
          mb: { xs: 7, md: 10 },
        }}
      >
        <Stack
          spacing={2.5}
          sx={{
            justifyContent: "center",
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
            textAlign: {
              xs: "center",
              md: "left",
            },
            p: {
              xs: 4,
              sm: 6,
              md: 7,
            },
          }}
        >
          <Typography
            sx={{
              color: "#b28a45",
              fontFamily: "Georgia, serif",
              fontSize: "0.72rem",
              letterSpacing: "0.2em",
            }}
          >
            DISCOVER YOUR NEXT SIGNATURE SCENT
          </Typography>

          <Typography
            component="h1"
            sx={{
              color: "#333",
              fontFamily: "Georgia, serif",
              fontSize: {
                xs: "2rem",
                sm: "2.6rem",
                md: "3.2rem",
              },
              lineHeight: 1.2,
              letterSpacing: "0.05em",
              fontWeight: 400,
            }}
          >
            LUXURY FRAGRANCES
            <br />
            IN SMALLER SIZES
          </Typography>

          <Typography
            sx={{
              maxWidth: 500,
              color: "text.secondary",
              fontFamily: "Georgia, serif",
              fontSize: "0.95rem",
              lineHeight: 1.8,
            }}
          >
            Explore iconic designer and niche fragrances without committing to a
            full-size bottle.
          </Typography>

          <Button
            component={Link}
            to="/parfums"
            variant="contained"
            disableElevation
            sx={{
              mt: 1,
              px: 4,
              py: 1.4,
              bgcolor: "#333",
              borderRadius: 1,
              fontFamily: "Georgia, serif",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",

              "&:hover": {
                bgcolor: "#b28a45",
              },
            }}
          >
            SHOP PARFUMES
          </Button>
        </Stack>

        <Box
          sx={{
            position: "relative",
            minHeight: { xs: 260, md: "100%" },
          }}
        >
          <Box
            component="img"
            src="https://cdn.notinoimg.com/detail_main_lq/dior/3348901368247_01/sauvage___260811.jpg"
            alt="Dior Sauvage"
            sx={{
              position: "absolute",
              width: { xs: 145, md: 210 },
              height: { xs: 190, md: 280 },
              objectFit: "contain",
              bottom: 20,
              left: { xs: "12%", md: "6%" },
              transform: "rotate(-6deg)",
              mixBlendMode: "multiply",
            }}
          />

          <Box
            component="img"
            src="https://cdn.notinoimg.com/detail_main_lq/yves-saint-laurent/3614272648418_01-o/libre___190828.jpg"
            alt="Yves Saint Laurent Libre"
            sx={{
              position: "absolute",
              width: { xs: 165, md: 245 },
              height: { xs: 210, md: 310 },
              objectFit: "contain",
              bottom: 5,
              left: { xs: "37%", md: "34%" },
              zIndex: 2,
              mixBlendMode: "multiply",
            }}
          />

          <Box
            component="img"
            src="https://cdn.notinoimg.com/detail_main_lq/prada/3614273760713_01-o/paradoxe___220825.jpg"
            alt="Prada Paradoxe"
            sx={{
              position: "absolute",
              width: { xs: 135, md: 210 },
              height: { xs: 180, md: 270 },
              objectFit: "contain",
              bottom: 20,
              right: "5%",
              transform: "rotate(5deg)",
              mixBlendMode: "multiply",
            }}
          />
        </Box>
      </Box>

      {/* SHOP BY CATEGORY */}
      <Box sx={{ mb: { xs: 7, md: 10 } }}>
        <Typography
          sx={{
            textAlign: "center",
            color: "#333",
            fontFamily: "Georgia, serif",
            fontSize: { xs: "1.15rem", md: "1.45rem" },
            letterSpacing: "0.15em",
            mb: 5,
          }}
        >
          SHOP BY CATEGORY
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(4, 1fr)",
              lg: "repeat(8, 1fr)",
            },
            gap: { xs: 4, md: 2 },
          }}
        >
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Box
                component={Link}
                to="/parfums"
                key={category.title}
                sx={{
                  textDecoration: "none",
                  color: "#333",
                  textAlign: "center",

                  "&:hover .category-icon": {
                    borderColor: "#b28a45",
                  },

                  "&:hover .category-icon-svg": {
                    color: "#b28a45",
                  },

                  "&:hover .category-title": {
                    color: "#b28a45",
                  },
                }}
              >
                <Box
                  className="category-icon"
                  sx={{
                    width: { xs: 74, md: 82 },
                    height: { xs: 74, md: 82 },
                    mx: "auto",
                    mb: 2,
                    border: "1px solid #333",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "border-color 180ms ease",
                  }}
                >
                  <Icon
                    className="category-icon-svg"
                    sx={{
                      fontSize: { xs: 29, md: 34 },
                      color: "#333",
                      transition: "color 180ms ease",
                    }}
                  />
                </Box>

                <Typography
                  className="category-title"
                  sx={{
                    fontFamily: "Georgia, serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.13em",
                    transition: "color 180ms ease",
                  }}
                >
                  {category.title}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* PERFUME VIDEO */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: {
            xs: 300,
            sm: 420,
            md: 540,
          },
          overflow: "hidden",
          borderRadius: 2,
          mb: { xs: 7, md: 10 },
          bgcolor: "#111",
        }}
      >
        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          sx={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
            objectPosition: "center",
          }}
        >
          <source
            src={`${import.meta.env.BASE_URL}videos/test_vonavky.mp4`}
            type="video/mp4"
          />
        </Box>

        {/* DARK OVERLAY */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.08) 100%)",
          }}
        />

        {/* VIDEO TEXT */}
        <Stack
          spacing={1.5}
          sx={{
            position: "absolute",
            top: "50%",
            left: {
              xs: "50%",
              md: "8%",
            },
            transform: {
              xs: "translate(-50%, -50%)",
              md: "translateY(-50%)",
            },
            width: {
              xs: "85%",
              md: "auto",
            },
            textAlign: {
              xs: "center",
              md: "left",
            },
            alignItems: {
              xs: "center",
              md: "flex-start",
            },
          }}
        >
          <Typography
            sx={{
              color: "rgba(255,255,255,0.85)",
              fontFamily: "Georgia, serif",
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
            }}
          >
            EXPERIENCE THE FRAGRANCE
          </Typography>

          <Typography
            sx={{
              color: "white",
              fontFamily: "Georgia, serif",
              fontSize: {
                xs: "1.5rem",
                sm: "2rem",
                md: "2.5rem",
              },
              fontWeight: 400,
              letterSpacing: "0.1em",
              lineHeight: 1.35,
              textShadow: "0 2px 10px rgba(0,0,0,0.35)",
            }}
          >
            FIND THE SCENT
            <br />
            THAT FEELS LIKE YOU
          </Typography>
        </Stack>
      </Box>

      {/* FIND YOUR MOOD */}
      <Box sx={{ mb: { xs: 7, md: 10 } }}>
        <Typography
          sx={{
            textAlign: "center",
            color: "#333",
            fontFamily: "Georgia, serif",
            fontSize: { xs: "1.15rem", md: "1.45rem" },
            letterSpacing: "0.15em",
            mb: 1.5,
          }}
        >
          FIND YOUR MOOD
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            color: "text.secondary",
            fontFamily: "Georgia, serif",
            fontSize: "0.72rem",
            letterSpacing: "0.12em",
            mb: 5,
          }}
        >
          CHOOSE HOW YOU WANT TO FEEL
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {moods.map((mood) => (
            <Box
              key={mood.title}
              component={Link}
              to="/parfums"
              sx={{
                p: { xs: 3, md: 4 },
                border: "1px solid #e5e5e5",
                borderRadius: 2,
                textAlign: "center",
                textDecoration: "none",
                transition: "border-color 180ms ease",

                "&:hover": {
                  borderColor: "#b28a45",
                },

                "&:hover .mood-title": {
                  color: "#b28a45",
                },
              }}
            >
              <Typography
                className="mood-title"
                sx={{
                  color: "#333",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.78rem",
                  letterSpacing: "0.12em",
                  mb: 1.5,
                  transition: "color 180ms ease",
                }}
              >
                {mood.title}
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.73rem",
                }}
              >
                {mood.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* DISCOVER MORE FOR LESS */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1.15fr 0.85fr",
          },
          bgcolor: "#333",
          color: "white",
          borderRadius: 2,
          overflow: "hidden",
          mb: { xs: 7, md: 10 },
        }}
      >
        <Stack
          spacing={2.3}
          sx={{
            justifyContent: "center",
            p: {
              xs: 4,
              sm: 6,
              md: 7,
            },
          }}
        >
          <Typography
            sx={{
              color: "#c9a968",
              fontFamily: "Georgia, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
            }}
          >
            SMALLER SIZE. SAME EXPERIENCE.
          </Typography>

          <Typography
            sx={{
              fontFamily: "Georgia, serif",
              fontSize: { xs: "1.8rem", md: "2.4rem" },
              lineHeight: 1.25,
              letterSpacing: "0.06em",
              fontWeight: 400,
            }}
          >
            DISCOVER MORE
            <br />
            FOR LESS
          </Typography>

          <Typography
            sx={{
              maxWidth: 520,
              color: "#d5d5d5",
              fontFamily: "Georgia, serif",
              fontSize: "0.9rem",
              lineHeight: 1.8,
            }}
          >
            Why choose only one fragrance? Explore luxury perfumes in smaller
            sizes and build a collection that changes with you.
          </Typography>

          <Button
            component={Link}
            to="/parfums"
            variant="outlined"
            sx={{
              alignSelf: "flex-start",
              mt: 1,
              px: 3,
              py: 1.2,
              borderColor: "white",
              color: "white",
              borderRadius: 1,
              fontFamily: "Georgia, serif",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",

              "&:hover": {
                borderColor: "#c9a968",
                color: "#c9a968",
                bgcolor: "transparent",
              },
            }}
          >
            DISCOVER NOW
          </Button>
        </Stack>

        <Box
          sx={{
            minHeight: { xs: 300, md: 420 },
            bgcolor: "#eee8de",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Box
            component="img"
            src="https://cdn.notinoimg.com/detail_main_lq/carolina-herrera/8411061823514_01-o/good-girl___210901.jpg"
            alt="Carolina Herrera Good Girl"
            sx={{
              width: "100%",
              height: "100%",
              maxHeight: 340,
              objectFit: "contain",
              mixBlendMode: "multiply",
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: { xs: 6, md: 8 } }} />

      {/* NEW IN */}
      <Box sx={{ mb: { xs: 8, md: 11 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              color: "#333",
              fontFamily: "Georgia, serif",
              fontSize: { xs: "1.1rem", md: "1.4rem" },
              letterSpacing: "0.15em",
            }}
          >
            NEW IN
          </Typography>

          <Button
            component={Link}
            to="/parfums"
            disableRipple
            sx={{
              color: "#333",
              fontFamily: "Georgia, serif",
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              textDecoration: "underline",
              textUnderlineOffset: 4,

              "&:hover": {
                bgcolor: "transparent",
                color: "#b28a45",
              },
            }}
          >
            VIEW ALL
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {newArrivals.map((product) => (
            <Box
              key={`${product.brand}-${product.name}`}
              component={Link}
              to="/parfums"
              sx={{
                color: "inherit",
                textDecoration: "none",

                "&:hover img": {
                  transform: "scale(1.035)",
                },

                "&:hover .product-name": {
                  color: "#b28a45",
                },
              }}
            >
              <Box
                sx={{
                  height: { xs: 220, sm: 280, md: 310 },
                  bgcolor: "#fafafa",
                  border: "1px solid #eeeeee",
                  borderRadius: 2,
                  p: { xs: 2, md: 3 },
                  mb: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                    transition: "transform 220ms ease",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#777",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.13em",
                  mb: 0.5,
                }}
              >
                {product.brand}
              </Typography>

              <Typography
                className="product-name"
                sx={{
                  color: "#333",
                  fontFamily: "Georgia, serif",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  transition: "color 180ms ease",
                }}
              >
                {product.name}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  color: "#999",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.7rem",
                }}
              >
                {product.type}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* PERFUME WARDROBE */}
      <Box
        sx={{
          borderTop: "1px solid #eeeeee",
          borderBottom: "1px solid #eeeeee",
          py: { xs: 7, md: 10 },
          mb: { xs: 7, md: 10 },
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#b28a45",
            fontFamily: "Georgia, serif",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            mb: 2,
          }}
        >
          THE PERFUME WARDROBE
        </Typography>

        <Typography
          sx={{
            color: "#333",
            fontFamily: "Georgia, serif",
            fontSize: {
              xs: "1.5rem",
              md: "2.15rem",
            },
            letterSpacing: "0.08em",
            lineHeight: 1.4,
            mb: 2.5,
          }}
        >
          ONE SCENT DOESN&apos;T HAVE
          <br />
          TO DEFINE YOU.
        </Typography>

        <Typography
          sx={{
            maxWidth: 650,
            mx: "auto",
            px: 2,
            color: "text.secondary",
            fontFamily: "Georgia, serif",
            fontSize: "0.9rem",
            lineHeight: 1.9,
            mb: 3,
          }}
        >
          A fragrance for work. One for the evening. One for summer. One simply
          because you love it. Smaller sizes let your collection grow with every
          side of you.
        </Typography>

        <Button
          component={Link}
          to="/parfums"
          disableRipple
          sx={{
            color: "#333",
            fontFamily: "Georgia, serif",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textDecoration: "underline",
            textUnderlineOffset: 5,

            "&:hover": {
              bgcolor: "transparent",
              color: "#b28a45",
            },
          }}
        >
          BUILD YOUR COLLECTION
        </Button>
      </Box>

      {/* BESTSELLERS */}
      <Box sx={{ mb: { xs: 7, md: 10 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              color: "#333",
              fontFamily: "Georgia, serif",
              fontSize: { xs: "1.1rem", md: "1.4rem" },
              letterSpacing: "0.15em",
            }}
          >
            BESTSELLERS
          </Typography>

          <Button
            component={Link}
            to="/parfums"
            disableRipple
            sx={{
              color: "#333",
              fontFamily: "Georgia, serif",
              fontSize: "0.68rem",
              letterSpacing: "0.12em",
              textDecoration: "underline",
              textUnderlineOffset: 4,

              "&:hover": {
                bgcolor: "transparent",
                color: "#b28a45",
              },
            }}
          >
            VIEW ALL
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: { xs: 2, md: 3 },
          }}
        >
          {bestsellers.map((product) => (
            <Box
              key={`${product.brand}-${product.name}`}
              component={Link}
              to="/parfums"
              sx={{
                color: "inherit",
                textDecoration: "none",

                "&:hover img": {
                  transform: "scale(1.035)",
                },

                "&:hover .product-name": {
                  color: "#b28a45",
                },
              }}
            >
              <Box
                sx={{
                  height: { xs: 220, sm: 280, md: 310 },
                  bgcolor: "#fafafa",
                  border: "1px solid #eeeeee",
                  borderRadius: 2,
                  p: { xs: 2, md: 3 },
                  mb: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                    transition: "transform 220ms ease",
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#777",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.13em",
                  mb: 0.5,
                }}
              >
                {product.brand}
              </Typography>

              <Typography
                className="product-name"
                sx={{
                  color: "#333",
                  fontFamily: "Georgia, serif",
                  fontSize: { xs: "0.9rem", md: "1rem" },
                  transition: "color 180ms ease",
                }}
              >
                {product.name}
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  color: "#999",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.7rem",
                }}
              >
                {product.type}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "#555",
                  fontFamily: "Georgia, serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                }}
              >
                2 ML · 5 ML · 10 ML · 20 ML
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
