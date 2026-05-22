import { useState } from 'react';
import { Users, GraduationCap, BookOpen, Heart } from 'lucide-react';
import { ComingSoonModal } from '@/components/Modals';

const FEATURES = [
  { key: 'buddies', icon: Users, title: 'Study Buddies', desc: 'Match with classmates who share your courses and study style. Stay accountable together with shared focus sessions and gentle nudges.' },
  { key: 'classmates', icon: GraduationCap, title: 'Find Classmates', desc: 'Discover other students from your university and major. Build a real campus network around your subjects.' },
  { key: 'rooms', icon: BookOpen, title: 'Study Rooms', desc: 'Drop into virtual focus rooms with timers, ambient sounds, and live presence. Study together — even when alone.' },
  { key: 'circles', icon: Heart, title: 'Wellness Circles', desc: 'Small, safe peer groups led by wellness prompts. Share weekly check-ins and support each other through exam season.' },
];

export default function CommunityPage() {
  const [open, setOpen] = useState<string | null>(null);
  const active = FEATURES.find(f => f.key === open);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Community Hub</h1>
        <p className="text-muted-foreground">A glimpse of the connected MindAura community — coming soon.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {FEATURES.map(f => (
          <button key={f.key} onClick={() => setOpen(f.key)} className="card-elevated p-6 text-left hover:shadow-elevated transition-all hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-xl gradient-aura text-white flex items-center justify-center mb-3">
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc.slice(0, 90)}…</p>
            <span className="inline-block mt-3 text-xs font-medium text-primary">Learn more →</span>
          </button>
        ))}
      </div>

      <ComingSoonModal
        open={!!open}
        onOpenChange={v => !v && setOpen(null)}
        title={active?.title || ''}
        description={active?.desc || ''}
        icon={active ? <active.icon className="w-6 h-6" /> : undefined}
      />
    </div>
  );
}
