import { InputComponent } from "@/components/sharedComponents/FormRow";
import customFetch from "@/utils/customFetch";
import React from "react";
import { LuKeyRound } from "react-icons/lu";
import { Form, Link, redirect, useActionData } from "react-router-dom";

// Action function for handling password change
export const changePasswordAction = async ({ request }) => {
  const result = await request.formData();
  const data = Object.fromEntries(result);
  
  try {
    const response = await customFetch.post("auth/change-password", data);
    if (response.status === 200) {
      redirect("/auth/sign-in");
      return { success: response.data };
    }
  } catch (error) {
    return { error: error?.response?.data?.msg || "Something went wrong" };
  }
};

const ChangePassword = () => {
  const data = useActionData();
  const isSubmitting = navigation.state === "submitting";
  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif text-slate-800">
            Change Password
          </h1>
        </div>
        <div className="p-6 bg-[var(--primary)] shadow-xl rounded-[6px]">
          <Form method="post" className="flex flex-col gap-4">
            <div className=" gap-2 flex flex-col items-center justify-center">
              <div className="flex bg-teal-100 p-4 rounded-full  ">
                <LuKeyRound className="w-12 h-12 text-teal-600" />
              </div>
              <p className="text-[var(--white-color)] text-center">
                Keep your account secure by creating a strong, unique password
              </p>
            </div>
            <p className="text-red-400 text-center">
              {data?.error && data.error.split(",")[0]}
            </p>
            <InputComponent type="email" name="email" placeholder="Email..." />
            <InputComponent
              type="password"
              name="password"
              placeholder="Current Passowrd..."
            />
            <InputComponent
              type="password"
              name="newPassword"
              placeholder="New Passowrd..."
            />
            <InputComponent
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password..."
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-2 w-full "
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </Form>

          <div className="mt-4 text-center">
            <Link
              to="/user/forget-password"
              className="text-[var(--white-color)] text-center"
            >
              Forget Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
