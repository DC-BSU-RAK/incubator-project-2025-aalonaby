import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSleep, addSleep, deleteSleep, SleepLog } from '@/lib/store';
import { Moon, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SleepPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<SleepLog[]>(getSleep());
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [hours, setHours] = useState('7');

  const refresh = () => setLogs(getSleep());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(hours);
    if (!date || isNaN(h) || h < 0 || h > 24) return;
    addSleep(date, h);
    toast({ title: 'Sleep logged' });
    refresh();
  };

  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  const recent = sorted.slice(0, 7);
  const avg = recent.length ? recent.reduce((s, l) => s + l.hours, 0) / recent.length : 0;
  const lowSleep = avg > 0 && avg <= 5;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Sleep Tracker</h1>
        <p className="text-muted-foreground">Healthy sleep = healthy studying. Track yours below.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground">7-day average</p>
          <p className="font-display text-3xl font-bold gradient-text">{avg.toFixed(1)}h</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground">Latest log</p>
          <p className="font-display text-3xl font-bold">{sorted[0]?.hours ?? '—'}{sorted[0] ? 'h' : ''}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted-foreground">Total logs</p>
          <p className="font-display text-3xl font-bold">{logs.length}</p>
        </div>
      </div>

      {lowSleep && (
        <div className="card-elevated p-5 border-2 border-destructive/40 bg-destructive/5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Rest warning</p>
            <p className="text-sm text-muted-foreground">Your recent average is {avg.toFixed(1)} hours. Try winding down earlier tonight — your brain (and grades) will thank you.</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="glass-card p-6 space-y-3 h-fit">
          <h3 className="font-display font-semibold flex items-center gap-2"><Plus className="w-4 h-4" /> Log sleep</h3>
          <div>
            <label className="text-xs text-muted-foreground">Date</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Hours slept</label>
            <Input type="number" min="0" max="24" step="0.5" value={hours} onChange={e => setHours(e.target.value)} />
          </div>
          <Button type="submit" variant="hero" className="w-full">Save log</Button>
        </form>

        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-4"><Moon className="w-5 h-5 text-primary" /> Recent sleep</h3>
          {sorted.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No logs yet.</p>
          ) : (
            <div className="space-y-2">
              {sorted.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <Moon className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{log.date}</p>
                      <p className="text-xs text-muted-foreground">{log.hours} hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 bg-muted rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full gradient-aura" style={{ width: `${Math.min(100, (log.hours / 9) * 100)}%` }} />
                    </div>
                    <button onClick={() => { deleteSleep(log.id); refresh(); }} className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
