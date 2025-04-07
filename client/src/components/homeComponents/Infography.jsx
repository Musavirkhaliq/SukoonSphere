import { useState, useEffect, useRef } from "react";
import { FaDotCircle, FaInfoCircle, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaArrowUpRightDots, FaArrowUpRightFromSquare } from "react-icons/fa6";
import SectionTitle from "../sharedComponents/SectionTitle";

// Import Highcharts directly as a script in the HTML
// This avoids module loading issues in production
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

function Infography() {
  const [timeRange, setTimeRange] = useState("5year");
  const [activeTab, setActiveTab] = useState("anxiety");
  const chartRef = useRef(null);

  // Initialize Highcharts 3D module
  useEffect(() => {
    // Load the 3D module after Highcharts is initialized
    if (typeof Highcharts === 'object') {
      // This dynamic import works better in production
      import('highcharts/highcharts-3d')
        .then(module => {
          module.default(Highcharts);
          // If we have a chart already, redraw it
          if (chartRef.current && chartRef.current.chart) {
            chartRef.current.chart.redraw();
          }
        })
        .catch(err => console.error("Failed to load 3D module:", err));
    }
  }, []);

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

  // Animate the chart when tab or time range changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (chartRef.current && chartRef.current.chart) {
        const chart = chartRef.current.chart;
        
        // Animated rotation for 3D effect
        let alpha = 0;
        const intervalId = setInterval(() => {
          alpha += 2;
          if (alpha > 15) {
            clearInterval(intervalId);
            return;
          }
          
          chart.update({
            chart: {
              options3d: {
                alpha: alpha
              }
            }
          }, true, false);
        }, 30);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeTab, timeRange]);

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
        ];
      case "depression":
        return [
          "Steady increase until 2022, followed by sharp acceleration",
          "Cases expected to nearly triple from 2021 to 2025",
          "Dramatic rise of 49% between 2023 and 2024",
          "10-year data shows more gradual increase before 2020",
        ];
      case "ptsd":
        return [
          "Cases nearly doubled between 2022 and 2023",
          "Projected 5-fold increase from 2021 to 2025",
          "Sharpest acceleration among all mental health conditions",
          "10-year data shows stability until recent years",
        ];
      case "youth":
        return [
          "Most consistent growth pattern among all categories",
          "20% increase projected from 2021 to 2025",
          "Less dramatic spikes compared to adult mental health conditions",
          "10-year data shows steady, concerning upward trajectory",
        ];
      default:
        return [
          "Data shows concerning trends across all mental health categories",
          "Significant acceleration in recent years",
          "Projected continued increase through 2025",
          "Youth mental health shows steadier but persistent growth",
        ];
    }
  };

  // Get alternative colors for bars based on year
  const getBarColors = () => {
    const baseColor = getChartColor();
    const data = getActiveData();
    
    // Generate a different color for each year's bar
    return data.map((item, index) => {
      // Create color variations based on position in array
      const position = index / (data.length - 1); // 0 to 1
      
      // Different color strategies for different mental health categories
      switch (activeTab) {
        case "anxiety":
          // Red gradient from light to dark
          return `rgba(239, ${Math.floor(100 - position * 50)}, ${Math.floor(100 - position * 60)}, 0.9)`;
        case "depression":
          // Blue gradient
          return `rgba(${Math.floor(99 + position * 20)}, ${Math.floor(102 - position * 20)}, ${Math.floor(241 - position * 40)}, 0.9)`;
        case "ptsd":
          // Purple gradient
          return `rgba(${Math.floor(168 + position * 30)}, ${Math.floor(85 - position * 20)}, ${Math.floor(247 - position * 40)}, 0.9)`;
        case "youth":
          // Orange to red gradient
          return `rgba(${Math.floor(239 - position * 0)}, ${Math.floor(130 - position * 80)}, ${Math.floor(44 + position * 25)}, 0.9)`;
        default:
          return baseColor;
      }
    });
  };

  // Prepare chart options for Highcharts
  const getChartOptions = () => {
    const data = getActiveData();
    const years = data.map(item => item.year.toString());
    const values = data.map(item => item.value);
    const colors = getBarColors();
    
    return {
      chart: {
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25
        },
        backgroundColor: '#1f2937', // Dark background
        style: {
          fontFamily: 'Inter, system-ui, sans-serif'
        }
      },
      title: {
        text: `${getCardTitle()} Statistics`,
        style: {
          color: '#ffffff',
          fontWeight: 'bold'
        }
      },
      xAxis: {
        categories: years,
        labels: {
          style: {
            color: '#d1d5db'
          }
        },
        title: {
          text: 'Year',
          style: {
            color: '#ffffff'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Cases per 100,000',
          style: {
            color: '#ffffff'
          }
        },
        labels: {
          style: {
            color: '#d1d5db'
          }
        },
        gridLineColor: 'rgba(255, 255, 255, 0.1)'
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Cases: {point.y} per 100,000',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        style: {
          color: '#ffffff'
        }
      },
      plotOptions: {
        column: {
          depth: 25,
          colorByPoint: true,
          dataLabels: {
            enabled: true,
            color: '#ffffff',
            style: {
              textOutline: '1px contrast'
            }
          },
          edgeColor: 'rgba(0,0,0,0.2)',
          edgeWidth: 1
        }
      },
      colors: colors,
      series: [{
        name: getCardTitle(),
        data: values,
        showInLegend: false
      }],
      credits: {
        enabled: false
      }
    };
  };

  return (
    <div className="min-h-screen">
      <SectionTitle title={"Mental Health Statistics"} />
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
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={getChartOptions()}
                      ref={chartRef}
                      containerProps={{ className: 'w-full h-full' }}
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