import express from "express"
import UserController from "../controllers/userControllers.js"

const router = express.Router()

// Public Routes

router.post('/register', UserController.userRegistration);
router.post('/verify-email', UserController.verifyEmail);

export default router;