import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Check, Building2, User, Briefcase, Loader2, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import arthicaLogo from "@/assets/arthica-logo.png";

export interface OnboardingData {
  accountType?: "personal" | "business" | "student";
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
  // Goals
  financialGoal: string;
  desiredSavings: string;
  timeFrame: string;
  personalizedInsights: string;
  // Financial Behavior
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
  onComplete: (data: OnboardingData) => Promise<void>;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number | 2.5>(1);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<OnboardingData>({
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

  const updateData = (field: keyof OnboardingData, value: string | string[] | Record<string, string>) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    const updated = data.expenseCategories.includes(category)
      ? data.expenseCategories.filter((c) => c !== category)
      : [...data.expenseCategories, category];
    const amounts = { ...data.categoryAmounts };
    if (!updated.includes(category)) delete amounts[category];
    setData((prev) => ({ ...prev, expenseCategories: updated, categoryAmounts: amounts }));
  };

  const updateCategoryAmount = (category: string, amount: string) => {
    setData((prev) => ({
      ...prev,
      categoryAmounts: { ...prev.categoryAmounts, [category]: amount },
    }));
  };

  const validateStep = () => {
    if (currentStep === 1 && !data.accountType) {
      toast({ title: "Please select account type", variant: "destructive" });
      return false;
    }

    if (currentStep === 1 && data.accountType === "business") {
      if (!data.companyName?.trim()) {
        toast({ title: "Please enter company name", variant: "destructive" });
        return false;
      }
      if (!data.address?.trim()) {
        toast({ title: "Please enter company address", variant: "destructive" });
        return false;
      }
      if (!data.fyBeginning) {
        toast({ title: "Please select financial year beginning", variant: "destructive" });
        return false;
      }
      return true;
    }

    if (currentStep === 1 && data.accountType === "personal") {
      if (!data.fullName.trim()) {
        toast({ title: "Please enter your full name", variant: "destructive" });
        return false;
      }
      if (!data.occupation) {
        toast({ title: "Please select your occupation", variant: "destructive" });
        return false;
      }
      if (!data.monthlyIncome) {
        toast({ title: "Please select your income range", variant: "destructive" });
        return false;
      }
      return true;
    }

    // Student validation - just need name and pocket money
    if (currentStep === 1 && data.accountType === "student") {
      if (!data.fullName.trim()) {
        toast({ title: "Please enter your name", variant: "destructive" });
        return false;
      }
      if (!data.monthlyIncome) {
        toast({ title: "Please select your pocket money range", variant: "destructive" });
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!data.financialGoal) {
        toast({ title: "Please select your main financial goal", variant: "destructive" });
        return false;
      }
      if (!data.desiredSavings.trim()) {
        toast({ title: "Please enter your desired monthly savings", variant: "destructive" });
        return false;
      }
    }

    if (currentStep === 3) {
      if (!data.moneyManagement) {
        toast({ title: "Please select how you manage your money", variant: "destructive" });
        return false;
      }
      if (data.expenseCategories.length === 0) {
        toast({ title: "Please select at least one expense category", variant: "destructive" });
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    // Business flow: Complete immediately after step 1
    if (currentStep === 1 && data.accountType === "business") {
      setLoading(true);
      try {
        await onComplete(data);
      } catch (err) {
        console.error(err);
        toast({ title: "Failed to complete onboarding", variant: "destructive" });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Student flow: Complete immediately after step 1
    if (currentStep === 1 && data.accountType === "student") {
      setLoading(true);
      try {
        await onComplete(data);
      } catch (err) {
        console.error(err);
        toast({ title: "Failed to complete onboarding", variant: "destructive" });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Personal flow: Continue to next steps
    if (currentStep === 1) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep as number) - 1);
  };

  const handleFinish = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      await onComplete(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to complete onboarding", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const expenseOptions = ["Food", "Rent", "Transportation", "Shopping", "Entertainment", "Bills", "Health"];

  return (
    <div className="min-h-screen w-full bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border/50 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={arthicaLogo} alt="Arthica" className="h-12" />
          </div>

          {/* Progress for Personal */}
          {data.accountType === "personal" && currentStep > 1 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Step {currentStep} of 3</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {Math.round((currentStep as number / 3) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentStep as number / 3) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Account Type Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Arthica</h2>
                  <p className="text-muted-foreground">Choose your account type to get started</p>
                </div>

                {/* Account Type Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:border-primary/50 ${
                      data.accountType === "personal" ? "border-primary bg-primary/10" : "border-border"
                    }`}
                    onClick={() => updateData("accountType", "personal")}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-full ${data.accountType === "personal" ? "bg-primary" : "bg-secondary"}`}>
                        <User className={`h-6 w-6 ${data.accountType === "personal" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <h3 className="font-semibold text-foreground">Personal</h3>
                      <p className="text-sm text-muted-foreground">Track personal expenses and financial goals</p>
                    </div>
                  </Card>

                  <Card
                    className={`p-6 cursor-pointer transition-all hover:border-student-primary/50 ${
                      data.accountType === "student" ? "border-student-primary bg-student-primary/10" : "border-border"
                    }`}
                    onClick={() => updateData("accountType", "student")}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-full ${data.accountType === "student" ? "bg-student-primary" : "bg-secondary"}`}>
                        <GraduationCap className={`h-6 w-6 ${data.accountType === "student" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <h3 className="font-semibold text-foreground">Student</h3>
                      <p className="text-sm text-muted-foreground">Fun, gamified finance tracking for students 🎮</p>
                    </div>
                  </Card>

                  <Card
                    className={`p-6 cursor-pointer transition-all hover:border-primary/50 ${
                      data.accountType === "business" ? "border-primary bg-primary/10" : "border-border"
                    }`}
                    onClick={() => updateData("accountType", "business")}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-full ${data.accountType === "business" ? "bg-primary" : "bg-secondary"}`}>
                        <Building2 className={`h-6 w-6 ${data.accountType === "business" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <h3 className="font-semibold text-foreground">Business</h3>
                      <p className="text-sm text-muted-foreground">Manage company finances and reports</p>
                    </div>
                  </Card>
                </div>

                {/* Personal Fields */}
                {data.accountType === "personal" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-4 border-t border-border"
                  >
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={data.fullName}
                        onChange={(e) => updateData("fullName", e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="occupation">Occupation *</Label>
                      <Select value={data.occupation} onValueChange={(v) => updateData("occupation", v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="salaried">Salaried</SelectItem>
                          <SelectItem value="freelancer">Freelancer</SelectItem>
                          <SelectItem value="business-owner">Business Owner</SelectItem>
                          <SelectItem value="retired">Retired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                      <Select value={data.monthlyIncome} onValueChange={(v) => updateData("monthlyIncome", v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select income range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="below-25000">Below ₹25,000</SelectItem>
                          <SelectItem value="25000-50000">₹25,000 – ₹50,000</SelectItem>
                          <SelectItem value="50000-100000">₹50,000 – ₹1,00,000</SelectItem>
                          <SelectItem value="above-100000">Above ₹1,00,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                {/* Student Fields */}
                {data.accountType === "student" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-4 border-t border-student-border"
                  >
                    <div className="p-3 rounded-lg bg-student-primary/10 border border-student-primary/20">
                      <p className="text-sm text-center">🎮 Welcome to Student Mode! Track spending, earn badges, and compete with friends!</p>
                    </div>

                    <div>
                      <Label htmlFor="fullName">Your Name *</Label>
                      <Input
                        id="fullName"
                        value={data.fullName}
                        onChange={(e) => updateData("fullName", e.target.value)}
                        placeholder="What should we call you?"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="monthlyIncome">Monthly Pocket Money *</Label>
                      <Select value={data.monthlyIncome} onValueChange={(v) => updateData("monthlyIncome", v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select pocket money range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="below-5000">Below ₹5,000</SelectItem>
                          <SelectItem value="5000-10000">₹5,000 – ₹10,000</SelectItem>
                          <SelectItem value="10000-20000">₹10,000 – ₹20,000</SelectItem>
                          <SelectItem value="above-20000">Above ₹20,000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}

                {/* Business Fields */}
                {data.accountType === "business" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-4 border-t border-border"
                  >
                    <div>
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={data.companyName}
                        onChange={(e) => updateData("companyName", e.target.value)}
                        placeholder="Enter company name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gstin">GSTIN (Optional)</Label>
                      <Input
                        id="gstin"
                        value={data.gstin}
                        onChange={(e) => updateData("gstin", e.target.value)}
                        placeholder="Enter GSTIN"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={data.address}
                        onChange={(e) => updateData("address", e.target.value)}
                        placeholder="Enter company address"
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={data.city}
                          onChange={(e) => updateData("city", e.target.value)}
                          placeholder="City"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={data.state}
                          onChange={(e) => updateData("state", e.target.value)}
                          placeholder="State"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fyBeginning">Financial Year Beginning *</Label>
                      <Select value={data.fyBeginning} onValueChange={(v) => updateData("fyBeginning", v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select FY start month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="april">April (India Standard)</SelectItem>
                          <SelectItem value="january">January</SelectItem>
                          <SelectItem value="july">July</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Step 2: Goals (Personal only) */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Financial Goals</h2>
                  <p className="text-muted-foreground">Tell us about your financial priorities</p>
                </div>

                <div>
                  <Label>Main Financial Goal *</Label>
                  <RadioGroup value={data.financialGoal} onValueChange={(v) => updateData("financialGoal", v)} className="mt-2 space-y-2">
                    {["Save for emergency fund", "Pay off debt", "Save for retirement", "Build wealth", "Save for a goal"].map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <RadioGroupItem value={goal.toLowerCase().replace(/ /g, "-")} id={goal} />
                        <Label htmlFor={goal} className="font-normal cursor-pointer">{goal}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="desiredSavings">Desired Monthly Savings (₹) *</Label>
                  <Input
                    id="desiredSavings"
                    type="number"
                    value={data.desiredSavings}
                    onChange={(e) => updateData("desiredSavings", e.target.value)}
                    placeholder="5000"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Planning Time Frame</Label>
                  <Select value={data.timeFrame} onValueChange={(v) => updateData("timeFrame", v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select time frame" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {/* Step 3: Behavior (Personal only) */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Financial Behavior</h2>
                  <p className="text-muted-foreground">Help us understand your spending patterns</p>
                </div>

                <div>
                  <Label>How do you manage money? *</Label>
                  <RadioGroup value={data.moneyManagement} onValueChange={(v) => updateData("moneyManagement", v)} className="mt-2 space-y-2">
                    {["Strictly budgeted", "Loosely tracked", "Spend freely"].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt.toLowerCase().replace(/ /g, "-")} id={opt} />
                        <Label htmlFor={opt} className="font-normal cursor-pointer">{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label>Select your main expense categories *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {expenseOptions.map((cat) => (
                      <Badge
                        key={cat}
                        variant={data.expenseCategories.includes(cat) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleCategory(cat)}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                {data.expenseCategories.length > 0 && (
                  <div className="space-y-3">
                    <Label>Monthly spending per category</Label>
                    {data.expenseCategories.map((cat) => (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="w-32 text-sm text-muted-foreground">{cat}</span>
                        <Input
                          type="number"
                          placeholder="₹ Amount"
                          value={data.categoryAmounts[cat] || ""}
                          onChange={(e) => updateCategoryAmount(cat, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-4 border-t border-border">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep === 3 ? (
              <Button onClick={handleFinish} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Complete
              </Button>
            ) : (
              <Button onClick={handleNext} disabled={!data.accountType || loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : data.accountType === "business" ? (
                  <>Create Company <ChevronRight className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Continue <ChevronRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
