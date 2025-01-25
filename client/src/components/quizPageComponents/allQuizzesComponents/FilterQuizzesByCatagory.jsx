import React from "react";
import { FaSearch } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import { Form, Link, useLoaderData } from "react-router-dom";

function FilterQuizzesByCategory() {
  const { allCategories } = useLoaderData();

  return (
    <>
      <Form className="flex flex-col w-full gap-4 bg-[var(--white-color)] backdrop-blur-sm p-4 rounded-lg shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* <div className="w-full lg:w-1/2 relative group">
            <input
              type="text"
              className="w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg text-[var(--black-color)] placeholder:text-gray-400 focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all duration-300"
              placeholder="Search by name or category"
              name="search"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--primary)] transition-colors duration-300"
            >
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd"
              />
            </svg>
          </div> */}
          <div className="w-full lg:w-1/3">
            <select
              name="category"
              className="w-full py-3 px-4 bg-gray-50 border rounded-lg text-[var(--black-color)] cursor-pointer focus:outline-none  focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundPosition: "right 1rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.5em 1.5em",
              }}
            >
              <option disabled selected>
                Filter by a category
              </option>
              {allCategories.map((tag) => (
                <option key={tag} value={tag} className="text-[var(--primary)]">
                  {tag}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3  lg:justify-end">
            <button
              type="submit"
              className="p-3 bg-[var(--primary)] hover:bg-[var(--ternery)] text-white rounded-lg shadow-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <FaSearch className="size-5" />
            </button>
            <Link
              to="/all-quizzes"
              className="p-3 bg-gray-100 hover:bg-gray-200 text-[var(--primary)] rounded-lg shadow-sm hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <RxReset className="size-5" />
            </Link>
          </div>
        </div>
      </Form>
    </>
  );
}

export default FilterQuizzesByCategory;
