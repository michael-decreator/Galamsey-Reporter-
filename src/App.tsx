import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import ReportActivity from "./pages/ReportActivity"
import About from "./pages/About"
import ReportsDashboard from "./pages/ReportsDashboard"
import ReportSuccess from "./pages/ReportSuccess"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportActivity />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<ReportsDashboard />} />
        <Route path="/success" element={<ReportSuccess />} />
      </Routes>
    </BrowserRouter>
)
}

export default App





