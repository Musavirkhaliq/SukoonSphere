import bg_hero from "../../assets/images/bg-mind-img.png";
import { Link } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import "../../assets/styles/global.css";
import "../../index.css";
import bgImg from "../../assets/images/teams-bg.png";

const TopIntro = () => {
  return (
    <div
      className="flex items-center justify-center p-4  max-w-7xl mx-auto overflow-x-hidden pt-4"
      data-aos="fade"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Section - Text and CTAs */}
        <div>
          {/* Badge */}
          <div className="bg-[var(--primary)] text-[--gray-700] text-[12px] sm:text-sm inline-flex items-center py-2 px-2 rounded-full mb-4 glossy-effect-bar">
            <span className="bg-[#01427a] text-white rounded-full w-4 h-4 flex items-center justify-center mr-2">
              S
            </span>
            <Link
              to={
                "/about/mental-health"
              }
              target="_blank"
              className="text-white hover:text-[var(--ternery)]"
            >
              SukoonSphere: For Mental Health Challenges
            </Link>
          </div>

          {/* Main Heading */}
          <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[3.5rem] sm:leading-[4rem] mb-4 font-extrabold text-[var(--grey--900)] ">
            Empowering you to Heal, Grow, and Thrive
          </h2>

          {/* Subtext */}
          <p className="text-[var(--grey--800)] text-lg lg:mb-8 text-b text-justify sm:hero-para">
            Through personalized resources, expert guidance, and a compassionate
            community, we provide the tools you need to overcome challenges,
            foster personal growth, and lead a fulfilling, balanced life.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={"/QA-section"}>
              <button className="btn-1 ">
                Ask questions to professionals
                <FaLongArrowAltRight className="ml-2" />
              </button>
            </Link>
            <Link to={"/posts"}>
              <button className="btn-2 glossy-effect-bar">
                Share a story
                <FaLongArrowAltRight className="ml-2" />
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section - Image */}
        <div
          className="lg:flex hidden justify-center lg:justify-end bg-contain md:bg-center object-bottom"
          style={{
            backgroundImage: `url(${bgImg}) `,
            width: "500px",
          }}
        >
          <img
            src={bg_hero}
            alt="Healthcare Illustration"
            className="w-full  sm:max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default TopIntro;
