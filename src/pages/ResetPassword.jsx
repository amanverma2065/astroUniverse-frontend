import React, { useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useAppContext } from '../context/AppContext';

function ResetPassword() {

  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const { newPassword, confirmPassword } = formData;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { axios, navigate, role } = useAppContext();

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const resetEmail = JSON.parse(localStorage.getItem("Reset-Email"));
    if (!resetEmail) {
      toast.error("Email missing");
      return navigate(`/${role}-login`);
    }

    const toastId = toast.loading("Resetting password...");
    setLoading(true);

    try {
      const res = await axios.put("/api/reset-password/update-password", {
        email: resetEmail,
        role,
        ...formData
      });

      if (res.data.success) {
        toast.success("Password Changed Successfully", { id: toastId });
        localStorage.removeItem("Reset-Email");
        navigate(`/${role}-login`);
      } else {
        toast.error(res.data.message || "Password Reset failed!", { id: toastId });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Password Reset failed!";
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-purple-500/20 transform hover:scale-[1.01] transition-transform duration-300 w-full max-w-md p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
          Reset Password
        </h2>

        <form onSubmit={handleOnSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="newPassword" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">
              New Password
            </label>
            <div className="flex">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 text-white placeholder-gray-400"
                value={newPassword}
                onChange={handleOnChange}
                placeholder="Enter new Password"
                required
                disabled={loading}
              />
              <button
                className="px-4 border border-l-0 border-gray-600 rounded-r-xl hover:bg-gray-700 transition-colors duration-200"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="text-xl text-gray-400" />
                ) : (
                  <AiOutlineEye className="text-xl text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-gray-300">
              Confirm Password
            </label>
            <div className="flex">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gray-700 border border-gray-600 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 disabled:opacity-60 text-white placeholder-gray-400"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Enter Confirm Password"
                required
                disabled={loading}
              />
              <button
                className="px-4 border border-l-0 border-gray-600 rounded-r-xl hover:bg-gray-700 transition-colors duration-200"
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible className="text-xl text-gray-400" />
                ) : (
                  <AiOutlineEye className="text-xl text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 sm:py-3 text-sm sm:text-base rounded-xl font-medium shadow-lg transition-all duration-200
              ${loading ? "opacity-50 cursor-not-allowed bg-gray-600" : "bg-purple-600 hover:bg-purple-700 hover:scale-[1.02] hover:shadow-xl text-white"}`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword;
