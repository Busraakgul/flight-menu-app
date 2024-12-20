import { useRouter } from "next/router";

// Importing Material UI components for layout and styling
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
} from "@mui/material";

export default function Index() {
  const router = useRouter();

  // Function to navigate to the Home page
  const goToHome = () => {
    router.push("/home"); // Redirecting to the home page
  };

  return (
    <Box style={{ backgroundColor: "#F4F4F4", minHeight: "100vh" }}>
      {/* Navbar: The header section with the app name */}
      <AppBar position="static" style={{ backgroundColor: "#C00A0A" }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, fontWeight: "bold" }}>
            Turkish Airlines Digital Menu
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Header Section: Background image with overlay text */}
      <Box
        style={{
          position: "relative",
          backgroundImage:
            "url(https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "50px 20px",
          textAlign: "center",
          minHeight: "300px",
        }}
      >
        {/* Overlay to darken the background for readability */}
        <Box
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay for text clarity
            zIndex: 1,
          }}
        />
        {/* Content within the header section */}
        <Container
          maxWidth="md"
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Main Heading */}
          <Typography variant="h3" gutterBottom style={{ fontWeight: "bold", marginTop: "60px", }}>
            Explore Our In-Flight Menu
          </Typography>
          <Typography variant="h6" gutterBottom>
            Select, customize, and explore the world of Turkish Airlines digital menus.
          </Typography>
          {/* Button to navigate to the home page */}
          <Button
            variant="contained"
            color="secondary"
            style={{
              marginTop: "30px",
              backgroundColor: "#FFFFFF",
              color: "#C00A0A",
              fontWeight: "bold",
              padding: "10px 30px",
              fontSize: "16px",
            }}
            onClick={goToHome}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Content Section: Grid of cards to showcase different menu features */}
      <Container maxWidth="lg" style={{ marginTop: "40px" }}>
        <Grid container spacing={4}>
          {/* Card 1: Digital Menu Overview */}
          <Grid item xs={12} sm={6} md={4}>
            <Card style={{ backgroundColor: "#FFF", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", height: "100%" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  style={{ fontWeight: "bold", marginBottom: "10px", color: "#C00A0A" }}
                >
                  Digital Menu
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "20px" }}>
                  Browse our carefully curated in-flight menus designed to suit every taste and preference.
                </Typography>
                {/* Button to view the menu */}
                <div style={{ marginTop: "45px" }}> {/* Adding a div to push the button to the bottom */}
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{
                      backgroundColor: "#C00A0A",
                      color: "white",
                      fontWeight: "bold",
                      padding: "5px 15px",
                    }}
                    onClick={goToHome}
                  >
                    View Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
          {/* Card 2: Menu Personalization */}
          <Grid item xs={12} sm={6} md={4}>
            <Card style={{ backgroundColor: "#FFF", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  style={{ fontWeight: "bold", marginBottom: "10px", color: "#C00A0A" }}
                >
                  View Menu
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "20px" }}>
                  Personalize your meal by selecting your preferred items from our menu and adjusting your order.
                </Typography>
                {/* Button to learn more about the menu */}
                <div style={{ marginTop: "auto" }}> {/* Adding div to align the button at the bottom */}
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{
                      backgroundColor: "#C00A0A",
                      color: "white",
                      fontWeight: "bold",
                      padding: "5px 15px",
                    }}
                    onClick={goToHome}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
          {/* Card 3: Exclusive Offers */}
          <Grid item xs={12} sm={6} md={4}>
            <Card style={{ backgroundColor: "#FFF", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  style={{ fontWeight: "bold", marginBottom: "10px", color: "#C00A0A" }}
                >
                  Customize Your Menu
                </Typography>
                <Typography variant="body1" style={{ marginBottom: "20px" }}>
                  Explore exclusive meal options available for your journey, including special dietary choices and deals.
                </Typography>
                {/* Button to explore exclusive offers */}
                <Button
                  variant="contained"
                  color="secondary"
                  style={{
                    backgroundColor: "#C00A0A",
                    color: "white",
                    fontWeight: "bold",
                    padding: "5px 15px",
                  }}
                  onClick={goToHome}
                >
                  Explore Offers
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer Section: Copyright notice */}
      <Box
        style={{
          backgroundColor: "#222",
          color: "white",
          marginTop: "40px",
          padding: "20px 0",
          textAlign: "center",
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Turkish Airlines. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}
