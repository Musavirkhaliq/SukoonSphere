import { useState } from "react";
import { RiHeartFill, RiChat1Fill } from "react-icons/ri";
import SectionTitle from "../sharedComponents/SectionTitle";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

// Sample user post data
const userPosts = [
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        initials: "AJ",
      },
      content:
        "Today I practiced mindfulness for 20 minutes and it really helped with my anxiety. Small steps lead to big changes! #MentalHealthJourney",
      likes: 24,
      comments: 5,
      time: "2 hours ago",
    },
    {
      id: 2,
      user: {
        name: "Sam Rivera",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        initials: "SR",
      },
      content:
        "Just finished my therapy session. Reminder that seeking help is a sign of strength, not weakness. You're not alone in this journey.",
      likes: 42,
      comments: 8,
      time: "4 hours ago",
    },
    {
      id: 3,
      user: {
        name: "Jordan Lee",
        avatar: "https://randomuser.me/api/portraits/women/50.jpg",
        initials: "JL",
      },
      content:
        "Found this amazing podcast about dealing with work stress. It's been a game-changer for my daily routine! Anyone want the link?",
      likes: 18,
      comments: 12,
      time: "Yesterday",
    },
    {
      id: 4,
      user: {
        name: "Taylor Morgan",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
        initials: "TM",
      },
      content:
        "Remember: It's okay to set boundaries and prioritize your mental health. I've started saying 'no' more often and it's been liberating.",
      likes: 56,
      comments: 7,
      time: "2 days ago",
    },
    {
      id: 5,
      user: {
        name: "Casey Kim",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg",
        initials: "CK",
      },
      content:
        "Just joined a local support group and met some amazing people. Community connection is so important for mental wellness!",
      likes: 31,
      comments: 4,
      time: "3 days ago",
    },
  ];  
export default function UserPosts() {
  const [isOpen, setIsOpen] = useState(false);

  // Configure Splide options
  const splideOptions = {
    type: 'loop',
    perPage: 5,
    perMove: 1,
    autoplay: true,
    interval: 3000,
    pauseOnHover: true,
    arrows: false,
    pagination: false,
    gap: '1rem',
    direction: 'rtl',
    breakpoints: {
      1024: {
        perPage: 3,
      },
      768: {
        perPage: 2,
      },
      640: {
        perPage: 1,
      }
    }
  };

  const PostCard = ({ post }) => (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex flex-row-reverse items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm font-medium text-left">{post.user.name}</p>
            <p className="text-xs text-gray-500 text-left">{post.time}</p>
          </div>
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="h-10 w-10 rounded-full"
          />
        </div>
      </div>
      <p className="text-sm mt-3 text-left">{post.content}</p>
      <div className="flex flex-row-reverse items-center gap-5 mt-auto">
        <button className="text-sm font-medium text-blue-500 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <RiHeartFill className="h-4 w-4" />
          <span className="ml-1">{post.likes}</span>
        </button>
        <button className="text-sm font-medium text-blue-500 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <RiChat1Fill className="h-4 w-4" />
          <span className="ml-1">{post.comments}</span>
        </button>
      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      <SectionTitle title={"Community Posts"} />
      <div className=" px-4 md:px-8">
        <Splide options={splideOptions}>
          {userPosts.map((post) => (
            <SplideSlide key={post.id}>
              <PostCard post={post} />
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
}