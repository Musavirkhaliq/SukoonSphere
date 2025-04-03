import { useState, useRef } from "react";
import { FaLongArrowAltRight, FaPlay, FaPause } from "react-icons/fa";
import { Link } from "react-router-dom";
import video from '../../assets/videos/herosection.mp4';
import { motion, useScroll, useTransform } from "framer-motion";
import "./HeroSection.css";

export default function HeroSection() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef(null);
  const heroRef = useRef(null);

  // Parallax effect with scroll
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Floating elements animation variants
  const floatingElements = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.8
      }
    }
  };

  const floatingItem = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div ref={heroRef} className="hero-section-wrapper">
      {/* Decorative elements */}
      <div className="hero-decorative-elements">
        <div className="hero-circle-1"></div>
        <div className="hero-circle-2"></div>
        <div className="hero-circle-3"></div>
        <div className="hero-line-1"></div>
        <div className="hero-line-2"></div>
      </div>

      <section className="hero-section">
        {/* Video container with enhanced effects */}
        <div className="hero-video-container">
          {/* Gradient overlay for better text readability and visual appeal */}
          <div className="hero-overlay">
            <div className="hero-gradient-overlay"></div>
            <div className="hero-noise-overlay"></div>
          </div>

          {/* Main video */}
          <motion.div
            className="hero-video-wrapper"
            style={{ y, opacity }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1200&auto=format&fit=crop"
              className="hero-video"
            >
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video controls */}
            <button
              className="hero-video-control"
              onClick={toggleVideo}
              aria-label={isVideoPlaying ? "Pause video" : "Play video"}
            >
              {isVideoPlaying ? <FaPause /> : <FaPlay />}
            </button>
          </motion.div>
        </div>

        {/* Content overlay with enhanced layout */}
        <div className="hero-content">
          <div className="hero-content-container">
            {/* Floating elements that appear as user scrolls */}
            <motion.div
              className="hero-floating-elements"
              variants={floatingElements}
              initial="hidden"
              animate="visible"
            >
              {/* <motion.div className="hero-floating-badge" variants={floatingItem}>
                <span className="hero-badge-icon">🌟</span>
                <span className="hero-badge-text">Mental Wellness</span>
              </motion.div>

              <motion.div className="hero-floating-badge" variants={floatingItem}>
                <span className="hero-badge-icon">💪</span>
                <span className="hero-badge-text">Community Support</span>
              </motion.div>

              <motion.div className="hero-floating-badge" variants={floatingItem}>
                <span className="hero-badge-icon">🧠</span>
                <span className="hero-badge-text">Expert Resources</span>
              </motion.div> */}
            </motion.div>

            {/* Main content with enhanced typography */}
            <motion.div
              className="hero-main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.h1
                className="hero-title"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="hero-title-line">Empowering</span>
                <span className="hero-title-line">Minds,{" "}</span>
                <span className="hero-title-highlight">Enhancing Lives</span>
              </motion.h1>

              <motion.p
                className="hero-description"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Join hands with those who care, find solace in supportive air.
                Resources abound, guidance is near, on your journey to peaceful mind and clear.
              </motion.p>

              <motion.div
                className="hero-cta-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link to="/QA-section" className="hero-cta-primary">
                  <span className="hero-cta-text">Ask questions</span>
                  <span className="hero-cta-icon">
                    <FaLongArrowAltRight />
                  </span>
                </Link>

                <Link to="/posts" className="hero-cta-secondary">
                  <span className="hero-cta-text">Share a story</span>
                  <span className="hero-cta-icon">
                    <FaLongArrowAltRight />
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="hero-scroll-indicator"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              {/* <div className="hero-scroll-text">Scroll to explore</div> */}
              {/* <div className="hero-scroll-icon"></div> */}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}