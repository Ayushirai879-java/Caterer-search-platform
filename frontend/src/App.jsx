import { Route, Routes } from "react-router-dom";
import AddCatererPage from "./pages/AddCatererPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CaterersPage from "./pages/CaterersPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/caterers" element={<CaterersPage />} />
      <Route path="/add-caterer" element={<AddCatererPage />} />
    </Routes>
  );
}
