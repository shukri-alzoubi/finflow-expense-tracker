import { createContext, useContext, useState, useEffect } from "react";
import NoInternetPage from "../pages/shared/NoInternet.page";

const OnlineContext = createContext(null);

export const OnlineProvider = ({children}) => {
    const getOnlineStatus = () => typeof navigator !== "undefined"
        ? Boolean(navigator.onLine) // normalize to boolean
        : true; // default fallback when navigator is not ready

    const [online, setOnline] = useState(getOnlineStatus());

    useEffect(() => {
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Recheck once component mounts (for browser quirks)
        setOnline(getOnlineStatus());

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const values = { online };

    return <OnlineContext.Provider value={values}>
        {online && children}
        {!online && <NoInternetPage />}
    </OnlineContext.Provider>
}

/**  @returns {{online: Boolean}} */
export const useOnline = ()=> useContext(OnlineContext);