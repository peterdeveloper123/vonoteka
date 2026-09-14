import { BrowserRouter, Routes, Route } from "react-router";
import { Container } from "@mui/material";
import { Menu } from "./header/Menu";
import { LoginForm } from "./components/LoginForm";

function App() {
  return (
    <BrowserRouter>
      <Menu />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/parfums" element={<ParfumsPage />} />
          <Route path="/profile" element={<Login />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

function HomePage() {
  return <h1>Domov</h1>;
}

function AboutPage() {
  return <h1>O nás</h1>;
}

function ParfumsPage() {
  return <h1>Parfumy</h1>;
}

function Login() {
  return <LoginForm />;
}

export default App;
