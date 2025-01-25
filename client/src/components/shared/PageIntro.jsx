import React from 'react'

function QuizIntro({ title, description }) {
    return (
        <div>
            <div>
                <h2 className="text-3xl font-bold text-[var(--primary)] mb-4">{title}</h2>
                <div className="border-l-4 border-[var(--primary)] bg-[var(--light-bg)] p-4 mb-6 rounded-lg">
                    <p className="text-gray-700">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default QuizIntro
