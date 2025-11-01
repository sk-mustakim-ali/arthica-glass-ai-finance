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

interface OnboardingData {
  // Step 1
  fullName: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  monthlyIncome: string;
  // Step 2
  moneyManagement: string;
  hasBudget: string;
  monthlySpendingLimit: string;
  expenseCategories: string[];
  hasLoans: string;
  // Step 3
  financialGoal: string;
  desiredSavings: string;
  timeFrame: string;
  personalizedInsights: string;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userProfileData, setUserProfileData] = useState<OnboardingData>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    monthlyIncome: "",
    moneyManagement: "",
    hasBudget: "",
    monthlySpendingLimit: "",
    expenseCategories: [],
    hasLoans: "",
    financialGoal: "",
    desiredSavings: "",
    timeFrame: "",
    personalizedInsights: "",
  });

  const updateData = (field: keyof OnboardingData, value: string | string[]) => {
    setUserProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    setUserProfileData((prev) => ({
      ...prev,
      expenseCategories: prev.expenseCategories.includes(category)
        ? prev.expenseCategories.filter((c) => c !== category)
        : [...prev.expenseCategories, category],
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    onComplete(userProfileData);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <Card className="w-full max-w-2xl rounded-2xl shadow-lg p-8 overflow-hidden">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of 3
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round((currentStep / 3) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

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
                <h2 className="text-3xl font-bold mb-2">Personal Profile</h2>
                <p className="text-muted-foreground">Tell us a bit about yourself</p>
              </div>

              <div className="space-y-4">
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
                  <Label htmlFor="occupation">Occupation</Label>
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
                <h2 className="text-3xl font-bold mb-2">Financial Behavior</h2>
                <p className="text-muted-foreground">Help us understand your spending habits</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="moneyManagement">How do you manage your money?</Label>
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
                  <Label>Do you currently have a budget?</Label>
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
                </div>

                <div>
                  <Label htmlFor="monthlySpendingLimit">Monthly Spending Limit (₹)</Label>
                  <Input
                    id="monthlySpendingLimit"
                    type="number"
                    value={userProfileData.monthlySpendingLimit}
                    onChange={(e) => updateData("monthlySpendingLimit", e.target.value)}
                    placeholder="Enter amount"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Biggest Expense Categories</Label>
                  <p className="text-sm text-muted-foreground mb-2">Select all that apply</p>
                  <div className="flex flex-wrap gap-2">
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
                </div>

                <div>
                  <Label>Active Loans or EMIs?</Label>
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
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
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
                  <Label htmlFor="financialGoal">Main financial goal</Label>
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
                  <Label htmlFor="desiredSavings">Desired monthly savings (₹)</Label>
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
                  <Label htmlFor="timeFrame">Time frame for planning</Label>
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
                  <Label>Would you like personalized insights?</Label>
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

          {currentStep < 3 ? (
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
      </Card>
    </div>
  );
};

export default OnboardingFlow;
