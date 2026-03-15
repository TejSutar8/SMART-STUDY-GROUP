import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import socket from '../services/socket';

export default function ChatPage() {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const loadMessages = async () => {
    const { data } = await api.get(`/api/messages/${groupId}`);
    setMessages(data);
  };

  useEffect(() => {
    loadMessages();
    socket.emit('join_group_room', groupId);
    const listener = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on('new_message', listener);

    return () => {
      socket.emit('leave_group_room', groupId);
      socket.off('new_message', listener);
    };
  }, [groupId]);

  const send = async (e) => {
    e.preventDefault();
    await api.post('/api/messages', { groupId: Number(groupId), message });
    setMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">Group Chat</h2>
      <div className="h-96 overflow-y-auto border rounded p-3 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="bg-slate-100 p-2 rounded">
            <p className="text-sm font-semibold">{m.user.name}</p>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="flex gap-2 mt-3">
        <input className="border flex-1 p-2 rounded" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type message" required />
        <button className="bg-indigo-600 text-white px-4 rounded">Send</button>
      </form>
    </div>
  );
}
