import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getJournal, addJournal, deleteJournal, updateJournal, JournalEntry } from '@/lib/store';
import { Plus, Trash2, BookHeart, Pencil, X, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PROMPTS = [
  'What is on your mind today?',
  'What is stressing you right now?',
  'What is one thing you handled well today?',
  'What are you grateful for?',
  'What would make tomorrow feel lighter?',
];

export default function JournalPage() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>(getJournal());
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });

  const refresh = () => setEntries(getJournal());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    if (editing) {
      updateJournal(editing.id, form);
      toast({ title: 'Entry updated' });
      setEditing(null);
    } else {
      addJournal(form);
      toast({ title: 'Entry saved 💜' });
    }
    setForm({ title: '', content: '' });
    refresh();
  };

  const usePrompt = (p: string) => setForm(f => ({ ...f, title: f.title || p, content: f.content ? f.content + '\n\n' + p + '\n' : p + '\n' }));

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Brain Dump Journal</h1>
        <p className="text-muted-foreground">A private space to clear your mind. Saved only on this device.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={submit} className="glass-card p-6 space-y-3 lg:col-span-2">
          <h3 className="font-display font-semibold flex items-center gap-2">
            {editing ? <><Pencil className="w-4 h-4" /> Edit entry</> : <><Plus className="w-4 h-4" /> New entry</>}
          </h3>
          <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Textarea placeholder="Write whatever is on your mind…" rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required />
          <div className="flex gap-2">
            <Button type="submit" variant="hero" className="flex-1">{editing ? 'Save changes' : 'Save entry'}</Button>
            {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({ title: '', content: '' }); }}><X className="w-4 h-4" /></Button>}
          </div>
        </form>

        <div className="glass-card p-6 h-fit">
          <h3 className="font-display font-semibold flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-primary" /> Prompts</h3>
          <div className="space-y-2">
            {PROMPTS.map(p => (
              <button key={p} onClick={() => usePrompt(p)} className="w-full text-left text-sm px-3 py-2 rounded-xl bg-accent/40 hover:bg-accent transition-colors">
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-display font-semibold flex items-center gap-2 mb-4"><BookHeart className="w-5 h-5 text-primary" /> Past entries ({entries.length})</h3>
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No entries yet. Write your first thought above.</p>
        ) : (
          <div className="space-y-3">
            {entries.map(entry => (
              <div key={entry.id} className="p-4 rounded-xl border border-border bg-card">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-medium">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditing(entry); setForm({ title: entry.title, content: entry.content }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-1.5 hover:bg-muted rounded-md"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => { deleteJournal(entry.id); refresh(); }} className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
