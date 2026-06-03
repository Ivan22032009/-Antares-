import * as mysql from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();

const db: mysql.Connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.DB_NAME || 'admin_panel_db',
});

db.connect((err) => {
  if (err) {
    console.error('❌ Помилка при підключенні до MySQL:', err);
    process.exit(1);
  }
  console.log('✅ Підключено до MySQL');
});

export default db;
