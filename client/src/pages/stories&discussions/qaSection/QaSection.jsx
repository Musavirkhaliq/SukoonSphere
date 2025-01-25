import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import { QuestionModal } from "@/components";
import { Link, Outlet } from "react-router-dom";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

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

  const groups = [
    {
      id: 1,
      name: "Mindfulness Practices 🧘‍♂️",
      image: "https://example.com/image_mindfulness.jpg",
    },
    {
      id: 2,
      name: "Coping with Anxiety 💭",
      image: "https://example.com/image_anxiety.jpg",
    },
    {
      id: 3,
      name: "Therapy Techniques 📖",
      image: "https://example.com/image_therapy.jpg",
    },
    {
      id: 4,
      name: "Depression Support Group ❤️",
      image: "https://example.com/image_depression.jpg",
    },
    {
      id: 5,
      name: "Stress Management Workshops 🌱",
      image: "https://example.com/image_stress.jpg",
    },
  ];

  return (
    <>
      <div className="relative w-full max-w-7xl mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left sidebar */}
          <div className="rounded-lg shadow-sm hidden lg:block lg:col-span-3 h-screen sticky top-20">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
              <div className="space-y-4">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {group.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {group.name}
                      </p>
                      <p className="text-xs text-gray-500">Starting soon</p>
                    </div>
                  </div>
                ))}
              </div>
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
