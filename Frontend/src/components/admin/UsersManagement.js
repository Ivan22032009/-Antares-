import React from 'react';
import { Link } from 'react-router-dom';

const UsersManagement = () => {
  return (
    <div>
      <div className="admin-card">
        <h3>Користувачі</h3>
        <p>Тут буде список користувачів. Можна додати нового користувача або переглянути існуючих.</p>
        <div style={{ marginTop: 12 }}>
          <Link to="/admin/users/create" className="quick-action-btn primary">Додати користувача</Link>
        </div>
      </div>

      <div className="admin-card">
        <h4>Примітка</h4>
        <p>Поточна реалізація дозволяє створювати користувачів через бекендний роут <code>/auth/register</code>. Якщо хочеш — я додам список користувачів (GET) і редагування/видалення (CRUD) на бекенді.</p>
      </div>
    </div>
  );
};

export default UsersManagement;
