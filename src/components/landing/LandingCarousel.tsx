import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Brain, Target, IndianRupee, FileSpreadsheet, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import arthicaLogo from "@/assets/arthica-logo.png";
import { useState, useEffect } from "react";

const LandingCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const features = [
    { icon: TrendingUp, title: "Track", description: "See exactly where your money goes with smart expense categorization" },
    { icon: Brain, title: "Understand", description: "Get AI-powered insights that explain your spending patterns" },
    { icon: Target, title: "Act", description: "Make confident financial decisions with personalized recommendations" },
  ];

  const reasons = [
    { icon: IndianRupee, title: "Built for India", description: "Designed for Indian students managing stipends and expenses" },
    { icon: FileSpreadsheet, title: "Works with Your Data", description: "Import from Tally, Excel, or add manually" },
    { icon: Sparkles, title: "AI-Powered", description: "Turn financial confusion into clarity with intelligent guidance" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen bg-gradient-hero text-white flex flex-col">
        {/* Fixed Navigation */}
        <nav className="w-full z-50 glass-card safe-area-top">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 shrink-0">
                <img src={arthicaLogo} alt="Arthica" className="h-6" />
                <span className="text-lg font-bold gradient-text">Arthica</span>
              </Link>
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="glass-button text-white text-xs px-3">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs px-3">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Carousel Content */}
        <div className="flex-1 flex flex-col">
          <Carousel setApi={setApi} className="flex-1" opts={{ align: "start", loop: false }}>
            <CarouselContent className="h-full">
              {/* Slide 1: Hero */}
              <CarouselItem className="h-full">
                <div className="h-full flex flex-col justify-between px-6 py-8">
                  <div className="flex-1 flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-center"
                    >
                      <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <img src={arthicaLogo} alt="Arthica" className="h-12" />
                      </div>
                      <h1 className="text-4xl font-bold mb-6 leading-tight">
                        AI that turns financial confusion into{" "}
                        <span className="gradient-text">clarity</span>
                      </h1>
                      <p className="text-lg text-white/70 mb-8 max-w-sm mx-auto">
                        Your personal AI companion for understanding money and making confident decisions.
                      </p>
                    </motion.div>
                  </div>
                  <div className="space-y-3">
                    <Link to="/signup" className="block">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-base px-6 h-14 w-full">
                        Start Your Journey
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/login" className="block">
                      <Button size="lg" variant="ghost" className="glass-button text-white text-base px-6 h-14 w-full">
                        I already have an account
                      </Button>
                    </Link>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 2: Features */}
              <CarouselItem className="h-full">
                <div className="h-full flex flex-col justify-center px-6 py-8">
                  <h2 className="text-2xl font-bold text-white mb-2 text-center">What Arthica Does</h2>
                  <p className="text-sm text-white/70 mb-6 text-center">Simple steps to control your finances</p>
                  <div className="space-y-4">
                    {features.map((feature) => (
                      <div key={feature.title} className="glass-card p-4 flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                          <p className="text-sm text-white/70">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 3: Why Arthica */}
              <CarouselItem className="h-full">
                <div className="h-full flex flex-col justify-center px-6 py-8">
                  <h2 className="text-2xl font-bold text-white mb-2 text-center">Why Arthica?</h2>
                  <p className="text-sm text-white/70 mb-6 text-center">Built different, built better</p>
                  <div className="space-y-4">
                    {reasons.map((reason) => (
                      <div key={reason.title} className="glass-card p-4 flex items-start gap-4">
                        <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center shrink-0">
                          <reason.icon className="h-6 w-6 text-secondary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">{reason.title}</h3>
                          <p className="text-sm text-white/70">{reason.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 4: CTA */}
              <CarouselItem className="h-full">
                <div className="h-full flex flex-col justify-between px-6 py-8">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to take control of your finances?
                      </h2>
                      <p className="text-base text-white/70 max-w-sm mx-auto">
                        Join thousands of students building smarter money habits with AI-powered insights
                      </p>
                    </div>
                    
                    <div className="glass-card p-5 mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <Target className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">85% of students</p>
                          <p className="text-sm text-white/70">found Arthica helpful in managing finances</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Link to="/signup" className="block">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-base px-6 h-14 w-full">
                        Start Using Arthica
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/about" className="block">
                      <Button size="lg" variant="ghost" className="glass-button text-white text-base px-6 h-14 w-full">
                        About Us
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-white/10 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <img src={arthicaLogo} alt="Arthica" className="h-4" />
                      <span className="font-semibold text-white text-xs">Arthica</span>
                    </div>
                    <p className="text-xs text-white/50">© 2025 Arthica • arthicaai@gmail.com</p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>

          {/* Navigation Dots & Arrows */}
          <div className="pb-8 safe-area-bottom">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => api?.scrollPrev()}
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center disabled:opacity-30"
                disabled={current === 0}
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === current ? "bg-primary w-6" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => api?.scrollNext()}
                className="w-10 h-10 rounded-full glass-card flex items-center justify-center disabled:opacity-30"
                disabled={current === count - 1}
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
            
            <p className="text-center text-xs text-white/50 mt-3">
              Swipe or use arrows to navigate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingCarousel;
