"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import { Lock, LogIn } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user?.isAdmin) {
      router.push("/admin");
    }
  }, [session, router]);

  if (session?.user?.isAdmin) return null;

  const displayedError = session
    ? "This account is not authorized for the admin dashboard."
    : error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      username: form.username,
      password: form.password,
    });

    setIsSubmitting(false);
    
    if (result?.error) {
      setError("Invalid username or password.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(77,216,255,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(243,181,69,0.16),transparent_30%),linear-gradient(160deg,#050914_0%,#0a1628_60%,#06101f_100%)]" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px]" />

      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <Image
          src="/bluedot-logo.png"
          alt="Bluedot Logo"
          width={80}
          height={80}
          className="opacity-90"
          priority
        />
        <h1 className="text-2xl font-bold heading-accent mt-2">Bluedot Admin</h1>
      </div>

      {/* Login Card */}
      <Card className="relative w-full max-w-md shadow-xl border-white/10 bg-white/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <p className="text-2xl text-base-content">Sign In</p>
          <div className="text-base-content/70">
            Access your admin dashboard securely
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="bg-white/5 border-white/15 text-base-content mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="bg-white/5 border-white/15 text-base-content mt-1"
              />
            </div>

            {displayedError && (
              <Alert variant="error">
                <span>{displayedError}</span>
              </Alert>
            )}

            <Button>
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Subtle Footer */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-xs text-base-content/70">
        &copy; {new Date().getFullYear()} Bluedot Systems. All rights reserved.
      </div>
    </div>
  );
}
