import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MobileTracker from "./pages/MobileTracker";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/mobile" element={<MobileTracker />} />
    </Routes>
  );
}

export default App;