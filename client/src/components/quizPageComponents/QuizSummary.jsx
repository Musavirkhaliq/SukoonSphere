import React from 'react';
const QuizSummary = ({ data }) => {
    if (!data) return null; // Handle the case where no data is provided

    return (
        <div className="attachment-styles">
            {/* Quiz Title and Subtitle */}
            <div>
                <h2 className="font-bold text-[1.6rem] md:text-[2rem] sm:text-[3rem] sm:leading-[3rem]   mb-2">{data.title}</h2>
                <p className="text-[var(--grey--800)] mb-4 text-semibold md:text-base lg:text-base font-bold">
                    {data.subtitle}
                </p>
            </div>

            {/* Author and Publication Details */}
            <div className="flex w-full items-center col-span-2  pb-4 justify-start gap-8">
                <div className="flex items-center col-span-2 justify-start gap-8 order-3 sm:order-none">
                    <div className="flex items-center justify-center gap-2  cursor-pointer">
                        <img
                            className="rounded-full size-7 border-2 border-gray-400"
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent('Sartaj Ashraf')}&background=random`}
                            alt={data.author.name}
                        />
                        <span className="text-sm text-[var(--primary)]"> {data.author.name || "Author"}</span>
                    </div>
                </div>
            </div>

            {/* Main Image and Description */}
            <div className="mb-6 overflow-hidden rounded-lg flex flex-col md:flex-col">
                <img
                    src={data.mainImage.src}
                    alt={data.mainImage.alt}
                    className="sm:w-full object-cover"
                />
                {/* <h3 className="text-gray-900 mb-4 text-semibold md:text-base lg:text-base my-3">
                    {data.mainImage.description}
                </h3> */}
            </div>

            {/* Detailed Sections */}
            {Object.keys(data).filter(key => !['title', 'subtitle', 'author', 'mainImage'].includes(key)).map((key, index) => (
                <div key={index} className="attachment-section">
                    <h4 className="text-lg  lg:text-xl font-bold text-[var(--black-color)] mt-6">{data[key].title}</h4>
                    <p className="text-sm md:text-base font-normal text-[var(--grey--800)] mb-2 ">{data[key].content}</p>
                    {data[key].quote && (
                        <blockquote className="attachment-quote">
                            {data[key].quote}
                        </blockquote>
                    )}
                    {data[key].reference && (
                        <p className="attachment-reference">Reference: {data[key].reference}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default QuizSummary;
