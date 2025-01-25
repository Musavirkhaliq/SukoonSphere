import React, { useState } from "react";
import { Form, useLoaderData } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const { category } = useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategoryClick = (tag) => {
    setSelectedCategory(tag);
    console.log(`Selected category: ${tag}`);
  };

  return (
    <Form className="grid gap-4 grid-cols-4">
      <div className="relative col-span-4">
        <input
          type="text"
          className="bg-transparent border border-gray-400 p-2 rounded pl-10 focus:outline-none focus:border-gray-600"
          name="search"
          placeholder="Search by title."
        />
        <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>

      <div className="col-span-4 flex flex-wrap gap-2">
        {category.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`p-2 rounded hover:bg-gray-300 transition ${
              selectedCategory === tag ? "bg-gray-300" : "bg-gray-200"
            }`}
            onClick={() => handleCategoryClick(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
    </Form>
  );
};

export default Search;
