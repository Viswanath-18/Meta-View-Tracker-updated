import { useEffect, useRef, useState } from "react";

import {
  ref,
  set,
  push,
} from "firebase/database";

import { database } from "../firebase/firebaseConfig";

function MobileTracker() {
  const watchIdRef = useRef(null);

  const [tracking, setTracking] = useState(false);

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    speed: null,
    accuracy: null,
  });

  const [status, setStatus] = useState("Waiting...");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Start GPS tracking
  const startTracking = () => {
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported");
      return;
    }

    setTracking(true);
    setStatus("Requesting GPS access...");

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const speed = position.coords.speed || 0;
        const accuracy = position.coords.accuracy;

        const payload = {
          lat,
          lng,
          speed,
          accuracy,
          timestamp: Date.now(),
        };

        try {
          // Update current location
          await set(ref(database, "tracking/current"), payload);

          // Save history point
          await push(ref(database, "tracking/history"), payload);

          setLocation(payload);

          setLastUpdated(new Date().toLocaleTimeString());

          setStatus("Live tracking active");
        } catch (error) {
          console.error(error);
          setStatus("Firebase sync failed");
        }
      },

      (error) => {
        console.error(error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatus("GPS permission denied");
            break;

          case error.POSITION_UNAVAILABLE:
            setStatus("Location unavailable");
            break;

          case error.TIMEOUT:
            setStatus("GPS timeout");
            break;

          default:
            setStatus("Unknown GPS error");
        }
      },

      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  };

  // Stop tracking
  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setTracking(false);
    setStatus("Tracking stopped");
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="glass shadow-glass rounded-3xl w-full max-w-md p-8">

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold text-slate-800">
            Meta View Lite
          </h1>

          <div
            className={`w-4 h-4 rounded-full ${
              tracking ? "bg-emerald-500" : "bg-slate-300"
            }`}
          />
        </div>

        <p className="text-slate-500 mt-2">
          Mobile GPS Sender
        </p>

        {/* GPS DATA */}
        <div className="mt-8 space-y-4">

          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-slate-500">
              Latitude
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-1">
              {location.lat || "--"}
            </h2>
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="text-sm text-slate-500">
              Longitude
            </p>

            <h2 className="text-xl font-semibold text-slate-800 mt-1">
              {location.lng || "--"}
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
        <div className="mt-6">
          <div className="glass rounded-2xl p-4">
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
        </div>

        {/* BUTTONS */}
        <div className="mt-8 flex gap-4">

          {!tracking ? (
            <button
              onClick={startTracking}
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-medium hover:scale-[1.02] transition-all duration-300"
            >
              Start Tracking
            </button>
          ) : (
            <button
              onClick={stopTracking}
              className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-medium hover:scale-[1.02] transition-all duration-300"
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