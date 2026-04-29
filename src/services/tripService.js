import {
  createTrip,
  deleteTripById,
  findTripByIdAndUserId,
  listTripsByUserId,
  updateTripById,
} from "../repositories/tripRepository.js";

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function normalizeDateInput(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

function parseTripId(idParam) {
  const id = Number.parseInt(idParam, 10);

  if (!Number.isInteger(id) || id <= 0) {
    throw createHttpError("Trip id must be a positive integer", 400);
  }

  return id;
}

function validateTripPayload({ title, startDate, endDate }, requireAllFields = true) {
  if (requireAllFields && (!title || !startDate || !endDate)) {
    throw createHttpError("title, startDate, and endDate are required", 400);
  }

  if (title !== undefined && String(title).trim() === "") {
    throw createHttpError("title cannot be empty", 400);
  }

  const normalized = {};

  if (title !== undefined) {
    normalized.title = String(title).trim();
  }

  if (startDate !== undefined) {
    const parsedStartDate = normalizeDateInput(startDate);
    if (!parsedStartDate) {
      throw createHttpError("startDate must be a valid date", 400);
    }
    normalized.startDate = parsedStartDate;
  }

  if (endDate !== undefined) {
    const parsedEndDate = normalizeDateInput(endDate);
    if (!parsedEndDate) {
      throw createHttpError("endDate must be a valid date", 400);
    }
    normalized.endDate = parsedEndDate;
  }

  if (normalized.startDate && normalized.endDate && normalized.endDate < normalized.startDate) {
    throw createHttpError("endDate must be on or after startDate", 400);
  }

  return normalized;
}

export async function createTripForUser(userId, payload) {
  const normalized = validateTripPayload(payload, true);

  return createTrip({
    title: normalized.title,
    description: payload.description ?? null,
    startDate: normalized.startDate,
    endDate: normalized.endDate,
    budget: payload.budget ?? null,
    userId,
  });
}

export function listUserTrips(userId) {
  return listTripsByUserId(userId);
}

export async function getUserTripById(userId, idParam) {
  const id = parseTripId(idParam);
  const trip = await findTripByIdAndUserId(id, userId);

  if (!trip) {
    throw createHttpError("Trip not found", 404);
  }

  return trip;
}

export async function updateUserTripById(userId, idParam, payload) {
  const id = parseTripId(idParam);
  const existing = await findTripByIdAndUserId(id, userId);

  if (!existing) {
    throw createHttpError("Trip not found", 404);
  }

  const normalized = validateTripPayload(payload, false);

  if (
    normalized.startDate === undefined &&
    normalized.endDate !== undefined &&
    normalized.endDate < existing.startDate
  ) {
    throw createHttpError("endDate must be on or after startDate", 400);
  }

  if (
    normalized.startDate !== undefined &&
    normalized.endDate === undefined &&
    existing.endDate < normalized.startDate
  ) {
    throw createHttpError("endDate must be on or after startDate", 400);
  }

  const data = {
    ...normalized,
  };

  if (payload.description !== undefined) {
    data.description = payload.description;
  }

  if (payload.budget !== undefined) {
    data.budget = payload.budget;
  }

  return updateTripById(id, data);
}

export async function deleteUserTripById(userId, idParam) {
  const id = parseTripId(idParam);
  const existing = await findTripByIdAndUserId(id, userId);

  if (!existing) {
    throw createHttpError("Trip not found", 404);
  }

  return deleteTripById(id);
}