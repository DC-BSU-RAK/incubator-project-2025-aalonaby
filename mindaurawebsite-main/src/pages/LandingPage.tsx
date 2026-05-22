import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, CheckCircle2, Droplets, Brain, Star, Zap, Users, BarChart3, Heart, Activity, BookOpen, Timer, Moon, PlayCircle, Building2, Globe, Rocket, Crown } from "lucide-react";
import { loginAsDemo } from "@/lib/auth";
import { useNavigate } from "react-router-dom";

const motivationalQuotes = [
  "You're doing great — one step at a time! 🌟",
  "Take a deep breath. You've got this. 💪",
  "Progress, not perfection. Keep going! 🚀",
  "Your mental health matters more than any grade. 💙",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const tryDemo = () => { loginAsDemo(); navigate("/dashboard"); };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl gradient-aura flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">MindAura</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#impact" className="hover:text-foreground transition-colors">Impact</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#premium" className="hover:text-foreground transition-colors">Premium</a>
            <a href="#market" className="hover:text-foreground transition-colors">Market</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link to="/signup"><Button variant="hero" size="sm">Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 gradient-hero">
        <div className="container mx-auto text-center max-w-4xl animate-fade-up">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> Built for UAE university students
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="gradient-text">MindAura</span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground mb-4 font-medium">
            Stay focused. Stay healthy. Stay balanced.
          </p>
          <p className="text-base text-muted-foreground mb-10 max-w-2xl mx-auto">
            The all-in-one wellness and productivity platform that helps university students manage their workload while taking care of their physical and mental health.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup"><Button variant="hero" size="lg" className="text-base px-8">Get Started Free <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
            <Button variant="outline" size="lg" className="text-base px-8" onClick={tryDemo}>
              <PlayCircle className="mr-2 w-4 h-4" /> Try Demo
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> Free to use</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> No credit card</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-primary" /> UAE focused</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Everything you need to thrive</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">A complete student wellness toolkit, designed to feel calm and powerful.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: "Smart Planner", desc: "Daily, weekly and monthly views with categories, notes and reminders." },
              { icon: Timer, title: "Focus Timer", desc: "Pomodoro-style sessions with study and chill modes." },
              { icon: Droplets, title: "Wellness Alerts", desc: "Smart hydration, stretch and screen-break reminders." },
              { icon: Brain, title: "Brain Dump Journal", desc: "Private journaling with guided prompts to clear your mind." },
              { icon: Moon, title: "Sleep Tracker", desc: "Log sleep, see averages and get rest warnings when needed." },
              { icon: Heart, title: "Mood & Reset", desc: "Mood check-ins, motivational quotes and breathing reset." },
            ].map((f, i) => (
              <div key={i} className="glass-card p-6 hover:shadow-elevated transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl gradient-aura flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section id="impact" className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary font-medium text-sm mb-4">
              <Heart className="w-4 h-4" /> Social Impact
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Making a real difference</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">MindAura is a movement to improve student wellbeing across UAE universities.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Activity, stat: "67%", label: "of students report high stress. MindAura helps them manage it." },
              { icon: BarChart3, stat: "3x", label: "productivity uplift with structured breaks and focus sessions." },
              { icon: Heart, stat: "85%", label: "of users feel calmer and more balanced after 2 weeks." },
              { icon: Users, stat: "24/7", label: "accessible mental wellness prompts and resources." },
            ].map((item, i) => (
              <div key={i} className="card-elevated p-6 text-center">
                <div className="w-14 h-14 rounded-2xl gradient-aura flex items-center justify-center mx-auto mb-4 text-white">
                  <item.icon className="w-7 h-7" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground mb-2">{item.stat}</div>
                <p className="text-muted-foreground text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Get started in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create your account", desc: "Pick your university and personalise your space in seconds." },
              { step: "2", title: "Plan your week", desc: "Add assignments, lectures and study blocks to your planner." },
              { step: "3", title: "Stay well", desc: "Track sleep, journal, take breaks — and feel the difference." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl gradient-aura flex items-center justify-center mx-auto mb-4 text-white font-display font-bold text-xl">{s.step}</div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Preview */}
      <section className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Wellness in action</h2>
            <p className="text-muted-foreground text-lg">A peek at your daily MindAura experience.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Droplets className="w-5 h-5 text-primary" /> Smart wellness alerts</h4>
              <div className="space-y-3">
                {["💧 Time to drink some water!", "🧘 Stand up and stretch for 2 minutes", "👁️ Look away from the screen — rest your eyes", "🚶 Take a 5-minute walk to refresh"].map((alert, i) => (
                  <div key={i} className="bg-accent/50 rounded-lg px-4 py-3 text-sm text-foreground">{alert}</div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <h4 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> Motivational support</h4>
              <div className="space-y-3">
                {motivationalQuotes.map((q, i) => (
                  <div key={i} className="bg-accent/50 rounded-lg px-4 py-3 text-sm text-foreground italic">"{q}"</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium */}
      <section id="premium" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Choose your plan</h2>
            <p className="text-muted-foreground text-lg">Start free, upgrade when you're ready.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="glass-card p-8">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Free</h3>
              <div className="font-display text-4xl font-bold text-foreground mb-1">AED 0<span className="text-base font-normal text-muted-foreground">/month</span></div>
              <p className="text-muted-foreground text-sm mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                {["Planner, journal & sleep tracker", "Focus timer & wellness alerts", "Mood check-ins", "Sponsored student offers"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {f}</li>
                ))}
              </ul>
              <Link to="/signup"><Button variant="outline" className="w-full">Get Started</Button></Link>
            </div>
            <div className="card-elevated p-8 border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-aura text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Star className="w-3 h-3" /> POPULAR</div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Premium</h3>
              <div className="font-display text-4xl font-bold text-foreground mb-1">AED 18<span className="text-base font-normal text-muted-foreground">/month</span></div>
              <p className="text-muted-foreground text-sm mb-6">For serious students</p>
              <ul className="space-y-3 mb-8">
                {["Everything in Free", "No advertisements", "Advanced analytics", "Custom themes", "Premium wellness content", "Extended focus modes"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {f}</li>
                ))}
              </ul>
              <Link to="/signup"><Button variant="hero" className="w-full">Start Free Trial</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market readiness */}
      <section id="market" className="py-20 px-4 bg-accent/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Market readiness</h2>
            <p className="text-muted-foreground text-lg">Why MindAura is positioned to scale across UAE universities and beyond.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Globe, title: "Built for UAE students", desc: "Localized for the academic calendar, languages and culture of UAE universities — Ajman, AUS, Sharjah, Zayed, UAEU and Khalifa." },
              { icon: Heart, title: "Real social impact", desc: "Tackles rising student burnout, sleep deprivation and mental health pressure with evidence-based wellness practices." },
              { icon: Crown, title: "Freemium monetization", desc: "Free tier with sponsored student offers, plus a premium subscription that funds continued development." },
              { icon: Building2, title: "University partnerships", desc: "Future white-label dashboards for student affairs, wellness centres and academic advisors." },
              { icon: Rocket, title: "Scalable architecture", desc: "Cloud-ready, mobile-first and language-ready — designed to expand across GCC and beyond." },
              { icon: Users, title: "Community-first", desc: "Roadmap includes study buddies, wellness circles and live focus rooms to build healthier student communities." },
            ].map((m, i) => (
              <div key={i} className="card-elevated p-6">
                <div className="w-11 h-11 rounded-xl gradient-aura text-white flex items-center justify-center mb-3"><m.icon className="w-5 h-5" /></div>
                <h3 className="font-display font-semibold text-foreground mb-2">{m.title}</h3>
                <p className="text-muted-foreground text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl gradient-aura flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-display text-lg font-bold text-foreground">MindAura</span>
              </div>
              <p className="text-muted-foreground text-sm">Helping UAE students build healthier study habits and thrive at university.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#premium" className="hover:text-foreground transition-colors">Premium</a></li>
                <li><a href="#impact" className="hover:text-foreground transition-colors">Social Impact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#market" className="hover:text-foreground transition-colors">Market</a></li>
                <li><a href="#how" className="hover:text-foreground transition-colors">How it works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span></li>
                <li><span className="hover:text-foreground transition-colors cursor-pointer">Terms</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} MindAura. Built with 💜 for students in the UAE.
          </div>
        </div>
      </footer>
    </div>
  );
}
