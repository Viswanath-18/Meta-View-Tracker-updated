import React from "react";
import ReactDOM from "react-dom/client";
import "leaflet/dist/leaflet.css";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider, } from "./context/AuthContext";
import {
  TrackingProvider,
} from "./context/TrackingContext";
import App from "./App";

import "./index.css";

// Leaflet marker fixes
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <AuthProvider>

      <TrackingProvider>

        <BrowserRouter>
          <App />
        </BrowserRouter>

      </TrackingProvider>

    </AuthProvider>

  </React.StrictMode>
);