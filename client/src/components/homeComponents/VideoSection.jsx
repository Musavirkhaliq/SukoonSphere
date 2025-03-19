import { useState, useRef } from "react"
import { FiPlay, FiChevronLeft, FiChevronRight, FiX, FiVolume2, FiVolumeX } from "react-icons/fi"
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import SectionTitle from "../sharedComponents/SectionTitle"
// Sample video data
import video from "../../assets/videos/video2.mp4"
const videos = [
    {
      id: 1,
      title: "5-Minute Breathing Exercise for Stress Relief",
      thumbnail: "/placeholder.svg?height=400&width=250",
      duration: "5:12",
      author: "Dr. Emma Chen",
      videoUrl: video // Demo video
    },
    {
      id: 2,
      title: "My Mental Health Journey: From Burnout to Recovery",
      thumbnail: "/placeholder.svg?height=400&width=250",
      duration: "8:45",
      author: "Michael Torres",
      videoUrl: "https://www.w3schools.com/html/movie.mp4" // Demo video
    },
    {
      id: 3,
      title: "Understanding Depression: Signs, Symptoms & Support",
      thumbnail: "/placeholder.svg?height=400&width=250",
      duration: "12:30",
      author: "Health Matters",
      videoUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" // Demo video
    },
    {
      id: 4,
      title: "Quick Mood-Boosting Activities for Busy Days",
      thumbnail: "/placeholder.svg?height=400&width=250",
      duration: "4:18",
      author: "Wellness With Jamie",
      videoUrl: "https://file-examples.com/storage/fe7fcd84eebd1e7e0868cc4/2017/04/file_example_MP4_480_1_5MG.mp4" // Demo video
    },
    {
      id: 5,
      title: "Morning Routine for Better Mental Health",
      thumbnail: "/placeholder.svg?height=400&width=250",
      duration: "7:22",
      author: "Dr. Emma Chen",
      videoUrl: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4" // Demo video
    },
    {
      id: 6,
      title: "How to Practice Self-Compassion Daily",
      thumbnail: "/placeholder.svg?height=400&width=250",
      duration: "6:15",
      author: "Michael Torres",
      videoUrl: "https://filesamples.com/samples/video/mp4/sample_640x360.mp4" // Demo video
    }
  ]
  
export default function VideoReels() {
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [muted, setMuted] = useState(true)
  const videoRef = useRef(null)

  const splideOptions = {
    perPage: 4,
    perMove: 1,
    gap: '1rem',
    pagination: false,
    arrows: false,
    breakpoints: {
      1200: { perPage: 3 },
      768: { perPage: 2 },
      640: { perPage: 1.5 },
      480: { perPage: 1.2 }
    }
  }

  const openVideoPlayer = (video) => {
    setSelectedVideo(video)
    // Reset muted state when opening new video
    setMuted(true)
  }

  const closeVideoPlayer = () => {
    setSelectedVideo(null)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const toggleMute = () => {
    setMuted(!muted)
    if (videoRef.current) {
      videoRef.current.muted = !muted
    }
  }

  return (
    <section className="p-4 md:p-8">
      {/* Header */}
      <SectionTitle title="Video Reels" />
      {/* Video Reels Carousel */}
      <Splide options={splideOptions} aria-label="Video Reels">
        {videos.map((video) => (
          <SplideSlide key={video.id}>
            <div 
              className=" rounded-xl overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer h-[440px] "
              onClick={() => openVideoPlayer(video)}
            >
              {/* Video Thumbnail */}
              <div className="relative h-full">
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
                  <div className="p-3 bg-white/80 rounded-full">
                    <FiPlay className="text-2xl text-gray-800" />
                  </div>
                </div>
                
                {/* Duration Badge */}
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                  {video.duration}
                </div>
                
                {/* Video Info (at bottom) */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-lg font-medium text-white line-clamp-2 mb-1">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-200">
                    {video.author}
                  </p>
                </div>
                {/* Video */}
                <video
                  className="w-full h-full object-cover"
                  src={video.videoUrl}
                  loop
                  muted={muted}
                  playsInline
                />
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>

      {/* Fullscreen Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          {/* Video Player */}
          <div className="relative w-full h-full max-w-3xl">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              src={selectedVideo.videoUrl}
              poster={selectedVideo.thumbnail}
              autoPlay
              muted={muted}
              controls={false}
              loop
            />
            
            {/* Video Controls */}
            <div className="absolute top-4 right-4 flex space-x-4">
              <button 
                onClick={toggleMute}
                className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
              >
                {muted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
              </button>
              <button 
                onClick={closeVideoPlayer}
                className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
              >
                <FiX size={24} />
              </button>
            </div>
            
            {/* Video Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedVideo.title}
              </h3>
              <p className="text-sm text-gray-200">
                {selectedVideo.author} • {selectedVideo.duration}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}