import { useState } from "react";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  ref,
  set,
} from "firebase/database";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  auth,
  database,
} from "../../firebase/firebaseConfig";

function Signup() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSignup = async (e) => {

    e.preventDefault();

    setError("");

    try {

      setLoading(true);

      // Create Firebase user
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user =
        userCredential.user;

      // Save profile in database
      await set(
        ref(
          database,
          `users/${user.uid}/profile`
        ),
        {
          name,
          email,
          createdAt: Date.now(),
        }
      );

      navigate("/");

    } catch (err) {

      console.error(err);

      setError(err.message);
    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">

      <div className="glass w-full max-w-md rounded-[32px] p-8 shadow-glass">

        <h1 className="text-4xl font-heading font-bold text-slate-800">
          Create Account
        </h1>

        <p className="text-slate-500 mt-2">
          Start your tracking journey
        </p>

        <form
          onSubmit={handleSignup}
          className="mt-8 space-y-5"
        >

          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white outline-none"
            required
          />

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
              ? "Creating..."
              : "Create Account"}
          </button>

        </form>

        <p className="mt-6 text-slate-500 text-sm">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-slate-900 font-medium"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;