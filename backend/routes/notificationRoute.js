import express from 'express';
import { getNotifications, markAsRead, clearNotifications } from '../controllers/notificationController.js';
// middlewares can be added later if needed, but for now we'll keep it simple
const notificationRouter = express.Router();

notificationRouter.get('/get', getNotifications);
notificationRouter.post('/mark-read', markAsRead);
notificationRouter.post('/clear-all', clearNotifications);

export default notificationRouter;
