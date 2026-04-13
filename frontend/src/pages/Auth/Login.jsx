import AuthLayout from "../../components/layouts/AuthLayout";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/UserContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle standard login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Handle Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.GOOGLE_LOGIN, {
        credential: credentialResponse.credential,
      });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Google Authentication Failed");
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col w-full max-w-md mx-auto">
        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome Back</h3>
        <p className="text-sm text-gray-500 mb-8">
          Enter your details below to access your account dashboard.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="john@example.com"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-300 shadow-md shadow-purple-500/30">
            Log In
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="px-4 text-sm text-gray-400 font-medium bg-white">OR</span>
          <div className="border-t border-gray-200 w-full"></div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don’t have an account?{" "}
          <Link className="font-semibold text-purple-600 hover:text-purple-700 transition" to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
