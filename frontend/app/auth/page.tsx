"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Authentication failed");

      const { role } = data.user; // Extract role from response
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      switch (role) {
        case "customer":
          router.push("/customer");
          break;
        case "kitchen":
          router.push("/kitchen");
          break;
        case "waiter":
          router.push("/waiter");
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;
        default:
          throw new Error("Invalid role");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Coffee className="w-12 h-12 text-primary mb-2" />
          <CardTitle className="text-2xl font-bold">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <motion.form
            key={isLogin ? "login" : "signup"}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="John Doe" onChange={handleChange} required />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" onChange={handleChange} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </motion.form>

          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}