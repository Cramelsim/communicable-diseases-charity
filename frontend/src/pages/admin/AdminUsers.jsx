import CrudManager from '../../components/CrudManager';
import { users } from '../../features/admin/usersSlice';

const fields = [
  { name: 'username', label: 'Username', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Password (leave blank to keep)', type: 'password', required: true },
  { name: 'role', label: 'Role', options: ['user', 'admin'] },
];

export default function AdminUsers() {
  return (
    <CrudManager
      title="Manage users"
      noun="user"
      selector={(s) => s.users}
      thunks={users}
      fields={fields}
      empty={{ role: 'user' }}
      columns={(u) => (
        <>
          <strong>{u.username}</strong> ({u.email}) <span className="badge">{u.role}</span>
        </>
      )}
    />
  );
}
