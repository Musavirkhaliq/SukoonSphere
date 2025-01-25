import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import img_bg from "../../assets/images/bg_login.png";
import { Link } from "react-router-dom";
import { GrLogin } from "react-icons/gr";
import { InputComponent } from "@/components/sharedComponents/FormRow";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignIn = () => {
  const { login, isLoading } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const result = await login(data);
      console.log(result);
      if (result.success) {
        toast.success("Login successful");
        navigate("/posts");
      } else if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen  flex  items-center justify-center p-4 ">
      <div className="bg-white shadow-xl max-w-6xl flex flex-col-reverse sm:flex-row">
        {/* Form Section - Light Half */}
        <div className=" w-full rounded-xl sm:rounded-l-2xl sm:w-1/2 p-4 flex flex-col justify-center items-center bg-[var(--primary)]">
          <div>
            <img
              src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png"
              alt="logo"
              className="w-14  h-14"
            />
          </div>
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 p-4 rounded-lg w-full max-w-[500px] mx-auto"
          >
            {error && (
              <p className="text-red-400 text-center">{error.split(",")[0]}</p>
            )}
            <h1 className="font-bold text-[var(--white-color)] text-center text-2xl">
              Sign In
            </h1>

            <InputComponent
              type="email"
              name="email"
              placeholder="Enter an email.."
            />
            <div className="relative">
              <InputComponent
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password.."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="btn-2 w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
              <GrLogin />
            </button>
            <p className="text-[var(--white-color)] text-center">
              Create an account
              <Link
                to="/auth/sign-up"
                className="text-blue-500 text-center ml-2 hover:underline"
              >
                Sign up
              </Link>
            </p>
            <Link
              to="/user/forget-password"
              className="text-[var(--white-color)] text-center hover:text-blue-500"
            >
              Forget Password
            </Link>
          </Form>
        </div>
        {/* Image Section - Right Half */}
        <div className="hidden  md:block w-full sm:w-1/2 p-4 pt-12 sm:flex flex-col justify-center items-center  bg-gray-50 ">
          <h2 className="font-bold text-[2.5rem] text-[var(--gray--900)] text-center mb-4">
            SukoonSphere
          </h2>
          <p className="text-center mb-6 max-w-[400px] text-[var(--grey--800)]"></p>
          <img
            src={img_bg}
            alt="bg-mind-img"
            className="w-full max-w-[400px] object-cover "
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
