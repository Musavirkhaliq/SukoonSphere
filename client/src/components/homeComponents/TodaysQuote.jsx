import { useState, useRef, useEffect } from "react"
import { FaHeart, FaSun, FaFistRaised, FaTree, FaHandHoldingHeart, FaFeather, FaTrophy, FaFire, FaStar, FaGem, FaShareAlt, FaTwitter, FaFacebook, FaWhatsapp, FaLink } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import "../../assets/styles/TodaysQuote.css";

// Define the attributes with their properties
const attributes = [
  {
    name: "Hope",
    link: "QA-section",
    actionName: "QA-section",
    color: "bg-rose-400",
    hoverColor: "hover:bg-rose-500",
    textColor: "text-rose-500",
    borderColor: "border-rose-300",
    icon: <FaHeart className="text-white text-2xl md:text-3xl" />,
    quotes: [
    "Hope is being able to see that there is light despite all of the darkness.",
    "Hope is the only thing stronger than fear.",
    "Hope is the pillar that holds up the world.",
    "Once you choose hope, anything’s possible.",
    "Hope is like the sun. If you only believe in it when you see it, you’ll never make it through the night.",
    "Hope is a waking dream.",
    "Everything that is done in this world is done by hope.",
    "Hope is the companion of power and the mother of success.",
    "Hope is not pretending that troubles don't exist. It is the trust that they will not last forever.",
    "Hope is the thing with feathers that perches in the soul and sings the tune without the words and never stops at all.",
    "When the world says 'give up,' hope whispers, 'try it one more time.'",
    "Hope is the heartbeat of the soul.",
    "To live without hope is to cease to live.",
    "Carve a tunnel of hope through the dark mountain of disappointment.",
    "Walk on with hope in your heart, and you’ll never walk alone.",
    "Hope is the fuel of progress and fear is the prison in which you put yourself.",
    "Hope is the anchor of the soul, the stimulus to action, and the incentive to achievement.",
    "Hope smiles from the threshold of the year to come, whispering ‘it will be happier.’",
    "Hope begins in the dark, the stubborn hope that if you just show up and try to do the right thing, the dawn will come.",
    "Hope is a passion for the possible.",
    "Hope is faith holding out its hand in the dark.",
    "Hope never abandons you, you abandon it.",
    "Once you have hope, anything is possible.",
    "Hope is a risk that must be run.",
    "Hope is sweet-minded and sweet-eyed. It draws pictures; it weaves fancies; it fills the future with delight.",
    "Hope is patience with the lamp lit.",
    "Hope sees the invisible, feels the intangible, and achieves the impossible.",
    "Hope is a good thing, maybe the best of things, and no good thing ever dies.",
    "Keep hope close to your heart and move forward.",
    "Hope is like a road in the country; there was never a road, but when many people walk on it, the road comes into existence.",
    "There is some good in this world, and it’s worth fighting for.",
    "Hope is the power of being cheerful in circumstances which we know to be desperate.",
    "In all things it is better to hope than to despair.",
    "Hope is a dream of those who are awake.",
    "Where there is no hope, it is incumbent on us to invent it.",
    "Hope is the candle in our soul that lights our path to achievement.",
    "Hope is the last thing ever lost.",
    "Hope is not an emotion; it’s a way of thinking or a cognitive process.",
    "Hope is the courage to live life even when it’s hard.",
    "Hope is what makes life bearable.",
    "Even the darkest night will end and the sun will rise.",
    "Hope is stronger than fear.",
    "Without hope, we are lost.",
    "Hope is the light at the end of the tunnel guiding us through the darkness.",
    "You may not always have a comfortable life, but you can always hold onto hope.",
    "Hope will never be silent.",
    "Hope means hoping when everything seems hopeless.",
    "Hope is the magic that transforms dreams into reality.",
    "Hope is a bridge between the impossible and the possible.",
    "If it were not for hope, the heart would break.",
    "Hope costs nothing but gives everything.",
    "Hope is oxygen for the soul.",
    "Hope is seeing light in spite of being surrounded by darkness.",
    "Hope is the rain that refreshes the soul in the desert of despair.",
    "Where hope grows, miracles blossom.",
    "Hope is the strength to keep going when all seems lost.",
    "Hope is the whisper of the soul that dares to dream.",
    "Hope doesn’t deny reality—it defies it.",
    "Hope is a flame that doesn’t die, even in the storm.",
    "Hope has wings that lift us above despair.",
    "Hope is the first step on the road to recovery.",
    "Hope is your superpower in the battle of life.",
    "Hope believes against the odds.",
    "Hope never sleeps.",
    "Hope is the refusal to give up.",
    "Let your hopes, not your hurts, shape your future.",
    "Hope gives the heart strength to beat when reason says stop.",
    "Hope is not a strategy, but it's a beginning.",
    "Hope is the dream of a soul awake.",
    "Hope is the thread that stitches courage to persistence.",
    "Hope is energy for your journey.",
    "Hope is the heart’s natural response to adversity.",
    "Hope doesn’t wait for evidence; it moves ahead with belief.",
    "Hope is the art of holding on when all seems lost.",
    "Hope is rebellion against the inevitable.",
    "Hope is love stretched into the future.",
    "Hope isn’t blind; it’s visionary.",
    "Hope is the melody of tomorrow’s possibilities.",
    "The wings of hope carry us above despair.",
    "Hope is a weapon—sharp, strong, and enduring.",
    "Hope is found in the smallest of things.",
    "Hope is a quiet strength.",
    "Hope is love’s twin in the face of darkness.",
    "Hope doesn’t deny pain—it believes in healing.",
    "Hope is the soul’s immune system.",
    "Hope is the gentle voice that says ‘try again.’",
    "Hope is more contagious than despair.",
    "The fire of hope warms the coldest days.",
    "Hope is the stubborn voice that says ‘things can change.’",
    "Hope is resistance in soft form.",
    "Hope doesn’t vanish—it transforms.",
    "Hope dares where logic withdraws.",
    "Hope believes in possibilities unknown.",
    "Hope turns doubt into direction.",
    "Hope sees beyond the obstacle.",
    "Hope makes way when the road ends.",
    "Hope is the seed of all transformation.",
    "Hope chooses action over fear.",
    "Hope lingers even in silence.",
    "Hope dances where fear walks.",
    "Hope is the language of survival.",
    "Hope invites change.",
    "Hope breaks the chains of despair.",
    "Hope is a lighthouse in the storm.",
    "Hope is a friend in the shadows.",
    "Hope gives meaning to struggle.",
    "Hope is the soul's home.",
    "Hope writes stories where endings seemed written."
    ],
  },
  {
    name: "Positivity",
    link: "about-us",
    actionName: "About Us",
    color: "bg-amber-400",
    hoverColor: "hover:bg-amber-500",
    textColor: "text-amber-500",
    borderColor: "border-amber-300",
    icon: <FaSun className="text-white text-2xl md:text-3xl" />,
    quotes: [
    "Keep your face to the sunshine and you cannot see a shadow.",
    "Positive anything is better than negative nothing.",
    "In a gentle way, you can shake the world.",
    "Your positive action combined with positive thinking results in success.",
    "The only time you fail is when you fall down and stay down.",
    "The positive thinker sees the invisible, feels the intangible, and achieves the impossible.",
    "Stay positive. Better days are on their way.",
    "Optimism is the faith that leads to achievement.",
    "You’re braver than you believe and stronger than you seem.",
    "A positive attitude causes a chain reaction of positive thoughts, events, and outcomes.",
    "Be the energy you want to attract.",
    "Positivity always wins. Always.",
    "You are never too old to set another goal or to dream a new dream.",
    "Start each day with a positive thought and a grateful heart.",
    "Live life to the fullest, and focus on the positive.",
    "A positive mindset brings positive things.",
    "Be so positive that negative people don’t want to be around you.",
    "Happiness is an inside job. Don’t assign anyone else that much power over your life.",
    "Think positive, be positive, and positive things will happen.",
    "Positive thoughts lead to positive results.",
    "When you can’t find the sunshine, be the sunshine.",
    "It’s not whether you get knocked down, it’s whether you get up.",
    "The only limit to our realization of tomorrow is our doubts of today.",
    "Surround yourself with positive people and thoughts.",
    "Wherever you go, no matter what the weather, always bring your own sunshine.",
    "Believe you can and you’re halfway there.",
    "The more you praise and celebrate your life, the more there is in life to celebrate.",
    "Happiness is not something ready made. It comes from your own actions.",
    "Every day may not be good... but there’s something good in every day.",
    "Positive anything is better than negative nothing.",
    "What you think, you become. What you feel, you attract. What you imagine, you create.",
    "You do not find the happy life. You make it.",
    "Positivity is a choice.",
    "Look for something positive in each day, even if some days you have to look a little harder.",
    "Train your mind to see the good in every situation.",
    "You’re one thought away from a different life.",
    "You cannot have a positive life and a negative mind.",
    "Let your smile change the world, but don’t let the world change your smile.",
    "Positive thinking will let you do everything better than negative thinking will.",
    "Every thought we think is creating our future.",
    "The good life is a process, not a state of being.",
    "Kindness is contagious. Sprinkle it everywhere.",
    "Where focus goes, energy flows.",
    "Make each day your masterpiece.",
    "Success is a state of mind. If you want success, start thinking of yourself as a success.",
    "The only way to do great work is to love what you do.",
    "Your mind is a powerful thing. When you fill it with positive thoughts, your life will start to change.",
    "Don’t wait for the perfect moment. Take the moment and make it perfect.",
    "Be a voice, not an echo.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Small steps in the right direction can turn out to be the biggest step of your life.",
    "Positive vibes only.",
    "You are capable of amazing things.",
    "Don't limit your challenges. Challenge your limits.",
    "You can. End of story.",
    "The best view comes after the hardest climb.",
    "Happiness is not by chance, but by choice.",
    "Be the reason someone smiles today.",
    "It always seems impossible until it’s done.",
    "Turn your wounds into wisdom.",
    "Nothing can dim the light that shines from within.",
    "Dream big. Start small. Act now.",
    "You don’t have to be perfect to be amazing.",
    "Focus on the step in front of you, not the whole staircase.",
    "Success is not how high you have climbed, but how you make a positive difference to the world.",
    "You are enough just as you are.",
    "There is no elevator to success—you have to take the stairs.",
    "Progress, not perfection.",
    "Your only limit is your mind.",
    "Positivity is contagious—spread it everywhere.",
    "The best is yet to come.",
    "Be fearless in the pursuit of what sets your soul on fire.",
    "Strive for progress, not perfection.",
    "Be the kind of person you want to meet.",
    "Don’t count the days, make the days count.",
    "With the new day comes new strength and new thoughts.",
    "Shine so bright that others can’t help but light up too.",
    "One small positive thought in the morning can change your whole day.",
    "Joy is not in things; it is in us.",
    "There is beauty in simplicity.",
    "Stop being afraid of what could go wrong, and start being excited about what could go right.",
    "Success is liking yourself, liking what you do, and liking how you do it.",
    "Don’t let yesterday take up too much of today.",
    "Dwell on the beauty of life. Watch the stars, and see yourself running with them.",
    "The only difference between a good day and a bad day is your attitude.",
    "Take the risk or lose the chance.",
    "The sun is a daily reminder that we too can rise again.",
    "Push yourself, because no one else is going to do it for you.",
    "Happiness depends upon ourselves.",
    "Do more of what makes you happy.",
    "Fall seven times, stand up eight.",
    "Each day provides its own gifts.",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    "Believe in yourself and all that you are.",
    "Smile. It will make you feel better.",
    "Keep going. Everything you need will come to you at the perfect time.",
    "Be proud of how hard you’re trying.",
    "Positivity isn’t about expecting the best to happen—it’s about accepting that whatever happens is for the best.",
    "The biggest source of motivation are your own thoughts, so think big and motivate yourself from within.",
    "Never let the things you want make you forget the things you have.",
    "Don't just go through life, grow through life.",
    "Your vibe attracts your tribe."
    ],
  },
  {
    name: "Courage",
    link: "about/mental-health",
    actionName: "Mental Health",
    color: "bg-orange-400",
    hoverColor: "hover:bg-orange-500",
    textColor: "text-orange-500",
    borderColor: "border-orange-300",
    icon: <FaFistRaised className="text-white text-2xl md:text-3xl" />,
    quotes: [
    "Courage is not the absence of fear, but the triumph over it.",
    "You gain strength, courage, and confidence by every experience in which you really stop to look fear in the face.",
    "Do one thing every day that scares you.",
    "Courage doesn't always roar. Sometimes courage is the quiet voice at the end of the day saying, 'I will try again tomorrow.'",
    "It takes courage to grow up and become who you really are.",
    "He who is not courageous enough to take risks will accomplish nothing in life.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Have the courage to follow your heart and intuition.",
    "Courage is being scared to death, but saddling up anyway.",
    "Being deeply loved gives you strength, while loving deeply gives you courage.",
    "The greatest test of courage on earth is to bear defeat without losing heart.",
    "It takes courage to stand up and speak; it also takes courage to sit down and listen.",
    "Bravery is being the only one who knows you’re afraid.",
    "You can choose courage, or you can choose comfort, but you cannot choose both.",
    "Without fear, there cannot be courage.",
    "Courage starts with showing up and letting ourselves be seen.",
    "Only those who will risk going too far can possibly find out how far one can go.",
    "Sometimes even to live is an act of courage.",
    "Real courage is when you know you're licked before you begin, but you begin anyway.",
    "Fear is a reaction. Courage is a decision.",
    "Courage is resistance to fear, mastery of fear—not absence of fear.",
    "Courage is found in unlikely places.",
    "It takes courage to bloom where you're planted.",
    "Stand up for what you believe in, even if you stand alone.",
    "True courage is doing the right thing when nobody’s watching.",
    "You were given this life because you are strong enough to live it.",
    "Vulnerability sounds like truth and feels like courage.",
    "Courage is grace under pressure.",
    "Leap, and the net will appear.",
    "Feel the fear and do it anyway.",
    "Inhale courage, exhale fear.",
    "Be brave. Take risks. Nothing can substitute experience.",
    "Have enough courage to trust love one more time and always one more time.",
    "Courage is the power to let go of the familiar.",
    "Dare to begin. Courage will follow.",
    "Being brave means knowing that when you fail, you don’t fail forever.",
    "It’s not the size of the dog in the fight, it’s the size of the fight in the dog.",
    "All our dreams can come true if we have the courage to pursue them.",
    "Courage is not living without fear. Courage is being scared to death and doing the right thing anyway.",
    "Be strong, you never know who you are inspiring.",
    "Storms make trees take deeper roots.",
    "It takes courage to be different.",
    "The brave may not live forever, but the cautious never live at all.",
    "Courage is contagious. When a brave man takes a stand, the spines of others are often stiffened.",
    "The opposite of courage is not cowardice, it is conformity.",
    "Every time we choose courage, we make everyone around us a little better and the world a little braver.",
    "Courage doesn’t mean you don’t get afraid. Courage means you don’t let fear stop you.",
    "Be bold. Be brave. Be you.",
    "Courage is a heart word. The root of the word courage is ‘cor’—the Latin word for heart.",
    "Fortune favors the brave.",
    "Scared is what you’re feeling. Brave is what you’re doing.",
    "When you have exhausted all possibilities, remember this: you haven’t.",
    "Fear kills more dreams than failure ever will.",
    "You must do the thing you think you cannot do.",
    "Dream big and dare to fail.",
    "Sometimes courage is simply a matter of hanging on one minute longer.",
    "What would life be if we had no courage to attempt anything?",
    "You don’t develop courage by being happy in your relationships every day. You develop it by surviving difficult times and challenging adversity.",
    "Being afraid doesn’t mean you’re not courageous.",
    "Courage is like a muscle. We strengthen it by use.",
    "If you're going through hell, keep going.",
    "Stand up, be bold, be strong.",
    "One person with courage makes a majority.",
    "There is no such thing as bravery; only degrees of fear.",
    "It takes courage to say yes to rest and play in a culture where exhaustion is seen as a status symbol.",
    "Don't let your fear decide your future.",
    "Courage means going against the grain, against the status quo, to stand for what you believe is right.",
    "Being strong doesn’t mean you’ll never get hurt. It means even when you do, you’ll never let it defeat you.",
    "We can't be brave without fear.",
    "Life shrinks or expands in proportion to one’s courage.",
    "Doubt kills more dreams than failure ever will.",
    "You are stronger than you think.",
    "A hero is no braver than an ordinary man, but he is brave five minutes longer.",
    "Even the darkest night will end and the sun will rise.",
    "Do not pray for an easy life; pray for the strength to endure a difficult one.",
    "The hardest step she ever took was to blindly trust in who she was.",
    "You don’t need a cape to be a hero. You just need courage.",
    "Bravery isn’t the absence of fear. It’s the choice to show up anyway.",
    "Courage doesn't always shout. Sometimes it’s the little whisper that says 'try again tomorrow.'",
    "You’ve got this. Even if it doesn’t feel like it right now.",
    "Act as if it were impossible to fail.",
    "When fear whispers, courage roars.",
    "Take pride in how far you’ve come. Have faith in how far you can go.",
    "Don’t give up. Don’t lose hope. Don’t sell out.",
    "It’s not about being fearless. It’s about taking the leap anyway.",
    "Sometimes, the bravest thing you can do is keep going when you want to give up.",
    "You don’t have to be fearless, just don’t let fear stop you.",
    "Everything you’ve ever wanted is on the other side of fear.",
    "Stand firm, even if you stand alone.",
    "Pain is temporary. Courage is forever.",
    "The most courageous act is still to think for yourself. Aloud.",
    "Live your beliefs and you can turn the world around.",
    "Take a deep breath and remind yourself of who you are.",
    "Bravery isn’t loud—it’s quiet, steady, and persistent.",
    "Behind every brave person is a moment that changed them forever.",
    "Courage means trusting yourself even when it’s hard.",
    "Boldness has genius, power, and magic in it.",
    "To dare is to lose one’s footing momentarily. To not dare is to lose oneself.",
    "Sometimes, just getting out of bed is an act of great courage.",
    "To live with courage is to live with freedom."
    ],
  },
  {
    name: "Resilience",
    link: "Posts",
    actionName: "Posts",
    color: "bg-emerald-400",
    hoverColor: "hover:bg-emerald-500",
    textColor: "text-emerald-500",
    borderColor: "border-emerald-300",
    icon: <FaTree className="text-white text-2xl md:text-3xl" />,
    quotes: [
      "Resilience is accepting your new reality, even if it's less good than the one you had before.",
    "The oak fought the wind and was broken, the willow bent when it must and survived.",
    "Resilience is knowing that you are the only one that has the power and the responsibility to pick yourself up.",
    "Do not judge me by my success, judge me by how many times I fell down and got back up again.",
    "Life doesn’t get easier or more forgiving; we get stronger and more resilient.",
    "Out of suffering have emerged the strongest souls.",
    "She stood in the storm, and when the wind did not blow her way, she adjusted her sails.",
    "It’s not the load that breaks you, it’s the way you carry it.",
    "Tough times never last, but tough people do.",
    "Fall seven times, stand up eight.",
    "Resilience is the capacity to recover quickly from difficulties.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "You may encounter many defeats, but you must not be defeated.",
    "In the middle of difficulty lies opportunity.",
    "Rock bottom became the solid foundation on which I rebuilt my life.",
    "Our greatest glory is not in never falling, but in rising every time we fall.",
    "Persistence and resilience only come from having been given the chance to work through difficult problems.",
    "Although the world is full of suffering, it is also full of the overcoming of it.",
    "Turn your wounds into wisdom.",
    "You can’t calm the storm, so stop trying. What you can do is calm yourself. The storm will pass.",
    "Your resilience will carry you further than your talent.",
    "The human capacity for burden is like bamboo – far more flexible than you'd ever believe at first glance.",
    "Strength grows in the moments when you think you can't go on but you keep going anyway.",
    "Stars can’t shine without darkness.",
    "If your heart is broken, make art with the pieces.",
    "It’s not whether you get knocked down, it’s whether you get up.",
    "A good half of the art of living is resilience.",
    "Resilience is built through adversity, not comfort.",
    "Scars are proof that we showed up for life.",
    "Storms don’t last forever.",
    "Sometimes, just breathing is a victory.",
    "Success is stumbling from failure to failure with no loss of enthusiasm.",
    "You were never created to live depressed, defeated, guilty, condemned, ashamed or unworthy. You were created to be victorious.",
    "Resilience means you experience, you feel, you fail, you hurt. You fall. But, you keep going.",
    "Your comeback is always stronger than your setback.",
    "No matter how much it hurts now, one day you will look back and realize it changed you for the better.",
    "Be like a tree. Stay grounded. Connect with your roots. Turn over a new leaf. Bend before you break.",
    "One small crack does not mean you are broken. It means that you were put to the test and you didn’t fall apart.",
    "You’ve been assigned this mountain to show others it can be moved.",
    "You learn to be resilient by being resilient.",
    "It always seems impossible until it's done.",
    "Bend, don’t break.",
    "Pain is real, but so is hope.",
    "Resilience is bouncing back stronger, wiser, and more humble.",
    "Even when the world feels like too much, keep going.",
    "You are not a victim. You are a survivor with scars to prove your strength.",
    "Be the kind of person that when your feet hit the floor in the morning, the devil says, 'Oh no, they're up.'",
    "Sometimes the bravest and most important thing you can do is just show up.",
    "The comeback is always stronger than the setback.",
    "Resilience is not about avoiding the fall, it’s about learning how to rise.",
    "Wounds are where light enters you.",
    "You were built for this storm.",
    "Difficulties are just things to overcome, after all.",
    "You can’t stop the waves, but you can learn to surf.",
    "Success requires replacing excuses with effort, replacing laziness with determination, and replacing dreams with discipline.",
    "Your story isn’t over yet.",
    "Resilience turns pain into strength and setbacks into growth.",
    "Life has knocked me down a few times. It showed me things I never wanted to see. But I always got back up.",
    "The strongest people are not those who show strength in front of us but those who win battles we know nothing about.",
    "What defines us is how well we rise after falling.",
    "You have survived everything you’ve been through, and you’re still standing.",
    "Be proud of how you’ve handled the storms.",
    "Sometimes being brave is just having the strength to keep going.",
    "The roots of resilience are to be found in the sense of being understood by and existing in the mind and heart of a loving, attuned, and self-possessed other.",
    "Life doesn’t get easier, you just get stronger.",
    "You’re not a mess. You’re a feeling person in a messy world.",
    "There is no strength where there is no struggle.",
    "You were given this life because you are strong enough to live it.",
    "Grief is the price we pay for love. But resilience is the proof we dared to love again.",
    "The world breaks everyone, and afterward, some are strong at the broken places.",
    "Resilience is the secret to peace, purpose, and progress.",
    "Strength is not about how much you can handle before you break. It’s about how much you can endure after you’ve been broken.",
    "Let your scars remind the world that you had the courage to survive.",
    "The moment you’re ready to quit is usually the moment right before the miracle happens.",
    "Your strength doesn’t come from winning. It comes from struggles and hardship.",
    "Fall apart when you need to. But rebuild yourself stronger.",
    "Sometimes resilience is just taking the next breath.",
    "With resilience, you bend but you never break.",
    "Keep going. Your hardest times often lead to the greatest moments of your life.",
    "Even if you fall on your face, you're still moving forward.",
    "The key to success is action, and the essential in action is perseverance.",
    "Be stronger than your excuses.",
    "Resilience is rising again after every fall, with a little more wisdom each time.",
    "You don’t drown by falling in the water. You drown by staying there.",
    "It takes courage to grow up and become who you really are.",
    "Every scar you have tells a story. It’s a reminder that you survived.",
    "You were not born to quit.",
    "Your ability to adapt is your greatest asset.",
    "Where there is no struggle, there is no strength.",
    "Strength isn’t always loud. Sometimes it’s the quiet determination to keep going.",
    "Your survival is a testimony of your resilience.",
    "Grow through what you go through.",
    "Every setback is a setup for a comeback.",
    "Your mind is a powerful thing. When you fill it with positivity, your life will start to change.",
    "Be resilient like water—soft, yet unbreakable.",
    "Resilience means keeping your head up even when the weight of the world is on your shoulders.",
    "It's okay to feel broken. Just don’t stay there forever.",
    "You are more resilient than you realize. Believe it. Live it."
    ],
  },
  {
    name: "Gratitude",
    link: "all-quizzes",
    actionName: "Quizzes",
    color: "bg-violet-400",
    hoverColor: "hover:bg-violet-500",
    textColor: "text-violet-500",
    borderColor: "border-violet-300",
    icon: <FaHandHoldingHeart className="text-white text-2xl md:text-3xl" />,
    quotes: [
"Gratitude turns what we have into enough. – Anonymous",
    "Be thankful for what you have; you’ll end up having more. – Oprah Winfrey",
    "Gratitude is not only the greatest of virtues, but the parent of all others. – Cicero",
    "The more grateful I am, the more beauty I see. – Mary Davis",
    "Gratitude unlocks the fullness of life. – Melody Beattie",
    "Acknowledging the good that you already have in your life is the foundation for all abundance. – Eckhart Tolle",
    "When I started counting my blessings, my whole life turned around. – Willie Nelson",
    "Gratitude is the fairest blossom which springs from the soul. – Henry Ward Beecher",
    "Gratitude is the healthiest of all human emotions. – Zig Ziglar",
    "Appreciation is a wonderful thing. It makes what is excellent in others belong to us as well. – Voltaire",
    "Gratitude is riches. Complaint is poverty. – Doris Day",
    "Train yourself never to put off the word or action for the expression of gratitude. – Albert Schweitzer",
    "Feeling gratitude and not expressing it is like wrapping a present and not giving it. – William Arthur Ward",
    "Silent gratitude isn’t very much use to anyone. – Gertrude Stein",
    "Let us be grateful to people who make us happy; they are the charming gardeners who make our souls blossom. – Marcel Proust",
    "Wear gratitude like a cloak and it will feed every corner of your life. – Rumi",
    "Gratitude is when memory is stored in the heart and not in the mind. – Lionel Hampton",
    "Gratitude is a powerful catalyst for happiness. – Amy Collette",
    "Enjoy the little things, for one day you may look back and realize they were the big things. – Robert Brault",
    "Gratitude opens the door to… the power, the wisdom, the creativity of the universe. – Deepak Chopra",
    "If the only prayer you ever say in your life is ‘thank you’, that would suffice. – Meister Eckhart",
    "It is not joy that makes us grateful; it is gratitude that makes us joyful. – David Steindl-Rast",
    "Gratitude is the sign of noble souls. – Aesop",
    "Develop an attitude of gratitude, and give thanks for everything. – Brian Tracy",
    "Appreciation is the currency of success. – Shaka Smart",
    "Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow. – Melody Beattie",
    "Be grateful for what you have while in pursuit of what you want. – Jim Rohn",
    "Gratitude is not only a response to the present, but also an invitation to the future.",
    "Give thanks for a little, and you will find a lot. – Hausa Proverb",
    "No duty is more urgent than giving thanks. – James Allen",
    "Gratitude helps you grow and expand. – Eileen Caddy",
    "In everything, give thanks. – 1 Thessalonians 5:18",
    "Gratitude turns denial into acceptance, chaos into order, confusion into clarity. – Melody Beattie",
    "You cannot feel grateful and depressed in the same moment. – Naomi Williams",
    "Start each day with a grateful heart.",
    "What separates privilege from entitlement is gratitude. – Brené Brown",
    "Being thankful is not always experienced as a natural state of existence; we must work at it. – Henri Nouwen",
    "A grateful heart is a magnet for miracles.",
    "Gratitude brings light to the darkest moments.",
    "Thankfulness is the beginning of gratitude. Gratitude is the completion of thankfulness. – Henri Frederic Amiel",
    "Those who are not grateful soon begin to complain of everything.",
    "Gratitude and attitude are not challenges; they are choices. – Robert Braathe",
    "Open your eyes and see all the blessings around you.",
    "Let gratitude be the pillow upon which you kneel to say your nightly prayer. – Maya Angelou",
    "Gratitude is the sweetest thing in a seeker’s life – in all human life. – Sri Chinmoy",
    "Gratitude changes everything.",
    "Gratitude is the wine for the soul. Go on. Get drunk. – Rumi",
    "Always have an attitude of gratitude.",
    "There is always something to be thankful for.",
    "No matter how bad it gets, there’s always something to be grateful for.",
    "Gratitude is the music of the heart, when its chords are swept by the breeze of kindness.",
    "Appreciate everything, even the small things.",
    "Let us be kinder to one another and show more gratitude.",
    "Even in the midst of chaos, there is much to be thankful for.",
    "Be thankful for the struggles you go through. They make you stronger.",
    "Gratitude is the foundation of humility and empathy.",
    "Gratitude is the inward feeling of kindness received.",
    "He is a wise man who does not grieve for the things he has not, but rejoices for those which he has. – Epictetus",
    "Say thank you with your whole being.",
    "Be grateful not just for what you have, but for who you are.",
    "Gratitude is not about what is received, but the joy in what exists.",
    "You have everything you need to be happy right now.",
    "The root of joy is gratefulness. – David Steindl-Rast",
    "When you arise in the morning, give thanks for the light, for your life, for your strength. – Tecumseh",
    "A moment of gratitude makes a difference in your attitude.",
    "Count your rainbows, not your thunderstorms.",
    "Your attitude determines your direction. Choose gratitude.",
    "Gratitude is not seasonal; it’s a way of life.",
    "There is a calmness to a life lived in gratitude. – Ralph H. Blum",
    "Give thanks not just on Thanksgiving, but every day.",
    "Gratitude is the antidote to bitterness and resentment.",
    "Thankfulness is the beginning of happiness.",
    "Saying thank you is more than good manners. It is good spirituality. – Alfred Painter",
    "Give thanks for unknown blessings already on their way. – Native American Saying",
    "Where gratitude grows, joy flows.",
    "In daily life, we must see that it is not happiness that makes us grateful, but gratefulness that makes us happy.",
    "Live simply. Dream big. Be grateful. Give love. Laugh lots.",
    "Gratitude is like sunshine – it nourishes what it touches.",
    "Make it a habit to be thankful for everything you receive.",
    "Gratitude fills the soul with joy.",
    "To be grateful is to recognize the love of God in everything.",
    "To speak gratitude is courteous and pleasant, to enact gratitude is generous and noble, but to live gratitude is to touch heaven. – Johannes A. Gaertner",
    "The attitude of gratitude brings blessings multiplied.",
    "Gratitude paints little smiley faces on everything it touches.",
    "A grateful mindset sees the good in every situation.",
    "Every day may not be good, but there’s something good in every day.",
    "Being grateful is the doorway to abundance.",
    "Gratitude is the best prayer anyone could say. – Alice Walker",
    "You won’t be happy with more until you’re grateful for what you already have.",
    "The way to develop the best in a person is by appreciation and encouragement. – Charles Schwab",
    "Gratitude is a sacred space where you allow and know that a force greater than your ego is always at work and always available. – Wayne Dyer",
    "The more you thank life, the more life gives you to be thankful for.",
    "Happiness is itself a kind of gratitude.",
    "Gratitude opens our hearts and minds to the miracles all around us.",
    "Live with a grateful heart, and life will be full of joy.",
    "Count your blessings, not your burdens.",
    "Let gratitude be your guide.",
    "There is magic in gratitude – it transforms the ordinary into extraordinary.",
    "Life becomes easier when you learn to appreciate the little things.",
    "Gratitude is seeing the light when all you feel is darkness.",
    "The thankful heart opens our eyes to a multitude of blessings that continually surround us.",
    "Be present. Be mindful. Be grateful.",
    "Each day is a gift. Unwrap it with gratitude.",
    "Gratitude roots you in what matters most.",
    "When you are grateful, fear disappears and abundance appears. – Tony Robbins"
    ],
  },
  {
    name: "Empowerment",
    link: "articles",
    actionName: "articles",
    color: "bg-pink-400",
    hoverColor: "hover:bg-pink-500",
    textColor: "text-pink-500",
    borderColor: "border-pink-300",
    icon: <FaFeather className="text-white text-2xl md:text-3xl" />,
    quotes: [
      "The most courageous act is still to think for yourself. Aloud.",
    "Power is not given to you. You have to take it.",
    "You are more powerful than you know; you are beautiful just as you are.",
    "No one can make you feel inferior without your consent.",
    "Your potential is endless. Go do what you were created to do.",
    "Owning our story and loving ourselves through that process is the bravest thing that we’ll ever do.",
    "Don’t wait for permission to do something. You already have it.",
    "Believe in yourself and you will be unstoppable.",
    "Your voice matters. Don’t let anyone silence it.",
    "You were born to stand out, not fit in.",
    "Empowerment comes from owning your truth.",
    "Stop shrinking to fit places you’ve outgrown.",
    "The power you seek lies within you.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "Be fearless in the pursuit of what sets your soul on fire.",
    "Speak your truth, even if your voice shakes.",
    "You are the hero of your own story.",
    "Nothing can dim the light that shines from within.",
    "Don't downgrade your dream just to fit your reality.",
    "I am deliberate and afraid of nothing.",
    "Success is liking yourself, liking what you do, and liking how you do it.",
    "Don’t just stand for the success of other women—insist on it.",
    "Your life is your message to the world. Make it inspiring.",
    "When you empower others, you empower yourself.",
    "You are not too much. You have just been in environments that were too small.",
    "Self-love is your superpower.",
    "Confidence is silent. Insecurities are loud.",
    "A strong woman looks a challenge in the eye and gives it a wink.",
    "Never apologize for being a powerful woman.",
    "Your vibe attracts your tribe.",
    "Be the kind of woman that makes other women want to up their game.",
    "Empowered women empower women.",
    "Do not wait for someone else to come and speak for you. It's you who can change the world.",
    "Make your life a masterpiece; imagine no limitations on what you can be, have, or do.",
    "Be bold enough to use your voice, brave enough to listen to your heart.",
    "Be so completely yourself that everyone feels safe to be themselves too.",
    "You are enough just as you are.",
    "Once you figure out who you are and what you love about yourself, I think it all kind of falls into place.",
    "You deserve to take up space.",
    "I am not afraid of storms, for I am learning how to sail my ship.",
    "You were not born to be subtle.",
    "Be a voice, not an echo.",
    "Stop asking people who have never been where you’re going for directions.",
    "The world needs that special gift that only you have.",
    "Don't just talk about it, be about it.",
    "Your only limit is you.",
    "What you do today can improve all your tomorrows.",
    "Be strong. Be fearless. Be beautiful.",
    "You don’t find your worth in a man. You find your worth within yourself.",
    "Be yourself. An original is worth more than a copy.",
    "I am not what happened to me. I am what I choose to become.",
    "Take up space. Be seen. Be heard.",
    "Sometimes the smallest step in the right direction ends up being the biggest step of your life.",
    "Do it scared. Do it unsure. But do it anyway.",
    "No one is you, and that is your power.",
    "You teach people how to treat you by what you allow, what you stop, and what you reinforce.",
    "Confidence is not ‘they will like me.’ Confidence is ‘I’ll be fine if they don’t.’",
    "A queen will always turn pain into power.",
    "The woman who does not require validation from anyone is the most feared individual on the planet.",
    "Be the change you want to see in the world.",
    "Stop waiting for permission to become who you want to be.",
    "Never underestimate the power of your presence.",
    "Don’t be afraid to shine. The world needs your light.",
    "You weren’t put on this earth to play small.",
    "Define success on your own terms.",
    "Go ahead and tell your story. Someone needs to hear it.",
    "Being powerful is like being a lady. If you have to tell people you are, you aren’t.",
    "Own your magic.",
    "You owe it to yourself to become everything you’ve ever dreamed of.",
    "The sky isn’t the limit—your mind is.",
    "Silence is the best response to a fool. Confidence is the best revenge.",
    "Don’t be a lady. Be a legend.",
    "Strong back. Soft front. Wild heart.",
    "Trust yourself. You've survived a lot, and you'll survive whatever is coming.",
    "Work on being in love with the person in the mirror.",
    "Be a game-changer, the world has enough followers.",
    "You have what it takes, but it will take everything you’ve got.",
    "She remembered who she was and the game changed.",
    "You don’t need to be perfect to inspire others. Let them be inspired by how you deal with your imperfections.",
    "Wake up. Kick ass. Be kind. Repeat.",
    "Stay strong. Make them wonder how you’re still smiling.",
    "Slay in your lane.",
    "Don’t get bitter. Get better.",
    "Don’t just exist. Live.",
    "Push yourself because no one else is going to do it for you.",
    "Some people dream of success, others wake up and work hard for it.",
    "Make yourself a priority once in a while.",
    "Sometimes you win, sometimes you learn.",
    "You’ve always had the power, my dear. You just had to learn it for yourself.",
    "The most powerful weapon on earth is the human soul on fire.",
    "If you want to fly, give up everything that weighs you down.",
    "Rise above the storm and you will find the sunshine.",
    "Don’t limit your challenges. Challenge your limits.",
    "Make it happen. Shock everyone.",
    "Act like a lady. Think like a boss.",
    "Turn your wounds into wisdom and your pain into power.",
    "You weren’t given this life to be average.",
    "Chin up princess, or the crown slips.",
    "You are gold, baby. Solid gold."
    ],
  },
]

function TodaysQuote() {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedAttribute, setSelectedAttribute] = useState(null)
  const [selectedQuote, setSelectedQuote] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const wheelRef = useRef(null)
  const [spinDuration, setSpinDuration] = useState(0)

  // Gamification state
  const [streak, setStreak] = useState(0)
  const [lastSpinDate, setLastSpinDate] = useState(null)
  const [collectedAttributes, setCollectedAttributes] = useState([])
  const [points, setPoints] = useState(0)
  const [showAchievement, setShowAchievement] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState(null)
  const [isWheelHovered, setIsWheelHovered] = useState(false)

  // Quote tracking state
  const [seenQuotes, setSeenQuotes] = useState({})
  const [showShareOptions, setShowShareOptions] = useState(false)

  // Track if component is mounted
  const isMounted = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Achievements
  const achievements = [
    {
      id: 'first-spin',
      name: 'First Inspiration',
      description: 'Spin the wheel for the first time',
      icon: <FaStar className="text-yellow-400 text-2xl" />,
      points: 10,
      condition: (state) => state.spins >= 1
    },
    {
      id: 'three-day-streak',
      name: 'Consistency',
      description: 'Maintain a 3-day streak',
      icon: <FaFire className="text-orange-500 text-2xl" />,
      points: 30,
      condition: (state) => state.streak >= 3
    },
    {
      id: 'collect-all',
      name: 'Wisdom Collector',
      description: 'Collect all inspiration attributes',
      icon: <FaGem className="text-purple-500 text-2xl" />,
      points: 50,
      condition: (state) => state.collected.length >= attributes.length
    },
    {
      id: 'seven-day-streak',
      name: 'Dedication',
      description: 'Maintain a 7-day streak',
      icon: <FaTrophy className="text-amber-500 text-2xl" />,
      points: 100,
      condition: (state) => state.streak >= 7
    },
  ]

  const spinWheel = () => {
    if (isSpinning) return

    setShowPopup(false)
    setIsSpinning(true)

    // Calculate a random number of full rotations (5-10) plus a random segment
    const spinDegrees = 360 * (Math.floor(Math.random() * 5) + 5) // 5-10 full rotations
    const randomSegment = Math.floor(Math.random() * 6) * (360 / 6) // Random segment (0-5)
    const newRotation = rotation + spinDegrees + randomSegment

    // Random duration between 4-6 seconds for more natural feel
    const duration = 4 + Math.random() * 2
    setSpinDuration(duration)
    setRotation(newRotation)

    // Calculate which segment will be at the top when wheel stops
    setTimeout(() => {
      const normalizedRotation = newRotation % 360
      const segmentIndex = Math.floor((360 - (normalizedRotation % 360)) / (360 / 6)) % 6
      const selectedAttr = attributes[segmentIndex]

      // Select a random quote from the attribute's quotes array
      const attrName = selectedAttr.name
      const attrQuotes = selectedAttr.quotes

      // Get previously seen quotes for this attribute
      const seenQuotesForAttr = seenQuotes[attrName] || []

      // Filter out quotes that have been seen
      const unseenQuotes = attrQuotes.filter(quote => !seenQuotesForAttr.includes(quote))

      let selectedQuoteText

      if (unseenQuotes.length > 0) {
        // If there are unseen quotes, select one randomly
        const randomIndex = Math.floor(Math.random() * unseenQuotes.length)
        selectedQuoteText = unseenQuotes[randomIndex]
      } else {
        // If all quotes have been seen, reset and select a random one
        const randomIndex = Math.floor(Math.random() * attrQuotes.length)
        selectedQuoteText = attrQuotes[randomIndex]

        // Reset seen quotes for this attribute
        setSeenQuotes(prev => ({
          ...prev,
          [attrName]: []
        }))
      }

      // Update seen quotes
      setSeenQuotes(prev => ({
        ...prev,
        [attrName]: [...(prev[attrName] || []), selectedQuoteText]
      }))

      setSelectedQuote(selectedQuoteText)

      setSelectedAttribute(selectedAttr)
      setIsSpinning(false)
      setShowPopup(true)

      // Gamification logic
      const today = new Date().toDateString()
      const savedState = localStorage.getItem('dailyInspiration')
        ? JSON.parse(localStorage.getItem('dailyInspiration'))
        : { streak: 0, lastSpinDate: null, collected: [], points: 0 }

      // Update collected attributes if this is a new one
      let newCollected = [...(savedState.collected || [])]
      if (!newCollected.includes(selectedAttr.name)) {
        newCollected.push(selectedAttr.name)
        setCollectedAttributes(newCollected)
        // Award points for new attribute
        setPoints(prev => prev + 15)
        savedState.points = (savedState.points || 0) + 15
      }

      // Update streak
      const lastDate = savedState.lastSpinDate ? new Date(savedState.lastSpinDate) : null
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      if (!lastDate || lastDate.toDateString() === yesterday.toDateString()) {
        // Either first spin or consecutive day
        savedState.streak = (savedState.streak || 0) + 1
        setStreak(savedState.streak)
      } else if (lastDate.toDateString() !== today) {
        // Not consecutive, but not same day - reset streak
        savedState.streak = 1
        setStreak(1)
      }

      // Update last spin date if it's not the same day
      if (!lastDate || lastDate.toDateString() !== today) {
        savedState.lastSpinDate = today
        setLastSpinDate(today)
      }

      // Save collected attributes
      savedState.collected = newCollected

      // Save to localStorage
      localStorage.setItem('dailyInspiration', JSON.stringify(savedState))

      // Launch confetti with attribute colors
      const confettiColors = [
        selectedAttr.color,
        "#FFFFFF",
        "#000000",
      ];

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: confettiColors,
      });
    }, duration * 1000) // Match this with the CSS transition duration
  }

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('dailyInspiration')
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      setStreak(parsedState.streak || 0)
      setLastSpinDate(parsedState.lastSpinDate || null)
      setCollectedAttributes(parsedState.collected || [])
      setPoints(parsedState.points || 0)
    }
  }, [])

  // Check for achievements
  useEffect(() => {
    const state = {
      streak,
      spins: collectedAttributes.length,
      collected: collectedAttributes,
      points
    }

    // Check for new achievements
    const earnedAchievements = localStorage.getItem('earnedAchievements')
      ? JSON.parse(localStorage.getItem('earnedAchievements'))
      : []

    achievements.forEach(achievement => {
      if (!earnedAchievements.includes(achievement.id) && achievement.condition(state)) {
        // New achievement earned!
        earnedAchievements.push(achievement.id)
        localStorage.setItem('earnedAchievements', JSON.stringify(earnedAchievements))

        // Show achievement notification
        setCurrentAchievement(achievement)
        setShowAchievement(true)

        // Add points
        setPoints(prev => prev + achievement.points)

        // Save updated points
        const savedState = localStorage.getItem('dailyInspiration')
          ? JSON.parse(localStorage.getItem('dailyInspiration'))
          : {}

        savedState.points = points + achievement.points
        localStorage.setItem('dailyInspiration', JSON.stringify(savedState))
      }
    })
  }, [streak, collectedAttributes, points])

  // Add wheel hover animation
  const handleWheelHover = () => {
    setIsWheelHovered(true)
  }

  const handleWheelLeave = () => {
    setIsWheelHovered(false)
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  const closeAchievement = () => {
    setShowAchievement(false)
  }

  // No navigation methods needed as we show only one quote per spin

  // Share functionality
  const toggleShareOptions = () => {
    setShowShareOptions(prev => !prev)
  }

  const shareQuote = (platform) => {
    if (!selectedAttribute || !selectedQuote) return

    const shareText = `"${selectedQuote}" - Daily Inspiration from SukoonSphere`
    let shareUrl = ''

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
        break
      case 'copy':
        navigator.clipboard.writeText(shareText)
          .then(() => {
            alert('Quote copied to clipboard!')
          })
          .catch(() => {
            alert('Failed to copy quote')
          })
        setShowShareOptions(false)
        return
      default:
        return
    }

    window.open(shareUrl, '_blank')
    setShowShareOptions(false)
  }

  return (
    <div className="max-w-7xl mx-auto lg:px-8">
      <div className="inspiration-container bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col items-center justify-center font-sans rounded-2xl shadow-xl overflow-hidden relative p-8">
        {/* Gamification header */}
        <div className="gamification-header w-full flex justify-between items-center mb-6">
          <motion.div
            className="streak-counter flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaFire className="text-orange-500 mr-2" />
            <span className="font-bold">{streak}</span>
            <span className="text-gray-600 ml-1">day streak</span>
          </motion.div>

          <motion.div
            className="points-counter flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaStar className="text-yellow-500 mr-2" />
            <span className="font-bold">{points}</span>
            <span className="text-gray-600 ml-1">points</span>
          </motion.div>
        </div>

        <motion.h1
          className="text-2xl md:text-3xl font-bold text-center mb-4 text-[var(--primary)] tracking-tight"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Daily Inspiration Wheel
        </motion.h1>

        {/* Progress indicator */}
        <motion.div
          className="collection-progress w-full max-w-md mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-sm text-gray-600 mb-2 flex justify-between">
            <span>Collection Progress</span>
            <span>{collectedAttributes.length}/{attributes.length} attributes</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
              style={{ width: `${(collectedAttributes.length / attributes.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            {attributes.map((attr) => (
              <div
                key={attr.name}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${collectedAttributes.includes(attr.name) ? attr.color : 'bg-gray-200'}`}
                title={attr.name}
              >
                <div className="text-white text-xs">
                  {collectedAttributes.includes(attr.name) ? attr.icon : '?'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="relative w-full max-w-md aspect-square mb-12">
          {/* Center circle with improved depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] bg-white rounded-full z-20 shadow-lg border-4 border-gray-200 flex items-center justify-center">
            <div className="w-[70%] h-[70%] rounded-full bg-gray-100 shadow-inner"></div>
          </div>

          {/* Improved pointer/indicator with better shadow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[40%] w-12 h-16 z-30">
            <div className="w-full h-full relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-12 bg-gray-800 rounded-t-full shadow-md"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-white shadow-xl rounded-full border-4 border-gray-800 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-red-500 shadow-inner animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Wheel container with enhanced shadow and border */}
          <motion.div
            className="absolute inset-0 rounded-full shadow-[0_5px_30px_rgba(0,0,0,0.25)] overflow-hidden border-[12px] border-gray-800"
            whileHover={{ scale: 1.02 }}
            onHoverStart={handleWheelHover}
            onHoverEnd={handleWheelLeave}
            animate={{
              boxShadow: isWheelHovered
                ? '0 10px 40px rgba(0,0,0,0.4)'
                : '0 5px 30px rgba(0,0,0,0.25)'
            }}
          >
            {/* Wheel with smooth transition */}
            <motion.div
              ref={wheelRef}
              className="w-full h-full rounded-full overflow-hidden relative bg-white"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? `transform ${spinDuration}s cubic-bezier(0.32, 0.94, 0.6, 1)` : "none",
              }}
              animate={{
                rotate: isWheelHovered && !isSpinning ? [0, 5, 0, -5, 0] : rotation,
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: isWheelHovered && !isSpinning ? Infinity : 0,
                  ease: "easeInOut"
                }
              }}
            >


              {/* Improved dividing lines with gradient */}
              {attributes.map((attr, index) => {
                const angle = index * 60;

                return (
                  <div
                    key={attr.name}
                    className="absolute w-1/2 h-1/2 origin-bottom-right"
                    style={{
                      transform: `rotate(${angle}deg)`,
                    }}
                  >
                    {/* Segment with texture and shading */}
                    <div
                      className={`absolute inset-0 ${attr.color}`}
                      style={{
                        borderRight: "2px solid rgba(255, 255, 255, 0.3)",
                        boxShadow: "inset 0 0 15px rgba(0, 0, 0, 0.15)",
                        background: `linear-gradient(135deg, ${getComputedStyle(document.documentElement).getPropertyValue('--' + attr.color.slice(3))} 0%, ${getComputedStyle(document.documentElement).getPropertyValue('--' + attr.color.slice(3) + '/80')} 100%)`,
                      }}
                    ></div>
                  </div>
                );
              })}

              {/* Add text and icons as separate elements positioned absolutely */}
              {attributes.map((attr, index) => {
                const angle = index * 60 + 30; // Position in the middle of each segment
                const radius = 35; // Adjust based on your wheel size (% of wheel radius)

                // Calculate position using trigonometry
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                return (
                  <div
                    key={`label-${attr.name}`}
                    className="absolute flex flex-col items-center justify-center"
                    style={{
                      top: `${y}%`,
                      left: `${x}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '20%',
                      textAlign: 'center'
                    }}
                  >
                    <div className="bg-white/20 p-2 rounded-full mb-1 backdrop-blur-sm shadow-lg flex items-center justify-center">
                      {attr.icon}
                    </div>
                    <div className="text-[var(--white-color)] font-bold text-base md:text-lg drop-shadow-lg tracking-wide whitespace-nowrap">
                      {attr.name}
                    </div>
                  </div>
                );
              })}

              {/* Divider lines between segments */}
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`divider-${index}`}
                  className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-white/10 to-white/40"
                  style={{
                    transform: `translateY(-50%) rotate(${index * 60}deg)`,
                    transformOrigin: "left center",
                  }}
                ></div>
              ))}
              {/* Center circle cutout */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] bg-gray-800 rounded-full"></div>
            </motion.div>
          </motion.div>

          {/* Improved decorative elements with gradients */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-4 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-b-lg shadow-md"></div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-4 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 rounded-b-lg shadow-md"></div>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {/* Enhanced spin button */}
          <motion.button
            onClick={spinWheel}
            disabled={isSpinning}
            className={`
              btn-1 relative overflow-hidden
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
              bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
              text-white font-bold py-3 px-6 rounded-lg shadow-lg
              transition-all duration-300 transform
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center justify-center">
              {isSpinning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Spinning...
                </>
              ) : (
                <>
                  <FaGem className="mr-2" /> Spin for Inspiration
                </>
              )}
            </span>
            {/* Animated gradient background */}
            <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400/20 to-transparent animate-shimmer"></span>
          </motion.button>
        </motion.div>

        {/* Achievement badges section */}
        <motion.div
          className="achievements-section w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-sm text-gray-600 mb-2">Achievements</div>
          <div className="flex justify-center gap-2 flex-wrap">
            {achievements.map((achievement) => {
              const earned = localStorage.getItem('earnedAchievements')
                ? JSON.parse(localStorage.getItem('earnedAchievements')).includes(achievement.id)
                : false;

              return (
                <div
                  key={achievement.id}
                  className={`achievement-badge w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${earned ? 'bg-gradient-to-br from-yellow-400 to-amber-600' : 'bg-gray-200'}`}
                  title={earned ? achievement.name : '???'}
                >
                  <div className={`${earned ? 'text-white' : 'text-gray-400'}`}>
                    {earned ? achievement.icon : '?'}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Improved modal popup with animations */}
        {showPopup && selectedAttribute && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closePopup}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 ease-out"
              style={{ animation: 'popup 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`${selectedAttribute.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}
                style={{
                  boxShadow: `0 10px 25px -5px ${getComputedStyle(document.documentElement).getPropertyValue('--' + selectedAttribute.color.slice(3) + '/40')}`
                }}
              >
                <div className="text-4xl">{selectedAttribute.icon}</div>
              </div>

              <h2 className={`text-3xl font-bold text-center mb-4 ${selectedAttribute.textColor}`}>
                {selectedAttribute.name}
              </h2>

              <div className="relative mb-6">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-gray-700 text-center text-lg italic mb-4 leading-relaxed"
                >
                  "{selectedQuote}"
                </motion.p>

                <div className="text-center text-sm text-gray-500 mt-2">
                  <p>Spin again to discover more inspirational quotes!</p>
                </div>
              </div>

              {/* Share options */}
              <div className="mb-6">
                <button
                  onClick={toggleShareOptions}
                  className={`flex items-center justify-center mx-auto px-4 py-2 rounded-full ${selectedAttribute.color} text-white hover:opacity-90 transition-opacity`}
                >
                  <FaShareAlt className="mr-2" /> Share Quote
                </button>

                {/* Share options popup */}
                <AnimatePresence>
                  {showShareOptions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex justify-center mt-4 space-x-3"
                    >
                      <button
                        onClick={() => shareQuote('twitter')}
                        className="p-2 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition-opacity"
                        aria-label="Share on Twitter"
                      >
                        <FaTwitter />
                      </button>
                      <button
                        onClick={() => shareQuote('facebook')}
                        className="p-2 bg-[#4267B2] text-white rounded-full hover:opacity-90 transition-opacity"
                        aria-label="Share on Facebook"
                      >
                        <FaFacebook />
                      </button>
                      <button
                        onClick={() => shareQuote('whatsapp')}
                        className="p-2 bg-[#25D366] text-white rounded-full hover:opacity-90 transition-opacity"
                        aria-label="Share on WhatsApp"
                      >
                        <FaWhatsapp />
                      </button>
                      <button
                        onClick={() => shareQuote('copy')}
                        className="p-2 bg-gray-700 text-white rounded-full hover:opacity-90 transition-opacity"
                        aria-label="Copy to clipboard"
                      >
                        <FaLink />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={closePopup}
                  className={`
                  px-6 py-2 text-lg border-2 ${selectedAttribute.borderColor} ${selectedAttribute.textColor}
                  rounded-lg hover:bg-gray-50 transition-colors duration-300
                  focus:outline-none focus:ring-2 focus:ring-gray-200
                `}
                >
                  Close
                </button>
                <Link
                  to={selectedAttribute.link}
                  className={`
                  ${selectedAttribute.color} ${selectedAttribute.hoverColor} text-white
                  px-6 py-2 text-lg rounded-lg shadow-md hover:shadow-lg
                  transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0
                  focus:outline-none focus:ring-2 focus:ring-${selectedAttribute.color}
                `}
                >
                  Explore {selectedAttribute.actionName}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Achievement notification */}
        <AnimatePresence>
          {showAchievement && currentAchievement && (
            <motion.div
              className="fixed top-10 right-10 bg-white rounded-lg shadow-2xl p-4 z-50 max-w-xs"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="flex items-start">
                <div className="bg-gradient-to-br from-yellow-400 to-amber-600 w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  {currentAchievement.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Achievement Unlocked!</h3>
                  <h4 className="font-semibold text-purple-600">{currentAchievement.name}</h4>
                  <p className="text-gray-600 text-sm mt-1">{currentAchievement.description}</p>
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <FaStar className="text-yellow-500 mr-1" /> {currentAchievement.points} points
                  </div>
                </div>
              </div>
              <button
                onClick={closeAchievement}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add keyframes for popup animation */}
        <style jsx global>{`
        @keyframes popup {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
      </div>
    </div>
  )
}
export default TodaysQuote