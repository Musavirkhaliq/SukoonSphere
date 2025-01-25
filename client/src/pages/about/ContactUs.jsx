import React, { useState } from "react";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";
import { useUser } from "../../context/UserContext";
import { FaLightbulb, FaBug } from "react-icons/fa";

const ContactUs = () => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    message: "",
    type: "suggestion", // or 'issue'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit suggestions or report issues");
      return;
    }

    try {
      const response = await customFetch.post("/user/suggestions", {
        message: formData.message,
      });

      toast.success(response.data.message);
      setFormData({
        message: "",
        type: "suggestion",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to submit. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--grey-50)] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-[var(--grey--900)] mb-4">
            Help Us Improve
          </h2>
          <p className="text-sm md:text-lg text-[var(--grey--800)] max-w-2xl mx-auto">
            Your feedback is valuable! Share your suggestions or report issues
            to help us make SukoonSphere better for everyone.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl px-4 md:px-8 py-8">
          {/* Type Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: "suggestion" }))
              }
              className={`p-6 rounded-xl border-2 transition-all ${
                formData.type === "suggestion"
                  ? "border-[var(--primary)] bg-[var(--primary-50)]"
                  : "border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary-50)]"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-full ${
                    formData.type === "suggestion"
                      ? "bg-[var(--primary)] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FaLightbulb size={24} />
                </div>
                <div className="text-left">
                  <h3 className=" text-base md:text-lg font-semibold text-[var(--grey--900)]">
                    Share a Suggestion
                  </h3>
                  <p className="text-xs md:text-base text-[var(--grey--800)]">
                    Help us improve with your ideas
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: "issue" }))
              }
              className={`p-6 rounded-xl border-2 transition-all ${
                formData.type === "issue"
                  ? "border-[var(--primary)] bg-[var(--primary-50)]"
                  : "border-gray-200 hover:border-[var(--primary)] hover:bg-[var(--primary-50)]"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 rounded-full ${
                    formData.type === "issue"
                      ? "bg-[var(--primary)] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <FaBug size={24} />
                </div>
                <div className="text-left">
                  <h3 className="text-base md:text-lg font-semibold text-[var(--grey--900)]">
                    Report an Issue
                  </h3>
                  <p className="text-xs md:text-base text-[var(--grey--800)]">
                    Let us know about any problems
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[var(--grey-900)] text-lg font-medium mb-2">
                {formData.type === "suggestion"
                  ? "Your Suggestion"
                  : "Issue Description"}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={
                  formData.type === "suggestion"
                    ? "Share your ideas on how we can improve SukoonSphere..."
                    : "Describe the issue you've encountered in detail..."
                }
                className="w-full px-4 py-3 bg-[var(--pure)] rounded-lg border border-var(--primary) focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 placeholder-ternary min-h-[100px] resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--primary)] text-white py-4 px-6 rounded-xl text-lg  hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2"
            >
              <span>
                {formData.type === "suggestion"
                  ? "Submit Suggestion"
                  : "Submit Report"}
              </span>
            </button>

            <p className="text-center text-[var(--grey-600)]">
              {formData.type === "suggestion"
                ? "Your suggestions help us create a better experience for everyone."
                : "We appreciate you taking the time to report this issue."}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
