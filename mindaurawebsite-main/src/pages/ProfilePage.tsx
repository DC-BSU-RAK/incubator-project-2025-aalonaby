import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrentUser, updateUser, UAE_UNIVERSITIES, logout } from '@/lib/auth';
import { applyTheme, THEMES, ThemeName } from '@/lib/theme';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { LogOut, Crown, Check } from 'lucide-react';

export default function ProfilePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [name, setName] = useState(user?.name || '');
  const [university, setUniversity] = useState(user?.university || 'Demo University');
  const [theme, setTheme] = useState<ThemeName>((user?.theme as ThemeName) || 'aura-light');

  if (!user) return null;

  const save = () => {
    updateUser({ name, university, theme });
    applyTheme(theme);
    toast({ title: 'Profile updated' });
  };

  const onTheme = (t: ThemeName) => {
    setTheme(t);
    applyTheme(t);
    updateUser({ theme: t });
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Profile</h1>
        <p className="text-muted-foreground">Manage your account and personalise MindAura.</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="w-16 h-16 rounded-2xl gradient-aura flex items-center justify-center text-white font-display font-bold text-2xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display font-semibold text-lg">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
              {user.isPremium ? <><Crown className="w-3 h-3" /> Premium</> : 'Free plan'}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Full name</Label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user.email} disabled />
        </div>

        <div className="space-y-2">
          <Label>University</Label>
          <Select value={university} onValueChange={setUniversity}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{UAE_UNIVERSITIES.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <Button variant="hero" onClick={save}>Save changes</Button>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-3">Theme</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {THEMES.map(t => (
            <button
              key={t.value}
              onClick={() => onTheme(t.value)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${theme === t.value ? 'border-primary bg-accent' : 'border-border hover:border-primary/40'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{t.label}</span>
                {theme === t.value && <Check className="w-4 h-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
}
