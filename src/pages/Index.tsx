import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Brain, Shield, TrendingUp, Zap, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized financial advice powered by advanced AI algorithms",
    },
    {
      icon: Shield,
      title: "Blockchain Security",
      description: "Your financial data protected with blockchain-backed transparency",
    },
    {
      icon: TrendingUp,
      title: "Smart Budgeting",
      description: "Automated expense tracking and intelligent budget recommendations",
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description: "Monitor your financial health with live insights and reports",
    },
    {
      icon: Globe,
      title: "Multi-currency Support",
      description: "Manage finances across multiple currencies effortlessly",
    },
    {
      icon: Lock,
      title: "Bank-level Encryption",
      description: "Enterprise-grade security keeping your data safe 24/7",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold gradient-text"
            >
              Arthica
            </motion.h1>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="glass-button">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-primary hover:bg-primary/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Financial technology visualization"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-6xl font-bold mb-6 gradient-text">
              Smarter Money.<br />Transparent Future.
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Harness the power of AI and blockchain to transform how you manage your finances.
              Budget smarter, save more, and achieve your financial goals with confidence.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="glass-button text-lg px-8">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4">Powerful Features</h3>
            <p className="text-xl text-muted-foreground">
              Everything you need to take control of your financial future
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 hover:scale-105 transition-transform duration-300"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 text-center"
          >
            <h3 className="text-4xl font-bold mb-4 gradient-text">
              Ready to Transform Your Financial Future?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their money smarter with Arthica
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 gradient-text">Arthica</h4>
              <p className="text-muted-foreground">
                AI-powered financial platform for smarter money management
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-muted-foreground">
            <p>© 2025 Arthica. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
