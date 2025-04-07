import React from "react";
import { Link } from "react-router-dom";
import {
    FaBookOpen,
    FaCalendarAlt,
    FaRegCommentAlt,
    FaUser,
} from "react-icons/fa";
import { BiUpvote } from "react-icons/bi";

const HomeArticleCard = ({ article, index }) => {
    return (
        <Link
            key={`${article._id}-${index}`}
            to={`/articles/article/${article._id}`}
            className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col"
        >
            <div className="relative h-48 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    {article.imageUrl ? (
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <FaBookOpen className="w-12 h-12 text-blue-200 group-hover:scale-110 transition-transform duration-200" />
                    )}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold text-[var(--grey--900)] group-hover:text-blue-600 transition-colors duration-200 mb-3 line-clamp-2">
                    {article.title}
                </h2>
                {article.content && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {article.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                )}
                <div className="flex flex-col gap-3 mt-auto">
                    <div className="flex items-center justify-end gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <BiUpvote className="w-5 h-5 text-[var(--grey--900)]" />
                            <span className="text-[var(--grey--600)]">
                                {article?.likes?.length || 0}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaRegCommentAlt className="w-4 h-4 text-[var(--grey--900)]" />
                            <span className="text-[var(--grey--600)]">
                                {article?.comments?.length || 0}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-[var(--grey--600)] pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                            {article?.author?.avatar ? (
                                <img
                                    src={article?.author?.avatar}
                                    alt={article?.author?.name}
                                    className="w-6 h-6 mr-2 object-cover rounded-full"
                                />
                            ) : (
                                <FaUser className="w-4 h-4 mr-2" />
                            )}
                            <span className="text-[var(--grey--900)] line-clamp-1">
                                {article?.author?.name || "Anonymous"}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <FaCalendarAlt className="w-4 h-4 mr-2 text-[var(--grey--900)]" />
                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default HomeArticleCard;
