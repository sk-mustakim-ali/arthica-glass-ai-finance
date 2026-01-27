import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Brain, Target, IndianRupee, FileSpreadsheet, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import arthicaLogo from "@/assets/arthica-logo.png";

const Index = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Track",
      description: "See exactly where your money goes with smart expense categorization",
    },
    {
      icon: Brain,
      title: "Understand",
      description: "Get AI-powered insights that explain your spending patterns in plain language",
    },
    {
      icon: Target,
      title: "Act",
      description: "Make confident financial decisions with personalized recommendations",
    },
  ];

  const reasons = [
    {
      icon: IndianRupee,
      title: "Built for India",
      description: "Designed specifically for Indian students managing stipends, internships, and daily expenses",
    },
    {
      icon: FileSpreadsheet,
      title: "Works with Your Data",
      description: "Import from Tally, Excel, or simply add manually — no complicated setup",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description: "Turn financial confusion into clarity with intelligent, personalized guidance",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={arthicaLogo} alt="Arthica" className="h-6 sm:h-8" />
              <span className="text-lg sm:text-2xl font-bold gradient-text">Arthica</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="glass-button text-white text-xs sm:text-sm px-2 sm:px-4">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs sm:text-sm px-2 sm:px-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              AI that turns financial confusion into{" "}
              <span className="gradient-text">clarity</span>
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Your personal AI companion for understanding money, building smart habits, and making confident financial decisions.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What Arthica Does */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Arthica Does
            </h2>
            <p className="text-lg text-white/70">
              Simple steps to take control of your finances
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/70">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Arthica */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Arthica?
            </h2>
            <p className="text-lg text-white/70">
              Built different, built better
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className="w-14 h-14 bg-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <reason.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {reason.title}
                </h3>
                <p className="text-white/70">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 sm:p-12 text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to take control of your finances?
            </h2>
            <p className="text-base sm:text-xl text-white/70 mb-6 sm:mb-8">
              Join thousands of students building smarter money habits
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
              <Link to="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-sm sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto">
                  Start Using Arthica
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link to="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="ghost" className="glass-button text-white text-sm sm:text-lg px-6 sm:px-8 h-12 sm:h-14 w-full sm:w-auto">
                  About Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={arthicaLogo} alt="Arthica" className="h-6" />
            <span className="font-semibold text-white">Arthica</span>
          </div>
          <p className="text-sm text-white/70">
            © 2025 Arthica. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/70">
            <a href="mailto:arthicaai@gmail.com" className="hover:text-white transition-colors">
              arthicaai@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
