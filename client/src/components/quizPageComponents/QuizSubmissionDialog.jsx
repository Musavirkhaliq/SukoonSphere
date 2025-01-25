function QuizSubmissionDialog({ answers }) {
    return (
        <div>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box w-11/12 overflow-hidden max-w-5xl p-4 sm:p-6 md:p-8 shadow-xl rounded-2xl bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 sm:right-4 top-2 sm:top-4 hover:bg-red-100 hover:text-red-500 transition-all duration-300">
                            ✕
                        </button>
                    </form>
                    <div className="header text-center">
                        <h2 className="font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4 text-[var(--primary)] ">
                            🎉 Quiz Completed! 🎉
                        </h2>
                        <h2 className="text-xl sm:text-2xl mb-4 sm:mb-6">Your style: <span className="text-[var(--grey--900)] font-semibold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">Anxious</span></h2>
                    </div>

                    <p className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center text-[var(--grey--800">
                        Here are your selected answers:
                    </p>
                    <ul className="space-y-2 sm:space-y-3 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-2 sm:pr-4">
                        {answers.map((answer, index) => (
                            <li key={index} className="bg-white p-1 sm:p-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-l-4 border-[var(--primary)]">
                                <strong className="block text-lg sm:text-xl mb-1 sm:mb-2 text-[var(--primary)]">
                                    Question {index + 1}:
                                </strong>
                                <h4 className="mb-1 sm:mb-2 text-base sm:text-lg text-[--grey--900]">{answer.question}</h4>
                                <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
                                    <strong className="text-gray-700 sm:mr-2">Your Answer:</strong>
                                    <span className="text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-sm sm:text-base w-fit">{answer.selectedOption}</span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </dialog>
        </div>
    );
}

export default QuizSubmissionDialog;
