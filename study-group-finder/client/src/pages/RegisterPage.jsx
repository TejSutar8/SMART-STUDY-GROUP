import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', subjectId: '', skillLevel: 'Beginner', availabilityTime: 'Morning' });
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/subjects').then((res) => setSubjects(res.data)).catch(() => setSubjects([]));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        college: form.college,
        subjects: form.subjectId
          ? [{ subjectId: Number(form.subjectId), skillLevel: form.skillLevel, availabilityTime: form.availabilityTime }]
          : []
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="w-full border p-2 rounded" placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <input className="w-full border p-2 rounded" placeholder="College" onChange={(e) => setForm({ ...form, college: e.target.value })} />
        <select className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
          <option value="">Select Subject</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
        </select>
        <select className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <select className="w-full border p-2 rounded" onChange={(e) => setForm({ ...form, availabilityTime: e.target.value })}>
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Evening</option>
        </select>
        <button className="w-full bg-indigo-600 text-white p-2 rounded">Create account</button>
      </form>
    </div>
  );
}
