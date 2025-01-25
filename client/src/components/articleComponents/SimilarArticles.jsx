import { BiUpvote } from "react-icons/bi";

import {
  FaBookOpen,
  FaCalendarAlt,
  FaRegCommentAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const SimilarArticles = ({ similarArticles }) => {
  if (!similarArticles || similarArticles.length === 0) return null;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="text-2xl font-bold mb-6 text-[var(--primary)]">
        Similar Articles
      </h3>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {similarArticles.map((similarArticle) => (
          <Link
            key={similarArticle._id}
            to={`/articles/article/${similarArticle._id}`}
            className="group block bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2 text-[var(--primary)] group-hover:text-[var(--ternery)] transition-colors duration-200 line-clamp-2">
                {similarArticle.title}
              </h4>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <div className="flex items-center">
                  {similarArticle.authorAvatar ? (
                    <img
                      src={similarArticle.authorAvatar}
                      alt={similarArticle.authorName}
                      className="w-6 h-6 rounded-full object-cover mr-2"
                    />
                  ) : (
                    <FaUser className="w-4 h-4 mr-2" />
                  )}
                  <span>{similarArticle.authorName || "Anonymous"}</span>
                </div>
                <span className="mx-2">•</span>
                <span>
                  {new Date(similarArticle.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {similarArticles.map((similarArticle, index) => (
          <Link
            key={`${similarArticle._id}-${index}`}
            to={`/articles/article/${similarArticle._id}`}
            className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col"
          >
            <div className="relative h-48 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                {similarArticle.imageUrl ? (
                  <img
                    src={similarArticle.imageUrl}
                    alt={similarArticle.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaBookOpen className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-200" />
                )}
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold text-[var(--grey--900)] group-hover:text-blue-600 transition-colors duration-200 mb-3 line-clamp-2">
                {similarArticle.title}
              </h2>
              <div className="flex flex-col gap-3 mt-auto">
                <div className="flex items-center justify-end gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BiUpvote className="w-5 h-5 text-[var(--grey--900)]" />
                    <span className="text-[var(--grey--600)]">
                      {similarArticle.likes?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegCommentAlt className="w-4 h-4 text-[var(--grey--900)]" />
                    <span className="text-[var(--grey--600)]">
                      {similarArticle.comments?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-[var(--grey--600)] pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    {similarArticle.authorAvatar ? (
                      <img
                        src={similarArticle.authorAvatar}
                        alt={similarArticle.authorName}
                        className="w-6 h-6 mr-2 object-cover rounded-full"
                      />
                    ) : (
                      <FaUser className="w-4 h-4 mr-2" />
                    )}
                    <span>{similarArticle.authorName || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="w-4 h-4 mr-2 text-[var(--grey--900)]" />
                    <span>
                      {new Date(similarArticle.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarArticles;
