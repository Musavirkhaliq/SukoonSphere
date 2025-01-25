import React from 'react'
import { Link } from 'react-router-dom';

function QuizList({ quizCategories, }) {
    return (
        <>
            {quizCategories?.map((allCategory) => (
                <div key={allCategory?.id} className="mb-8">
                    <h2 className="text-xl font-bold text-[var(--black-color)] mb-4">{allCategory.category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                        {allCategory.quizzes.map((quiz) => (
                            <div key={quiz.id} className=" bg-white shadow-lg rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-[101%]">
                                <Link to={`quiz/${quiz.quizId}`}>
                                    <figure>
                                        <img
                                            src={quiz.imageSrc || 'default_image_placeholder_url'}
                                            alt={quiz.imageAlt}
                                            className="h-48 w-full object-cover rounded-t-[10px] "
                                        />
                                    </figure>
                                </Link>
                                <div className="card-body p-3">
                                    <Link to={`quiz/${quiz.quizId}`}>
                                        <h1 className="card-title text-[var(--primary)] hover:text-[var(--ternery)] pt-0 mb-3">{quiz.title}</h1>
                                        <p className='line-clamp-2 text-[var(--grey--800)]'>{quiz.description || "Take the quiz to find out more!"}</p>
                                    </Link>
                                    <div className="flex items-center pb-4 justify-start gap-1 order-3 sm:order-none">
                                        <div className="flex items-center mt-1 col-span-2 justify-start gap-4 order-3 sm:order-none">
                                            <div className="flex items-center justify-center gap-2  cursor-pointer">
                                                <img
                                                    className="rounded-full size-6 border-2 border-[var(--ternery)]"
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent('Sartaj Ashraf')}&background=random`}
                                                    alt="alt"
                                                />
                                                <span className="text-sm text-[var(--primary)]"> Sartaj Ashraf</span>
                                            </div>
                                            {/* <div className="flex items-center justify-center gap-2">
                                                <AiOutlineFieldTime color="var(--ternery)" />
                                                <span className="text-sm text-[var(--primary)]">20-12-2012</span>
                                            </div> */}

                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                </div >

            ))
            }
        </>
    )
}

export default QuizList
