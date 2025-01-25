import React from "react";
import { Link } from "react-router-dom";
import PostActions from "@/components/shared/PostActions";
import { FaBookOpen, FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";

const ArticleCard = ({ article, isOwnProfile, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Card Image */}
      {article.imageUrl ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <FaBookOpen className="w-24 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-200" />
      )}

      {/* Card Header */}
      <div className="p-4 flex-grow">
        <Link
          to={`/articles/article/${article._id}`}
          className="block mb-3 group"
        >
          <h2 className="text-xl font-semibold text-[var(--grey--900)] line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h2>
        </Link>

        {/* Meta Information */}
        <div className="flex items-center gap-2 text-sm text-[var(--grey--600)] mb-4">
          <FaCalendarAlt className="w-4 h-4" />
          <span>
            {new Date(article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      {isOwnProfile && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-end gap-2">
            <button
              onClick={() => onEdit(article)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit article"
            >
              <FaEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(article)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete article"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleCard;
