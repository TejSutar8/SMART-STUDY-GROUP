import prisma from '../config/prisma.js';

export const getSubjects = async (_req, res) => {
  try {
    const subjects = await prisma.subject.findMany({ orderBy: { subjectName: 'asc' } });
    return res.json(subjects);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch subjects', error: error.message });
  }
};
