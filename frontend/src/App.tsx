import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import { AuthProvider } from "./lib/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}
