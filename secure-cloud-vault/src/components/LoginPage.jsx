import React, { useState } from "react";
import { Lock, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";

const LoginPage = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError("");
      setLoading(true);
      
      // The login function from your context should return the user credential
      const userCredential = await login(email, password);
      console.log("Login successful!");

      // --- NEW ---
      // After a successful login, we get the user object from the credential
      // and ask it for the ID Token.
      if (userCredential && userCredential.user) {
        const token = await userCredential.user.getIdToken();
        console.log("Firebase ID Token:", token);
        console.log("SUCCESS! Copy this entire token and send it to your teammate.");
      }
      // --- END NEW ---

      onNavigate('dashboard');
    } catch (error) {
      console.error("Login failed:", error.message);
      setError("Failed to sign in: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100">
      <div className="w-full max-w-md p-8 border border-gray-100 shadow-xl bg-white/90 backdrop-blur-md rounded-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-600 rounded-full shadow-lg">
              <Shield className="text-white" size={36} />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your <span className="font-semibold">Secure Cloud-Vault</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 mb-4 text-red-700 border border-red-200 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-sm transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm transition border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock className="mr-2" size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Signup link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("signup")}
              className="font-semibold text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline"
              disabled={loading}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;