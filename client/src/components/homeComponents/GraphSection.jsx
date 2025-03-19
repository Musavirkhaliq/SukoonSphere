import { useState, useEffect } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GoGraph } from "react-icons/go";
import { FaBrain } from "react-icons/fa";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

// Real mental health disorder prevalence data (approximate global statistics)
// Source: World Health Organization and various mental health research institutes
const disorderData = [
  { name: "Anxiety", percentage: 3.6, color: "#4CAF50" },
  { name: "Depression", percentage: 3.8, color: "#2E7D32" },
  { name: "Bipolar", percentage: 0.6, color: "#1B5E20" },
  { name: "Schizophrenia", percentage: 0.3, color: "#8BC34A" },
  { name: "PTSD", percentage: 3.9, color: "#689F38" },
  { name: "OCD", percentage: 1.3, color: "#558B2F" },
  { name: "Eating Disorders", percentage: 0.9, color: "#33691E" },
  { name: "ADHD", percentage: 2.5, color: "#7CB342" },
  { name: "Substance Use", percentage: 2.8, color: "#9CCC65" },
];

// Age group prevalence data
const ageGroupData = [
  { age: "12-17", prevalence: 16.5 },
  { age: "18-25", prevalence: 25.8 },
  { age: "26-49", prevalence: 22.2 },
  { age: "50-64", prevalence: 16.8 },
  { age: "65+", prevalence: 14.5 },
  { age: "Male", prevalence: 18.3 },
  { age: "Female", prevalence: 22.3 },
  { age: "Urban", prevalence: 21.5 },
  { age: "Rural", prevalence: 19.2 },
];

export default function GraphSection() {
  const [activeCard, setActiveCard] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Configure Splide options - reverse direction compared to UserPosts
  const splideOptions = {
    type: 'loop',
    perPage: 2,
    perMove: 1,
    autoplay: true,
    interval: 4000,
    pauseOnHover: true,
    arrows: false,
    pagination: true,
    gap: '1rem',
    direction: 'rtl', // This makes it slide in the opposite direction
    breakpoints: {
      768: {
        perPage: 1,
      }
    }
  };

  // Disorders Card Component
  const DisordersCard = ({ data, isActive, setActive }) => (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl h-full"
      onMouseEnter={() => setActive('disorders')}
      onMouseLeave={() => setActive(null)}
    >
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBrain className="text-emerald-600 text-lg" />
            <h3 className="font-semibold text-gray-800 text-lg">Global Mental Health Disorders</h3>
          </div>
          <IoIosInformationCircleOutline className="text-gray-400 text-xl hover:text-emerald-600 cursor-pointer transition-colors" />
        </div>
        <p className="text-sm text-gray-500 mt-1">Percentage of global population affected by common mental health disorders</p>
      </div>
      
      <div className="p-5">
        <div className="space-y-5">
          {data.map((disorder) => (
            <div key={disorder.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{disorder.name}</span>
                <span className="font-semibold text-emerald-600">{disorder.percentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-in-out"
                  style={{
                    width: `${(disorder.percentage / 5) * 100}%`,
                    backgroundColor: disorder.color,
                    transform: isActive === 'disorders' ? 'scaleX(1.03)' : 'scaleX(1)',
                    transformOrigin: 'left'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Age Groups Card Component
  const AgeGroupCard = ({ data, isActive, setActive }) => (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl h-full"
      onMouseEnter={() => setActive('age')}
      onMouseLeave={() => setActive(null)}
    >
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GoGraph className="text-blue-600 text-lg" />
            <h3 className="font-semibold text-gray-800 text-lg">Mental Health by Age Group</h3>
          </div>
          <IoIosInformationCircleOutline className="text-gray-400 text-xl hover:text-blue-600 cursor-pointer transition-colors" />
        </div>
        <p className="text-sm text-gray-500 mt-1">Percentage of people experiencing mental illness by age group</p>
      </div>
      
      <div className="p-5">
        <div className="flex h-64 items-end justify-between gap-3 mt-4">
          {data.map((item, index) => (
            <div key={item.age} className="flex flex-col items-center gap-1 w-full">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{ 
                  height: `${(item.prevalence / 30) * 100}%`,
                  backgroundColor: `hsl(${210 + index * 15}, 80%, 55%)`,
                  transform: isActive === 'age' ? 'scaleY(1.03)' : 'scaleY(1)',
                  transformOrigin: 'bottom'
                }}
              />
              <span className="text-xs font-medium text-gray-800 mt-1">{item.age}</span>
              <span className="text-xs font-semibold text-blue-600">{item.prevalence}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Group data into chunks for slides
  const chunkSize = 3;
  const disorderChunks = [];
  for (let i = 0; i < disorderData.length; i += chunkSize) {
    disorderChunks.push(disorderData.slice(i, i + chunkSize));
  }
  
  const ageChunks = [];
  for (let i = 0; i < ageGroupData.length; i += chunkSize) {
    ageChunks.push(ageGroupData.slice(i, i + chunkSize));
  }

  if (!mounted) {
    return <div className="h-64 w-full bg-gray-100 rounded-xl animate-pulse"></div>;
  }

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mental Health Statistics</h2>
      
      <Splide options={splideOptions}>
        {disorderChunks.map((chunk, index) => (
          <SplideSlide key={`disorders-${index}`}>
            <DisordersCard 
              data={chunk} 
              isActive={activeCard} 
              setActive={setActiveCard} 
            />
          </SplideSlide>
        ))}
        
        {ageChunks.map((chunk, index) => (
          <SplideSlide key={`age-${index}`}>
            <AgeGroupCard 
              data={chunk} 
              isActive={activeCard} 
              setActive={setActiveCard} 
            />
          </SplideSlide>
        ))}
      </Splide>
    </section>
  );
}