import { Navigate } from "react-router-dom";

import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

export const UserRoute = ({ children }) => {
    const { user, loading } = useAppContext();

    if (loading) return null;
    const justLoggedOut = sessionStorage.getItem("justLoggedOut");

    if (!user) {
        if (!justLoggedOut) {
            toast.error("Login Required!");
        } else {
            sessionStorage.removeItem("justLoggedOut");  // Clear flag
        }
        return <Navigate to="/" />;
    }

    return children;
};

export const AdminRoute = ({ children }) => {
    const { admin, loading } = useAppContext();

    if (loading) return null;

    if (!admin) {
        return <Navigate to="/" />;
    }

    return children;
};

export const AstrologerRoute = ({ children }) => {
    const { astrologer, loading } = useAppContext();

    if (loading) return null;
    const justLoggedOut = sessionStorage.getItem("justLoggedOut");

    if (!astrologer) {
        if (!justLoggedOut) {
            toast.error("Login Required!");
        } else {
            sessionStorage.removeItem("justLoggedOut");  // Clear flag
        }
        return <Navigate to="/" />;
    }

    return children;
};
