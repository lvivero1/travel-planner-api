import {
  createDestination,
  deleteDestinationById,
  findDestinationByIdAndUserId,
  listDestinationsByUserId,
  updateDestinationById,
} from "../repositories/destinationRepository.js";
import { findTripByIdAndUserId } from "../repositories/tripRepository.js";

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

async function assertUserOwnsTrip(userId, tripId) {
  const trip = await findTripByIdAndUserId(tripId, userId);
  if (!trip) {
    throw createHttpError("Trip not found", 404);
  }
}

function validateCreatePayload(payload) {
  const { city, country, tripId } = payload;

  if (!city || !country || tripId === undefined) {
    throw createHttpError("city, country, and tripId are required", 400);
  }

  if (String(city).trim() === "" || String(country).trim() === "") {
    throw createHttpError("city and country cannot be empty", 400);
  }
}

function normalizeDestinationPayload(payload, requireCreateFields = false) {
  if (requireCreateFields) {
    validateCreatePayload(payload);
  }

  const normalized = {};

  if (payload.city !== undefined) {
    const city = String(payload.city).trim();
    if (city === "") {
      throw createHttpError("city cannot be empty", 400);
    }
    normalized.city = city;
  }

  if (payload.country !== undefined) {
    const country = String(payload.country).trim();
    if (country === "") {
      throw createHttpError("country cannot be empty", 400);
    }
    normalized.country = country;
  }

  if (payload.arrivalDate !== undefined) {
    normalized.arrivalDate =
      payload.arrivalDate === null ? null : normalizeDateInput(payload.arrivalDate, "arrivalDate");
  }

  if (payload.departureDate !== undefined) {
    normalized.departureDate =
      payload.departureDate === null
        ? null
        : normalizeDateInput(payload.departureDate, "departureDate");
  }

  if (payload.notes !== undefined) {
    normalized.notes = payload.notes;
  }

  if (payload.tripId !== undefined) {
    normalized.tripId = parsePositiveInt(payload.tripId, "tripId");
  }

  if (
    normalized.arrivalDate instanceof Date &&
    normalized.departureDate instanceof Date &&
    normalized.departureDate < normalized.arrivalDate
  ) {
    throw createHttpError("departureDate must be on or after arrivalDate", 400);
  }

  return normalized;
}

export async function createDestinationForUser(userId, payload) {
  const normalized = normalizeDestinationPayload(payload, true);

  await assertUserOwnsTrip(userId, normalized.tripId);

  return createDestination(normalized);
}

export function listUserDestinations(userId) {
  return listDestinationsByUserId(userId);
}

export async function getUserDestinationById(userId, idParam) {
  const id = parsePositiveInt(idParam, "Destination id");
  const destination = await findDestinationByIdAndUserId(id, userId);

  if (!destination) {
    throw createHttpError("Destination not found", 404);
  }

  return destination;
}

export async function updateUserDestinationById(userId, idParam, payload) {
  const id = parsePositiveInt(idParam, "Destination id");
  const existing = await findDestinationByIdAndUserId(id, userId);

  if (!existing) {
    throw createHttpError("Destination not found", 404);
  }

  const normalized = normalizeDestinationPayload(payload, false);

  if (normalized.tripId !== undefined) {
    await assertUserOwnsTrip(userId, normalized.tripId);
  }

  const arrivalDate =
    normalized.arrivalDate !== undefined ? normalized.arrivalDate : existing.arrivalDate;
  const departureDate =
    normalized.departureDate !== undefined ? normalized.departureDate : existing.departureDate;

  if (
    arrivalDate instanceof Date &&
    departureDate instanceof Date &&
    departureDate < arrivalDate
  ) {
    throw createHttpError("departureDate must be on or after arrivalDate", 400);
  }

  return updateDestinationById(id, normalized);
}

export async function deleteUserDestinationById(userId, idParam) {
  const id = parsePositiveInt(idParam, "Destination id");
  const existing = await findDestinationByIdAndUserId(id, userId);

  if (!existing) {
    throw createHttpError("Destination not found", 404);
  }

  return deleteDestinationById(id);
}