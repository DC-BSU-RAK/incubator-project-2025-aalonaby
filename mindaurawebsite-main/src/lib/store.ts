import { getCurrentUser } from './auth';

export interface Task {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface PlannerItem {
  id: string;
  title: string;
  date: string;
  category: string;
  notes: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface SleepLog {
  id: string;
  date: string;
  hours: number;
  createdAt: string;
}

function userKey(key: string): string {
  const user = getCurrentUser();
  return user ? `mindaura_${user.id}_${key}` : `mindaura_guest_${key}`;
}

function read<T>(key: string): T[] {
  const data = localStorage.getItem(userKey(key));
  return data ? JSON.parse(data) : [];
}
function write<T>(key: string, value: T[]) {
  localStorage.setItem(userKey(key), JSON.stringify(value));
}

// Tasks
export const getTasks = () => read<Task>('tasks');
export const saveTasks = (t: Task[]) => write('tasks', t);
export function addTask(task: Omit<Task, 'id' | 'completed' | 'createdAt'>) {
  const newTask: Task = { ...task, id: crypto.randomUUID(), completed: false, createdAt: new Date().toISOString() };
  const tasks = getTasks(); tasks.push(newTask); saveTasks(tasks); return newTask;
}
export const toggleTask = (id: string) => saveTasks(getTasks().map(t => t.id === id ? { ...t, completed: !t.completed } : t));
export const deleteTask = (id: string) => saveTasks(getTasks().filter(t => t.id !== id));
export function updateTask(id: string, updates: Partial<Task>) {
  saveTasks(getTasks().map(t => t.id === id ? { ...t, ...updates } : t));
}

// Mood
export const getMoodLog = (): { mood: string; timestamp: string }[] => {
  const data = localStorage.getItem(userKey('moods')); return data ? JSON.parse(data) : [];
};
export function logMood(mood: string) {
  const moods = getMoodLog(); moods.push({ mood, timestamp: new Date().toISOString() });
  localStorage.setItem(userKey('moods'), JSON.stringify(moods));
}

// Planner
export const getPlanner = () => read<PlannerItem>('planner');
export function addPlanner(item: Omit<PlannerItem, 'id' | 'createdAt'>) {
  const list = getPlanner();
  const ni: PlannerItem = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  list.push(ni); write('planner', list); return ni;
}
export const updatePlanner = (id: string, updates: Partial<PlannerItem>) =>
  write('planner', getPlanner().map(p => p.id === id ? { ...p, ...updates } : p));
export const deletePlanner = (id: string) => write('planner', getPlanner().filter(p => p.id !== id));

// Journal
export const getJournal = () => read<JournalEntry>('journal');
export function addJournal(entry: Omit<JournalEntry, 'id' | 'createdAt'>) {
  const list = getJournal();
  const ne: JournalEntry = { ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  list.unshift(ne); write('journal', list); return ne;
}
export const updateJournal = (id: string, updates: Partial<JournalEntry>) =>
  write('journal', getJournal().map(j => j.id === id ? { ...j, ...updates } : j));
export const deleteJournal = (id: string) => write('journal', getJournal().filter(j => j.id !== id));

// Sleep
export const getSleep = () => read<SleepLog>('sleep');
export function addSleep(date: string, hours: number) {
  const list = getSleep();
  const ns: SleepLog = { id: crypto.randomUUID(), date, hours, createdAt: new Date().toISOString() };
  list.push(ns); write('sleep', list); return ns;
}
export const deleteSleep = (id: string) => write('sleep', getSleep().filter(s => s.id !== id));
export function getFocusMinutes(): number {
  return Number(localStorage.getItem(userKey('focusMinutes')) || '0');
}
export function addFocusMinutes(mins: number) {
  localStorage.setItem(userKey('focusMinutes'), String(getFocusMinutes() + mins));
}
