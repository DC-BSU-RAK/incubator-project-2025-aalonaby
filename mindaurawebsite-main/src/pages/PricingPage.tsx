import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Crown, CheckCircle2, Star } from 'lucide-react';
import { UpgradeModal } from '@/components/Modals';
import { getCurrentUser, upgradeToPremium } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export default function PricingPage() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const user = getCurrentUser();

  return (
    <div className="space-y-8 animate-fade-up max-w-5xl mx-auto">
      <div className="text-center">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Choose your plan</h1>
        <p className="text-muted-foreground">Start free. Upgrade when you're ready for the full MindAura experience.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-8">
          <h3 className="font-display text-xl font-bold mb-2">Free</h3>
          <div className="font-display text-4xl font-bold mb-1">AED 0<span className="text-base font-normal text-muted-foreground">/month</span></div>
          <p className="text-muted-foreground text-sm mb-6">Everything you need to get started</p>
          <ul className="space-y-3 mb-8">
            {["Planner, Journal & Sleep tracker", "Focus timer & wellness alerts", "Mood check-ins & breathing reset", "Sponsored student offers"].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {f}</li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" disabled>{!user?.isPremium ? 'Current plan' : 'Available'}</Button>
        </div>

        <div className="card-elevated p-8 border-2 border-primary relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-aura text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Star className="w-3 h-3" /> POPULAR</div>
          <h3 className="font-display text-xl font-bold mb-2 flex items-center gap-2"><Crown className="w-5 h-5 text-primary" /> Premium</h3>
          <div className="font-display text-4xl font-bold mb-1">AED 18<span className="text-base font-normal text-muted-foreground">/month</span></div>
          <p className="text-muted-foreground text-sm mb-6">For serious students</p>
          <ul className="space-y-3 mb-8">
            {["Everything in Free", "No advertisements", "Advanced analytics", "Custom themes", "Premium wellness content", "Extended focus modes"].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {f}</li>
            ))}
          </ul>
          {user?.isPremium ? (
            <Button variant="hero" className="w-full" disabled>You're on Premium 💜</Button>
          ) : (
            <div className="space-y-2">
              <Button variant="hero" className="w-full" onClick={() => setOpen(true)}>Upgrade to Premium</Button>
              <Button variant="outline" className="w-full" onClick={() => {
                upgradeToPremium();
                toast({ title: '🎉 Premium activated', description: 'Enjoy your ad-free MindAura experience.' });
                setTimeout(() => window.location.reload(), 600);
              }}>Preview Premium (free)</Button>
            </div>
          )}
        </div>
      </div>

      <UpgradeModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
