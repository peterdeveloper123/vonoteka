import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

export function Parfumes() {
  const parfumes = [
    {
      brand: "DIOR",
      name: "Sauvage",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/dior/3348901368247_01/sauvage___260811.jpg",
      description:
        "An intense aromatic fragrance combining fresh bergamot with a warm and sensual vanilla character.",
      link: "https://www.notino.sk/dior/sauvage-parfumovana-voda-pre-muzov/",
    },
    {
      brand: "JEAN PAUL GAULTIER",
      name: "Le Male Le Parfum",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/jean-paul-gaultier/8435415032315_01-o/le-male-le-parfum___250411.jpg",
      description:
        "A sophisticated masculine fragrance built around cardamom, lavender and elegant iris.",
      link: "https://www.notino.sk/jean-paul-gaultier/le-male-le-parfum-parfumovana-voda-pre-muzov/p-16037673/",
    },
    {
      brand: "LANCÔME",
      name: "La Vie Est Belle",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/lancome/3605532612690_01-o/la-vie-est-belle___250312.jpg",
      description:
        "A feminine composition of blackcurrant, pear, jasmine, iris, vanilla and sweet praline.",
      link: "https://www.notino.sk/lancome/la-vie-est-belle-parfemovana-voda-pre-zeny/p-83697/",
    },
    {
      brand: "NARCISO RODRIGUEZ",
      name: "For Her",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/narciso-rodriguez/3423470890129_01/for-her___130904.jpg",
      description:
        "A delicate and sensual fragrance combining floral notes with the signature musky character of Narciso Rodriguez.",
      link: "https://www.notino.sk/narciso-rodriguez/for-her-parfemovana-voda-pre-zeny/p-69508/",
    },
    {
      brand: "RABANNE",
      name: "1 Million Parfum",
      type: "Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/paco-rabanne/3349668581948_01-o/1-million-parfum___240717.jpg",
      description:
        "A bold, rich and warm fragrance with an unmistakably opulent and seductive character.",
      link: "https://www.notino.sk/paco-rabanne/1-million-parfum-parfem-pre-muzov/",
    },
    {
      brand: "GIVENCHY",
      name: "Gentleman",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/givenchy/3274872424982_01/gentleman-givenchy___220711.jpg",
      description:
        "Elegant iris and patchouli meet dark vanilla and balsamic notes in a refined masculine fragrance.",
      link: "https://www.notino.sk/givenchy/gentleman-parfumovana-voda-pre-muzov/",
    },
    {
      brand: "GUCCI",
      name: "Bloom",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/gucci/8005610481005_02-o/bloom___170908.jpg",
      description:
        "A rich white-floral fragrance with an elegant, creamy and unmistakably feminine character.",
      link: "https://www.notino.sk/gucci/bloom-parfemovana-voda-pre-zeny/",
    },
    {
      brand: "BURBERRY",
      name: "Her",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/burberry/3614227693920_01-o/her___260216.jpg",
      description:
        "Juicy berries meet jasmine, violet, warm amber, musk and woods in this modern feminine fragrance.",
      link: "https://www.notino.sk/burberry/her-parfumovana-voda-pre-zeny/p-15765972/",
    },
    {
      brand: "CAROLINA HERRERA",
      name: "Good Girl",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/carolina-herrera/8411061823514_01-o/good-girl___210901.jpg",
      description:
        "Almond, jasmine and tuberose blend with tonka bean and cocoa for a seductive oriental floral signature.",
      link: "https://www.notino.sk/carolina-herrera/good-girl-parfemovana-voda-pre-zeny/p-573739/",
    },
    {
      brand: "VERSACE",
      name: "Eros",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/versace/8011003861224_01-o/eros___260216.jpg",
      description:
        "A powerful and energetic masculine fragrance balancing fresh aromatic notes with a warm sensual base.",
      link: "https://www.notino.sk/versace/eros-parfumovana-voda-pre-muzov/",
    },
    {
      brand: "GIORGIO ARMANI",
      name: "Sì",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/armani/3605521816511_01-o/si___241007.jpg",
      description:
        "Blackcurrant, freesia and rose are balanced by patchouli and musk in an elegant modern composition.",
      link: "https://www.notino.sk/armani/si-parfumovana-voda-pre-zeny/p-405451/",
    },
    {
      brand: "MUGLER",
      name: "Alien",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/mugler/3439600056952_01-o/alien___220425.jpg",
      description:
        "A distinctive and mysterious fragrance centred around luminous jasmine and warm cashmere wood.",
      link: "https://www.notino.sk/thierry-mugler/alien-parfemovana-voda-pre-zeny/",
    },
    {
      brand: "TOM FORD",
      name: "Lost Cherry",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/tom-ford/888066082341_01-o/private-blend-lost-cherry___250311.jpg",
      description:
        "A luxurious gourmand fragrance where dark cherry and almond meet a rich, warm and sensual base.",
      link: "https://www.notino.sk/tom-ford/lost-cherry-parfumovana-voda-unisex/",
    },
    {
      brand: "YVES SAINT LAURENT",
      name: "Libre",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/yves-saint-laurent/3614272648418_01-o/libre___190828.jpg",
      description:
        "French lavender, orange blossom and warm vanilla create a confident and elegant floral composition.",
      link: "https://www.notino.sk/yves-saint-laurent/libre-libre-parfumovana-voda-pre-zeny/",
    },
    {
      brand: "GIORGIO ARMANI",
      name: "Acqua di Gioia",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/armani/3605521172525_01new-o/acqua-di-gioia___130516.jpg",
      description:
        "A luminous aquatic floral fragrance with jasmine, cedar and warm labdanum inspired by the Mediterranean.",
      link: "https://www.notino.sk/armani/acqua-di-gioia-parfemovana-voda-pre-zeny/",
    },
    {
      brand: "DIOR",
      name: "J'adore",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/dior/3348901738224_01/jadore___241218.jpg",
      description:
        "A celebrated floral composition of ylang-ylang, Damask rose and luminous jasmine.",
      link: "https://www.notino.sk/dior/jadore-parfumovana-voda-pre-zeny-7053802/",
    },
    {
      brand: "DOLCE & GABBANA",
      name: "Light Blue",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/dolcegabbana/8056669925781_01/light-blue-eau-de-parfum___260310.jpg",
      description:
        "Sicilian lemon and creamy frangipani meet warm amber woods in a bright Mediterranean composition.",
      link: "https://www.notino.sk/dolce-gabbana/light-blue-eau-de-parfum-parfumovana-voda-pre-zeny/",
    },
    {
      brand: "HUGO BOSS",
      name: "BOSS Bottled",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/hugo-boss/3614229828559_01-i/boss-bottled___250411.jpg",
      description:
        "A warm and sophisticated masculine fragrance with a polished woody and spicy character.",
      link: "https://www.notino.sk/hugo-boss/boss-bottled-parfumovana-voda-pre-muzov/p-16043448/",
    },
    {
      brand: "PRADA",
      name: "Paradoxe",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/prada/3614273760713_01-o/paradoxe___220825.jpg",
      description:
        "Bergamot, neroli and orange blossom meet amber, vanilla and white musk in a modern floral composition.",
      link: "https://www.notino.sk/prada/prada-paradoxe-parfumovana-voda-plnitelna-pre-zeny/p-16143147/",
    },
    {
      brand: "NARCISO RODRIGUEZ",
      name: "For Her Musc Noir Rose",
      type: "Eau de Parfum",
      image:
        "https://cdn.notinoimg.com/detail_main_lq/narciso-rodriguez/3423222055547_01/for-her-musc-noir-rose___220119.jpg",
      description:
        "Bergamot and pink pepper reveal sensual musk and tuberose over vanilla, patchouli and suede.",
      link: "https://www.notino.sk/narciso-rodriguez/for-her-musc-noir-rose-parfumovana-voda-pre-zeny/",
    },
  ];

  return (
    <Box sx={{ pb: { xs: 5, md: 9 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: {
            xs: 2.5,
            sm: 3,
            md: 3.5,
          },
        }}
      >
        {parfumes.map((parfume) => (
          <Card
            key={`${parfume.brand}-${parfume.name}`}
            elevation={0}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              border: "1px solid #e3e3e3",
              borderRadius: 2,
              bgcolor: "white",
              overflow: "hidden",
              transition:
                "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",

              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 4,
                borderColor: "#333",
              },
            }}
          >
            <Box
              sx={{
                height: {
                  xs: 320,
                  sm: 300,
                  md: 290,
                },
                bgcolor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
                borderBottom: "1px solid #eeeeee",
              }}
            >
              <Box
                component="img"
                src={parfume.image}
                alt={`${parfume.brand} ${parfume.name}`}
                loading="lazy"
                sx={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transition: "transform 250ms ease",

                  ".MuiCard-root:hover &": {
                    transform: "scale(1.04)",
                  },
                }}
              />
            </Box>

            <CardContent
              sx={{
                p: 3,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",

                "&:last-child": {
                  pb: 3,
                },
              }}
            >
              <Stack spacing={1.2} sx={{ height: "100%" }}>
                <Typography
                  sx={{
                    color: "#777",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    fontWeight: 400,
                  }}
                >
                  {parfume.brand}
                </Typography>

                <Typography
                  sx={{
                    color: "#333",
                    fontFamily: "Georgia, serif",
                    fontSize: "1.15rem",
                    fontWeight: 400,
                  }}
                >
                  {parfume.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#999",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {parfume.type}
                </Typography>

                <Typography
                  sx={{
                    color: "text.secondary",
                    fontFamily: "Georgia, serif",
                    fontSize: "0.82rem",
                    lineHeight: 1.7,
                    flexGrow: 1,
                    pt: 0.5,
                  }}
                >
                  {parfume.description}
                </Typography>

                <Button
                  component="a"
                  href={parfume.link}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  disableRipple
                  sx={{
                    mt: 1.5,
                    alignSelf: "flex-start",
                    color: "#333",
                    borderColor: "#333",
                    borderRadius: 1,
                    fontFamily: "Georgia, serif",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    fontWeight: 400,
                    px: 2.2,
                    py: 1,
                    whiteSpace: "nowrap",

                    "&:hover": {
                      color: "#b28a45",
                      borderColor: "#b28a45",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  VIEW DETAILS
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
