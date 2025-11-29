import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import arthicaLogo from "@/assets/arthica-logo.png";
import { loginUser } from "@/services/authService";

// 🔥 Firebase imports for Google Login
import { signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, googleProvider, db } from "@/services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // -------------------------------------------------------
  // ✨ Normal email + password login
  // -------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginUser(email, password);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      navigate("/dashboard");
    } catch (err: unknown) {
      console.error("🔥 Login error:", err);
      let errorMessage = "Login failed. Please check your credentials.";

      if (err instanceof FirebaseError) {
        if (err.code === "auth/user-not-found")
          errorMessage = "No account found with that email.";
        else if (err.code === "auth/wrong-password")
          errorMessage = "Incorrect password.";
        else if (err.code === "auth/invalid-email")
          errorMessage = "Please enter a valid email.";
      }

      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // ✨ Google Login (no password)
  // -------------------------------------------------------
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Optional: Create or update Firestore user document
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          provider: "google",
          lastLogin: serverTimestamp(),
        },
        { merge: true }
      );

      toast({
        title: "Welcome back!",
        description: "Signed in with Google successfully.",
      });

      navigate("/dashboard");
    } catch (err: unknown) {
      console.error("🔥 Google login error:", err);
      let message = "Failed to sign in with Google.";

      if (err instanceof FirebaseError && err.code === "auth/popup-closed-by-user") {
        message = "Sign-in cancelled. Please try again.";
      }

      toast({
        title: "Google Login Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-4">
              <img src={arthicaLogo} alt="Arthica" className="h-12" />
              <h1 className="text-3xl font-bold gradient-text">Arthica</h1>
            </Link>
            <p className="text-muted-foreground">
              Welcome back! Please login to your account
            </p>
          </div>

          {/* Email + Password Login */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-button"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-button"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          {/* ✨ Google Login Button */}
          <div className="mt-4">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full flex items-center justify-center gap-3 border border-gray-700 hover:bg-gray-800 transition"
              disabled={loading}
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Sign in with Google
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link
              to="/signup"
              className="text-primary hover:underline font-semibold"
            >
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
