import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import { QuestionModal } from "@/components";
import { Link, Outlet } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import TopPublicGroups from "@/components/shared/TopPublicGroups";

export const questionsAction = async ({ request }) => {
  const result = await request.formData();
  const data = Object.fromEntries(result.entries());
  const tags = result.getAll("tags");
  data.tags = tags;
  try {
    const response = await customFetch.post("/qa-section", data);
    window.location.href = "/qa-section";
    return { success: response.data.msg };
  } catch (error) {
    return {
      error:
        error?.response?.data?.msg ||
        "An error occurred during posting question.",
    };
  }
};

const QaSection = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="relative w-full max-w-7xl mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Mobile Groups - Visible on small screens */}
          <div className="lg:hidden col-span-full mb-4">
            <TopPublicGroups />
          </div>
          {/* Left sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-20">
              <TopPublicGroups />
            </div>
          </div>

          {/* Middle section */}
          <div className="col-span-1 lg:col-span-6">
            {/* Header */}
            <div className="mb-3 text-center bg-blue-50 p-4 rounded-lg">
              <h2 className=" text-gray-800 mb-4"></h2>
              <h2 className="text-md sm:text-xl font-bold mb-4 text-[var(--grey--900)]">
                Have a Question or Insight? Share it with Us!
              </h2>

              <div className="flex flex-row justify-center gap-2 sm:gap-4">
                <button
                  onClick={() => {
                    if (!user) {
                      toast.error("Please login to ask a question");
                      return;
                    }
                    setIsModalOpen(true);
                  }}
                  className="btn-1 w-full sm:w-auto"
                >
                  <FaQuestionCircle className="mr-2" />
                  Ask
                </button>
                <Link
                  to="/answer"
                  className="btn-2 w-full sm:w-auto text-center"
                >
                  <AiOutlineComment className="mr-2" />
                  Answer
                </Link>
              </div>
            </div>

            {/* Questions List */}
            <Outlet />
          </div>
        </div>

        {/* Question Modal */}
        <QuestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </>
  );
};

export default QaSection;
