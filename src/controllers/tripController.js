import {
  createTripForUser,
  deleteUserTripById,
  getUserTripById,
  listUserTrips,
  updateUserTripById,
} from "../services/tripService.js";

export async function createTrip(req, res, next) {
  try {
    const trip = await createTripForUser(req.user.userId, req.body);
    res.status(201).json({ trip });
  } catch (error) {
    next(error);
  }
}

export async function getTrips(req, res, next) {
  try {
    const trips = await listUserTrips(req.user.userId);
    res.status(200).json({ trips });
  } catch (error) {
    next(error);
  }
}

export async function getTripById(req, res, next) {
  try {
    const trip = await getUserTripById(req.user.userId, req.params.id);
    res.status(200).json({ trip });
  } catch (error) {
    next(error);
  }
}

export async function updateTrip(req, res, next) {
  try {
    const trip = await updateUserTripById(req.user.userId, req.params.id, req.body);
    res.status(200).json({ trip });
  } catch (error) {
    next(error);
  }
}

export async function deleteTrip(req, res, next) {
  try {
    await deleteUserTripById(req.user.userId, req.params.id);
    res.status(200).json({ message: "Trip deleted" });
  } catch (error) {
    next(error);
  }
}