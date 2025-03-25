import { useState, useEffect, useRef } from "react";
import { FaDotCircle, FaInfoCircle, FaUsers } from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { FaArrowUpRightDots, FaArrowUpRightFromSquare } from "react-icons/fa6";
import SectionTitle from "../sharedComponents/SectionTitle";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function Infography() {
  const [timeRange, setTimeRange] = useState("5year");
  const [activeTab, setActiveTab] = useState("anxiety");
  const chartRef = useRef(null);

  // State to manage animation progress
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef(null);

  // Mental health statistics data with projections through 2025
  const anxietyData = {
    "5year": [
      { year: 2021, value: 50 },
      { year: 2022, value: 52 },
      { year: 2023, value: 99 },
      { year: 2024, value: 58 },
      { year: 2025, value: 150 },
    ],
    "10year": [
      { year: 2016, value: 44 },
      { year: 2017, value: 45 },
      { year: 2018, value: 46 },
      { year: 2019, value: 80 },
      { year: 2020, value: 49 },
      { year: 2021, value: 50 },
      { year: 2022, value: 99 },
      { year: 2023, value: 105 },
      { year: 2024, value: 200 },
      { year: 2025, value: 250 },
    ],
  };

  const depressionData = {
    "5year": [
      { year: 2021, value: 51 },
      { year: 2022, value: 53 },
      { year: 2023, value: 70 },
      { year: 2024, value: 105 },
      { year: 2025, value: 150 },
    ],
    "10year": [
      { year: 2016, value: 45 },
      { year: 2017, value: 46 },
      { year: 2018, value: 47 },
      { year: 2019, value: 48 },
      { year: 2020, value: 50 },
      { year: 2021, value: 51 },
      { year: 2022, value: 53 },
      { year: 2023, value: 70 },
      { year: 2024, value: 105 },
      { year: 2025, value: 150 },
    ],
  };

  const ptsdData = {
    "5year": [
      { year: 2021, value: 16 },
      { year: 2022, value: 17 },
      { year: 2023, value: 33 },
      { year: 2024, value: 59 },
      { year: 2025, value: 83 },
    ],
    "10year": [
      { year: 2016, value: 14 },
      { year: 2017, value: 14 },
      { year: 2018, value: 15 },
      { year: 2019, value: 15 },
      { year: 2020, value: 16 },
      { year: 2021, value: 16 },
      { year: 2022, value: 17 },
      { year: 2023, value: 18 },
      { year: 2024, value: 19 },
      { year: 2025, value: 20 },
    ],
  };

  const youthData = {
    "5year": [
      { year: 2021, value: 70 },
      { year: 2022, value: 74 },
      { year: 2023, value: 78 },
      { year: 2024, value: 81 },
      { year: 2025, value: 84 },
    ],
    "10year": [
      { year: 2016, value: 61 },
      { year: 2017, value: 63 },
      { year: 2018, value: 65 },
      { year: 2019, value: 67 },
      { year: 2020, value: 69 },
      { year: 2021, value: 70 },
      { year: 2022, value: 74 },
      { year: 2023, value: 78 },
      { year: 2024, value: 81 },
      { year: 2025, value: 84 },
    ],
  };

  // Reset animation when tab or time range changes
  useEffect(() => {
    // Restart the animation when tab or time range changes
    triggerAnimation();

    // Clean up animation frame on unmount or changes
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeTab, timeRange]);

  // Function to trigger the progressive animation with requestAnimationFrame
  const triggerAnimation = () => {
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Reset animation progress
    setAnimationProgress(0);

    const startTime = performance.now();
    const duration = 2000; // Animation duration in ms

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Use easeOutCubic easing function for smoother motion
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setAnimationProgress(easedProgress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const getActiveData = () => {
    switch (activeTab) {
      case "anxiety":
        return anxietyData[timeRange];
      case "depression":
        return depressionData[timeRange];
      case "ptsd":
        return ptsdData[timeRange];
      case "youth":
        return youthData[timeRange];
      default:
        return anxietyData[timeRange];
    }
  };

  const getChartColor = () => {
    switch (activeTab) {
      case "anxiety":
        return "#ef4444";
      case "depression":
        return "#6366f1";
      case "ptsd":
        return "#a855f7";
      case "youth":
        return "#ef4444";
      default:
        return "#818cf8";
    }
  };

  const getCardTitle = () => {
    switch (activeTab) {
      case "anxiety":
        return "Anxiety Disorders";
      case "depression":
        return "Depression";
      case "ptsd":
        return "Post-Traumatic Stress Disorder";
      case "youth":
        return "Youth Mental Health";
      default:
        return "Anxiety Disorders";
    }
  };

  const getCardDescription = () => {
    switch (activeTab) {
      case "anxiety":
        return "Cases per 100,000 population, showing a significant increase since 2020";
      case "depression":
        return "Cases per 100,000 population, showing consistent growth over time";
      case "ptsd":
        return "Cases per 100,000 population, with sharp increase during global events";
      case "youth":
        return "Cases per 100,000 population (ages 10-24), showing alarming growth";
      default:
        return "Cases per 100,000 population, showing a significant increase since 2020";
    }
  };

  const getCardFooter = () => {
    switch (activeTab) {
      case "anxiety":
        return "Note: Significant increase observed during the global pandemic period";
      case "depression":
        return "Note: Depression remains one of the most common mental health conditions globally";
      case "ptsd":
        return "Note: PTSD diagnoses increased significantly during periods of collective trauma";
      case "youth":
        return "Note: Youth mental health concerns have grown at a faster rate than adult cases";
      default:
        return "Note: Significant increase observed during the global pandemic period";
    }
  };

  // Get key insights for bullet points
  const getKeyInsights = () => {
    switch (activeTab) {
      case "anxiety":
        return [
          "Significant spike in 2023 with cases nearly doubling from 2022",
          "Projected to reach 150 cases per 100,000 by 2025",
          "Shows dramatic increase following the global pandemic",
          "2024 shows anomalous dip before sharp increase in 2025",
          "10-year data reveals consistent upward trend with periodic spikes"
        ];
      case "depression":
        return [
          "Steady increase until 2022, followed by sharp acceleration",
          "Cases expected to nearly triple from 2021 to 2025",
          "Dramatic rise of 49% between 2023 and 2024",
          "10-year data shows more gradual increase before 2020",
          "Acceleration appears more pronounced than for anxiety disorders"
        ];
      case "ptsd":
        return [
          "Cases nearly doubled between 2022 and 2023",
          "Projected 5-fold increase from 2021 to 2025",
          "Sharpest acceleration among all mental health conditions",
          "10-year data shows stability until recent years",
          "Indicates possible link to collective trauma events"
        ];
      case "youth":
        return [
          "Most consistent growth pattern among all categories",
          "20% increase projected from 2021 to 2025",
          "Less dramatic spikes compared to adult mental health conditions",
          "10-year data shows steady, concerning upward trajectory",
          "Suggests ongoing systemic issues affecting youth mental health"
        ];
      default:
        return [
          "Data shows concerning trends across all mental health categories",
          "Significant acceleration in recent years",
          "Projected continued increase through 2025",
          "Youth mental health shows steadier but persistent growth",
          "Data suggests need for increased mental health resources"
        ];
    }
  };

  // Smoothly animate line chart data points
  const getCurrentDataPoints = () => {
    const fullData = getActiveData();
    const result = [];

    // For each data point in the full dataset
    for (let i = 0; i < fullData.length; i++) {
      // If this is the first point or we've passed this point's position in the animation
      if (i === 0 || i <= (fullData.length - 1) * animationProgress) {
        result.push(fullData[i]);
      } else {
        // This is a point we're currently animating toward
        // Calculate the previous point we've already reached
        const prevIndex = i - 1;
        const prevPoint = fullData[prevIndex];

        // Calculate how far we are between the previous point and this point
        const segmentProgress = (animationProgress * (fullData.length - 1) - prevIndex) / 1;

        // If we haven't started moving to this point yet, don't include it
        if (segmentProgress <= 0) break;

        // If we're interpolating between points
        if (segmentProgress > 0 && segmentProgress < 1) {
          // Interpolate the value
          const currentPoint = fullData[i];
          const interpolatedValue = prevPoint.value + segmentProgress * (currentPoint.value - prevPoint.value);

          // Add the interpolated point and stop
          result.push({ year: currentPoint.year, value: interpolatedValue });
          break;
        } else {
          // We've reached this point completely
          result.push(fullData[i]);
        }
      }
    }

    return result;
  };

  // Prepare Chart.js data with smooth animation
  const chartData = {
    labels: getActiveData().map(item => item.year.toString()),
    datasets: [
      {
        label: getCardTitle(),
        data: getCurrentDataPoints().map(item => item.value),
        borderColor: getChartColor(),
        backgroundColor: getChartColor(),
        pointRadius: (context) => {
          // Only show points for completed segments
          const index = context.dataIndex;
          const fullData = getActiveData();
          return index < getCurrentDataPoints().length - 1 ||
            index === fullData.length - 1 && animationProgress === 1 ? 6 : 0;
        },
        pointHoverRadius: 10,
        borderWidth: 3,
        tension: 0.3, // Increased for smoother curve
        fill: false,
      },
    ],
  };

  // Enhanced Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            weight: 'bold',
          }
        }
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.1)",
        },
        ticks: {
          font: {
            weight: 'bold',
          }
        },
        // Keep a consistent scale even during animation
        min: 0,
        max: Math.max(...getActiveData().map(item => item.value)) * 1.1
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold',
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 6,
        displayColors: false,
      },
    },
    // Disable default Chart.js animations as we're handling it ourselves
    animation: false,
    elements: {
      point: {
        radius: 6,
        borderWidth: 3,
        hoverRadius: 10,
        hoverBorderWidth: 4,
      },
      line: {
        tension: 0.3, // Increased for smoother curve
        borderWidth: 3,
        capBezierPoints: true
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      <SectionTitle title={"Mental health Stats"} />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="flex flex-col gap-6 justify-center items-center max-w-7xl mx-auto relative text-center">
            <div className="bg-[var(--primary)] text-[--gray-700] text-[12px] sm:text-sm inline-flex items-center py-2 px-2 rounded-full mb-4 glossy-effect-bar">
              <span className="bg-[#01427a] text-white rounded-full w-4 h-4 flex items-center justify-center mr-2">
                S
              </span>
              <Link
                to={"/about/mental-health"}
                target="_blank"
                className="hover:text-[var(--ternery)] text-white"
              >
                SukoonSphere: For Mental Health Challenges
              </Link>
            </div>
            <Link to="about/mental-health">
              <h2
                className="font-bold text-[var(--grey--900)] hover:text-[var(--ternery)] cursor-pointer text-[1.6rem] md:text-[2.5rem] lg:text-[3.5rem] sm:leading-[3.5rem]"
                data-aos="fade-up"
              >
                Mental Health Challenges
              </h2>
            </Link>
            <p
              className=":text-center text-lg font-light text-[var(--grey--800)] md:px-8 lg:px-0 text-justify lg:text-center"
              data-aos="fade-up"
            >
              Overcoming emotional, psychological, and social hurdles that
              impact mental well-being and daily functioning <br /> through
              support, guidance, and resilience-building.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 pb-2">
                <h3 className="text-2xl font-bold">1 in 5</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Adults experience mental illness each year
                </p>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-[var(--primary)] flex items-center gap-2">
                  20% <FaArrowUpRightDots className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 pb-2">
                <h3 className="text-2xl font-bold">17%</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Increase in anxiety disorders since 2020
                </p>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-[var(--primary)] flex items-center gap-2">
                  +17% <FaArrowUpRightDots className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 pb-2">
                <h3 className="text-2xl font-bold">50%</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Of conditions begin by age 14
                </p>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-[var(--primary)] flex items-center gap-2">
                  50% <FaInfoCircle className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-4 pb-2">
                <h3 className="text-2xl font-bold">60%</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Of people with mental illness don't receive treatment
                </p>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-[var(--primary)] flex items-center gap-2">
                  60% <FaUsers className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Mental Health Conditions Over Time
            </h2>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded-md text-sm ${timeRange === "5year" ? "bg-[var(--primary)] text-white" : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"}`}
                onClick={() => setTimeRange("5year")}
              >
                5 Years
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${timeRange === "10year" ? "bg-[var(--primary)] text-white" : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"}`}
                onClick={() => setTimeRange("10year")}
              >
                10 Years
              </button>
            </div>
          </div>

          <div className="tabs">
            <div className="tab-header grid grid-cols-4 mb-6">
              {["anxiety", "depression", "ptsd", "youth"].map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 border-b-2 transition-all duration-300 ${activeTab === tab ? "border-[var(--primary)] font-medium" : "border-transparent hover:border-gray-200"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "ptsd"
                    ? "PTSD"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Modified layout - Split into two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="p-6">
                  <h3 className="text-xl font-bold">{getCardTitle()}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {getCardDescription()}
                  </p>
                </div>
                <div className="h-96 px-4 relative">
                  <div className="w-full h-full">
                    <Line
                      data={chartData}
                      options={chartOptions}
                      ref={chartRef}
                      key={`${activeTab}-${timeRange}`}
                    />
                  </div>
                </div>
                <div className="p-4 text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
                  {getCardFooter()}
                </div>

              </div>

              {/* Right Column - Bullet Points */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-lg hidden md:block">
                <div className="p-6">
                  <h3 className="text-xl font-bold">Key Insights: {getCardTitle()}</h3>
                  <div className="mt-6">
                    <ul className="space-y-4">
                      {getKeyInsights().map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <div className="mr-3 h-6 w-6 text-[var(--primary)] flex-shrink-0 mt-0.5">
                            <FaDotCircle className="h-5 w-5" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-[var(--primary)] dark:text-blue-300 mb-2">
                      <FaInfoCircle className="inline mr-2" /> Critical Observations
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      {activeTab === "anxiety" && "Anxiety disorders show dramatic spikes that correlate with major global events, suggesting environmental triggers play a significant role."}
                      {activeTab === "depression" && "Depression cases show a more sustained acceleration pattern, indicating persistent underlying factors beyond immediate events."}
                      {activeTab === "ptsd" && "PTSD data reveals the most dramatic rate of increase, suggesting a growing impact of traumatic events on the population."}
                      {activeTab === "youth" && "Youth mental health shows a more stable but concerning trend, pointing to ongoing systemic issues affecting younger generations."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Infography;