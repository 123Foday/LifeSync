import { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";

const ResetPassword = () => {
    const { backendUrl } = useContext(AppContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token || !email) {
            toast.error("Invalid or expired reset link.");
            navigate("/login");
        }
    }, [token, email, navigate]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(backendUrl + "/api/user/reset-password", {
                email,
                token,
                newPassword
            });

            if (data.success) {
                toast.success("Password reset successfully!");
                setIsSuccess(true);
                setTimeout(() => navigate("/login"), 3000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white dark:bg-[#121212] p-8 rounded-2xl shadow-xl text-center border dark:border-gray-800">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600 dark:text-green-400 w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Your password has been successfully updated. Redirecting to login...</p>
                    <div className="w-full bg-gray-100 dark:bg-zinc-900 h-1 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full animate-[progress_3s_linear_infinite]" style={{ width: '100%' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4 transition-all duration-300">
            <div className="max-w-md w-full bg-white dark:bg-[#121212] p-8 rounded-2xl shadow-xl border dark:border-gray-800">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-[#5f6FFF] w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">New Password</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Create a secure password for your account</p>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                className="w-full border dark:border-gray-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 pr-12 focus:ring-2 focus:ring-[#5f6FFF] outline-none transition-all font-medium"
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Confirm Password</label>
                        <input
                            className="w-full border dark:border-gray-800 dark:bg-zinc-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-[#5f6FFF] outline-none transition-all font-medium"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#5f6FFF] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#4f5fef] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-100 dark:shadow-none disabled:bg-gray-400"
                    >
                        {isLoading ? "Updating..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
