import { InputComponent } from "@/components/sharedComponents/FormRow";
import customFetch from "@/utils/customFetch";
import React from "react";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import { toast } from "react-toastify";
import img_bg from "../../assets/images/bg_signup.png";

export const forgetPasswordAction = async ({ request }) => {
  const result = await request.formData();
  const data = Object.fromEntries(result);
  try {
    const response = await customFetch.post("auth/forget-password", data);
    toast.success(response.data.msg);
    return { success: response.data.msg };
  } catch (error) {
    toast.error(error?.response?.data?.msg || "An error occurred. Please try again.");
    return {
      error: error?.response?.data?.msg || "An error occurred. Please try again.",
    };
  }
};

const ForgetPassword = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const data = useActionData();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 rounded-lg">
      <div className="bg-white shadow-xl max-w-6xl flex flex-col sm:flex-row">
        {/* Image Section - left Half */}
        <div className="w-full sm:w-1/2 p-4 pt-12 flex flex-col justify-center items-center bg-gray-50">
          <h2 className="font-bold text-[2.5rem] text-[var(--gray--900)] text-center mb-4">
            Password Recovery
          </h2>
          <p className="text-center mb-6 max-w-[400px] text-[var(--grey--800)]">
            Don't worry! It happens. Please enter the email address associated with your account.
          </p>
          {/* <img
            src={img_bg}
            alt="forget-password-img"
            className="w-full max-w-[400px] object-cover"
          /> */}
        </div>

        {/* Form Section - Right Half */}
        <div className="w-full sm:w-1/2 p-4 flex flex-col justify-center items-center bg-[var(--primary)] sm:rounded-r-2xl">
          <div>
            <img src="https://cdn-icons-png.flaticon.com/512/6146/6146587.png" alt="logo" className="w-14 h-14" />
          </div>
          <Form
            method="post"
            className="flex flex-col gap-4 p-4 rounded-lg w-full max-w-[500px] mx-auto"
          >
            <h1 className="font-bold text-[var(--white-color)] text-center text-2xl">
              Forgot Password?
            </h1>
            {data?.success && (
              <p className="text-[var(--btn-secondary)] text-center">
                {data.success}
              </p>
            )}
            <p className="text-red-400 text-center">
              {data?.error && data.error.split(",")[0]}
            </p>
            <InputComponent
              type="email"
              name="email"
              placeholder="Enter your email address..."
            />
            <button type="submit" disabled={isSubmitting} className="btn-2 w-full">
              {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
            </button>
            <Link to="/auth/sign-in" className="text-[var(--white-color)] text-center">
              Remember your password? Sign In
            </Link>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
