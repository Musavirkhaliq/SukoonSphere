import React, { lazy, Suspense } from "react";
import LoadingSpinner from "@/components/loaders/LoadingSpinner";
import { GivePrescription, PatientPrescriptions, SinglePrescription } from "@/pages";
export const prescriptionRoutes = [
  {
    path: "/prescription/:id",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <GivePrescription />
      </Suspense>
    ),
  },
  {
    path: "/prescriptions/:id",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PatientPrescriptions />
      </Suspense>
    ),
  },
  {
    path: "/view-prescription/:id",
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SinglePrescription />
      </Suspense>
    ),
  },
];
