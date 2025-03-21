import { useState } from "react";
import { FaInfoCircle, FaUsers } from "react-icons/fa";

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
  Legend
);

function Infography() {
  const [timeRange, setTimeRange] = useState("5year");
  const [activeTab, setActiveTab] = useState("anxiety");

  // Updated mental health statistics data with projections through 2025
  const anxietyData = {
    "5year": [
      { year: 2021, value: 50 }, // ~50 million
      { year: 2022, value: 52 }, // ~52 million
      { year: 2023, value: 99 }, // ~55 million
      { year: 2024, value: 58 }, // ~58 million
      { year: 2025, value: 150 }, // ~62 million
    ],
    "10year": [
      { year: 2016, value: 44 }, // ~44 million
      { year: 2017, value: 45 }, // 44.9M reported
      { year: 2018, value: 46 }, // Slight increase
      { year: 2019, value: 80 }, // Pre-COVID growth
      { year: 2020, value: 49 }, // Early COVID impact
      { year: 2021, value: 50 }, // ~50 million
      { year: 2022, value: 99 }, // ~52 million
      { year: 2023, value: 105 }, // ~55 million
      { year: 2024, value: 200 }, // ~58 million
      { year: 2025, value: 250 }, // ~62 million
    ],
  };

  const depressionData = {
    "5year": [
      { year: 2021, value: 51 }, // ~51 million
      { year: 2022, value: 53 }, // ~53 million
      { year: 2023, value: 70 }, // ~56 million
      { year: 2024, value: 105 }, // ~59 million
      { year: 2025, value: 150 }, // ~63 million
    ],
    "10year": [
      { year: 2016, value: 45 }, // ~45 million
      { year: 2017, value: 46 }, // 45.7M reported
      { year: 2018, value: 47 }, // Slight increase
      { year: 2019, value: 48 }, // Pre-COVID
      { year: 2020, value: 50 }, // COVID impact
      { year: 2021, value: 51 }, // ~51 million
      { year: 2022, value: 53 }, // ~53 million
      { year: 2023, value: 70 }, // ~56 million
      { year: 2024, value: 105 }, // ~59 million
      { year: 2025, value: 150 }, // ~63 million
    ],
  };

  const ptsdData = {
    "5year": [
      { year: 2021, value: 16 }, // ~16 million
      { year: 2022, value: 17 }, // ~17 million
      { year: 2023, value: 33 }, // ~18 million
      { year: 2024, value: 59 }, // ~19 million
      { year: 2025, value: 83 }, // ~20 million
    ],
    "10year": [
      { year: 2016, value: 14 }, // ~14 million
      { year: 2017, value: 14 }, // Stable
      { year: 2018, value: 15 }, // Slight rise
      { year: 2019, value: 15 }, // Pre-COVID
      { year: 2020, value: 16 }, // COVID trauma
      { year: 2021, value: 16 }, // ~16 million
      { year: 2022, value: 17 }, // ~17 million
      { year: 2023, value: 18 }, // ~18 million
      { year: 2024, value: 19 }, // ~19 million
      { year: 2025, value: 20 }, // ~20 million
    ],
  };

  const youthData = {
    "5year": [
      { year: 2021, value: 70 }, // ~70 million
      { year: 2022, value: 74 }, // ~74 million
      { year: 2023, value: 78 }, // ~78 million
      { year: 2024, value: 81 }, // ~81 million
      { year: 2025, value: 84 }, // ~84 million
    ],
    "10year": [
      { year: 2016, value: 61 }, // ~61 million
      { year: 2017, value: 63 }, // Slight rise
      { year: 2018, value: 65 }, // Steady growth
      { year: 2019, value: 67 }, // Pre-COVID
      { year: 2020, value: 69 }, // COVID impact
      { year: 2021, value: 70 }, // ~70 million
      { year: 2022, value: 74 }, // ~74 million
      { year: 2023, value: 78 }, // ~78 million
      { year: 2024, value: 81 }, // ~81 million
      { year: 2025, value: 84 }, // ~84 million
    ],
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

  // Prepare Chart.js data
  const chartData = {
    labels: getActiveData().map((item) => item.year.toString()),
    datasets: [
      {
        label: getCardTitle(),
        data: getActiveData().map((item) => item.value),
        borderColor: getChartColor(),
        backgroundColor: getChartColor(),
        pointRadius: 4,
        pointHoverRadius: 8,
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  // Chart.js options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(200, 200, 200, 0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      <SectionTitle title={"Mental health Stats"} />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className=" flex flex-col gap-6 justify-center items-center max-w-7xl mx-auto relative text-center">
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
                  className={`py-2 px-4 border-b-2 ${activeTab === tab ? "border-[var(--primary)] font-medium" : "border-transparent"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "ptsd"
                    ? "PTSD"
                    : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold">{getCardTitle()}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {getCardDescription()}
                </p>
              </div>
              <div className="h-96 px-4">
                <div className="w-full h-full">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400 border-t dark:border-gray-700">
                {getCardFooter()}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 text-white">
          <div className="bg-[var(--primary)] dark:bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">
              Why Mental Health Awareness Matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Reducing Stigma</h3>
                <p className="text-gray-300 dark:text-gray-300 mb-4">
                  Stigma prevents many people from seeking help. By increasing
                  awareness and understanding, we can create a more supportive
                  environment for those experiencing mental health challenges.
                </p>
                <h3 className="text-xl font-semibold mb-3">
                  Early Intervention
                </h3>
                <p className="text-gray-300 dark:text-gray-300">
                  Recognizing the signs early leads to better outcomes. Mental
                  health education helps people identify symptoms sooner and
                  seek appropriate care before conditions worsen.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Improving Access to Care
                </h3>
                <p className="text-gray-300 dark:text-gray-300 mb-4">
                  Awareness drives policy change and resource allocation. As
                  more people understand the importance of mental health,
                  support for expanding services and coverage increases.
                </p>
                <h3 className="text-xl font-semibold mb-3">
                  Building Resilience
                </h3>
                <p className="text-gray-300 dark:text-gray-300">
                  Mental health education provides tools for managing stress and
                  building coping skills, helping people navigate life's
                  challenges more effectively.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Infography;
