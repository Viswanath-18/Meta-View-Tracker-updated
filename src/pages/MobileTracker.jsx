import { useEffect, useRef, useState } from "react";

import {
  ref,
  set,
  push,
} from "firebase/database";
import {
  useAuth,
} from "../context/AuthContext";
import { database } from "../firebase/firebaseConfig";

function MobileTracker() {
const { currentUser } =
  useAuth();
  const watchIdRef = useRef(null);

  const [tracking, setTracking] = useState(false);

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    speed: 0,
    accuracy: null,
  });

  const [status, setStatus] = useState("Idle");

  const [lastUpdated, setLastUpdated] = useState("");

  // Start tracking
  const startTracking = () => {

    if (!navigator.geolocation) {
      setStatus("Geolocation not supported");
      return;
    }

    setStatus("Requesting location permission...");

    watchIdRef.current = navigator.geolocation.watchPosition(

      async (position) => {

        // Prevent updates after tracking stopped
        if (watchIdRef.current === null) {
          return;
        }

        const payload = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          speed: position.coords.speed || 0,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        };

        console.log("GPS DATA:", payload);

        try {

          // Save current live position
          await set(
  ref(
    database,
    `users/${currentUser.uid}/current`
  ),
  payload
);

          // Save history path
          await push(
  ref(
    database,
    `users/${currentUser.uid}/history`
  ),
  payload
);

          setLocation(payload);

          setTracking(true);

          setStatus("Live tracking active");

          setLastUpdated(
            new Date().toLocaleTimeString()
          );

        } catch (error) {

          console.error(error);

          setStatus("Firebase sync failed");
        }
      },

      (error) => {

        console.error(error);

        switch (error.code) {

          case 1:
            setStatus("Location permission denied");
            break;

          case 2:
            setStatus("Location unavailable");
            break;

          case 3:
            setStatus("GPS timeout");
            break;

          default:
            setStatus("GPS error");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000,
      }
    );
};
  // Stop tracking
const stopTracking = () => {

  // Stop browser GPS watcher
  if (watchIdRef.current !== null) {

    navigator.geolocation.clearWatch(
      watchIdRef.current
    );

    // IMPORTANT
    // Reset watcher reference completely
    watchIdRef.current = null;
  }

  // Update UI state
  setTracking(false);

  setStatus("Tracking stopped");
};
  // Cleanup
  useEffect(() => {

    return () => {

      if (watchIdRef.current !== null) {

        navigator.geolocation.clearWatch(
          watchIdRef.current
        );
      }
    };

  }, []);

  return (

    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">

      <div className="glass rounded-3xl shadow-glass p-8 w-full max-w-md">

        {/* HEADER */}
        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-heading font-bold text-slate-800">
              Meta View Lite
            </h1>

            <p className="text-slate-500 mt-1">
              Mobile GPS Sender
            </p>

          </div>

          <div
            className={`w-4 h-4 rounded-full ${
              tracking
                ? "bg-emerald-500 animate-pulse"
                : "bg-slate-300"
            }`}
          />
        </div>

        {/* LOCATION CARDS */}
        <div className="mt-8 space-y-4">

          <div className="glass rounded-2xl p-4">

            <p className="text-sm text-slate-500">
              Latitude
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-1 break-all">
              {location.lat ?? "--"}
            </h2>
          </div>

          <div className="glass rounded-2xl p-4">

            <p className="text-sm text-slate-500">
              Longitude
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-1 break-all">
              {location.lng ?? "--"}
            </h2>
          </div>

          <div className="glass rounded-2xl p-4">

            <p className="text-sm text-slate-500">
              Accuracy
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-1">
              {location.accuracy
                ? `${Math.round(location.accuracy)} m`
                : "--"}
            </h2>
          </div>

          <div className="glass rounded-2xl p-4">

            <p className="text-sm text-slate-500">
              Speed
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-1">
              {location.speed
                ? `${location.speed.toFixed(2)} m/s`
                : "0 m/s"}
            </h2>
          </div>

        </div>

        {/* STATUS */}
        <div className="mt-6 glass rounded-2xl p-4">

          <p className="text-sm text-slate-500">
            Status
          </p>

          <h2 className="text-lg font-medium text-slate-800 mt-1">
            {status}
          </h2>

          {lastUpdated && (

            <p className="text-sm text-slate-400 mt-2">
              Last updated: {lastUpdated}
            </p>
          )}
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex gap-4">

          {!tracking ? (

            <button
              onClick={startTracking}
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-[1.02]"
            >
              Start Tracking
            </button>

          ) : (

            <button
              onClick={stopTracking}
              className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-[1.02]"
            >
              Stop Tracking
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default MobileTracker;
