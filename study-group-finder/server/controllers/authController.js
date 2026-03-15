import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, college, subjects = [] } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, college }
    });

    for (const item of subjects) {
      await prisma.userSubject.upsert({
        where: {
          userId_subjectId: {
            userId: user.id,
            subjectId: item.subjectId
          }
        },
        update: {
          skillLevel: item.skillLevel,
          availabilityTime: item.availabilityTime
        },
        create: {
          userId: user.id,
          subjectId: item.subjectId,
          skillLevel: item.skillLevel,
          availabilityTime: item.availabilityTime
        }
      });
    }

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
