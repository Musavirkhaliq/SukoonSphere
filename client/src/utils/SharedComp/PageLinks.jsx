import React from "react";
import { FaHome, FaCaretRight, FaBrain } from "react-icons/fa";
import { BiQuestionMark } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { MdVideoLibrary } from "react-icons/md";
import { GiPodium } from "react-icons/gi";
import { AiOutlineMail, AiOutlineInfoCircle } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { AiFillRead } from "react-icons/ai";
import { RiHomeSmileFill, RiBookReadFill, RiDiscussFill, RiMovieFill, RiCustomerService2Fill } from "react-icons/ri";

const links = [
  {
    name: "Home",
    address: "/",
    icon: <RiHomeSmileFill />,
  },
  {
    name: "Articles & Resources",
    address: '',
    description: "Educational content and tools",
    icon: <RiBookReadFill />,
    sublinks: [
      {
        name: "Articles",
        address: 'articles',
        description: "In-depth written content",
        // icon: <FaCaretRight />,
        icon: <AiFillRead />,
      },
      {
        name: "Quizzes",
        address: 'all-quizzes',
        description: "Interactive knowledge tests",
        // icon: <FaCaretRight />,
        icon: <BiQuestionMark />,
      },
    ],
  },
  {
    name: 'Debates & Discussions',
    address: "",
    icon: <RiDiscussFill />,
    description: "Engage in dialogues",
    sublinks: [
      {
        name: "QA-Section",
        address: "QA-Section",
        description: "Question and answer forum",
        // icon: <FaCaretRight />,
        icon: <BiQuestionMark />,
      },
      {
        name: "Posts",
        address: 'Posts',
        description: "User-submitted discussions",
        // icon: <FaCaretRight />,
        icon: <BsChatDots />,
      },
    ],
  },
  {
    name: 'Media Libraries',
    address: "",
    icon: <RiMovieFill />,
    description: "Audio-visual resources",
    sublinks: [
      {
        name: "Podcasts",
        address: "/podcasts",
        description: "Audio-based discussions",
        // icon: <FaCaretRight />,
        icon: <GiPodium />,
      },
      {
        name: "Videos",
        address: 'all-videos',
        description: "Visual media content",
        // icon: <FaCaretRight />,
        icon: <MdVideoLibrary />,
      },
    ],
  },
  {
    name: 'Contact & Help',
    address: "",
    icon: <RiCustomerService2Fill />,
    description: "Get support or learn more",
    sublinks: [
      {
        name: "Contact Us",
        address: "contact-us",
        description: "Get in touch with support",
        // icon: <FaCaretRight />,
        icon: <AiOutlineMail />,
      },
      {
        name: "About Us",
        address: 'about-us',
        description: "Learn about our mission",
        // icon: <FaCaretRight />,
        icon: <AiOutlineInfoCircle />,
      },
      {
        name: "Mental Health",
        address: 'about/mental-health',
        description: "Mental health resources",
        // icon: <FaCaretRight />,
        icon: <FaBrain />,
      },
      {
        name: "Our Contributors",
        address: '/about/our-team',
        description: "Meet our contributors",
        // icon: <FaCaretRight />,
        icon: <FiUsers />,
      },

    ],
  },
];
export default links;