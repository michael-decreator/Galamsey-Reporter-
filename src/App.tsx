import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import ReportActivity from "./pages/ReportActivity"
import About from "./pages/About"

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportActivity />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
)
}

export default App





// function App() {
//   return (
//     <div>
//       <h1>Galamsey Reporter</h1>
//       <p>Report and monitor illegal mining activities.</p>
//     </div>
//   )
// }

// export default App