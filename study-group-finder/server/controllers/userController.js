import prisma from '../config/prisma.js';

export const getProfile = async (req, res) => {
  try {
    const profile = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        createdAt: true,
        userSubjects: {
          include: {
            subject: true
          }
        }
      }
    });

    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, college, subjects = [] } = req.body;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { name, college }
    });

    for (const item of subjects) {
      await prisma.userSubject.upsert({
        where: {
          userId_subjectId: {
            userId: req.user.id,
            subjectId: item.subjectId
          }
        },
        update: {
          skillLevel: item.skillLevel,
          availabilityTime: item.availabilityTime
        },
        create: {
          userId: req.user.id,
          subjectId: item.subjectId,
          skillLevel: item.skillLevel,
          availabilityTime: item.availabilityTime
        }
      });
    }

    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};
