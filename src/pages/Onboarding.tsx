import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = () => {
    toast({ title: "Welcome to Arthica!", description: "Your profile is ready." });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="glass-card p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold gradient-text mb-4">Welcome!</h1>
        <p className="text-white/70 mb-6">Your demo account is ready with sample data.</p>
        <button onClick={handleComplete} className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
