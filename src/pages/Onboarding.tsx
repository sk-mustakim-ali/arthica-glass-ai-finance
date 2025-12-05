import React from "react";
import { useNavigate } from "react-router-dom";
import OnboardingFlow, { OnboardingData } from "@/components/onboarding/OnboardingFlow";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createCompanyAndInit } from "@/modules/business/services/companyService";

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateUser } = useAuth();

  const handleOnboardingComplete = async (data: OnboardingData) => {
    try {
      if (data.accountType === "business") {
        // Create company using business module service
        const { companyId } = await createCompanyAndInit({
          name: data.companyName || "My Company",
          gstNumber: data.gstin,
          address: data.address,
          financialYearStart: data.fyBeginning || "april",
          currency: "INR",
          timezone: "Asia/Kolkata",
        });

        // Update user with company info
        updateUser({
          accountType: "business",
          companyId,
          onboardingCompleted: true,
        });

        toast({ title: "Company created!", description: "Redirecting to business dashboard." });
        navigate(`/business/dashboard/${companyId}`, { replace: true });
        return;
      }

      // Student flow
      if (data.accountType === "student") {
        updateUser({
          accountType: "student",
          onboardingCompleted: true,
        });

        // Store student profile in localStorage (demo)
        localStorage.setItem("arthica-student-profile", JSON.stringify({
          displayName: data.fullName,
          pocketMoney: data.monthlyIncome,
        }));

        toast({ title: "Welcome to Student Mode! 🎓", description: "Start tracking and earning points!" });
        navigate("/student/dashboard", { replace: true });
        return;
      }

      // Personal flow
      updateUser({
        accountType: "personal",
        onboardingCompleted: true,
      });

      // Store personal preferences in localStorage (demo)
      localStorage.setItem("arthica-personal-profile", JSON.stringify({
        fullName: data.fullName,
        occupation: data.occupation,
        monthlyIncome: data.monthlyIncome,
        financialGoal: data.financialGoal,
        desiredSavings: data.desiredSavings,
        expenseCategories: data.expenseCategories,
        categoryAmounts: data.categoryAmounts,
      }));

      toast({ title: "Welcome to Arthica!", description: "Your personal dashboard is ready." });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Onboarding error:", err);
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Failed to complete onboarding", description: message, variant: "destructive" });
    }
  };

  return <OnboardingFlow onComplete={handleOnboardingComplete} />;
};

export default OnboardingPage;
