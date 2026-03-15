import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function DashboardPage() {
  const [data, setData] = useState({ allGroups: [], recommendedGroups: [], joinedGroups: [] });
  const [subjects, setSubjects] = useState([]);
  const [groupForm, setGroupForm] = useState({ groupName: '', subjectId: '', scheduleTime: 'Morning' });

  const load = async () => {
    const [groupsRes, subRes] = await Promise.all([api.get('/api/groups'), api.get('/api/subjects')]);
    setData(groupsRes.data);
    setSubjects(subRes.data);
  };

  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  const createGroup = async (e) => {
    e.preventDefault();
    await api.post('/api/groups/create', { ...groupForm, subjectId: Number(groupForm.subjectId) });
    setGroupForm({ groupName: '', subjectId: '', scheduleTime: 'Morning' });
    load();
  };

  const joinGroup = async (groupId) => {
    await api.post('/api/groups/join', { groupId });
    load();
  };

  const leaveGroup = async (groupId) => {
    await api.post('/api/groups/leave', { groupId });
    load();
  };

  return (
    <div className="p-6 space-y-8">
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Create Study Group</h2>
        <form onSubmit={createGroup} className="grid md:grid-cols-4 gap-3">
          <input className="border p-2 rounded" value={groupForm.groupName} placeholder="Group Name" onChange={(e) => setGroupForm({ ...groupForm, groupName: e.target.value })} required />
          <select className="border p-2 rounded" value={groupForm.subjectId} onChange={(e) => setGroupForm({ ...groupForm, subjectId: e.target.value })} required>
            <option value="">Select Subject</option>
            {subjects.map((s) => <option key={s.id} value={s.id}>{s.subjectName}</option>)}
          </select>
          <select className="border p-2 rounded" value={groupForm.scheduleTime} onChange={(e) => setGroupForm({ ...groupForm, scheduleTime: e.target.value })}>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
          <button className="bg-indigo-600 text-white rounded px-4">Create</button>
        </form>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <GroupColumn title="Suggested Study Groups" groups={data.recommendedGroups} actionLabel="Join" onAction={joinGroup} />
        <GroupColumn title="Joined Groups" groups={data.joinedGroups} actionLabel="Leave" onAction={leaveGroup} chatLink />
        <GroupColumn title="All Groups" groups={data.allGroups} actionLabel="Join" onAction={joinGroup} />
      </section>
    </div>
  );
}

function GroupColumn({ title, groups, actionLabel, onAction, chatLink = false }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <div className="space-y-3">
        {groups.map((group) => (
          <div key={group.id} className="border rounded p-3 space-y-1">
            <p className="font-medium">{group.groupName}</p>
            <p className="text-sm text-gray-500">{group.subject.subjectName} • {group.scheduleTime}</p>
            <div className="flex gap-2">
              <button onClick={() => onAction(group.id)} className="bg-indigo-600 text-white text-sm px-3 py-1 rounded">{actionLabel}</button>
              {chatLink && <Link to={`/chat/${group.id}`} className="border text-sm px-3 py-1 rounded">Open Chat</Link>}
            </div>
          </div>
        ))}
        {!groups.length && <p className="text-gray-500 text-sm">No groups yet.</p>}
      </div>
    </div>
  );
}
