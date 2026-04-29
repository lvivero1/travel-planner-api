import { prisma } from "./prismaClient.js";

export function createDestination(data) {
  return prisma.destination.create({ data });
}

export function listDestinationsByUserId(userId) {
  return prisma.destination.findMany({
    where: {
      trip: {
        userId,
      },
    },
    orderBy: { id: "desc" },
  });
}

export function findDestinationByIdAndUserId(id, userId) {
  return prisma.destination.findFirst({
    where: {
      id,
      trip: {
        userId,
      },
    },
  });
}

export function updateDestinationById(id, data) {
  return prisma.destination.update({
    where: { id },
    data,
  });
}

export function deleteDestinationById(id) {
  return prisma.destination.delete({
    where: { id },
  });
}