import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import api from '../../services/api';
import { SkeletonGrid } from '../../components/common/Skeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const ROLE_STYLE = {
  admin: 'bg-brand-800 text-white dark:bg-white/10',
  provider: 'bg-jade-500/15 text-jade-700 dark:text-jade-300',
  traveler: 'bg-saffron-500/15 text-saffron-700 dark:text-saffron-300',
};

export default function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data.data)).catch(() => setError(true));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Users</h1>
      <p className="mt-1 text-sm text-brand-900/60 dark:text-stone-50/60">All registered accounts on the platform.</p>

      <div className="mt-6">
        {error && <ErrorState message="Couldn't load users." />}
        {!error && !users && <SkeletonGrid count={4} />}
        {!error && users && users.length === 0 && <EmptyState icon={Users} title="No users yet" />}
        {!error && users && users.length > 0 && (
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/5 text-xs uppercase tracking-wide text-brand-900/40 dark:border-white/10 dark:text-stone-50/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-black/5 last:border-0 dark:border-white/5">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-brand-900/70 dark:text-stone-50/70">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${ROLE_STYLE[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-brand-900/50 dark:text-stone-50/50">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
