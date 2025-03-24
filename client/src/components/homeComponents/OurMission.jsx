import React, { useState } from 'react';
import { FaBrain, FaHandHoldingHeart } from 'react-icons/fa';
import { BsShieldPlus, BsLightbulb } from "react-icons/bs";
import SectionTitle from "../sharedComponents/SectionTitle";
function OurMission() {
  const [activeAccordion, setActiveAccordion] = useState(0);

  const features = [
    {
      id: 1,
      icon: <FaBrain size={40} className="text-[var(--primary)]" />,
      title: "Mental Health Resources",
      description: "Providing comprehensive resources to support your journey toward better mental wellness."
    },
    {
      id: 2,
      icon: <FaHandHoldingHeart size={40} className="text-[var(--primary)]" />,
      title: "Supportive Community",
      description: "Building a safe, inclusive community where everyone feels heard and supported."
    },
    {
      id: 3,
      icon: <BsLightbulb size={40} className="text-[var(--primary)]" />,
      title: "Innovative Approaches",
      description: "Exploring the latest research and approaches to mental health care and wellbeing."
    },
    {
      id: 4,
      icon: <BsShieldPlus size={40} className="text-[var(--primary)]" />,
      title: "Preventive Care",
      description: "Empowering you with tools and knowledge for proactive mental health management."
    }
  ];

  const accordionItems = [
    {
      question: "What is our core mission?",
      answer: "Our core mission is to make mental health support accessible to everyone and break down the stigma surrounding mental health issues. We believe in providing evidence-based resources and building a supportive community that empowers individuals to take control of their mental wellbeing."
    },
    {
      question: "How do we approach mental health care?",
      answer: "We take a holistic approach to mental health care, recognizing that wellbeing encompasses physical, emotional, social, and spiritual dimensions. Our resources and community support reflect this integrated perspective, offering diverse pathways to healing and growth."
    },
    {
      question: "Who do we serve?",
      answer: "We serve anyone seeking mental health support, resources, and community. Our platform is designed to be inclusive and accessible to people from all backgrounds, cultures, and experiences. We particularly focus on reaching underserved populations who may face barriers to traditional mental health care."
    },
    {
      question: "What sets us apart?",
      answer: "Our commitment to combining evidence-based approaches with compassionate support distinguishes us in the mental health space. We prioritize both the science of mental health and the human experience, creating resources that are both effective and empathetic."
    },
    {
      question: "What are our future goals?",
      answer: "We aim to expand our reach globally, develop innovative digital mental health tools, and advocate for policy changes that support mental health awareness and accessibility. We're committed to ongoing research and continuous improvement of our resources and community support mechanisms."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <section className="my-8">
      <SectionTitle title="Our Mission" />
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-grey-800 text-lg max-w-2xl mx-auto">
            We're committed to advancing mental health support through key initiatives and a clear mission.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Cards */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white-color rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:translate-y-1 border-b-4 border-[--primary]"
                >
                  <div className="bg-light-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--primary)] text-center mb-3">{feature.title}</h3>
                  <p className="text-grey-800 text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Accordion */}
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <div className="bg-white-color rounded-lg shadow-lg p-3">
              <h3 className="text-2xl font-bold text-[var(--primary)] mb-6 text-center">Our Mission & Vision</h3>

              <div className="space-y-4">
                {accordionItems.map((item, index) => (
                  <div key={index} className="border border-grey-300 rounded-lg overflow-hidden">
                    <button
                      className="w-full flex justify-between items-center p-4 text-left bg-grey-100 hover:bg-grey-200 transition-colors duration-300"
                      onClick={() => toggleAccordion(index)}
                    >
                      <span className="font-bold text-[var(--primary)]">{item.question}</span>
                      <span className="text-[var(--primary)] text-xl">
                        {activeAccordion === index ? '−' : '+'}
                      </span>
                    </button>
                    <div
                      className={`px-4 overflow-hidden transition-all duration-300 ${activeAccordion === index ? 'max-h-64 py-4' : 'max-h-0'
                        }`}
                    >
                      <p className="text-grey-800">{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurMission;