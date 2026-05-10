import {
  createContext,
  useContext,
  useState,
} from "react";

const TrackingContext =
  createContext();

export const TrackingProvider = ({
  children,
}) => {

  const [trackingId, setTrackingId] =
    useState("");

  const [sessionId, setSessionId] =
    useState("");

  return (

    <TrackingContext.Provider
      value={{
        trackingId,
        setTrackingId,
        sessionId,
        setSessionId,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () =>
  useContext(TrackingContext);