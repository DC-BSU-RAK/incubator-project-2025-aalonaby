export interface User {
  id: string;
  email: string;
  name: string;
  isPremium: boolean;
  university?: string;
  theme?: 'aura-light' | 'midnight' | 'nature';
  createdAt: string;
}

const USERS_KEY = 'mindaura_users';
const SESSION_KEY = 'mindaura_session';
const PASSWORDS_KEY = 'mindaura_passwords';

// Backward-compat: migrate old StudyWell keys if present
(function migrate() {
  try {
    if (!localStorage.getItem(USERS_KEY) && localStorage.getItem('studywell_users')) {
      localStorage.setItem(USERS_KEY, localStorage.getItem('studywell_users')!);
    }
    if (!localStorage.getItem(SESSION_KEY) && localStorage.getItem('studywell_session')) {
      localStorage.setItem(SESSION_KEY, localStorage.getItem('studywell_session')!);
    }
    if (!localStorage.getItem(PASSWORDS_KEY) && localStorage.getItem('studywell_passwords')) {
      localStorage.setItem(PASSWORDS_KEY, localStorage.getItem('studywell_passwords')!);
    }
  } catch {}
})();

function getUsers(): User[] {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}
function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signup(name: string, email: string, password: string, university?: string) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false as const, error: 'An account with this email already exists.' };
  }
  const user: User = {
    id: crypto.randomUUID(),
    email, name,
    isPremium: false,
    university: university || 'Demo University',
    theme: 'aura-light',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}');
  passwords[email] = password;
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { success: true as const, user };
}

export function login(email: string, password: string) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return { success: false as const, error: 'No account found with this email.' };
  const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}');
  if (passwords[email] !== password) return { success: false as const, error: 'Incorrect password.' };
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { success: true as const, user };
}

export function loginAsDemo() {
  const users = getUsers();
  let demo = users.find(u => u.email === 'demo@mindaura.app');
  if (!demo) {
    demo = {
      id: 'demo-user',
      email: 'demo@mindaura.app',
      name: 'Demo Student',
      isPremium: false,
      university: 'Demo University',
      theme: 'aura-light',
      createdAt: new Date().toISOString(),
    };
    users.push(demo);
    saveUsers(users);
    const passwords = JSON.parse(localStorage.getItem(PASSWORDS_KEY) || '{}');
    passwords['demo@mindaura.app'] = 'demo1234';
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(passwords));
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(demo));
  // Seed sample data
  seedDemoData(demo.id);
  return demo;
}

function seedDemoData(userId: string) {
  const k = (key: string) => `mindaura_${userId}_${key}`;
  if (!localStorage.getItem(k('tasks'))) {
    localStorage.setItem(k('tasks'), JSON.stringify([
      { id: '1', title: 'Finish marketing essay', subject: 'Marketing 201', dueDate: new Date(Date.now()+86400000).toISOString().slice(0,10), completed: false, priority: 'high', createdAt: new Date().toISOString() },
      { id: '2', title: 'Review chapter 4', subject: 'Statistics', dueDate: new Date(Date.now()+2*86400000).toISOString().slice(0,10), completed: false, priority: 'medium', createdAt: new Date().toISOString() },
      { id: '3', title: 'Group project meeting prep', subject: 'Management', dueDate: new Date().toISOString().slice(0,10), completed: true, priority: 'low', createdAt: new Date().toISOString() },
    ]));
  }
  if (!localStorage.getItem(k('moods'))) {
    localStorage.setItem(k('moods'), JSON.stringify([
      { mood: 'okay', timestamp: new Date(Date.now()-86400000).toISOString() },
      { mood: 'great', timestamp: new Date().toISOString() },
    ]));
  }
  if (!localStorage.getItem(k('planner'))) {
    localStorage.setItem(k('planner'), JSON.stringify([
      { id: 'p1', title: 'Lecture: Intro to AI', date: new Date().toISOString().slice(0,10), category: 'Class', notes: 'Room 204', createdAt: new Date().toISOString() },
      { id: 'p2', title: 'Library study session', date: new Date(Date.now()+86400000).toISOString().slice(0,10), category: 'Study', notes: '2 hours focused', createdAt: new Date().toISOString() },
    ]));
  }
  if (!localStorage.getItem(k('journal'))) {
    localStorage.setItem(k('journal'), JSON.stringify([
      { id: 'j1', title: 'A productive day', content: 'Managed to finish my essay early today and went for a walk. Feeling balanced.', createdAt: new Date().toISOString() },
    ]));
  }
  if (!localStorage.getItem(k('sleep'))) {
    localStorage.setItem(k('sleep'), JSON.stringify([
      { id: 's1', date: new Date(Date.now()-2*86400000).toISOString().slice(0,10), hours: 7, createdAt: new Date().toISOString() },
      { id: 's2', date: new Date(Date.now()-86400000).toISOString().slice(0,10), hours: 6.5, createdAt: new Date().toISOString() },
      { id: 's3', date: new Date().toISOString().slice(0,10), hours: 8, createdAt: new Date().toISOString() },
    ]));
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function updateUser(updates: Partial<User>) {
  const user = getCurrentUser();
  if (!user) return null;
  const updated = { ...user, ...updates };
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  const users = getUsers().map(u => u.id === updated.id ? updated : u);
  saveUsers(users);
  return updated;
}

export function upgradeToPremium() {
  return updateUser({ isPremium: true });
}

export const UAE_UNIVERSITIES = [
  'Ajman University',
  'American University of Sharjah',
  'University of Sharjah',
  'Zayed University',
  'United Arab Emirates University',
  'Khalifa University',
  'Demo University',
];
