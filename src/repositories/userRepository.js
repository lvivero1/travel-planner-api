import { prisma } from "./prismaClient.js";

export function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function createUser({ name, email, passwordHash }) {
  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });
}