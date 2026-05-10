import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";

import MobileTracker from "./pages/MobileTracker";

import Login from "./pages/auth/Login";

import Signup from "./pages/auth/Signup";

import ProtectedRoute from "./components/ProtectedRoute";

import {
  useAuth,
} from "./context/AuthContext";

function App() {

  const { currentUser } =
    useAuth();

  return (

    <Routes>

      {/* Protected Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected Mobile Tracker */}
      <Route
        path="/mobile"
        element={
          <ProtectedRoute>
            <MobileTracker />
          </ProtectedRoute>
        }
      />

      {/* Auth */}
      <Route
        path="/login"
        element={
          currentUser
            ? <Navigate to="/" />
            : <Login />
        }
      />

      <Route
        path="/signup"
        element={
          currentUser
            ? <Navigate to="/" />
            : <Signup />
        }
      />

    </Routes>
  );
}

export default App;