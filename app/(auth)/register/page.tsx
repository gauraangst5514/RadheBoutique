"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-ivory flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-gold mb-2">Create Account</h1>
          <p className="text-ivory/60 text-sm">Join Radhe Boutique</p>
        </div>

        <div className="bg-white border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your name"
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="At least 8 characters"
            />
            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Re-enter password"
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ivory/60">
            Already have an account?{" "}
            <Link href="/login" className="text-gold hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gold hover:underline text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
