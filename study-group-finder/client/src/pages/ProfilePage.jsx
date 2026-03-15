import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/api/users/profile').then((res) => setProfile(res.data));
  }, []);

  if (!profile) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="p-6">
      <div className="bg-white max-w-2xl p-6 rounded shadow space-y-2">
        <h2 className="text-2xl font-semibold">{profile.name}</h2>
        <p>{profile.email}</p>
        <p>{profile.college}</p>
        <h3 className="font-semibold mt-4">Subjects & Availability</h3>
        <ul className="list-disc pl-5">
          {profile.userSubjects.map((s) => (
            <li key={s.id}>{s.subject.subjectName} - {s.skillLevel} - {s.availabilityTime}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
