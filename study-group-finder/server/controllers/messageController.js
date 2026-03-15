import prisma from '../config/prisma.js';

export const getMessages = async (req, res) => {
  try {
    const groupId = Number(req.params.groupId);
    const messages = await prisma.message.findMany({
      where: { groupId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { timestamp: 'asc' }
    });

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { groupId, message } = req.body;
    const newMessage = await prisma.message.create({
      data: {
        groupId: Number(groupId),
        userId: req.user.id,
        message
      },
      include: { user: { select: { id: true, name: true } } }
    });

    req.io.to(`group_${groupId}`).emit('new_message', newMessage);
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
};
