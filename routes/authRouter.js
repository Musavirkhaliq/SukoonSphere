import { Router } from "express";
const router = Router();

import {
  changePassword,
  forgetPassword,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
  refreshToken,
  googleAuth,
  googleAuthCallback,
  facebookAuth,
  facebookAuthCallback,
  twitterAuth,
  twitterAuthCallback
} from "../controllers/authController.js";
import {
  validateChangePasswordInput,
  validateForgetPasswordInput,
  validateLoginInput,
  validateRegisterInput,
  validateResetPasswordInput,
} from "../middleware/validationMiddleware.js";

import { authenticateUser, optionalAuthenticateUser } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, login);
router.delete("/logout", optionalAuthenticateUser, logout);
router.post("/verify-email", verifyEmail);
router.get("/refresh-token", refreshToken);
router.post(
  "/change-password",
  authenticateUser,
  validateChangePasswordInput,
  changePassword
);
router.post("/forget-password", validateForgetPasswordInput, forgetPassword);

router.post("/reset-password", validateResetPasswordInput, resetPassword);

// Social Authentication Routes
// Google
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

// Facebook
router.get('/facebook', facebookAuth);
router.get('/facebook/callback', facebookAuthCallback);

// Twitter
router.get('/twitter', twitterAuth);
router.get('/twitter/callback', twitterAuthCallback);

// not in use yet

// router.post("/verify-email", verifyEmail);
// router.get("/admin-data", getAdminData);
// router.patch(
//   "/update-user-details/:id",
//   authenticateUser,
//   upload.fields([
//     { name: "avatar", maxCount: 1 },
//     { name: "avatar1", maxCount: 1 },
//   ]),
//   updateAdminData
// );

export default router;
