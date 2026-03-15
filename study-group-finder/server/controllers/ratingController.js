import prisma from '../config/prisma.js';

export const createRating = async (req, res) => {
  try {
    const { groupId, ratedUser, rating, feedback } = req.body;
    const newRating = await prisma.rating.create({
      data: {
        groupId: Number(groupId),
        raterId: req.user.id,
        ratedUser: Number(ratedUser),
        rating: Number(rating),
        feedback
      }
    });

    return res.status(201).json(newRating);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create rating', error: error.message });
  }
};
