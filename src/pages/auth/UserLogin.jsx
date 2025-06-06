import { useState } from 'react'
import { NavLink } from 'react-router-dom';
import toast from "react-hot-toast";
import { useAppContext } from '../../context/AppContext';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import homeImage from "../../assets/astrology-zodiac-signs-circle.png"

function UserLogin() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { email, password } = formData;
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { axios, navigate, setUser, setAdmin, setRole, setCurrentSubscription } = useAppContext();

    const handleOnChange = (e) => {
        setFormData((prevData) => {
            return {
                ...prevData,
                [e.target.name]: e.target.value,
            }
        })
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (loading) return; // Prevent double click

        setLoading(true);
        const loadingToastId = toast.loading("Logging in...");


        try {
            const resData = await axios.post("/api/user/user-login", { email, password });
            toast.dismiss(loadingToastId);

            if (resData.data.success) {
                const token = resData.data.token;
                localStorage.setItem("token", JSON.stringify(token));
                localStorage.setItem("userData", JSON.stringify(resData.data.userData));
                console.log("LOCAL USER DATA :", resData.data.userData);

                if (resData.data.userData.accountType === "user") {
                    setUser(resData.data.userData);
                    toast.success("Login Successful");
                    navigate("/");
                }
                if (resData.data.userData.accountType === "admin") {
                    setAdmin(resData.data.userData);
                    toast.success("Admin Login Successful");
                    navigate("/admin");
                }

            } else {
                toast.error(resData.data.message);
                console.log("Else error: ", resData.data.message);
            }
        } catch (error) {
            toast.dismiss(loadingToastId);
            const backendMessage = error.response?.data?.message || "Login failed.....";
            toast.error(backendMessage);
            console.log("Catch error message: ", backendMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 sm:p-6 md:p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-16 w-full max-w-7xl">
                {/* Image Section */}
                <div className="w-full lg:w-1/2 lg:block hidden">
                    <img
                        src={homeImage}
                        alt="homeImage"
                        className="w-full h-auto object-contain"
                    />
                </div>

                <div className="w-full lg:w-1/2 px-2 sm:px-4">
                    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/20 transform hover:scale-[1.01] transition-transform duration-300 my-4 sm:my-6">
                        <div className="p-4 sm:p-6 md:p-8">
                            <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white">
                                Welcome Back!
                            </h2>
                            <form onSubmit={handleOnSubmit} className="space-y-4 sm:space-y-6">
                                <div>
                                    <label htmlFor="email" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 bg-gray-700 text-white placeholder-gray-400"
                                        value={email}
                                        onChange={handleOnChange}
                                        disabled={loading}
                                        placeholder="Enter your email address"
                                        pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">Password</label>
                                    <div className="flex">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-600 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 bg-gray-700 text-white placeholder-gray-400"
                                            value={password}
                                            onChange={handleOnChange}
                                            disabled={loading}
                                            placeholder="Enter Password"
                                            required
                                        />
                                        <button
                                            className="px-3 sm:px-4 border border-l-0 border-gray-600 rounded-r-xl hover:bg-gray-600 transition-colors duration-200 bg-gray-700"
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            disabled={loading}
                                        >
                                            {showPassword ? (
                                                <AiOutlineEyeInvisible className="text-lg sm:text-xl text-gray-300" />
                                            ) : (
                                                <AiOutlineEye className="text-lg sm:text-xl text-gray-300" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full bg-purple-600 text-white py-2 sm:py-3 text-sm sm:text-base rounded-xl font-medium shadow-lg transition-all duration-200
                                      ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl"}`}
                                    >
                                        {loading ? "Signing In..." : "Sign In"}
                                    </button>
                                </div>

                                <div className="text-center gap-x-2 flex flex-col sm:flex-row justify-center items-center text-sm sm:text-base">
                                    <p className="text-gray-400">Don't have an account?</p>
                                    <NavLink to="/user-signup" className="inline-block text-purple-400 font-medium hover:text-purple-300 transition-colors duration-200">
                                        Create Account
                                    </NavLink>
                                </div>

                                <div className="text-center">
                                    <NavLink to='/reset-email' className="inline-block text-sm sm:text-base text-purple-400 font-medium hover:text-purple-300 transition-colors duration-200">
                                        Forgot Password?
                                    </NavLink>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-center">
                        <NavLink
                            to="/astrologer-login"
                            onClick={() => setRole("astrologer")}
                            className="w-1/2 block text-center bg-purple-600 text-white py-2 sm:py-3 text-sm sm:text-base rounded-xl font-medium shadow-lg transition-all duration-200 hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl"
                        >
                            Continue as Astrologer
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserLogin