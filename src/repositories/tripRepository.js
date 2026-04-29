import { prisma } from "./prismaClient.js";

export function createTrip(data) {
  return prisma.trip.create({ data });
}

export function listTripsByUserId(userId) {
  return prisma.trip.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export function findTripByIdAndUserId(id, userId) {
  return prisma.trip.findFirst({
    where: { id, userId },
  });
}

export function updateTripById(id, data) {
  return prisma.trip.update({
    where: { id },
    data,
  });
}

export function deleteTripById(id) {
  return prisma.trip.delete({
    where: { id },
  });
}