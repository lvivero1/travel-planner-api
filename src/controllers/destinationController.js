import {
  createDestinationForUser,
  deleteUserDestinationById,
  getUserDestinationById,
  listUserDestinations,
  updateUserDestinationById,
} from "../services/destinationService.js";

export async function createDestination(req, res, next) {
  try {
    const destination = await createDestinationForUser(req.user.userId, req.body);
    res.status(201).json({ destination });
  } catch (error) {
    next(error);
  }
}

export async function getDestinations(req, res, next) {
  try {
    const destinations = await listUserDestinations(req.user.userId);
    res.status(200).json({ destinations });
  } catch (error) {
    next(error);
  }
}

export async function getDestinationById(req, res, next) {
  try {
    const destination = await getUserDestinationById(req.user.userId, req.params.id);
    res.status(200).json({ destination });
  } catch (error) {
    next(error);
  }
}

export async function updateDestination(req, res, next) {
  try {
    const destination = await updateUserDestinationById(req.user.userId, req.params.id, req.body);
    res.status(200).json({ destination });
  } catch (error) {
    next(error);
  }
}

export async function deleteDestination(req, res, next) {
  try {
    await deleteUserDestinationById(req.user.userId, req.params.id);
    res.status(200).json({ message: "Destination deleted" });
  } catch (error) {
    next(error);
  }
}