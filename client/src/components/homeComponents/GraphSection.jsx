import { useState, useEffect } from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { GoGraph } from "react-icons/go";
import { FaBrain } from "react-icons/fa";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

// Import Highcharts
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import highcharts3d from 'highcharts/highcharts-3d'; // Import the 3D module

// Initialize the 3D module
highcharts3d(Highcharts);

// --- Data remains the same ---
const disorderData = [
  { name: "Anxiety", percentage: 3.6, color: "#4CAF50" }, // Keep colors for reference or potential use
  { name: "Depression", percentage: 3.8, color: "#2E7D32" },
  { name: "Bipolar", percentage: 0.6, color: "#1B5E20" },
  { name: "Schizophrenia", percentage: 0.3, color: "#8BC34A" },
  { name: "PTSD", percentage: 3.9, color: "#689F38" },
  { name: "OCD", percentage: 1.3, color: "#558B2F" },
  { name: "Eating Disorders", percentage: 0.9, color: "#33691E" },
  { name: "ADHD", percentage: 2.5, color: "#7CB342" },
  { name: "Substance Use", percentage: 2.8, color: "#9CCC65" },
];

const ageGroupData = [
  { age: "12-17", prevalence: 16.5 },
  { age: "18-25", prevalence: 25.8 },
  { age: "26-49", prevalence: 22.2 },
  { age: "50-64", prevalence: 16.8 },
  { age: "65+", prevalence: 14.5 },
  // Let's keep these distinct for clarity in the bar chart
  // { age: "Male", prevalence: 18.3 },
  // { age: "Female", prevalence: 22.3 },
  // { age: "Urban", prevalence: 21.5 },
  // { age: "Rural", prevalence: 19.2 },
];

// More vibrant color palettes
const disorderColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#2AB7CA',
  '#F0B8B8', '#97EAD2', '#F9C89C', '#C4DEF6'
];

const ageGroupColors = [
  '#54478C', '#2C699A', '#048BA8', '#0DB39E', '#16DB93',
  '#83E377', '#B9E769', '#EFEA5A', '#F1C453', '#F29E4C'
];


export default function GraphSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Configure Splide options for single chart view
  const splideOptions = {
    type: 'loop',
    perPage: 1, // Show one full chart at a time
    perMove: 1,
    autoplay: true,
    interval: 5000, // Slightly longer interval for charts
    pauseOnHover: true,
    arrows: true, // Enable arrows for easier navigation between the two charts
    pagination: true,
    gap: '1rem',
    // direction: 'rtl', // Optional: keep if you prefer right-to-left
  };

  // --- Highcharts Options ---

  // Options for the Disorders Line Chart
  const disordersChartOptions = {
    chart: {
      type: 'line',
      height: 350, // Adjust height as needed
      backgroundColor: 'transparent',
    },
    title: {
      text: null, // Disable default title, use card title
    },
    xAxis: {
      categories: disorderData.map(d => d.name),
      labels: {
        style: {
          color: '#4A5568', // Gray-700
          fontSize: '11px'
        }
      },
       gridLineColor: '#E2E8F0', // Gray-200
       lineColor: '#CBD5E0', // Gray-300
       tickColor: '#CBD5E0'
    },
    yAxis: {
      title: {
        text: 'Global Prevalence (%)',
        style: {
           color: '#4A5568'
        }
      },
      labels: {
        format: '{value}%',
         style: {
           color: '#4A5568'
        }
      },
      gridLineColor: '#E2E8F0', // Gray-200
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y:.1f}%</b>',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      style: {
        color: '#FFF'
      }
    },
    plotOptions: {
      line: {
        marker: {
          enabled: true,
          radius: 4,
          symbol: 'circle' // Use circle markers
        },
        lineWidth: 3,
        // dataLabels: { // Optional: Show labels directly on points
        //   enabled: true,
        //   format: '{point.y:.1f}%',
        //   style: { fontSize: '10px', color: '#333' }
        // },
        states: {
          hover: {
            lineWidthPlus: 1
          }
        }
      }
    },
    series: [{
      name: 'Global Prevalence',
      data: disorderData.map(d => d.percentage),
      color: '#2C699A', // Choose a nice line color
      // Or use multiple colors for points if needed, though less common for lines
    }],
    legend: {
      enabled: false // Only one series, legend not needed
    },
    credits: {
      enabled: false // Disable Highcharts credits
    },
  };

  // Options for the Age Group 3D Bar Chart
  const ageGroupChartOptions = {
    chart: {
      type: 'column', // Use 'column' for vertical bars
      height: 350,
      backgroundColor: 'transparent',
      options3d: {
        enabled: true,
        alpha: 10,  // Vertical viewing angle
        beta: 25,   // Horizontal viewing angle
        depth: 70,  // Depth of the chart
        viewDistance: 30 // Higher value makes perspective less extreme
      }
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: ageGroupData.map(item => item.age),
      labels: {
        skew3d: true, // Skew labels to match 3D perspective
        style: {
          fontSize: '11px',
          color: '#4A5568'
        }
      },
       gridLineColor: '#E2E8F0', // Gray-200
       lineColor: '#CBD5E0', // Gray-300
       tickColor: '#CBD5E0'
    },
    yAxis: {
      title: {
        text: 'Prevalence (%)',
        margin: 20, // Add margin to avoid overlap with skewed labels
        style: {
           color: '#4A5568'
        }
      },
      labels: {
        format: '{value}%',
         style: {
           color: '#4A5568'
        }
      },
      gridLineColor: '#E2E8F0', // Gray-200
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br>',
      pointFormat: 'Prevalence: <b>{point.y:.1f}%</b>',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      style: {
        color: '#FFF'
      }
    },
    plotOptions: {
      column: {
        depth: 35, // Depth of columns
        colorByPoint: true, // Use different colors for each column
        colors: ageGroupColors, // Assign the vibrant color palette
        borderRadius: 3, // Slight rounding on column tops
        borderWidth: 0,
        dataLabels: { // Optional: Show labels on top of columns
          enabled: true,
          format: '{point.y:.1f}%',
          style: { fontSize: '10px', color: '#333', textOutline: 'none' },
          y: -10 // Position labels slightly above the bar
        }
      }
    },
    colors: ageGroupColors, // Ensure colors are applied
    series: [{
      name: 'Prevalence', // Name for the tooltip
      data: ageGroupData.map(item => item.prevalence),
    }],
    legend: {
      enabled: false // colorByPoint makes legend redundant
    },
    credits: {
      enabled: false
    },
  };

  // --- Card Components using Highcharts ---

  const DisordersCard = () => (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl h-full flex flex-col"
    >
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBrain className="text-emerald-600 text-lg" />
            <h3 className="font-semibold text-gray-800 text-lg">Global Mental Health Disorders</h3>
          </div>
          <IoIosInformationCircleOutline className="text-gray-400 text-xl hover:text-emerald-600 cursor-pointer transition-colors" title="Approximate global prevalence percentages (WHO & research institutes)" />
        </div>
        <p className="text-sm text-gray-500 mt-1">Prevalence trend across common disorders</p>
      </div>

      <div className="p-5 flex-grow">
        {mounted ? (
           <HighchartsReact
             highcharts={Highcharts}
             options={disordersChartOptions}
           />
         ) : (
           <div className="h-64 w-full bg-gray-100 rounded animate-pulse"></div> // Placeholder while mounting
         )}
      </div>
    </div>
  );

  const AgeGroupCard = () => (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl h-full flex flex-col"
    >
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GoGraph className="text-blue-600 text-lg" />
            <h3 className="font-semibold text-gray-800 text-lg">Mental Health by Age Group (3D)</h3>
          </div>
          <IoIosInformationCircleOutline className="text-gray-400 text-xl hover:text-blue-600 cursor-pointer transition-colors" title="Percentage experiencing mental illness in past year (approx. US data)" />
        </div>
        <p className="text-sm text-gray-500 mt-1">Prevalence across different age brackets</p>
      </div>

      <div className="p-5 flex-grow">
       {mounted ? (
           <HighchartsReact
             highcharts={Highcharts}
             options={ageGroupChartOptions}
           />
         ) : (
            <div className="h-64 w-full bg-gray-100 rounded animate-pulse"></div> // Placeholder while mounting
         )}
      </div>
    </div>
  );

  // Render Section
  if (!mounted) {
    // Render a larger placeholder for the whole section before Splide mounts
    return (
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Mental Health Statistics</h2>
        <div className="h-96 w-full bg-gray-100 rounded-xl animate-pulse"></div>
      </section>
    );
  }

  return (
    <section className="space-y-8 px-4 md:px-0"> {/* Add padding for smaller screens */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center md:text-left">Mental Health Statistics</h2>

      <Splide options={splideOptions} aria-label="Mental Health Statistics Charts">
        <SplideSlide>
          {/* Ensure chart components are fully rendered before Splide tries to calculate dimensions */}
          {mounted && <DisordersCard />}
        </SplideSlide>

        <SplideSlide>
          {mounted && <AgeGroupCard />}
        </SplideSlide>
      </Splide>
    </section>
  );
}