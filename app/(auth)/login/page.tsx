"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Login successful!");
        router.push("/account");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ivory flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-gold mb-2">
            Radhe Boutique
          </h1>
          <p className="text-ivory/60">Sign in to your account</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 bg-bg border border-border rounded-sm focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 bg-bg border border-border rounded-sm focus:outline-none focus:border-gold transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold hover:bg-gold/90 text-bg py-3 rounded-sm font-semibold transition-all disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-ivory/60">
              Don't have an account?{" "}
              <Link href="/register" className="text-gold hover:underline">
                Register
              </Link>
            </p>
            <Link
              href="/forgot-password"
              className="text-gold hover:underline block mt-2"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gold hover:underline text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
