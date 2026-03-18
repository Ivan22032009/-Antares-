import db from '../config/database';
import { User, UserWithoutPassword } from '../types';
import { QueryError } from 'mysql2';

class UserModel {
  static getAllUsers(callback: (err: QueryError | null, results: User[] | null) => void): void {
    const query = 'SELECT * FROM users';
    db.query(query, (err, results: any) => {
      if (err) {
        console.error('❌ Database error in getAllUsers:', err);
        return callback(err, null);
      }
      callback(null, results as User[]);
    });
  }

  static createUser(
    username: string,
    email: string,
    password: string,
    callback: (err: QueryError | null, result: any) => void
  ): void {
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, result: any) => {
      if (err) {
        console.error('❌ Database error in createUser:', err);
        return callback(err, null);
      }
      callback(null, result);
    });
  }

  static getUserByEmail(
    email: string,
    callback: (err: QueryError | null, user: User | undefined) => void
  ): void {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results: any) => {
      if (err) {
        console.error('❌ Database error in getUserByEmail:', err);
        return callback(err, undefined);
      }
      callback(null, results?.[0] as User | undefined);
    });
  }

  static getUserByEmailOrUsername(
    identifier: string,
    callback: (err: QueryError | null, user: User | undefined) => void
  ): void {
    const query = 'SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1';
    db.query(query, [identifier, identifier], (err, results: any) => {
      if (err) {
        console.error('❌ Database error in getUserByEmailOrUsername:', err);
        return callback(err, undefined);
      }
      callback(null, results?.[0] as User | undefined);
    });
  }

  static getUserById(
    id: number,
    callback: (err: QueryError | null, user: UserWithoutPassword | undefined) => void
  ): void {
    const query = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
    db.query(query, [id], (err, results: any) => {
      if (err) {
        console.error('❌ Database error in getUserById:', err);
        return callback(err, undefined);
      }
      callback(null, results?.[0] as UserWithoutPassword | undefined);
    });
  }
}

export default UserModel;
