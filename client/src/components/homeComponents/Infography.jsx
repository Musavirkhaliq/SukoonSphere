import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../sharedComponents/SectionTitle";
import "../../assets/styles/global.css";

function Infography() {
  const mentalHealthStats = [
    {
      category: "Anxiety Disorders",
      percentage: 31.1,
      description:
        "Anxiety disorders affect over 31% of adults globally at some point in their lives, making it one of the most common mental health challenges.",
      image:
        "https://drsamyaktiwari.com/wp-content/uploads/2021/01/AC033623-B540-4EA3-BB17-97E135A36B6D-640x476.jpeg",
    },
    {
      category: "Depression",
      percentage: 4.4,
      description:
        "Over 264 million people of all ages suffer from depression worldwide, representing approximately 4.4% of the global population.",
      image:
        "https://miro.medium.com/v2/resize:fit:1080/1*3vEz1I3bNdsS1vlSNH2ijw.jpeg",
    },
    {
      category: "Substance Abuse",
      percentage: 2.5,
      description:
        "Around 2.5% of the global population is affected by substance abuse disorders, often leading to other mental health issues.",
      image:
        "data:image/jpeg;base64,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",
    },
    {
      category: "Bipolar Disorder",
      percentage: 1.3,
      description:
        "Approximately 1-3% of the global population suffers from bipolar disorder, which is characterized by extreme mood swings.",
      image:
        "data:image/jpeg;base64,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",
    },
  ];

  const useAnimatedPercentage = (finalValue) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
      let current = 0;
      const interval = setInterval(() => {
        if (current < finalValue) {
          current += 1;
          setValue(current);
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, [finalValue]);

    return value;
  };

  return (
    <div className="relative ">
      <SectionTitle title={"Why SukoonSphere?"}></SectionTitle>

      <div className="max-w-7xl mx-auto text-white relative px-4 ">
        <div className=" flex flex-col gap-6 justify-center items-center max-w-7xl mx-auto relative text-center">
          <div className="bg-[var(--primary)] text-[--gray-700] text-[12px] sm:text-sm inline-flex items-center py-2 px-2 rounded-full mb-4 glossy-effect-bar">
            <span className="bg-[#01427a] text-white rounded-full w-4 h-4 flex items-center justify-center mr-2">
              S
            </span>
            <Link
              to={
                "/about/mental-health"
              }
              target="_blank"
              className="hover:text-[var(--ternery)]"
            >
              SukoonSphere: For Mental Health Challenges
            </Link>
          </div>
          <Link to="about/mental-health">
            <h2
              className="font-bold text-[var(--grey--900)] hover:text-[var(--ternery)] cursor-pointer text-[1.6rem] md:text-[2.5rem] lg:text-[3.5rem] sm:leading-[3.5rem]"
              data-aos="fade-up"
            >
              Mental Health Challenges
            </h2>
          </Link>
          <p
            className=":text-center text-lg font-light text-[var(--grey--800)] md:px-8 lg:px-0 text-justify lg:text-center"
            data-aos="fade-up"
          >
            Overcoming emotional, psychological, and social hurdles that impact
            mental well-being and daily functioning <br /> through support,
            guidance, and resilience-building.
          </p>
        </div>

        <div
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8"
          data-aos="fade-up"
        >
          {mentalHealthStats.map((stats, index) => {
            const animatedValue = useAnimatedPercentage(stats.percentage);
            return (
              <div
                key={index}
                className={`sm:p-3 text-center ${index === 0 ? "sm:border-l-2 sm:border-r-2" : "sm:border-r-2"}`}
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div className="flex justify-center mt-4">
                  <div className=" w-full sm:w-[270px] h-[200px] bg-gray-200 rounded-[20px]">
                    <img
                      src={stats.image}
                      alt={stats.category}
                      className="w-full h-full object-cover rounded-[20px]"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="text-md font-bold text-[var(--primary)] hover:text-[var(--ternery)] cursor-pointer">
                    <Link to="about/mental-health">{stats.category} </Link>
                  </h4>
                  <h1 className="text-3xl font-semibold text-[var(--primary)]">
                    {animatedValue} <span>%</span>
                  </h1>
                  <p className="mt-2 text-justify sm:text-center text-[var(--grey--800)]">
                    {stats.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Infography;
