
import React, { useState, useEffect } from 'react';
import { UserAccount, UserStatus } from '../types';
import { ShieldAlert, UserCheck, UserX, Trash2, Key, Mail, Clock, ShieldCheck, Search } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = () => {
    const data = JSON.parse(localStorage.getItem('jci_db_users') || '[]');
    setUsers(data);
  };

  useEffect(() => { loadUsers(); }, []);

  const updateUserStatus = (username: string, status: UserStatus) => {
    const updated = users.map(u => u.username === username ? { ...u, status } : u);
    localStorage.setItem('jci_db_users', JSON.stringify(updated));
    setUsers(updated);
  };

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Gestão de Operadores</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.map(user => (
          <div key={user.username} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${user.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                  {user.status === 'APPROVED' ? <ShieldCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">{user.username}</h3>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{user.status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {user.status === 'PENDING' && (
                  <button onClick={() => updateUserStatus(user.username, 'APPROVED')} className="p-2 bg-emerald-500 text-slate-950 rounded-lg"><UserCheck className="w-4 h-4" /></button>
                )}
                {user.status === 'APPROVED' ? (
                  <button onClick={() => updateUserStatus(user.username, 'BLOCKED')} className="p-2 bg-rose-500/20 text-rose-500 rounded-lg"><UserX className="w-4 h-4" /></button>
                ) : (
                  <button onClick={() => updateUserStatus(user.username, 'APPROVED')} className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg"><UserCheck className="w-4 h-4" /></button>
                )}
                <button onClick={() => {if(confirm('Excluir?')) { const up = users.filter(u => u.username !== user.username); localStorage.setItem('jci_db_users', JSON.stringify(up)); setUsers(up); }}} className="p-2 bg-slate-800 text-slate-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
