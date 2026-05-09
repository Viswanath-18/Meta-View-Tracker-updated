import { useEffect, useState } from "react";

import {
  ref,
  onValue,
} from "firebase/database";

import { database } from "../firebase/firebaseConfig";

import MapView from "../components/MapView";

function Dashboard() {

  const [currentLocation, setCurrentLocation] =
    useState(null);

  const [pathHistory, setPathHistory] =
    useState([]);

  const [autoCenter, setAutoCenter] =
    useState(true);

  const [connectionStatus, setConnectionStatus] =
    useState("Waiting for GPS...");

  // Listen for realtime updates
  useEffect(() => {

    const currentRef =
      ref(database, "tracking/current");

    const historyRef =
      ref(database, "tracking/history");

    // Current position listener
    const unsubscribeCurrent = onValue(
      currentRef,
      (snapshot) => {

        const data = snapshot.val();

        if (data) {

          setCurrentLocation([
            data.lat,
            data.lng,
          ]);

          setConnectionStatus(
            "Live tracking active"
          );
        }
      }
    );

    // Path history listener
    const unsubscribeHistory = onValue(
      historyRef,
      (snapshot) => {

        const data = snapshot.val();

        if (data) {

          const points = Object.values(data).map(
            (item) => [
              item.lat,
              item.lng,
            ]
          );

          setPathHistory(points);
        }
      }
    );

    return () => {
      unsubscribeCurrent();
      unsubscribeHistory();
    };

  }, []);

  return (

    <div className="w-full h-screen bg-[#f8fafc] p-4">

      <div className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl">

        {/* MAP */}
        <MapView
          currentPosition={currentLocation}
          pathPositions={pathHistory}
          autoCenter={autoCenter}
        />

        {/* TOP PANEL */}
        <div className="absolute top-6 left-6 z-[1000] glass rounded-3xl px-6 py-5 shadow-glass">

          <h1 className="text-3xl font-heading font-bold text-slate-800">
            Meta View Lite
          </h1>

          <p className="text-slate-500 mt-1">
            Real-Time GPS Tracking
          </p>

          <div className="mt-4 flex items-center gap-3">

            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />

            <span className="text-sm text-slate-700">
              {connectionStatus}
            </span>
          </div>
        </div>

        {/* TELEMETRY */}
        <div className="absolute bottom-6 left-6 z-[1000] glass rounded-3xl p-5 shadow-glass w-[320px]">

          <h2 className="text-lg font-semibold text-slate-800">
            Live Telemetry
          </h2>

          <div className="mt-5 space-y-4">

            <div>
              <p className="text-sm text-slate-500">
                Latitude
              </p>

              <h3 className="text-lg font-medium text-slate-800 break-all">
                {currentLocation
                  ? currentLocation[0]
                  : "--"}
              </h3>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Longitude
              </p>

              <h3 className="text-lg font-medium text-slate-800 break-all">
                {currentLocation
                  ? currentLocation[1]
                  : "--"}
              </h3>
            </div>

            <button
              onClick={() =>
                setAutoCenter(!autoCenter)
              }
              className="w-full mt-2 bg-slate-900 text-white py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              {autoCenter
                ? "Disable Auto-Center"
                : "Enable Auto-Center"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;