import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser, upgradeToPremium, User } from "@/lib/auth";
import { getTasks, addTask, toggleTask, deleteTask, logMood, getMoodLog, getSleep, getFocusMinutes, addFocusMinutes, Task } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { UpgradeModal } from "@/components/Modals";
import BreathingModal from "@/components/BreathingModal";
import {
  Plus, Trash2, CheckCircle2, Circle, Play, Pause, RotateCcw,
  Droplets, Sparkles, Brain, Timer, BookOpen, Crown, Smile, Meh, Frown, AlertTriangle, Coffee, Moon, Wind, GraduationCap
} from "lucide-react";

const wellnessAlerts = [
  { icon: "💧", message: "Time to drink some water! Stay hydrated." },
  { icon: "🧘", message: "Stand up and stretch for 2 minutes." },
  { icon: "👁️", message: "Look away from your screen — rest your eyes for 20 seconds." },
  { icon: "🚶", message: "Take a 5-minute walk to refresh your mind." },
  { icon: "🫁", message: "Take 3 deep breaths. Inhale… hold… exhale…" },
];

const motivationalQuotes = [
  "You're doing great — one step at a time! 🌟",
  "Take a deep breath. You've got this. 💪",
  "Progress, not perfection. Keep going! 🚀",
  "Your mental health matters more than any grade. 💙",
  "Small steps lead to big achievements. 🌱",
  "Rest is productive. Recharging is working smart. 🔋",
];

const moods = [
  { value: "great", label: "Great", icon: Smile, suggestion: "Love that energy! Channel it into a focused study block." },
  { value: "okay", label: "Okay", icon: Meh, suggestion: "A short walk or 5 min of stretching can lift your mood." },
  { value: "stressed", label: "Stressed", icon: AlertTriangle, suggestion: "Try the breathing reset. You've got this." },
  { value: "tired", label: "Tired", icon: Frown, suggestion: "Consider a 20-minute nap or going to sleep earlier tonight." },
];

export default function DashboardPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'done'>('all');
  const [now, setNow] = useState(new Date());
  const [mode, setMode] = useState<'study' | 'chill'>('study');

  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState("");
  const [taskDue, setTaskDue] = useState("");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");

  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [focusMin, setFocusMin] = useState(getFocusMinutes());

  const [currentAlert, setCurrentAlert] = useState<typeof wellnessAlerts[0] | null>(null);
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const wellnessRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [breathOpen, setBreathOpen] = useState(false);
  const [moodMsg, setMoodMsg] = useState<string | null>(null);

  useEffect(() => {
    setTasks(getTasks());
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      addFocusMinutes(timerMinutes);
      setFocusMin(getFocusMinutes());
      toast({ title: "⏰ Session Complete!", description: "Great work! Time for a break." });
      triggerWellnessAlert();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning, timeLeft]);

  useEffect(() => {
    if (timerRunning) {
      wellnessRef.current = setInterval(() => triggerWellnessAlert(), 20 * 60 * 1000);
    }
    return () => { if (wellnessRef.current) clearInterval(wellnessRef.current); };
  }, [timerRunning]);

  const triggerWellnessAlert = useCallback(() => {
    const alert = wellnessAlerts[Math.floor(Math.random() * wellnessAlerts.length)];
    setCurrentAlert(alert);
    toast({ title: `${alert.icon} Wellness Reminder`, description: alert.message });
  }, [toast]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({ title: taskTitle, subject: taskSubject, dueDate: taskDue, priority: taskPriority });
    setTasks(getTasks());
    setTaskTitle(""); setTaskSubject(""); setTaskDue(""); setTaskPriority("medium");
    toast({ title: "Task added", description: taskTitle });
  };

  const handleToggle = (id: string) => { toggleTask(id); setTasks(getTasks()); };
  const handleDelete = (id: string) => { deleteTask(id); setTasks(getTasks()); };

  const resetTimer = () => { setTimerRunning(false); setTimeLeft(timerMinutes * 60); };
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleLogMood = (m: typeof moods[0]) => {
    logMood(m.value);
    setMoodMsg(m.suggestion);
    toast({ title: "Mood logged", description: `Feeling ${m.label.toLowerCase()} — that's okay! 💜` });
  };

  const generateQuote = () => setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  if (!user) return null;

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const isPremium = user.isPremium;
  const sleepLogs = getSleep();
  const lastSleep = sleepLogs.length ? sleepLogs[sleepLogs.length - 1].hours : null;
  const moodHistory = getMoodLog();
  const lastMood = moodHistory.length ? moodHistory[moodHistory.length - 1].mood : '—';
  const filteredTasks = tasks.filter(t => filter === 'all' ? true : filter === 'open' ? !t.completed : t.completed);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}</span> 👋
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {user.university || 'Demo University'}</span>
            <span>{now.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })} · {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="flex items-center gap-1">
              {isPremium ? <><Crown className="w-3.5 h-3.5 text-primary" /> Premium</> : 'Free plan'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={mode === 'study' ? 'hero' : 'outline'} size="sm" onClick={() => setMode('study')}>
            <BookOpen className="w-4 h-4 mr-1" /> Study mode
          </Button>
          <Button variant={mode === 'chill' ? 'hero' : 'outline'} size="sm" onClick={() => setMode('chill')}>
            <Coffee className="w-4 h-4 mr-1" /> Chill mode
          </Button>
        </div>
      </div>

      {/* Stat overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Pending tasks', value: pendingTasks, icon: BookOpen },
          { label: 'Completed', value: completedTasks, icon: CheckCircle2 },
          { label: 'Focus min', value: focusMin, icon: Timer },
          { label: 'Last mood', value: lastMood, icon: Smile },
          { label: 'Last sleep', value: lastSleep ? `${lastSleep}h` : '—', icon: Moon },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="font-display text-2xl font-bold text-foreground capitalize">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Sponsored offer (free users) */}
      {!isPremium && (
        <div className="card-elevated p-4 flex items-center justify-between gap-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary"><Sparkles className="w-5 h-5" /></div>
            <div>
              <p className="text-sm font-semibold">Sponsored: 20% off student stationery this week</p>
              <p className="text-xs text-muted-foreground">Sample student offer — upgrade to Premium to remove ads.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setUpgradeOpen(true)}>Remove ads</Button>
        </div>
      )}

      {/* Wellness alert popup */}
      {currentAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm p-4" onClick={() => setCurrentAlert(null)}>
          <div className="card-elevated p-8 max-w-sm text-center animate-fade-up">
            <div className="text-5xl mb-3">{currentAlert.icon}</div>
            <h3 className="font-display text-xl font-bold mb-2">Wellness Reminder</h3>
            <p className="text-muted-foreground mb-4">{currentAlert.message}</p>
            <Button variant="hero" onClick={() => setCurrentAlert(null)}>Got it</Button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> Add a task</h3>
            <form onSubmit={handleAddTask} className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Task title" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} required />
              <Input placeholder="Subject (optional)" value={taskSubject} onChange={e => setTaskSubject(e.target.value)} />
              <Input type="date" value={taskDue} onChange={e => setTaskDue(e.target.value)} />
              <Select value={taskPriority} onValueChange={v => setTaskPriority(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low priority</SelectItem>
                  <SelectItem value="medium">Medium priority</SelectItem>
                  <SelectItem value="high">High priority</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="hero" className="sm:col-span-2"><Plus className="w-4 h-4 mr-1" /> Add task</Button>
            </form>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="font-display font-semibold">Your tasks ({tasks.length})</h3>
              <div className="flex gap-1">
                {(['all', 'open', 'done'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${filter === f ? 'gradient-aura text-white' : 'bg-muted text-muted-foreground'}`}>{f}</button>
                ))}
              </div>
            </div>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No tasks here. Add one above to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTasks.sort((a, b) => {
                  if (a.completed !== b.completed) return a.completed ? 1 : -1;
                  const prio = { high: 0, medium: 1, low: 2 };
                  return prio[a.priority] - prio[b.priority];
                }).map(task => (
                  <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border border-border transition-all ${task.completed ? "opacity-60 bg-muted/30" : "bg-card hover:bg-accent/30"}`}>
                    <button onClick={() => handleToggle(task.id)} className="shrink-0">
                      {task.completed ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {task.subject && <span className="text-xs text-muted-foreground">{task.subject}</span>}
                        {task.dueDate && <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>}
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      task.priority === "high" ? "bg-destructive/10 text-destructive" :
                      task.priority === "medium" ? "bg-wellness-orange/10 text-wellness-orange" :
                      "bg-secondary text-secondary-foreground"
                    }`}>{task.priority}</span>
                    <button onClick={() => handleDelete(task.id)} className="shrink-0 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Timer & wellness */}
        <div className="space-y-6">
          <div className="glass-card p-6 text-center">
            <h3 className="font-display font-semibold mb-4 flex items-center justify-center gap-2"><Timer className="w-5 h-5 text-primary" /> Focus Timer</h3>
            <div className="font-display text-5xl font-bold tabular-nums mb-6">{formatTime(timeLeft)}</div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button variant={timerRunning ? "outline" : "hero"} size="sm" onClick={() => setTimerRunning(!timerRunning)}>
                {timerRunning ? <><Pause className="w-4 h-4 mr-1" /> Pause</> : <><Play className="w-4 h-4 mr-1" /> Start</>}
              </Button>
              <Button variant="outline" size="sm" onClick={resetTimer}><RotateCcw className="w-4 h-4 mr-1" /> Reset</Button>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              {[15, 25, 45, 60].map(m => (
                <button key={m} onClick={() => { setTimerMinutes(m); setTimeLeft(m * 60); setTimerRunning(false); }}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${timerMinutes === m ? "gradient-aura text-white" : "bg-muted text-muted-foreground"}`}>
                  {m}m
                </button>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="mt-4 text-xs" onClick={triggerWellnessAlert}>
              <Droplets className="w-3 h-3 mr-1" /> Trigger wellness check
            </Button>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-primary" /> Mental Wellness</h3>
            <p className="text-sm text-muted-foreground mb-3">How are you feeling?</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {moods.map(m => (
                <button key={m.value} onClick={() => handleLogMood(m)}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl border border-border hover:bg-accent/50 transition-colors">
                  <m.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs text-muted-foreground">{m.label}</span>
                </button>
              ))}
            </div>
            {moodMsg && <div className="bg-accent/50 rounded-xl p-3 text-sm text-foreground mb-4">{moodMsg}</div>}
            <div className="bg-accent/50 rounded-xl p-4 mb-3">
              <p className="text-sm text-foreground italic">"{quote}"</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={generateQuote}>
                <Sparkles className="w-4 h-4 mr-1" /> New quote
              </Button>
              <Button variant="hero" size="sm" onClick={() => setBreathOpen(true)}>
                <Wind className="w-4 h-4 mr-1" /> Breathe
              </Button>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display font-semibold mb-4 flex items-center gap-2"><Droplets className="w-5 h-5 text-primary" /> Wellness reminders</h3>
            <div className="space-y-2">
              {wellnessAlerts.slice(0, 4).map((a, i) => (
                <div key={i} className="flex items-center gap-3 bg-accent/30 rounded-lg px-3 py-2 text-sm">
                  <span>{a.icon}</span>
                  <span className="text-xs">{a.message}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Reminders trigger every 20 minutes during focus sessions.</p>
          </div>

          {!isPremium && (
            <div className="card-elevated p-6 border-2 border-primary">
              <h3 className="font-display font-semibold mb-2 flex items-center gap-2"><Crown className="w-5 h-5 text-primary" /> Go Premium</h3>
              <p className="text-sm text-muted-foreground mb-4">Remove ads and unlock advanced wellness features.</p>
              <div className="space-y-2">
                <Button variant="hero" size="sm" className="w-full" onClick={() => setUpgradeOpen(true)}>
                  Learn more
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={() => {
                  upgradeToPremium();
                  setUser({ ...user, isPremium: true });
                  toast({ title: "🎉 Welcome to Premium!", description: "Enjoy your ad-free experience." });
                }}>
                  Preview Premium (free)
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <BreathingModal open={breathOpen} onOpenChange={setBreathOpen} />
    </div>
  );
}
