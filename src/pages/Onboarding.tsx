import { useNavigate } from "react-router-dom";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = (data: any) => {
    console.log("Onboarding data:", data);
    
    toast({
      title: "Profile Complete!",
      description: "Welcome to Arthica. Let's start managing your finances!",
    });
    
    // TODO: Save onboarding data to Firestore/database
    navigate("/dashboard");
  };

  return <OnboardingFlow onComplete={handleComplete} />;
};

export default Onboarding;
