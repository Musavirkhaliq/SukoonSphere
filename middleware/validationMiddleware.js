import { body, param, validationResult } from "express-validator";

import mongoose from "mongoose";
import User from "../models/userModel.js";
import { BadRequestError } from "../errors/customErors.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMsgs = errors.array().map((err) => err.msg);
        throw new BadRequestError(errorMsgs);
      }
      next();
    },
  ];
};
// validate param id
export const validateIdParam = withValidationErrors([
  param("id").custom(async (value) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("invalid id");
  }),
]);
// auth validators
export const validateRegisterInput = withValidationErrors([
  body("name").notEmpty().withMessage("name is required"),

  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new BadRequestError("email already exists");
    }),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage("password must contain at least one special character "),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email"),
  body("password").notEmpty().withMessage("password is required"),
]);
export const validateChangePasswordInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .notEmpty()
    .withMessage("Current password is required")
    .isLength({ min: 8 })
    .withMessage("Current password must be at least 8 characters"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (@$!%*?&)"
    ),

  body("confirmNewPassword")
    .notEmpty()
    .withMessage("Please confirm your new password")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new BadRequestError("passwords do not match");
      }
      return true;
    }),
]);

export const validateForgetPasswordInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email"),
]);
export const validateResetPasswordInput = withValidationErrors([
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[@$!%*?&]/)
    .withMessage(
      "Password must contain at least one special character (@$!%*?&)"
    ),

  body("token").notEmpty().withMessage("token is required"),
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email"),
]);
// post validatos
export const validatePostInput = withValidationErrors([
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1500 })
    .withMessage("Description must not exceed 1500 characters"),

]);

// qa section
export const validateQaSectionInput = withValidationErrors([
  body("questionText")
    .notEmpty()
    .withMessage("Question is required")
    .isLength({ max: 200 })
    .withMessage("Question must not exceed 200 characters"),

]);

export const validateAnswerInput = withValidationErrors([
  body("context")
    .notEmpty()
    .withMessage("answer is required")
    .isLength({ max: 2000 })
    .withMessage("Answer must not exceed 2000 characters"),
]);

export const validateQaCommentInput = withValidationErrors([
  body("content").notEmpty().withMessage("comment is required"),
]);
