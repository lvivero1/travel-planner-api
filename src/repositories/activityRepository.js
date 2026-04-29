import { prisma } from "./prismaClient.js";

export function createActivity(data) {
  return prisma.activity.create({ data });
}

export function listActivitiesByUserId(userId) {
  return prisma.activity.findMany({
    where: {
      destination: {
        trip: {
          userId,
        },
      },
    },
    orderBy: { id: "desc" },
  });
}

export function findActivityByIdAndUserId(id, userId) {
  return prisma.activity.findFirst({
    where: {
      id,
      destination: {
        trip: {
          userId,
        },
      },
    },
  });
}

export function updateActivityById(id, data) {
  return prisma.activity.update({
    where: { id },
    data,
  });
}

export function deleteActivityById(id) {
  return prisma.activity.delete({
    where: { id },
  });
}