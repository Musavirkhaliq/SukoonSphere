import React, { useState } from 'react';
import { FaUsers, FaComments } from 'react-icons/fa';
import { MdConnectWithoutContact } from "react-icons/md";
import { RiMentalHealthFill } from "react-icons/ri";
import SectionTitle from "../sharedComponents/SectionTitle";
import { motion } from "framer-motion";
function OurMission() {
  const [activeAccordion, setActiveAccordion] = useState(0);

  const features = [
    {
      id: 1,
      icon: <FaComments size={40} className="text-[var(--primary)]" />,
      title: "Open Communication",
      description: "Fostering a space where people can freely express themselves and engage in meaningful dialogue about mental health."
    },
    {
      id: 2,
      icon: <FaUsers size={40} className="text-[var(--primary)]" />,
      title: "Culture of Discussion",
      description: "Building a community that values diverse perspectives, respectful debate, and collaborative problem-solving."
    },
    {
      id: 3,
      icon: <MdConnectWithoutContact size={40} className="text-[var(--primary)]" />,
      title: "Modern Connectivity",
      description: "Leveraging cutting-edge technology to connect people in more meaningful and supportive ways across distances."
    },
    {
      id: 4,
      icon: <RiMentalHealthFill size={40} className="text-[var(--primary)]" />,
      title: "Resilience Building",
      description: "Equipping individuals with the tools and mindsets to navigate life's challenges and thrive in an unchangeable world."
    }
  ];

  const accordionItems = [
    {
      question: "What is our core mission?",
      answer: "Our core mission is to create an open platform where people can freely communicate about mental health, fostering a culture of meaningful discussion and connection. We believe in using modern technology to bring people together in more profound ways, helping them develop resilience to navigate life's challenges in a world whose fundamental design cannot be changed."
    },
    {
      question: "Why do we focus on communication?",
      answer: "We believe that open, honest communication is the foundation of mental wellbeing. By creating spaces where people can express themselves authentically and be truly heard, we help break down isolation and stigma. Our platform encourages dialogue that builds understanding, empathy, and collective wisdom."
    },
    {
      question: "How do we use technology?",
      answer: "We leverage cutting-edge technology not just to connect people, but to create meaningful interactions that transcend physical boundaries. From AI-powered tools like SukoonAI that facilitate self-discovery to community features that enable supportive conversations, we're using technology to enhance human connection rather than replace it."
    },
    {
      question: "What do we mean by resilience?",
      answer: "We recognize that while we cannot change the fundamental design of the world, we can develop the inner strength to navigate it successfully. Resilience is the ability to adapt to challenges, bounce back from setbacks, and find meaning even in difficult circumstances. Our platform provides tools, insights, and community support to build this essential life skill."
    },
    {
      question: "How do we create community?",
      answer: "We foster a culture of discussion where diverse perspectives are valued and respectful dialogue is encouraged. Our community guidelines promote constructive conversation, mutual support, and collaborative problem-solving. We believe that by bringing people together around shared challenges, we create a collective wisdom greater than any individual solution."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  return (
    <section className="my-12">
      <SectionTitle title="Our Mission" />
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">
            Connecting People Through Open Communication
          </h2>
          <p className="text-grey-800 text-lg max-w-3xl mx-auto leading-relaxed">
            We believe in the power of open dialogue to transform lives. Our mission is to create spaces where people can freely communicate,
            foster a culture of meaningful discussion, and use modern technology to connect at deeper levels—helping everyone develop
            the resilience to navigate life in a world whose design cannot be changed.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Cards */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white-color rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl border-b-4 border-[--primary] group"
                >
                  <div className="bg-light-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--primary-light)] transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--primary)] text-center mb-3 group-hover:text-[var(--ternery)] transition-colors duration-300">{feature.title}</h3>
                  <p className="text-grey-800 text-center">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side - Accordion */}
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <motion.div
              className="bg-white-color rounded-lg shadow-lg p-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold text-[var(--primary)] mb-6 text-center">Our Vision for Connection</h3>

              <div className="space-y-4">
                {accordionItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="border border-grey-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <button
                      className={`w-full flex justify-between items-center p-4 text-left transition-colors duration-300 ${activeAccordion === index ? 'bg-[var(--primary-light)] text-[var(--primary)]' : 'bg-grey-100 hover:bg-grey-200'}`}
                      onClick={() => toggleAccordion(index)}
                    >
                      <span className={`font-bold ${activeAccordion === index ? 'text-[var(--primary)]' : 'text-[var(--grey--800)]'}`}>{item.question}</span>
                      <span className={`${activeAccordion === index ? 'text-[var(--primary)]' : 'text-[var(--grey--600)]'} text-xl`}>
                        {activeAccordion === index ? '−' : '+'}
                      </span>
                    </button>
                    <motion.div
                      initial={false}
                      animate={{
                        height: activeAccordion === index ? 'auto' : 0,
                        opacity: activeAccordion === index ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-white">
                        <p className="text-grey-800 leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[var(--primary)] mb-4">
            Join Our Community of Open Communication
          </h3>
          <p className="text-grey-800 text-lg max-w-3xl mx-auto mb-8">
            Together, we can build a world where meaningful connections thrive and everyone has the tools to navigate life's challenges.
          </p>
          <a
            href="/auth/sign-in"
            className="inline-block px-8 py-3 bg-[var(--primary)] text-white rounded-full font-medium hover:bg-[var(--primary-dark)] transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Become Part of Our Mission
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default OurMission;