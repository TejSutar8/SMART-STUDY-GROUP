import prisma from '../config/prisma.js';

export const createGroup = async (req, res) => {
  try {
    const { groupName, subjectId, scheduleTime } = req.body;
    const group = await prisma.studyGroup.create({
      data: {
        groupName,
        subjectId: Number(subjectId),
        scheduleTime,
        createdBy: req.user.id,
        members: {
          create: { userId: req.user.id }
        }
      },
      include: { subject: true }
    });

    return res.status(201).json(group);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create group', error: error.message });
  }
};

export const getGroups = async (req, res) => {
  try {
    const groups = await prisma.studyGroup.findMany({
      include: {
        subject: true,
        members: { include: { user: { select: { id: true, name: true, email: true } } } }
      },
      orderBy: { id: 'desc' }
    });

    const userSubjects = await prisma.userSubject.findMany({ where: { userId: req.user.id } });
    const subjectSet = new Set(userSubjects.map((us) => us.subjectId));

    const recommendedGroups = groups.filter((group) => {
      const prefs = userSubjects.find((us) => us.subjectId === group.subjectId);
      if (!prefs) return false;

      const matchingMember = group.members.some((member) =>
        member.user.id === req.user.id ||
        userSubjects.some((us) =>
          subjectSet.has(group.subjectId) &&
          us.subjectId === group.subjectId &&
          us.skillLevel === prefs.skillLevel &&
          us.availabilityTime === group.scheduleTime
        )
      );

      return matchingMember || (subjectSet.has(group.subjectId) && prefs.availabilityTime === group.scheduleTime);
    });

    const joinedGroups = groups.filter((group) => group.members.some((member) => member.user.id === req.user.id));

    return res.json({ allGroups: groups, recommendedGroups, joinedGroups });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch groups', error: error.message });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    await prisma.groupMember.create({
      data: {
        groupId: Number(groupId),
        userId: req.user.id
      }
    });

    return res.json({ message: 'Joined group successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to join group', error: error.message });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId: Number(groupId),
          userId: req.user.id
        }
      }
    });

    return res.json({ message: 'Left group successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to leave group', error: error.message });
  }
};

export const upcomingSessions = async (req, res) => {
  try {
    const memberships = await prisma.groupMember.findMany({
      where: { userId: req.user.id },
      include: { group: { include: { subject: true } } }
    });

    return res.json(memberships.map((membership) => membership.group));
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch sessions', error: error.message });
  }
};
