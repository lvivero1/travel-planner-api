import {
  createActivity,
  deleteActivityById,
  findActivityByIdAndUserId,
  listActivitiesByUserId,
  updateActivityById,
} from "../repositories/activityRepository.js";
import { findDestinationByIdAndUserId } from "../repositories/destinationRepository.js";

function createHttpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function parsePositiveInt(value, fieldName) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw createHttpError(`${fieldName} must be a positive integer`, 400);
  }

  return parsed;
}

function normalizeDateInput(value, fieldName) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw createHttpError(`${fieldName} must be a valid date`, 400);
  }
  return date;
}

async function assertUserOwnsDestination(userId, destinationId) {
  const destination = await findDestinationByIdAndUserId(destinationId, userId);
  if (!destination) {
    throw createHttpError("Destination not found", 404);
  }
}

function normalizeActivityPayload(payload, requireCreateFields = false) {
  if (requireCreateFields) {
    if (!payload.name || payload.destinationId === undefined) {
      throw createHttpError("name and destinationId are required", 400);
    }
  }

  const normalized = {};

  if (payload.name !== undefined) {
    const name = String(payload.name).trim();
    if (name === "") {
      throw createHttpError("name cannot be empty", 400);
    }
    normalized.name = name;
  }

  if (payload.description !== undefined) {
    normalized.description = payload.description;
  }

  if (payload.activityDate !== undefined) {
    normalized.activityDate =
      payload.activityDate === null
        ? null
        : normalizeDateInput(payload.activityDate, "activityDate");
  }

  if (payload.cost !== undefined) {
    if (payload.cost === null) {
      normalized.cost = null;
    } else {
      const numericCost = Number(payload.cost);
      if (Number.isNaN(numericCost)) {
        throw createHttpError("cost must be a valid number", 400);
      }
      normalized.cost = numericCost;
    }
  }

  if (payload.status !== undefined) {
    const status = String(payload.status).trim();
    if (status === "") {
      throw createHttpError("status cannot be empty", 400);
    }
    normalized.status = status;
  }

  if (payload.destinationId !== undefined) {
    normalized.destinationId = parsePositiveInt(payload.destinationId, "destinationId");
  }

  return normalized;
}

export async function createActivityForUser(userId, payload) {
  const normalized = normalizeActivityPayload(payload, true);

  await assertUserOwnsDestination(userId, normalized.destinationId);

  return createActivity(normalized);
}

export function listUserActivities(userId) {
  return listActivitiesByUserId(userId);
}

export async function getUserActivityById(userId, idParam) {
  const id = parsePositiveInt(idParam, "Activity id");
  const activity = await findActivityByIdAndUserId(id, userId);

  if (!activity) {
    throw createHttpError("Activity not found", 404);
  }

  return activity;
}

export async function updateUserActivityById(userId, idParam, payload) {
  const id = parsePositiveInt(idParam, "Activity id");
  const existing = await findActivityByIdAndUserId(id, userId);

  if (!existing) {
    throw createHttpError("Activity not found", 404);
  }

  const normalized = normalizeActivityPayload(payload, false);

  if (normalized.destinationId !== undefined) {
    await assertUserOwnsDestination(userId, normalized.destinationId);
  }

  return updateActivityById(id, normalized);
}

export async function deleteUserActivityById(userId, idParam) {
  const id = parsePositiveInt(idParam, "Activity id");
  const existing = await findActivityByIdAndUserId(id, userId);

  if (!existing) {
    throw createHttpError("Activity not found", 404);
  }

  return deleteActivityById(id);
}