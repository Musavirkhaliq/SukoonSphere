import { InputComponent } from "@/components/sharedComponents/FormRow";
import customFetch from "@/utils/customFetch";
import React, { useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useLocation,
  useNavigation,
} from "react-router-dom";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// const { token, email, password } = req.body
const ResetPassword = () => {
  const [password, setPassoword] = useState("");
  const [message, setMessage] = useState({});
  const query = useQuery();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const paramtoken = query.get("token");
  const paramEmail = query.get("email");
  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await customFetch.post("/auth/reset-password", {
        token: paramtoken,
        email: paramEmail,
        password,
      });
      setMessage({ success: data.msg });
    } catch (error) {
      console.log({ error });
      console.log({
        error: error?.response?.data?.msg || "An error occurred during signup.",
      });
      setMessage({
        error: error?.response?.data?.msg || "An error occurred during signup.",
      });
      return {
        error: error?.response?.data?.msg || "An error occurred during signup.",
      };
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <form className="flex flex-col bg-[var(--primary)] gap-4  rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-[var(--white-color)] ">Reset Your Password.</h1>
        {message?.success && (
          <p className="text-[var(--btn-secondary)] text-center">
            {message.success}
          </p>
        )}
        <p className="text-red-400 text-center">{message?.error}</p>
        {message.success ? (
          <p>
            Go to{" "}
            <Link to="/auth/sign-in" className="btn-2 w-full">
              Login Page
            </Link>
          </p>
        ) : (
          <>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassoword(e.target.value)}
              placeholder="New password..."
              className="input input-bordered w-full bg-gray-100 text-[var(--black-color)]"
            />
            <button
              disabled={isSubmitting}
              className="btn-2 w-full"
              onClick={(e) => resetPassword(e)}
            >
              {isSubmitting ? "Plase wait..." : "Reset Password"}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
