import React from "react";
import SectionTitle from "../sharedComponents/SectionTitle";
import IntroVideo from "../../assets/videos/ourstory.mp4";
import { Link } from "react-router-dom";
import bgImg from "../../assets/images/teams-bg.png";
import { MdOutlineReadMore } from "react-icons/md";

const OurStory = () => {
  return (
    <>
      <SectionTitle title={"Our Story"}></SectionTitle>
      <div
        className=" max-w-7xl mx-auto px-4  bg-[--primary] text-white rounded-lg"
        data-aos="fade-up"
      >
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between  md:space-y-0 lg:space-x-8">
          <div
            className="lg:w-1/2 space-y-6 py-4 sm:py-0 sm:p-8"
            data-aos="fade-up"
          >
            <div className="bg-[var(--grey--900)] text-[--gray-700] text-sm hidden lg:inline-flex items-center py-2 px-3 rounded-full mb-4 glossy-effect-bar">
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
            <h2
              className=" font-extrabold text-[1.6rem] md:text-[2.5rem] sm:leading-[3.5rem]"
              data-aos="fade-up"
            >
              {" "}
              Committed to Your Mental Health and Wellness Journey
            </h2>
            <p
              className="text-lg font-light mb-4 text-[var(--grey--600)]"
              data-aos="fade"
              data-aos-duration="1500"
            >
              We're passionate about supporting individuals in achieving
              emotional well-being through personalized care and guidance.
            </p>
            <hr />
            <div>
              <Link to="/about-us">
                <button className="btn-4 glossy-effect-bar mb-6 lg:mb-0">
                  Know more
                  <MdOutlineReadMore className="ml-2" size={20} />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Side: Video Section */}
          <div
            className="w-full relative lg:w-1/2 flex flex-col justify-center items-center md:px-8 lg:p-12 "
            // data-aos="fade-left"
            data-aos-duration="1500"
          >
            <div className="lg:hidden bg-[var(--grey--900)] md:mt-4 text-[--gray-700] text-sm inline-flex  lg:items-center py-2 px-3 my-4 rounded-full ">
              <span className="bg-[#01427a] text-white rounded-full w-4 h-4 flex items-center justify-center mr-2">
                N
              </span>
              <Link
                to={
                  "https://www.nhm.gov.in/index1.php?lang=1&level=2&sublinkid=1043&lid=359"
                }
                target="_blank"
                className="hover:text-[var(--ternery)]"
              >
                NMHP: National Mental Health Programme
              </Link>
            </div>
            <div
              className={`w-full  bg-contain bg-center flex justify-center items-center lg:h-[30rem] bg-[url(${bgImg})]`}
            >
              <div className="relative w-full h-72 md:h-96 flex justify-center items-center ">
                <video
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  src={IntroVideo}
                  loop
                  muted
                  controls
                  playsInline
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurStory;
