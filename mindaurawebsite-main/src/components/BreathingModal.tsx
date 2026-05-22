import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wind } from 'lucide-react';

const PHASES = [
  { label: 'Breathe in…', duration: 4000, scale: 1.4 },
  { label: 'Hold…', duration: 4000, scale: 1.4 },
  { label: 'Breathe out…', duration: 6000, scale: 1 },
];

export default function BreathingModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!open) { setPhaseIdx(0); setRound(0); return; }
    const t = setTimeout(() => {
      setPhaseIdx(p => {
        const next = (p + 1) % PHASES.length;
        if (next === 0) setRound(r => r + 1);
        return next;
      });
    }, PHASES[phaseIdx].duration);
    return () => clearTimeout(t);
  }, [phaseIdx, open]);

  const phase = PHASES[phaseIdx];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Wind className="w-5 h-5 text-primary" /> Breathing Reset</DialogTitle>
          <DialogDescription>Follow the rhythm. 4 - 4 - 6 box breathing to calm your mind.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8">
          <div
            className="w-40 h-40 rounded-full gradient-aura flex items-center justify-center text-white font-medium transition-transform ease-in-out"
            style={{ transform: `scale(${phase.scale})`, transitionDuration: `${phase.duration}ms` }}
          >
            {phase.label}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Round {round + 1}</p>
        </div>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
