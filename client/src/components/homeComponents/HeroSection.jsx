import { FaLongArrowAltRight } from "react-icons/fa"
import { Link } from "react-router-dom"
import video from '../../assets/videos/herosection.mp4'
export default function HeroSection() {
  return (
    <div className=" ">
    <section className="  relative w-full overflow-hidden  bg-primary-foreground  ">
      <div className="relative aspect-square md:aspect-[2.5/1] overflow-hidden ">
        {/* Video background with poster image fallback */}
        <div className="absolute inset-0 h-full w-full filter blur-[3px] ">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1200&auto=format&fit=crop"
            className="absolute inset-0 h-full w-full object-cover "
          >
            {/* Replace the src with your actual video URL */}
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-foreground/80 to-primary-foreground/40 flex flex-col items-center justify-center text-center p-6">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-primary-foreground">
              Your Journey to Mental Wellness Starts Here
            </h2>
            <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
              Connect with a supportive community, access resources, and find the help you need on your path to better
              mental health.
            </p>
            <div className="flex flex-col justify-center sm:flex-row gap-4">
              <Link to={"/QA-section"}>
                <button className="btn-1 ">
                  Ask questions 
                  <FaLongArrowAltRight className="ml-2" />
                </button>
              </Link>
              <Link to={"/posts"}>
                <button className="btn-2 glossy-effect-bar">
                  Share a story
                  <FaLongArrowAltRight className="ml-2" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}