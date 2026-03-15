import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

async function main() {
  const subjectNames = ['Mathematics', 'Physics', 'Computer Science', 'Chemistry', 'Biology'];

  for (const subjectName of subjectNames) {
    await prisma.subject.upsert({
      where: { subjectName },
      update: {},
      create: { subjectName }
    });
  }

  const password = await bcrypt.hash('Password123!', 10);

  const users = [
    { name: 'Alice', email: 'alice@example.com', college: 'State University' },
    { name: 'Bob', email: 'bob@example.com', college: 'State University' },
    { name: 'Carol', email: 'carol@example.com', college: 'City College' }
  ];

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: { ...userData, password }
    });
  }

  const math = await prisma.subject.findUnique({ where: { subjectName: 'Mathematics' } });
  const cs = await prisma.subject.findUnique({ where: { subjectName: 'Computer Science' } });
  const alice = await prisma.user.findUnique({ where: { email: 'alice@example.com' } });
  const bob = await prisma.user.findUnique({ where: { email: 'bob@example.com' } });

  await prisma.userSubject.upsert({
    where: { userId_subjectId: { userId: alice.id, subjectId: math.id } },
    update: { skillLevel: 'Intermediate', availabilityTime: 'Evening' },
    create: { userId: alice.id, subjectId: math.id, skillLevel: 'Intermediate', availabilityTime: 'Evening' }
  });

  await prisma.userSubject.upsert({
    where: { userId_subjectId: { userId: bob.id, subjectId: cs.id } },
    update: { skillLevel: 'Beginner', availabilityTime: 'Morning' },
    create: { userId: bob.id, subjectId: cs.id, skillLevel: 'Beginner', availabilityTime: 'Morning' }
  });

  const mathGroup = await prisma.studyGroup.create({
    data: {
      groupName: 'Math Masters',
      subjectId: math.id,
      scheduleTime: 'Evening',
      createdBy: alice.id
    }
  });

  await prisma.groupMember.createMany({
    data: [
      { groupId: mathGroup.id, userId: alice.id },
      { groupId: mathGroup.id, userId: bob.id }
    ],
    skipDuplicates: true
  });

  console.log('Seed complete');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
