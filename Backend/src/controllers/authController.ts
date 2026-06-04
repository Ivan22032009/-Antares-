import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import { AuthRequest, LoginRequest, RegisterRequest } from '../types';

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('🔐 Login attempt - body:', req.body);

    const { email, password } = req.body as LoginRequest;
    const identifier = email;

    if (!identifier || !password) {
      console.log('❌ Missing login/email or password');
      res.status(400).json({
        success: false,
        message: 'Логін (або email) і пароль обов\'язкові',
      });
      return;
    }

    UserModel.getUserByEmailOrUsername(identifier, async (err, user) => {
      if (err) {
        console.error('❌ Database error:', err);
        res.status(500).json({
          success: false,
          message: 'Помилка бази даних',
        });
        return;
      }

      if (!user) {
        console.log('❌ User not found with identifier:', identifier);
        res.status(400).json({
          success: false,
          message: 'Користувача не знайдено',
        });
        return;
      }

      console.log('✅ User found:', { id: user.id, email: user.email });
      console.log('🔑 Comparing password with bcrypt');

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('❌ Bcrypt compare error:', err);
          res.status(500).json({
            success: false,
            message: 'Помилка сервера',
          });
          return;
        }

        if (!result) {
          console.log('❌ Password does not match for user:', identifier);
          res.status(400).json({
            success: false,
            message: 'Невірний пароль',
          });
          return;
        }

        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
          },
          process.env.JWT_SECRET || 'fallback_secret_antares',
          { expiresIn: '24h' }
        );

        console.log('✅ Login successful for user:', identifier);

        res.json({
          success: true,
          message: 'Успішний вхід',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
          },
        });
      });
    });
  } catch (error: any) {
    console.error('❌ Login unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера',
    });
  }
};

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('📝 Registration attempt - body:', req.body);

    const { username, email, password } = req.body as RegisterRequest;

    if (!username || !email || !password) {
      console.log('❌ Missing required fields');
      res.status(400).json({
        success: false,
        message: 'Всі поля обов\'язкові',
      });
      return;
    }

    UserModel.getUserByEmail(email, (err, existingUser) => {
      if (err) {
        console.error('❌ Database error checking existing user:', err);
        res.status(500).json({
          success: false,
          message: 'Помилка бази даних',
        });
        return;
      }

      if (existingUser) {
        console.log('❌ User already exists with email:', email);
        res.status(400).json({
          success: false,
          message: 'Користувач з таким email вже існує',
        });
        return;
      }

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('❌ Bcrypt hash error:', err);
          res.status(500).json({
            success: false,
            message: 'Помилка сервера',
          });
          return;
        }

        console.log('🔑 Password hashed on backend');

        UserModel.createUser(username as string, email as string, hashedPassword as string, (err, result) => {
          if (err) {
            console.error('❌ Database error in createUser:', err);
            res.status(500).json({
              success: false,
              message: 'Помилка бази даних: ' + err.message,
            });
            return;
          }

          console.log('✅ User created successfully:', result);

          res.status(201).json({
            success: true,
            message: 'Користувача успішно зареєстровано',
            userId: result.insertId,
          });
        });
      });
    });
  } catch (error: any) {
    console.error('❌ Register unexpected error:', error);
    res.status(500).json({
      success: false,
      message: 'Внутрішня помилка сервера: ' + error.message,
    });
  }
};

export const verifyToken = (req: AuthRequest, res: Response): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Токен відсутній',
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_antares');

    res.json({
      success: true,
      user: decoded,
    });
  } catch (error: any) {
    console.error('❌ Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Недійсний токен',
    });
  }
};

export const getUsers = (req: AuthRequest, res: Response): void => {
  try {
    UserModel.getAllUsers((err, users) => {
      if (err) {
        console.error('❌ Error fetching users:', err);
        res.status(500).json({ success: false, message: 'Помилка бази даних' });
        return;
      }

      // Remove password field before returning
      const safe = (users || []).map(u => ({ id: u.id, username: u.username, email: u.email, created_at: u.created_at }));
      res.json({ success: true, users: safe });
    });
  } catch (error: any) {
    console.error('❌ getUsers unexpected error:', error);
    res.status(500).json({ success: false, message: 'Внутрішня помилка сервера' });
  }
};
