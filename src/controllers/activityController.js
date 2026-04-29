import {
  createActivityForUser,
  deleteUserActivityById,
  getUserActivityById,
  listUserActivities,
  updateUserActivityById,
} from "../services/activityService.js";

export async function createActivity(req, res, next) {
  try {
    const activity = await createActivityForUser(req.user.userId, req.body);
    res.status(201).json({ activity });
  } catch (error) {
    next(error);
  }
}

export async function getActivities(req, res, next) {
  try {
    const activities = await listUserActivities(req.user.userId);
    res.status(200).json({ activities });
  } catch (error) {
    next(error);
  }
}

export async function getActivityById(req, res, next) {
  try {
    const activity = await getUserActivityById(req.user.userId, req.params.id);
    res.status(200).json({ activity });
  } catch (error) {
    next(error);
  }
}

export async function updateActivity(req, res, next) {
  try {
    const activity = await updateUserActivityById(req.user.userId, req.params.id, req.body);
    res.status(200).json({ activity });
  } catch (error) {
    next(error);
  }
}

export async function deleteActivity(req, res, next) {
  try {
    await deleteUserActivityById(req.user.userId, req.params.id);
    res.status(200).json({ message: "Activity deleted" });
  } catch (error) {
    next(error);
  }
}