import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaArrowRight, FaExternalLinkAlt, FaBookOpen } from 'react-icons/fa';
import SectionTitle from '../sharedComponents/SectionTitle';
import '../../assets/styles/EnhancedMentalHealthTopics.css';

const EnhancedMentalHealthTopics = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  
  // Mental health categories with descriptions and resources
  const categories = [
    {
      id: 'anxiety',
      name: 'Anxiety Disorders',
      color: '#4a6cf7',
      description: 'Conditions characterized by excessive worry, fear, and related behavioral disturbances that can significantly impair daily functioning.',
      disorders: [
        'Generalized Anxiety Disorder',
        'Panic Disorder',
        'Social Anxiety Disorder',
        'Obsessive-Compulsive Disorder',
        'Specific Phobias'
      ],
      symptoms: [
        'Excessive worry',
        'Restlessness',
        'Fatigue',
        'Difficulty concentrating',
        'Sleep problems',
        'Muscle tension'
      ],
      resources: [
        {
          name: 'Anxiety and Depression Association of America',
          url: 'https://adaa.org/'
        },
        {
          name: 'National Institute of Mental Health - Anxiety Disorders',
          url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders'
        }
      ],
      image: 'https://images.unsplash.com/photo-1541199249251-f713e6145474?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'mood',
      name: 'Mood Disorders',
      color: '#6c63ff',
      description: 'Conditions that primarily affect a person\'s emotional state, causing persistent feelings of sadness or periods of excessive happiness, or fluctuations between extreme happiness and extreme sadness.',
      disorders: [
        'Major Depressive Disorder',
        'Bipolar Disorder',
        'Persistent Depressive Disorder',
        'Seasonal Affective Disorder',
        'Cyclothymic Disorder'
      ],
      symptoms: [
        'Persistent sadness',
        'Loss of interest in activities',
        'Changes in appetite or weight',
        'Sleep disturbances',
        'Fatigue',
        'Feelings of worthlessness'
      ],
      resources: [
        {
          name: 'Depression and Bipolar Support Alliance',
          url: 'https://www.dbsalliance.org/'
        },
        {
          name: 'National Institute of Mental Health - Depression',
          url: 'https://www.nimh.nih.gov/health/topics/depression'
        }
      ],
      image: 'https://images.unsplash.com/photo-1473830394358-91588751b241?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'personality',
      name: 'Personality Disorders',
      color: '#ff6b6b',
      description: 'A class of mental disorders characterized by enduring maladaptive patterns of behavior, cognition, and inner experience that deviate from cultural expectations and cause distress or problems functioning.',
      disorders: [
        'Borderline Personality Disorder',
        'Narcissistic Personality Disorder',
        'Avoidant Personality Disorder',
        'Obsessive-Compulsive Personality Disorder',
        'Antisocial Personality Disorder'
      ],
      symptoms: [
        'Distorted thinking patterns',
        'Problematic emotional responses',
        'Impulse control issues',
        'Interpersonal difficulties',
        'Identity disturbances'
      ],
      resources: [
        {
          name: 'National Education Alliance for Borderline Personality Disorder',
          url: 'https://www.borderlinepersonalitydisorder.org/'
        },
        {
          name: 'International Society for the Study of Personality Disorders',
          url: 'https://www.isspd.com/'
        }
      ],
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'trauma',
      name: 'Trauma & Stress',
      color: '#ff8f3c',
      description: 'Mental health conditions that are triggered by experiencing or witnessing a terrifying, shocking, or dangerous event that overwhelms one\'s ability to cope.',
      disorders: [
        'Post-Traumatic Stress Disorder (PTSD)',
        'Acute Stress Disorder',
        'Adjustment Disorders',
        'Complex PTSD',
        'Reactive Attachment Disorder'
      ],
      symptoms: [
        'Flashbacks',
        'Nightmares',
        'Severe anxiety',
        'Uncontrollable thoughts',
        'Avoidance behaviors',
        'Hypervigilance'
      ],
      resources: [
        {
          name: 'National Center for PTSD',
          url: 'https://www.ptsd.va.gov/'
        },
        {
          name: 'Trauma-Informed Care Implementation Resource Center',
          url: 'https://www.traumainformedcare.chcs.org/'
        }
      ],
      image: 'https://images.unsplash.com/photo-1486825586573-7131f7991bdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      id: 'eating',
      name: 'Eating Disorders',
      color: '#20c997',
      description: 'Serious mental health conditions related to persistent eating behaviors that negatively impact health, emotions, and ability to function in important areas of life.',
      disorders: [
        'Anorexia Nervosa',
        'Bulimia Nervosa',
        'Binge Eating Disorder',
        'Avoidant/Restrictive Food Intake Disorder',
        'Pica'
      ],
      symptoms: [
        'Extreme weight loss or gain',
        'Obsession with food, weight, and body shape',
        'Distorted body image',
        'Abnormal eating patterns',
        'Excessive exercise',
        'Social withdrawal'
      ],
      resources: [
        {
          name: 'National Eating Disorders Association',
          url: 'https://www.nationaleatingdisorders.org/'
        },
        {
          name: 'Academy for Eating Disorders',
          url: 'https://www.aedweb.org/'
        }
      ],
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];

  const toggleCategory = (categoryId) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
    } else {
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className="enhanced-mental-health-topics">
      <SectionTitle title="Mental Health Topics" />
      
      <div className="categories-container">
        {categories.map((category) => (
          <div key={category.id} className="category-section">
            <motion.div 
              className="category-row"
              style={{ 
                borderColor: category.color,
                backgroundColor: activeCategory === category.id ? `${category.color}10` : 'transparent'
              }}
              onClick={() => toggleCategory(category.id)}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="category-header">
                <div 
                  className="category-icon" 
                  style={{ backgroundColor: category.color }}
                >
                  <FaInfoCircle className="text-white" />
                </div>
                <h3 className="category-name">{category.name}</h3>
              </div>
              
              <div className="category-disorders">
                {category.disorders.map((disorder, index) => (
                  <span key={index} className="disorder-tag">
                    {disorder}
                  </span>
                ))}
              </div>
              
              <div className="category-toggle">
                <FaArrowRight 
                  className={`toggle-icon ${activeCategory === category.id ? 'rotate-90' : ''}`} 
                  style={{ color: category.color }}
                />
              </div>
            </motion.div>
            
            {activeCategory === category.id && (
              <motion.div 
                className="category-details"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="details-grid">
                  <div className="details-image">
                    <img src={category.image} alt={category.name} />
                  </div>
                  
                  <div className="details-content">
                    <div className="details-description">
                      <h4>About {category.name}</h4>
                      <p>{category.description}</p>
                    </div>
                    
                    <div className="details-symptoms">
                      <h4>Common Symptoms</h4>
                      <ul>
                        {category.symptoms.map((symptom, index) => (
                          <li key={index}>
                            <span 
                              className="symptom-dot"
                              style={{ backgroundColor: category.color }}
                            ></span>
                            {symptom}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="details-resources">
                      <h4>Helpful Resources</h4>
                      <ul>
                        {category.resources.map((resource, index) => (
                          <li key={index}>
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="resource-link"
                              style={{ color: category.color }}
                            >
                              <FaExternalLinkAlt className="resource-icon" />
                              {resource.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="details-footer">
                  <Link 
                    to="/resources" 
                    className="learn-more-link"
                    style={{ backgroundColor: category.color }}
                  >
                    <FaBookOpen className="mr-2" />
                    Explore more about {category.name}
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
      
      <div className="topics-footer">
        <p className="disclaimer">
          This information is for educational purposes only. If you're experiencing symptoms, 
          please consult with a qualified mental health professional.
        </p>
        
        <Link to="/resources" className="all-resources-link">
          View all mental health resources <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default EnhancedMentalHealthTopics;
