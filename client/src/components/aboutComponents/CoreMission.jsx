import React from 'react';
import { motion } from 'framer-motion';
import { FaComments, FaUsers, FaLaptopCode, FaHeartbeat, FaHeadphones } from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';
import { MdScience } from 'react-icons/md';

const CoreMission = () => {
  const missionPillars = [
    {
      id: 1,
      icon: <GiTeacher className="w-8 h-8 text-green-600" />,
      title: "Reciprocal Learning",
      description: "Creating spaces where we learn from each other through collaborative education and shared experiences to foster growth and understanding."
    },
    {
      id: 2,
      icon: <FaHeadphones className="w-8 h-8 text-yellow-600" />,
      title: "Active Listening",
      description: "Practicing deep, attentive listening to understand diverse perspectives and respect others' feelings and opinions through meaningful dialogue."
    },
    {
      id: 3,
      icon: <FaComments className="w-8 h-8 text-blue-600" />,
      title: "Open Communication",
      description: "Fostering a space where people can freely express themselves and engage in meaningful dialogue about mental health and personal growth."
    },
    {
      id: 4,
      icon: <FaUsers className="w-8 h-8 text-indigo-600" />,
      title: "Culture of Discussion",
      description: "Building a community that values diverse perspectives, respectful debate, and collaborative problem-solving."
    },
    {
      id: 5,
      icon: <MdScience className="w-8 h-8 text-purple-600" />,
      title: "Research-Oriented Approach",
      description: "Embracing scientific perspectives without scientism, promoting research on computational neuroscience to understand the brain and help people."
    },
    {
      id: 6,
      icon: <FaLaptopCode className="w-8 h-8 text-teal-600" />,
      title: "Modern Technology",
      description: "Leveraging cutting-edge technology to connect people in more meaningful and supportive ways across distances."
    },
    {
      id: 7,
      icon: <FaHeartbeat className="w-8 h-8 text-red-600" />,
      title: "Resilience Building",
      description: "Equipping individuals with the tools and mindsets to navigate life's challenges and thrive in an unchangeable world."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-full mb-4">Our Purpose</span>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--grey--900)] mb-6">Our Core Mission</h2>
          <p className="text-xl text-[var(--grey--700)] max-w-4xl mx-auto leading-relaxed">
            Our mission is to create an open platform where people can reciprocally learn and collaboratively educate about mental health,
            fostering a culture of active listening and respectful dialogue. We believe in using modern technology and scientific research
            to bring people together in more profound ways, promoting computational neuroscience to understand the brain while helping people
            develop resilience to navigate life's challenges in a world whose fundamental design cannot be changed.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-16">
          {missionPillars.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              className="bg-gray-50 rounded-xl p-8 shadow-md hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-white p-3 rounded-lg shadow-sm mr-5">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--grey--900)] mb-3">{pillar.title}</h3>
                  <p className="text-[var(--grey--700)]">{pillar.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-4">Where you discover yourself, we help you</h3>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            We believe that by creating spaces for reciprocal learning, active listening, and scientific understanding,
            we can help everyone discover their true selves and navigate life's challenges with
            resilience and purpose. Our research-centric approach combines the best of science and human connection.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CoreMission;
