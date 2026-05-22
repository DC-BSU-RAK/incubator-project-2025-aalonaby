import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPlanner, addPlanner, deletePlanner, updatePlanner, PlannerItem } from '@/lib/store';
import { Plus, Trash2, CalendarDays, Pencil, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CATEGORIES = ['Class', 'Study', 'Assignment', 'Exam', 'Wellness', 'Personal'];
type View = 'day' | 'week' | 'month';

function inRange(date: string, view: View) {
  if (!date) return false;
  const d = new Date(date); const now = new Date();
  if (view === 'day') return d.toDateString() === now.toDateString();
  if (view === 'week') {
    const diff = (d.getTime() - now.getTime()) / 86400000;
    return diff >= -1 && diff <= 7;
  }
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export default function PlannerPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<PlannerItem[]>(getPlanner());
  const [view, setView] = useState<View>('week');
  const [editing, setEditing] = useState<PlannerItem | null>(null);
  const [form, setForm] = useState({ title: '', date: new Date().toISOString().slice(0, 10), category: 'Study', notes: '' });

  const refresh = () => setItems(getPlanner());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) {
      updatePlanner(editing.id, form);
      toast({ title: 'Item updated' });
      setEditing(null);
    } else {
      addPlanner(form);
      toast({ title: 'Added to planner' });
    }
    setForm({ title: '', date: new Date().toISOString().slice(0, 10), category: 'Study', notes: '' });
    refresh();
  };

  const startEdit = (item: PlannerItem) => {
    setEditing(item);
    setForm({ title: item.title, date: item.date, category: item.category, notes: item.notes });
  };

  const filtered = items.filter(i => inRange(i.date, view)).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Planner</h1>
        <p className="text-muted-foreground">Plan your week with classes, study blocks and wellness time.</p>
      </div>

      <div className="flex gap-2">
        {(['day', 'week', 'month'] as View[]).map(v => (
          <Button key={v} variant={view === v ? 'hero' : 'outline'} size="sm" onClick={() => setView(v)} className="capitalize">{v}</Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-3 lg:col-span-1 h-fit">
          <h3 className="font-display font-semibold flex items-center gap-2">
            {editing ? <><Pencil className="w-4 h-4" /> Edit item</> : <><Plus className="w-4 h-4" /> New item</>}
          </h3>
          <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
          <Textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-2">
            <Button type="submit" variant="hero" className="flex-1">{editing ? 'Save changes' : 'Add to planner'}</Button>
            {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ title: '', date: new Date().toISOString().slice(0, 10), category: 'Study', notes: '' }); }}><X className="w-4 h-4" /></Button>}
          </div>
        </form>

        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold flex items-center gap-2"><CalendarDays className="w-5 h-5 text-primary" /> {view === 'day' ? 'Today' : view === 'week' ? 'This week' : 'This month'}</h3>
            <span className="text-sm text-muted-foreground">{filtered.length} items</span>
          </div>
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">Nothing scheduled. Add your first item!</p>
          ) : (
            <div className="space-y-2">
              {filtered.map(item => (
                <div key={item.id} className="p-4 rounded-xl border border-border bg-card hover:bg-accent/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{item.category}</span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                      <p className="font-medium">{item.title}</p>
                      {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(item)} className="p-1.5 hover:bg-muted rounded-md"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => { deletePlanner(item.id); refresh(); }} className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
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
