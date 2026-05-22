import { useState, ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles } from 'lucide-react';

export function ComingSoonModal({
  open, onOpenChange, title, description, icon,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  title: string; description: string; icon?: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="w-14 h-14 rounded-2xl gradient-aura flex items-center justify-center mb-3 text-white">
            {icon ?? <Sparkles className="w-6 h-6" />}
          </div>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="bg-accent/50 rounded-xl px-4 py-3 text-sm text-accent-foreground">
          ✨ This feature is coming soon as part of the MindAura roadmap.
        </div>
        <DialogFooter>
          <Button variant="hero" onClick={() => onOpenChange(false)}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UpgradeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="w-14 h-14 rounded-2xl gradient-aura flex items-center justify-center mb-3 text-white">
            <Crown className="w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl">Premium subscriptions — coming soon</DialogTitle>
          <DialogDescription className="text-base leading-relaxed pt-2">
            We're finalising MindAura Premium ($4.99/month). It will remove ads,
            unlock advanced wellness analytics, custom themes and extended focus modes.
            For now you can preview Premium for free below.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2 text-sm">
          <li>✓ No advertisements</li>
          <li>✓ Advanced study & sleep analytics</li>
          <li>✓ Premium wellness content & breathing programs</li>
          <li>✓ Priority support</li>
        </ul>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Maybe later</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useModal() {
  const [open, setOpen] = useState(false);
  return { open, setOpen, openModal: () => setOpen(true), closeModal: () => setOpen(false) };
}
