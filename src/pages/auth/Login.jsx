import { useState } from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import { auth } from "../../firebase/firebaseConfig";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    try {

      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/");

    } catch (err) {

      console.error(err);

      setError("Invalid credentials");
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">

      <div className="glass w-full max-w-md rounded-[32px] p-8 shadow-glass">

        <h1 className="text-4xl font-heading font-bold text-slate-800">
          Welcome Back
        </h1>

        <p className="text-slate-500 mt-2">
          Login to continue tracking
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white outline-none"
            required
          />

          {error && (

            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-[1.02]"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="mt-6 text-slate-500 text-sm">

          Don’t have an account?{" "}

          <Link
            to="/signup"
            className="text-slate-900 font-medium"
          >
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;