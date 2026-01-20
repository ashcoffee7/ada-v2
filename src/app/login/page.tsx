'use client';
import { useState, useEffect } from 'react';
import InputField from '@/components/input-field';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [availableInsurances, setAvailableInsurances] = useState<string[]>([]);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    username: '', // Added for SQL trigger
    fullName: '', 
    address: '', 
    insurance: '' 
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (mode === 'signup') {
      fetch('/api/ada/all-insurances')
        .then((res) => res.json())
        .then((data) => setAvailableInsurances(data.map((i: any) => i.insurance_name)))
        .catch((err) => console.error("Error fetching insurances:", err));
    }
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: '', message: '' });

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', message: mode === 'login' ? 'Welcome back!' : 'Account created! Please check your email for a confirmation link.' });
        setFormData({
            email: '',
            password: '',
            username: '',
            fullName: '',
            address: '',
            insurance: ''
        });
        if (mode === 'signup') {
            router.push('/login');
        }
        if (mode === 'login') {
            router.push('/');
        }
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Connection error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

 return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl p-10 border border-stone-100">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Email" type="email" value={formData.email} onChange={(v) => setFormData({...formData, email: v})} />
          <InputField label="Password" type="password" value={formData.password} onChange={(v) => setFormData({...formData, password: v})} />

          {mode === 'signup' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">

              <InputField label="Username" type="text" value={formData.username} onChange={(v) => setFormData({...formData, username: v})} />
              
              <InputField label="Full Name" type="text" value={formData.fullName} onChange={(v) => setFormData({...formData, fullName: v})} />
              <InputField label="Address" type="text" value={formData.address} onChange={(v) => setFormData({...formData, address: v})} />
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-1">Insurance Provider</label>
                <div className="relative">
                  <select 
                    className="w-full p-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-[#3d9194] outline-none transition-all appearance-none text-gray-700 cursor-pointer"
                    value={formData.insurance}
                    onChange={(e) => setFormData({...formData, insurance: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select your insurance...</option>
                    {availableInsurances.map((ins) => (
                      <option key={ins} value={ins}>{ins}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full bg-[#3d9194] text-white py-4 rounded-2xl font-bold shadow-lg mt-4 disabled:opacity-50 hover:brightness-105 active:scale-[0.98] transition-all">
            {isLoading ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {status.message && (
          <div className={`mt-6 p-4 rounded-2xl text-center text-sm font-medium ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.message}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setStatus({ type: '', message: '' }); 
            }}
            className="text-[#3d9194] font-bold text-sm hover:underline mt-1"
          >
            {mode === 'login' ? 'Create an account' : 'Login instead'}
          </button>
        </div>
      </div>
    </main>
  );
}