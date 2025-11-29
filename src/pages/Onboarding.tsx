// src/pages/Onboarding.tsx
import { useNavigate } from "react-router-dom";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { useToast } from "@/hooks/use-toast";
import { saveOnboardingData } from "@/services/queryWrappers";

import { OnboardingData } from "@/services/queryWrappers";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async (data: OnboardingData) => {
    try {
      await saveOnboardingData(data); // ✅ wrapper handles everything

      toast({
        title: "Welcome to Arthica!",
        description: "Your onboarding data has been successfully saved.",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("🔥 Error saving onboarding data:", error);
      toast({
        title: "Error",
        description: "Something went wrong while saving your onboarding data.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <OnboardingFlow onComplete={handleComplete} />
    </div>
  );
};

export default Onboarding;
