import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wind, Brain, Gamepad2, Coffee, Trophy, Sparkles } from 'lucide-react';
import BreathingModal from '@/components/BreathingModal';
import { ComingSoonModal } from '@/components/Modals';

const QUIZ = [
  { q: 'How many hours of sleep do most students need each night?', a: ['5', '6', '7-9', '10+'], correct: 2 },
  { q: 'Which of these is a proven study technique?', a: ['Cramming all night', 'Pomodoro intervals', 'Studying with TV on', 'Skipping breaks'], correct: 1 },
  { q: 'A quick wellness reset usually involves…', a: ['Caffeine', 'Deep breathing', 'Scrolling social media', 'Skipping meals'], correct: 1 },
  { q: 'What helps reduce study stress most?', a: ['Avoiding the topic', 'Movement & breaks', 'All-nighters', 'Comparing yourself to others'], correct: 1 },
];

const COMING = [
  { key: 'memory', icon: Gamepad2, title: 'Mini Memory Game', desc: 'A short, calming card-matching game to refresh your focus between study sessions.' },
  { key: 'calm', icon: Coffee, title: 'Calm Breaks', desc: 'Guided 2-minute audio breaks with breathing, soundscapes, and gentle stretches.' },
  { key: 'focus', icon: Trophy, title: 'Focus Challenges', desc: 'Daily and weekly focus challenges with streaks, badges and gentle accountability.' },
];

export default function ResetZonePage() {
  const [breath, setBreath] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const active = COMING.find(c => c.key === modal);

  // Quiz state
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  const answer = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === QUIZ[qi].correct) setScore(s => s + 1);
    setTimeout(() => {
      setPicked(null);
      if (qi + 1 < QUIZ.length) setQi(qi + 1);
      else setDone(true);
    }, 800);
  };

  const restart = () => { setQi(0); setScore(0); setDone(false); setPicked(null); };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">Reset Zone</h1>
        <p className="text-muted-foreground">A calm corner to breathe, play and reset between study sessions.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl gradient-aura text-white flex items-center justify-center"><Wind className="w-6 h-6" /></div>
            <div>
              <h3 className="font-display font-semibold text-lg">Breathing Reset</h3>
              <p className="text-sm text-muted-foreground">A 4 - 4 - 6 box-breathing exercise.</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Slow your nervous system in under 2 minutes. Great between focus sessions or before exams.</p>
          <Button variant="hero" onClick={() => setBreath(true)}><Wind className="w-4 h-4 mr-1" /> Start breathing</Button>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl gradient-aura text-white flex items-center justify-center"><Brain className="w-6 h-6" /></div>
            <div>
              <h3 className="font-display font-semibold text-lg">Daily Brain Quiz</h3>
              <p className="text-sm text-muted-foreground">A quick wellness & study trivia.</p>
            </div>
          </div>
          {!done ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Question {qi + 1} of {QUIZ.length}</p>
              <p className="font-medium mb-4">{QUIZ[qi].q}</p>
              <div className="grid grid-cols-1 gap-2">
                {QUIZ[qi].a.map((opt, i) => {
                  const isCorrect = picked !== null && i === QUIZ[qi].correct;
                  const isWrong = picked === i && i !== QUIZ[qi].correct;
                  return (
                    <button
                      key={i}
                      onClick={() => answer(i)}
                      className={`text-left px-4 py-2.5 rounded-xl border transition-colors ${
                        isCorrect ? 'border-primary bg-primary/10' :
                        isWrong ? 'border-destructive bg-destructive/10' :
                        'border-border hover:bg-accent/50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="font-display text-2xl font-bold mb-1">{score} / {QUIZ.length}</p>
              <p className="text-sm text-muted-foreground mb-4">Nice work — you've got the wellness mindset!</p>
              <Button variant="hero" onClick={restart}>Play again</Button>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold mb-3">Coming soon</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {COMING.map(c => (
            <button key={c.key} onClick={() => setModal(c.key)} className="card-elevated p-5 text-left hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-xl gradient-aura text-white flex items-center justify-center mb-3">
                <c.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-semibold mb-1">{c.title}</h3>
              <p className="text-sm text-muted-foreground">Learn more →</p>
            </button>
          ))}
        </div>
      </div>

      <BreathingModal open={breath} onOpenChange={setBreath} />
      <ComingSoonModal
        open={!!modal}
        onOpenChange={v => !v && setModal(null)}
        title={active?.title || ''}
        description={active?.desc || ''}
        icon={active ? <active.icon className="w-6 h-6" /> : undefined}
      />
    </div>
  );
}
