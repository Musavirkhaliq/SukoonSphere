import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {
  FaArrowUp,
  FaInfoCircle,
  FaUsers,
  FaBrain,
  FaChartLine,
  FaCircle,
  FaExternalLinkAlt,
  FaHeartbeat,
  FaHandHoldingHeart,
  FaGlobe
} from "react-icons/fa";
// Not using EnhancedSectionTitle in this component
// import EnhancedSectionTitle from "../shared/EnhancedSectionTitle";
import "./MentalHealthStats.css";

function MentalHealthStats() {
  const [timeRange, setTimeRange] = useState("5year");
  const [activeTab, setActiveTab] = useState("anxiety");
  const chartRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Initialize Highcharts 3D module
  useEffect(() => {
    // Load the 3D module after Highcharts is initialized
    if (typeof Highcharts === 'object') {
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

  // Intersection Observer to trigger animations when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.disconnect();
      }
    };
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

  // Get critical observation text
  const getCriticalObservation = () => {
    switch (activeTab) {
      case "anxiety":
        return "Anxiety disorders show dramatic spikes that correlate with major global events, suggesting environmental triggers play a significant role. The projected increase by 2025 indicates a potential mental health crisis if intervention strategies aren't implemented.";
      case "depression":
        return "Depression cases show a more sustained acceleration pattern, indicating persistent underlying factors beyond immediate events. The consistent upward trend suggests systemic issues in society that require comprehensive approaches to mental health care.";
      case "ptsd":
        return "PTSD data reveals the most dramatic rate of increase, suggesting a growing impact of traumatic events on the population. This trend highlights the need for improved trauma-informed care and early intervention programs.";
      case "youth":
        return "Youth mental health shows a more stable but concerning trend, pointing to ongoing systemic issues affecting younger generations. The steady increase suggests that current interventions are insufficient to address the underlying causes of youth mental health challenges.";
      default:
        return "The data reveals concerning trends across all mental health categories, with significant acceleration in recent years. These patterns suggest a growing mental health crisis that requires immediate attention and comprehensive intervention strategies.";
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
        backgroundColor: '#ffffff',
        style: {
          fontFamily: 'Inter, system-ui, sans-serif'
        }
      },
      title: {
        text: `${getCardTitle()} Trends`,
        style: {
          color: '#1f2937',
          fontWeight: 'bold',
          fontSize: '16px'
        }
      },
      xAxis: {
        categories: years,
        labels: {
          style: {
            color: '#4b5563'
          }
        },
        title: {
          text: 'Year',
          style: {
            color: '#1f2937'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Cases per 100,000',
          style: {
            color: '#1f2937'
          }
        },
        labels: {
          style: {
            color: '#4b5563'
          }
        },
        gridLineColor: 'rgba(0, 0, 0, 0.1)'
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Cases: {point.y} per 100,000',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderWidth: 0,
        shadow: true,
        style: {
          color: '#1f2937'
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
              textOutline: '1px contrast',
              fontWeight: 'bold'
            }
          },
          edgeColor: 'rgba(0,0,0,0.2)',
          edgeWidth: 1,
          borderRadius: 4
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
    <div className="stats-container" ref={containerRef}>
      <div className="stats-bg-pattern"></div>
      <div className="container mx-auto px-4">
        {/* <div className="stats-header">
          <h2 className="stats-title">Mental Health Statistics</h2>
          <p className="stats-subtitle">
            Explore the latest data on mental health conditions, their prevalence, and trends over time.
            Understanding these statistics helps us recognize the scale of mental health challenges and
            the importance of accessible support and treatment.
          </p>
        </div> */}

        {/* Key Statistics Cards */}
        <div className={`key-stats-grid ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="stat-card delay-100">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Global Prevalence</h3>
              <p className="stat-card-subtitle">
                Adults experiencing mental illness each year
              </p>
            </div>
            <div className="stat-card-body">
              <div className="stat-value">1 in 5</div>
              <div className="stat-icon">
                <FaGlobe />
              </div>
            </div>
          </div>

          <div className="stat-card delay-200">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Anxiety Increase</h3>
              <p className="stat-card-subtitle">
                Growth in anxiety disorders since 2020
              </p>
            </div>
            <div className="stat-card-body">
              <div className="stat-value">+17%</div>
              <div className="stat-icon">
                <FaArrowUp />
              </div>
            </div>
          </div>

          <div className="stat-card delay-300">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Early Onset</h3>
              <p className="stat-card-subtitle">
                Mental health conditions begin by age 14
              </p>
            </div>
            <div className="stat-card-body">
              <div className="stat-value">50%</div>
              <div className="stat-icon">
                <FaBrain />
              </div>
            </div>
          </div>

          <div className="stat-card delay-400">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Treatment Gap</h3>
              <p className="stat-card-subtitle">
                People with mental illness don't receive treatment
              </p>
            </div>
            <div className="stat-card-body">
              <div className="stat-value">60%</div>
              <div className="stat-icon">
                <FaUsers />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Mental Health Conditions Over Time</h3>
            <div className="chart-controls">
              <button
                className={`chart-control-btn ${timeRange === "5year" ? "active" : ""}`}
                onClick={() => setTimeRange("5year")}
              >
                5 Years
              </button>
              <button
                className={`chart-control-btn ${timeRange === "10year" ? "active" : ""}`}
                onClick={() => setTimeRange("10year")}
              >
                10 Years
              </button>
            </div>
          </div>

          <div className="chart-tabs">
            {[
              { id: "anxiety", label: "Anxiety" },
              { id: "depression", label: "Depression" },
              { id: "ptsd", label: "PTSD" },
              { id: "youth", label: "Youth Mental Health" }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`chart-tab ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="chart-content">
            <div className="chart-visualization">
              <HighchartsReact
                highcharts={Highcharts}
                options={getChartOptions()}
                ref={chartRef}
                containerProps={{ style: { height: '400px' } }}
              />
            </div>

            <div className="chart-insights">
              <h4 className="insights-title">Key Insights: {getCardTitle()}</h4>
              <ul className="insights-list">
                {getKeyInsights().map((insight, index) => (
                  <li key={index} className="insight-item">
                    <FaCircle className="insight-icon" />
                    <span className="insight-text">{insight}</span>
                  </li>
                ))}
              </ul>

              <div className="critical-observation">
                <h5 className="observation-title">
                  <FaInfoCircle className="observation-icon" />
                  Critical Observations
                </h5>
                <p className="observation-text">
                  {getCriticalObservation()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="additional-info">
          <div className="info-grid">
            <div className="info-card">
              <h4 className="info-title">
                <FaHeartbeat className="info-icon" />
                Why These Statistics Matter
              </h4>
              <p className="info-content">
                Understanding mental health statistics helps us recognize the scale of these challenges and the importance of accessible support. These numbers represent real people who need compassionate care and effective treatment options.
              </p>
              <Link to="/about/mental-health" className="info-link">
                Learn more about mental health
                <FaExternalLinkAlt className="info-link-icon" />
              </Link>
            </div>

            <div className="info-card">
              <h4 className="info-title">
                <FaHandHoldingHeart className="info-icon" />
                Finding Support
              </h4>
              <p className="info-content">
                If you or someone you know is struggling with mental health challenges, remember that help is available. SukoonSphere offers resources, community support, and guidance to help navigate these difficulties.
              </p>
              <Link to="/QA-section" className="info-link">
                Ask questions and find support
                <FaExternalLinkAlt className="info-link-icon" />
              </Link>
            </div>

            <div className="info-card">
              <h4 className="info-title">
                <FaChartLine className="info-icon" />
                Data Sources
              </h4>
              <p className="info-content">
                These statistics are compiled from reputable mental health organizations, research institutions, and government health agencies. The data is regularly updated to reflect the most current understanding of mental health trends.
              </p>
              <Link to="/about/our-research" className="info-link">
                Explore our research methodology
                <FaExternalLinkAlt className="info-link-icon" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentalHealthStats;
