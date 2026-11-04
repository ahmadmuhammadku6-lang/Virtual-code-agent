import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8000/api/auth";

function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${API_URL}/signup`, form, {
        withCredentials: true,
      });
      setMessage(`Account created for ${response.data.name}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl"
      >
        <h1 className="text-center text-3xl font-bold text-white">Sign Up</h1>
        <p className="mt-2 text-center text-slate-400">Create your account</p>

        <label className="mt-8 block text-sm text-slate-300">
          Name
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
          />
        </label>

        <label className="mt-5 block text-sm text-slate-300">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
          />
        </label>

        <label className="mt-5 block text-sm text-slate-300">
          Password
          <input
            type="password"
            minLength={6}
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
          />
        </label>

        {message && (
          <p className="mt-5 rounded-lg bg-slate-800 px-4 py-3 text-center text-sm text-slate-200">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/sign-in" className="font-semibold text-violet-400 hover:text-violet-300">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}

export default SignUp;
