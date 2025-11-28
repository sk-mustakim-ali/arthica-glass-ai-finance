import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import arthicaLogo from "@/assets/arthica-logo.png";

interface OnboardingData {
  // New: account type
  accountType?: "personal" | "business";

  // Personal fields
  fullName: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  otherOccupation: string;
  monthlyIncome: string;

  // Business fields
  gstin?: string;
  companyName?: string;
  address?: string;
  pincode?: string;
  country?: string;
  state?: string;
  city?: string;
  fyBeginning?: string;

  // Step 2 - Goals & Priorities
  financialGoal: string;
  desiredSavings: string;
  timeFrame: string;
  personalizedInsights: string;

  // Step 3 - Financial Behavior
  moneyManagement: string;
  hasBudget: string;
  currentMonthBudget: string;
  monthlySpendingLimit: string;
  expenseCategories: string[];
  categoryAmounts: Record<string, string>;
  hasLoans: string;
  emiAmount: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState<number | 2.5>(1);
  const { toast } = useToast();
  const [userProfileData, setUserProfileData] = useState<OnboardingData>({
    accountType: undefined,
    fullName: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    otherOccupation: "",
    monthlyIncome: "",
    gstin: "",
    companyName: "",
    address: "",
    pincode: "",
    country: "India",
    state: "",
    city: "",
    fyBeginning: "",
    financialGoal: "",
    desiredSavings: "",
    timeFrame: "",
    personalizedInsights: "",
    moneyManagement: "",
    hasBudget: "",
    currentMonthBudget: "",
    monthlySpendingLimit: "",
    expenseCategories: [],
    categoryAmounts: {},
    hasLoans: "",
    emiAmount: "",
  });

  const updateData = (field: keyof OnboardingData, value: string | string[]) => {
    setUserProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    const updatedCategories = userProfileData.expenseCategories.includes(category)
      ? userProfileData.expenseCategories.filter((c) => c !== category)
      : [...userProfileData.expenseCategories, category];
    
    // Remove amount if category is deselected
    const updatedAmounts = { ...userProfileData.categoryAmounts };
    if (!updatedCategories.includes(category)) {
      delete updatedAmounts[category];
    }
    
    setUserProfileData((prev) => ({
      ...prev,
      expenseCategories: updatedCategories,
      categoryAmounts: updatedAmounts,
    }));
  };

  const updateCategoryAmount = (category: string, amount: string) => {
    setUserProfileData((prev) => ({
      ...prev,
      categoryAmounts: {
        ...prev.categoryAmounts,
        [category]: amount,
      },
    }));
  };

  const validateStep = () => {
    // If no account type chosen, block
    if (currentStep === 1 && !userProfileData.accountType) {
      toast({ title: "Please select account type (Personal or Business)", variant: "destructive" });
      return false;
    }

    // If personal selected: keep original personal validations
    if (currentStep === 1 && userProfileData.accountType === "personal") {
      if (!userProfileData.fullName.trim()) {
        toast({ title: "Please enter your full name", variant: "destructive" });
        return false;
      }
      if (!userProfileData.dateOfBirth) {
        toast({ title: "Please select your date of birth", variant: "destructive" });
        return false;
      }
      if (!userProfileData.gender) {
        toast({ title: "Please select your gender", variant: "destructive" });
        return false;
      }
      if (!userProfileData.occupation) {
        toast({ title: "Please select your occupation", variant: "destructive" });
        return false;
      }
      if (userProfileData.occupation === "other" && !userProfileData.otherOccupation.trim()) {
        toast({ title: "Please specify your occupation", variant: "destructive" });
        return false;
      }
      if (!userProfileData.monthlyIncome) {
        toast({ title: "Please select your monthly income range", variant: "destructive" });
        return false;
      }
      return true;
    }

    // If business selected: validate business fields
    if (currentStep === 1 && userProfileData.accountType === "business") {
      if (!userProfileData.companyName || !userProfileData.companyName.trim()) {
        toast({ title: "Please enter company name", variant: "destructive" });
        return false;
      }
      if (!userProfileData.address || !userProfileData.address.trim()) {
        toast({ title: "Please enter company address", variant: "destructive" });
        return false;
      }
      if (!userProfileData.pincode || !userProfileData.pincode.trim()) {
        toast({ title: "Please enter company pincode", variant: "destructive" });
        return false;
      }
      if (!userProfileData.fyBeginning || !userProfileData.fyBeginning.trim()) {
        toast({ title: "Please select FY beginning date", variant: "destructive" });
        return false;
      }
      return true;
    }

    // Steps 2 and 3 validations remain unchanged (personal flow)
    if (currentStep === 2) {
      if (!userProfileData.financialGoal) {
        toast({ title: "Please select your main financial goal", variant: "destructive" });
        return false;
      }
      if (!userProfileData.desiredSavings.trim()) {
        toast({ title: "Please enter your desired monthly savings", variant: "destructive" });
        return false;
      }
      if (!userProfileData.timeFrame) {
        toast({ title: "Please select your planning time frame", variant: "destructive" });
        return false;
      }
      if (!userProfileData.personalizedInsights) {
        toast({ title: "Please select if you want personalized insights", variant: "destructive" });
        return false;
      }
    }

    if (currentStep === 3) {
      if (!userProfileData.moneyManagement) {
        toast({ title: "Please select how you manage your money", variant: "destructive" });
        return false;
      }
      if (!userProfileData.hasBudget) {
        toast({ title: "Please select if you have a budget", variant: "destructive" });
        return false;
      }
      if (userProfileData.hasBudget === "yes" && !userProfileData.currentMonthBudget.trim()) {
        toast({ title: "Please enter your current month's budget", variant: "destructive" });
        return false;
      }
      if (!userProfileData.hasLoans) {
        toast({ title: "Please select if you have active loans or EMIs", variant: "destructive" });
        return false;
      }
      if (userProfileData.hasLoans === "yes" && !userProfileData.emiAmount.trim()) {
        toast({ title: "Please enter your total EMI amount", variant: "destructive" });
        return false;
      }
      if (userProfileData.expenseCategories.length === 0) {
        toast({ title: "Please select at least one expense category", variant: "destructive" });
        return false;
      }
      
      // Validate all selected categories have amounts
      for (const category of userProfileData.expenseCategories) {
        if (!userProfileData.categoryAmounts[category] || !userProfileData.categoryAmounts[category].trim()) {
          toast({ title: `Please enter spending amount for ${category}`, variant: "destructive" });
          return false;
        }
      }
      
      // Validate total expenses don't exceed budget
      const totalExpenses = Object.values(userProfileData.categoryAmounts)
        .reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
      const monthlyBudget = parseFloat(userProfileData.currentMonthBudget) || 0;
      
      if (monthlyBudget > 0 && totalExpenses > monthlyBudget) {
        toast({
            title: "Expenses exceed your budget",
            description: `You’re overspending by ₹${(totalExpenses - monthlyBudget).toFixed(2)}.`,
            variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    // If on step 1 and business selected, validate & complete onboarding immediately
    if (currentStep === 1 && userProfileData.accountType === "business") {
      if (validateStep()) {
        try {
          // call onComplete with business data
          onComplete(userProfileData);
          // show success state (keeps steps 2/3 unreachable unless changed later)
          setCurrentStep(999);
        } catch (err) {
          console.error("onComplete threw:", err);
        }
      }
      return;
    }

    // If on step 1 and personal selected: keep original behavior - move to next steps
    if (currentStep === 1 && userProfileData.accountType === "personal") {
      if (validateStep()) {
        setCurrentStep(2);
      }
      return;
    }

    // Existing multi-step navigation for later steps (unchanged)
    if (validateStep()) {
      if (currentStep === 2 && (userProfileData.timeFrame === "weekly" || userProfileData.timeFrame === "quarterly")) {
        setCurrentStep(2.5);
      } else if (currentStep === 2.5) {
        setCurrentStep(3);
      } else if (currentStep < 3) {
        setCurrentStep((currentStep as number) + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2.5) setCurrentStep(2);
    else if (currentStep > 1) setCurrentStep((currentStep as number) - 1);
  };

  const handleFinish = () => {
    if (validateStep()) {
      onComplete(userProfileData);
    }
  };

  const expenseOptions = [
    "Food",
    "Rent",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills",
    "Health",
  ];

  return (
    <div className="h-screen w-screen bg-gradient-hero flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-2xl p-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6 md:p-8 max-h-[90vh] overflow-y-auto scrollbar-none">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={arthicaLogo} alt="Arthica" className="h-12" />
          </div>
          
          {/* Progress Indicator: only show when Personal selected */}
          {userProfileData.accountType === "personal" && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep} of 3
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {Math.round(((currentStep === 2.5 ? 3 : currentStep) / 3) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentStep === 2.5 ? 3 : currentStep) / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    {userProfileData.accountType === "business" ? "Company Creation" : "Personal Profile"}
                  </h2>
                  <p className="text-muted-foreground">
                    {userProfileData.accountType === "business"
                      ? "Provide company details to create a business account"
                      : "Tell us a bit about yourself"}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Account type selector */}
                  <div>
                    <Label>Account type *</Label>
                    <RadioGroup
                      value={userProfileData.accountType}
                      onValueChange={(value) => updateData("accountType", value)}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="personal" id="acct-personal" />
                        <Label htmlFor="acct-personal" className="font-normal cursor-pointer">
                          Personal
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business" id="acct-business" />
                        <Label htmlFor="acct-business" className="font-normal cursor-pointer">
                          Business
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Personal fields (shown when personal selected) */}
                  {userProfileData.accountType === "personal" && (
                    <>
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={userProfileData.fullName}
                          onChange={(e) => updateData("fullName", e.target.value)}
                          placeholder="Enter your full name"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={userProfileData.dateOfBirth}
                          onChange={(e) => updateData("dateOfBirth", e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Gender</Label>
                        <RadioGroup
                          value={userProfileData.gender}
                          onValueChange={(value) => updateData("gender", value)}
                          className="mt-2 space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male" className="font-normal cursor-pointer">
                              Male
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female" className="font-normal cursor-pointer">
                              Female
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="non-binary" id="non-binary" />
                            <Label htmlFor="non-binary" className="font-normal cursor-pointer">
                              Non-binary
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                            <Label htmlFor="prefer-not-to-say" className="font-normal cursor-pointer">
                              Prefer not to say
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div>
                        <Label htmlFor="occupation">Occupation *</Label>
                        <Select
                          value={userProfileData.occupation}
                          onValueChange={(value) => updateData("occupation", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select your occupation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="salaried">Salaried</SelectItem>
                            <SelectItem value="freelancer">Freelancer</SelectItem>
                            <SelectItem value="business-owner">Business Owner</SelectItem>
                            <SelectItem value="retired">Retired</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {userProfileData.occupation === "other" && (
                          <Input
                            id="otherOccupation"
                            value={userProfileData.otherOccupation}
                            onChange={(e) => updateData("otherOccupation", e.target.value)}
                            placeholder="Please specify your occupation"
                            className="mt-2"
                            required
                          />
                        )}
                      </div>

                      <div>
                        <Label htmlFor="monthlyIncome">Monthly Income</Label>
                        <Select
                          value={userProfileData.monthlyIncome}
                          onValueChange={(value) => updateData("monthlyIncome", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select your income range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="below-25000">Below ₹25,000</SelectItem>
                            <SelectItem value="25000-50000">₹25,000–₹50,000</SelectItem>
                            <SelectItem value="50000-100000">₹50,000–₹1,00,000</SelectItem>
                            <SelectItem value="above-100000">Above ₹1,00,000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Business fields (shown when business selected) */}
                  {userProfileData.accountType === "business" && (
                    <>
                      <div>
                        <Label htmlFor="gstin">GSTIN</Label>
                        <Input
                          id="gstin"
                          value={userProfileData.gstin}
                          onChange={(e) => updateData("gstin", e.target.value)}
                          placeholder="GSTIN (optional)"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
                        <Input
                          id="companyName"
                          value={userProfileData.companyName}
                          onChange={(e) => updateData("companyName", e.target.value)}
                          placeholder="Company Name"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address *</Label>
                        <Input
                          id="address"
                          value={userProfileData.address}
                          onChange={(e) => updateData("address", e.target.value)}
                          placeholder="Address"
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pincode">Pincode *</Label>
                          <Input
                            id="pincode"
                            value={userProfileData.pincode}
                            onChange={(e) => updateData("pincode", e.target.value)}
                            placeholder="Pincode"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={userProfileData.country}
                            onChange={(e) => updateData("country", e.target.value)}
                            placeholder="Country"
                            className="mt-1"
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={userProfileData.state}
                            onChange={(e) => updateData("state", e.target.value)}
                            placeholder="State"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={userProfileData.city}
                            onChange={(e) => updateData("city", e.target.value)}
                            placeholder="City"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="fyBeginning">FY Beginning From *</Label>
                        <Input
                          id="fyBeginning"
                          type="date"
                          value={userProfileData.fyBeginning}
                          onChange={(e) => updateData("fyBeginning", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">Goals & Priorities</h2>
                  <p className="text-muted-foreground">Let's set your financial targets</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="financialGoal">Main financial goal *</Label>
                    <Select
                      value={userProfileData.financialGoal}
                      onValueChange={(value) => updateData("financialGoal", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="save-more">Save more</SelectItem>
                        <SelectItem value="pay-off-debts">Pay off debts</SelectItem>
                        <SelectItem value="track-expenses">Track expenses</SelectItem>
                        <SelectItem value="build-investments">Build investments</SelectItem>
                        <SelectItem value="plan-business">Plan business finances</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="desiredSavings">Desired monthly savings (₹) *</Label>
                    <Input
                      id="desiredSavings"
                      type="number"
                      value={userProfileData.desiredSavings}
                      onChange={(e) => updateData("desiredSavings", e.target.value)}
                      placeholder="Enter amount"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeFrame">Time frame for planning *</Label>
                    <Select
                      value={userProfileData.timeFrame}
                      onValueChange={(value) => updateData("timeFrame", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select time frame" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Would you like personalized insights? *</Label>
                    <RadioGroup
                      value={userProfileData.personalizedInsights}
                      onValueChange={(value) => updateData("personalizedInsights", value)}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="insights-yes" />
                        <Label htmlFor="insights-yes" className="font-normal cursor-pointer">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="insights-no" />
                        <Label htmlFor="insights-no" className="font-normal cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2.5 && (
              <motion.div
                key="step2-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">Budget Preferences</h2>
                  <p className="text-muted-foreground">
                    Tell us more about your {userProfileData.timeFrame} planning.
                  </p>
                </div>

                {userProfileData.timeFrame === "weekly" && (
                  <div className="space-y-4">
                    <Label htmlFor="weeklyBudget">Average weekly budget (₹)</Label>
                    <Input
                      id="weeklyBudget"
                      type="number"
                      placeholder="Enter your weekly budget"
                      value={userProfileData.monthlySpendingLimit}
                      onChange={(e) => updateData("monthlySpendingLimit", e.target.value)}
                      className="mt-1"
                    />
                    <Label>Which days do you usually track expenses?</Label>
                    <p className="text-sm text-muted-foreground">Optional question for personalization</p>
                  </div>
                )}

                {userProfileData.timeFrame === "quarterly" && (
                  <div className="space-y-4">
                    <Label htmlFor="quarterSavings">Quarterly savings goal (₹)</Label>
                    <Input
                      id="quarterSavings"
                      type="number"
                      placeholder="Enter your quarterly savings target"
                      value={userProfileData.desiredSavings}
                      onChange={(e) => updateData("desiredSavings", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 max-h-[60vh] overflow-y-auto pr-2"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2">Financial Behavior</h2>
                  <p className="text-muted-foreground">Help us understand your spending habits</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="moneyManagement">How do you manage your money? *</Label>
                    <Select
                      value={userProfileData.moneyManagement}
                      onValueChange={(value) => updateData("moneyManagement", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manually">Manually</SelectItem>
                        <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                        <SelectItem value="finance-app">Finance App</SelectItem>
                        <SelectItem value="dont-track">Don't track</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Do you currently have a budget? *</Label>
                    <RadioGroup
                      value={userProfileData.hasBudget}
                      onValueChange={(value) => updateData("hasBudget", value)}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="budget-yes" />
                        <Label htmlFor="budget-yes" className="font-normal cursor-pointer">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="budget-no" />
                        <Label htmlFor="budget-no" className="font-normal cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {userProfileData.hasBudget === "yes" && (
                      <Input
                        id="currentMonthBudget"
                        type="number"
                        value={userProfileData.currentMonthBudget}
                        onChange={(e) => updateData("currentMonthBudget", e.target.value)}
                        placeholder="What is your budget for this current month? (₹)"
                        className="mt-2"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <Label>Biggest Expense Categories *</Label>
                    <p className="text-sm text-muted-foreground mb-2">Select all that apply and enter spending amounts</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {expenseOptions.map((category) => (
                        <Badge
                          key={category}
                          variant={
                            userProfileData.expenseCategories.includes(category)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                    
                    {userProfileData.expenseCategories.length > 0 && (
                      <div className="space-y-3 mt-4 p-4 bg-secondary/20 rounded-lg">
                        <p className="text-sm font-medium mb-2">Enter spending amount for each category:</p>
                        {userProfileData.expenseCategories.map((category) => (
                          <div key={category} className="flex items-center gap-2">
                            <Label className="min-w-[120px]">{category}:</Label>
                            <Input
                              type="number"
                              value={userProfileData.categoryAmounts[category] || ""}
                              onChange={(e) => updateCategoryAmount(category, e.target.value)}
                              placeholder="Amount in ₹"
                              className="flex-1"
                            />
                          </div>
                        ))}
                        {Object.keys(userProfileData.categoryAmounts).length > 0 && (
                          <div className="pt-2 border-t mt-3">
                            <div className="flex justify-between items-center font-semibold">
                              <span>Total Expenses:</span>
                              <span className="text-primary">
                                ₹{Object.values(userProfileData.categoryAmounts)
                                  .reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0)
                                  .toFixed(2)}
                              </span>
                            </div>
                            {userProfileData.currentMonthBudget && (
                              <div className="flex justify-between items-center text-sm text-muted-foreground mt-1">
                                <span>Budget:</span>
                                <span>₹{parseFloat(userProfileData.currentMonthBudget).toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Active Loans or EMIs? *</Label>
                    <RadioGroup
                      value={userProfileData.hasLoans}
                      onValueChange={(value) => updateData("hasLoans", value)}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="loans-yes" />
                        <Label htmlFor="loans-yes" className="font-normal cursor-pointer">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="loans-no" />
                        <Label htmlFor="loans-no" className="font-normal cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                    {userProfileData.hasLoans === "yes" && (
                      <Input
                        id="emiAmount"
                        type="number"
                        value={userProfileData.emiAmount}
                        onChange={(e) => updateData("emiAmount", e.target.value)}
                        placeholder="How much EMI do you have per month? (₹)"
                        className="mt-2"
                        required
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-full"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {/*
              - If business selected: treat Next as immediate create & completion (business only)
              - If personal selected: preserve original Next behaviour (move to next step)
            */}
            {userProfileData.accountType === "business" ? (
              <Button onClick={handleNext} className="rounded-full">
                Create
              </Button>
            ) : currentStep < 3 ? (
              <Button onClick={handleNext} className="rounded-full">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleFinish} className="rounded-full">
                Finish
                <Check className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
