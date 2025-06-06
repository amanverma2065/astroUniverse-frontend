import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [astrologer, setAstrologer] = useState(null);
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(true);
    const [allHomeAstrologer, setAllHomeAstrologer] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState([]);
    const [currentClients, setCurrentClients] = useState([]);
    const [selectedChatAstrologer, setSelectedChatAstrologer] = useState();
    const [selectedChatClient, setSelectedChatClient] = useState();

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUserData = localStorage.getItem("userData");

        if (savedToken && savedUserData) {
            const parsedUser = JSON.parse(savedUserData);
            if (parsedUser.accountType === "user") {
                setUser(parsedUser);
                console.log("LOCAL USER :", parsedUser);
                const activeSubs = parsedUser.subscribedAstrologers.filter(
                    (subscription) => new Date(subscription.expiryDate) > new Date()
                );
                setCurrentSubscription(activeSubs);
                if (window.location.pathname === "/user-login" || window.location.pathname === "/astrologer-login" || window.location.pathname === "/verify-otp") {
                    navigate("/"); // only redirect from login/otp page
                }
            } else if (parsedUser.accountType === "admin") {
                setAdmin(parsedUser);
                console.log("LOCAL ADMIN :", parsedUser);
                if (!window.location.pathname.startsWith("/admin")) {
                    navigate("/admin");
                }
            } else if (parsedUser.accountType === "astrologer") {
                setAstrologer(parsedUser);
                console.log("LOCAL ASTROLOGER :", parsedUser);
                const activeClients = parsedUser.clients.filter(
                    (subscription) => new Date(subscription.expiryDate) > new Date()
                );
                setCurrentClients(activeClients);
                if (window.location.pathname === "/user-login" || window.location.pathname === "/astrologer-login" || window.location.pathname === "/verify-otp") {
                    navigate("/"); // only redirect from login/otp page
                }
            }
        }
        setLoading(false);
    }, [navigate]);


    const refreshUser = async () => {
        const res = await axios.get("/api/user/current-user");
        const updatedUser = res.data.user;
        setUser(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        const activeSubs = updatedUser.subscribedAstrologers.filter(
            (subscription) => new Date(subscription.expiryDate) > new Date()
        );
        setCurrentSubscription(activeSubs);
    };


    const fetchHomeAstrologer = async () => {
        try {
            const resData = await axios.get("/api/user/all-astrologer");
            console.log("ALL ASTROLOGER RES :", resData);

            if (resData.data.success) {
                // toast.success("All Astrologers")
                setAllHomeAstrologer(resData.data.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong.");
            return;
        }
    }

    const logout = async () => {
        try {
            const resData = await axios.post("/api/user/logout");
            console.log("LOGOUT RES :", resData);
            if (resData.data.success) {
                sessionStorage.setItem("justLoggedOut", "true");
                setAdmin(null);
                setUser(null);
                setAstrologer(null);
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                toast.success("Logged Out")
                navigate("/");
            }
            else {
                toast.error("Cannot logout!");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong!");
        }
    }

    useEffect(() => {
        fetchHomeAstrologer();
    }, []);

    const values = {
        axios,
        navigate,
        user,
        setUser,
        admin,
        setAdmin,
        astrologer,
        setAstrologer,
        role,
        setRole,
        logout,
        loading,
        fetchHomeAstrologer,
        allHomeAstrologer,
        setAllHomeAstrologer,
        currentSubscription,
        setCurrentSubscription,
        currentClients,
        setCurrentClients,
        refreshUser,
        selectedChatAstrologer,
        setSelectedChatAstrologer,
        selectedChatClient,
        setSelectedChatClient
    }

    return <AppContext.Provider value={values}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}