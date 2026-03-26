import React, { useState } from "react";
import { useLoginMutation, useSeedCandidatesMutation } from "../../services/candidateApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { LogIn, ShieldCheck, Database, CheckCircle2 } from "lucide-react";

export const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [seedCandidates, { isLoading: isSeeding }] = useSeedCandidatesMutation();
  const [seedSuccess, setSeedSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email: "admin@recruitflow.com" }).unwrap();
      dispatch(setCredentials(result.data));
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed. Please seed the data first if this is a new setup.");
    }
  };

  const handleSeed = async () => {
    try {
      await seedCandidates().unwrap();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch (err) {
      console.error("Seeding failed:", err);
      alert("Failed to seed data. Check console for details.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to access your recruitment dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value="admin@recruitflow.com"
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              placeholder="admin@recruitflow.com"
            />
            <Input
              label="Password"
              type="password"
              value="••••••••"
              readOnly
              className="bg-gray-50 cursor-not-allowed"
              placeholder="••••••••"
            />
          </div>

          <div className="rounded-lg bg-blue-50 p-4 text-xs text-blue-800">
            <p className="font-semibold">Demo Credentials:</p>
            <p>Email: admin@recruitflow.com</p>
            <p>Password: (Any value, mocked for demo)</p>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full py-6 text-lg"
              isLoading={isLoading}
            >
              <LogIn className="mr-2 h-5 w-5" /> Sign In
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full py-6"
              onClick={handleSeed}
              isLoading={isSeeding}
              disabled={seedSuccess}
            >
              {seedSuccess ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                  Data Seeded Successfully
                </>
              ) : (
                <>
                  <Database className="mr-2 h-5 w-5" />
                  Seed Demo Data
                </>
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400">
          &copy; 2026 RecruitFlow Mini. All rights reserved.
        </p>
      </div>
    </div>
  );
};
