import React, { lazy, Suspense } from 'react';
import { ForgetPassword, ResetPassword, SignUp } from '@/pages';
import { signupAction } from '@/pages/auth/SignUp';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import SignIn from '@/pages/auth/SignIn';
import VerifyEmailAddres from '@/pages/auth/VerifyEmailAddres';
import ChangePassword, { changePasswordAction } from '@/pages/auth/ChangePassword';
import { forgetPasswordAction } from '@/pages/auth/ForgetPassword';
import { logoutAction } from '@/layouts/HomeLayout';

export const authRoutes = [
  {
    path: "/auth/sign-up",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignUp />
      </Suspense>
    ),
    action: signupAction,
  },
  {
    path: "/auth/sign-in",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignIn />
      </Suspense>
    ),
  },
  {
    path: "/user/verify-email",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <VerifyEmailAddres />
      </Suspense>
    ),
  },
  {
    path: "/user/change-passowrd",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ChangePassword />
      </Suspense>
    ),
    action: changePasswordAction
  },
  {
    path: "/user/forget-password",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ForgetPassword />
      </Suspense>
    ),
    action: forgetPasswordAction
  },
  {
    path: "/user/reset-password",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ResetPassword />
      </Suspense>
    ),
  },
  {
    path: "/user/",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <ResetPassword />
      </Suspense>
    ),
  },
  {
    path: "/logout",
    action: logoutAction
  },
];
