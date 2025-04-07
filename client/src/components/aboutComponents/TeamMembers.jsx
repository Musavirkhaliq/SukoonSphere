import React from 'react';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TeamMembers = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Musavir Khaliq',
      role: 'Founder & CEO',
      bio: 'Research engineer and AI expert with a Masters in CS from IISc, working on AI in biology at LTIMindtree.',
      image: '',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 2,
      name: 'Dr. Chandana Barat',
      role: 'Co-founder & Research Lead',
      bio: 'PhD in Neuroscience from IISc, Medical School Cornell. Former HOD of Biotechnology at St. Xavier’s.',
      image: '',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 3,
      name: 'Sanmit Chakraborty',
      role: 'Research Scientist',
      bio: 'PhD in Physics from UT Austin, specializing in computational models and AI-driven research.',
      image: '',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 4,
      name: 'Mohsin Urfie',
      role: 'Mass Communication Expert',
      bio: 'Specialist in mass communication and media outreach, dedicated to impactful storytelling.',
      image: '',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 5,
      name: 'Sartaj Ashraf',
      role: 'Tech Team Lead',
      bio: 'Experienced software engineer leading the development of scalable tech solutions.',
      image: '',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 6,
      name: 'Shahid',
      role: 'Software Engineer',
      bio: 'Developer focused on backend systems and AI integration.',
      image: '',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    },
    {
      id: 7,
      name: 'Auqib',
      role: 'Software Engineer',
      bio: 'Passionate about full-stack development and optimizing web performance.',
      image: '',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        github: 'https://github.com'
      }
    }
  ];

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--grey--900)] mb-4">Meet Our Team</h2>
          <p className="text-lg text-[var(--grey--700)] max-w-3xl mx-auto">
            The passionate individuals behind SukoonSphere who are dedicated to creating spaces for open communication,
            fostering meaningful discussions, and helping you discover yourself.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={member.image || 'https://via.placeholder.com/150'} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-sm text-gray-200">{member.role}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-[var(--grey--700)] mb-4">{member.bio}</p>
                
                <div className="flex space-x-4 justify-center">
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors">
                    <FaLinkedin className="w-5 h-5" />
                  </a>
                  <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors">
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800 transition-colors">
                    <FaGithub className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
