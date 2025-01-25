import React, { useState } from "react";
import SectionTitle from "../sharedComponents/SectionTitle";
import QuizSummary from "../quizComponents/QuizSummary";
import QuizQuestions from "../quizComponents/QuizQuestions";

function TodaysQuiz() {

  const quizQuestions = [
    {
      question:
        "How do you feel when someone close to you starts to spend less time with you and more time with someone else?",
      option1:
        "I worry that they might drift away from me, and it makes me feel anxious.",
      option2:
        "I feel a bit left out but understand that relationships evolve.",
      option3:
        "It doesn't bother me much; I value our time together when it happens.",
      option4: "I feel hurt and wonder if I did something wrong.",
    },
    {
      question:
        "When someone you care about seems distant, how do you usually respond?",
      option1:
        "I try to reach out and make more effort to reconnect with them.",
      option2: "I give them space and wait for them to come back around.",
      option3:
        "I feel insecure and often question what I might have done wrong.",
      option4: "I adapt easily and don't let it affect my mood much.",
    },
    {
      question:
        "How do you react if your partner begins spending significant time with new friends?",
      option1: "I feel jealous and insecure about our relationship.",
      option2:
        "I understand that they need social interaction and feel okay with it.",
      option3:
        "I try to communicate my feelings and seek reassurance from them.",
      option4:
        "I appreciate the independence and find it gives me time for my own interests.",
    },
    {
      question:
        "What are your thoughts when a family member starts prioritizing others over you?",
      option1:
        "I feel neglected and may become anxious about our relationship.",
      option2:
        "I feel okay and respect their need for balance in their relationships.",
      option3:
        "I feel hurt and try to discuss it with them to understand their perspective.",
      option4: "I feel fine and use the time to focus on my own activities.",
    },
    {
      question:
        "How do you usually feel when a close person doesn't respond to your messages promptly?",
      option1: "I feel anxious and start to worry if something is wrong.",
      option2:
        "I understand that they may be busy and try not to overthink it.",
      option3: "I feel frustrated and may follow up with another message.",
      option4: "I feel indifferent and continue with my day as usual.",
    },
  ];

  return (
    <>
      <SectionTitle title="Today's Quiz" />
      <div className="max-w-7xl mx-auto  ">
        <div className="grid grid-cols-1  lg:grid-cols-12 gap-4  px-4 md:px-6 ">
          <div
            className=" col-span-full lg:col-span-5  grid gap-6 bg-white rounded-[20px] shadow-lg"
            data-aos="fade-down"
          >
            <QuizQuestions quizQuestionsList={quizQuestions} />
          </div>
          <div
            className="col-span-full lg:col-span-7  rounded-lg"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <QuizSummary
              SummaryTitle={"What is my Attachment Style?"}
              SummarySubtitle={
                "Secure, anxious, avoidant, and disorganized—which one are you?"
              }
              ShortDescription={
                "This short free 5-question quiz measures feelings associated with the four main attachment styles—secure, anxious, avoidant, and disorganized. This quiz is not a formal medical or diagnostic test and should not be interpreted as clinical or medical advice."
              }
              ContentTitle={"The Four Attachment Styles "}
              ContentSubtitle={
                "Early attachment styles may not be exactly the same as those in adult relationships, but they can be a good predictor of adult behavior patterns.Your attachment style consists of a variation of attachment strategies, which strategies show up the most depend on the overall safety you have felt in relationships."
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default TodaysQuiz;
