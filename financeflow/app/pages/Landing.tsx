import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DollarSign, BarChart3, Shield, Zap, ArrowRight,
  TrendingUp, Wallet, PieChart, FileText, ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: 'Track Every Dollar',
    desc: 'Effortlessly log income and expenses with smart categorization that keeps your finances crystal clear.',
  },
  {
    icon: PieChart,
    title: 'Visual Reports',
    desc: 'Beautiful charts and graphs that transform raw numbers into actionable financial insights.',
  },
  {
    icon: FileText,
    title: 'PDF Export',
    desc: 'Generate polished PDF reports of your financial data, ready to share or archive.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    desc: 'Your data is encrypted and protected with enterprise-level security protocols.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Optimized performance means instant load times and seamless interactions.',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    desc: 'Monthly and yearly summaries that help you understand your spending patterns.',
  },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '$2M+', label: 'Tracked Monthly' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9★', label: 'User Rating' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl gradient-primary">
              <DollarSign className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">FinanceFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="gradient-primary text-primary-foreground font-medium px-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-income/5 blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Zap className="h-3.5 w-3.5" />
            Smart financial management made simple
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Take Control of
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
              Your Finances
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Track income, manage expenses, and visualize your financial health with beautiful reports. 
            Everything you need to master your money in one elegant platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-primary-foreground font-semibold px-8 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Start Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="font-semibold px-8 h-12 text-base">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="max-w-4xl mx-auto mt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="relative rounded-2xl border border-border/60 bg-card shadow-2xl shadow-primary/5 overflow-hidden p-1">
            <div className="rounded-xl bg-background/50 p-6 space-y-4">
              {/* Mock stat cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Income', value: '$12,450', color: 'bg-income/10 text-income' },
                  { label: 'Expenses', value: '$8,320', color: 'bg-expense/10 text-expense' },
                  { label: 'Balance', value: '$4,130', color: 'bg-primary/10 text-primary' },
                ].map(s => (
                  <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
                    <p className="text-xs opacity-70">{s.label}</p>
                    <p className="text-lg font-display font-bold mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
              {/* Mock chart bars */}
              <div className="flex items-end gap-2 h-32 px-4">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 65].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-primary/20" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-display font-bold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Everything You Need to
              <br />
              <span className="text-primary">Manage Your Money</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Powerful tools wrapped in a beautiful interface that makes financial management a joy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl gradient-primary p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
            <div className="relative">
              <TrendingUp className="h-12 w-12 text-primary-foreground/80 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground mb-4">
                Ready to Take Control?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of users who've transformed their financial lives with FinanceFlow.
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 font-semibold px-8 h-12 text-base">
                  Get Started Free <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg gradient-primary">
              <DollarSign className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm">FinanceFlow</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FinanceFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
