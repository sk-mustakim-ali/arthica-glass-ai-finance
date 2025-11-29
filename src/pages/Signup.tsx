import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import arthicaLogo from "@/assets/arthica-logo.png";

// 🔥 Firebase imports
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, db, googleProvider } from "@/services/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // -------------------------------------------------------
  // ✨ Email + Password Signup
  // -------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      const uid = user.uid;

      // Refresh token to ensure Firestore has auth context
      await user.getIdToken(true);

      // Create user document in Firestore
      const userDocPayload = {
        email,
        name,
        role: "personal",
        createdAt: serverTimestamp(),
        healthScore: 0,
        budgetRef: null,
      };

      await setDoc(doc(db, "users", uid), userDocPayload);

      toast({
        title: "Account created!",
        description: "Please complete your onboarding to set up your profile.",
      });

      navigate("/onboarding");
    } catch (err: unknown) {
      console.error("🔥 Signup error:", err);
      let message = "Signup failed. Please try again.";

      // ✅ Safe type narrowing for Firebase errors
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "permission-denied":
            message = "Permission denied. Check your Firestore rules.";
            break;
          case "auth/email-already-in-use":
            message = "This email is already registered.";
            break;
          case "auth/invalid-email":
            message = "Please enter a valid email address.";
            break;
          case "auth/weak-password":
            message = "Password is too weak.";
            break;
          default:
            message = err.message;
        }
      }

      toast({
        title: "Signup Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------
  // ✨ Google Signup (No password)
  // -------------------------------------------------------
  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Create or merge Firestore user doc
      await setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          name: user.displayName,
          role: "personal",
          provider: "google",
          photo: user.photoURL,
          createdAt: serverTimestamp(),
          healthScore: 0,
          budgetRef: null,
        },
        { merge: true }
      );

      toast({
        title: "Signed up with Google!",
        description: "Welcome to Arthica.",
      });

      navigate("/onboarding");
    } catch (err: unknown) {
      console.error("🔥 Google signup error:", err);
      let message = "Failed to sign up with Google.";

      if (err instanceof FirebaseError && err.code === "auth/popup-closed-by-user") {
        message = "Sign-up cancelled. Please try again.";
      }

      toast({
        title: "Google Sign-up Error",
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
              Create your account and start your journey
            </p>
          </div>

          {/* 🔐 Email Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="glass-button"
              />
            </div>

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
              <Label htmlFor="password">Password</Label>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="glass-button"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          {/* ✨ Google Signup Button */}
          <div className="mt-4">
            <Button
              onClick={handleGoogleSignup}
              variant="outline"
              className="w-full flex items-center justify-center gap-3 border border-gray-700 hover:bg-gray-800 transition"
              disabled={loading}
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-primary hover:underline font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
