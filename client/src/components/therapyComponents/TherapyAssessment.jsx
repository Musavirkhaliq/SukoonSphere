import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowLeft, FaSpinner, FaClipboardCheck } from 'react-icons/fa';
import customFetch from '@/utils/customFetch';
import './TherapyComponents.css';

const TherapyAssessment = ({ type = 'initial', onComplete, onSkip }) => {
  const [assessment, setAssessment] = useState(null);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch assessment questions
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching assessment questions for type:', type);
        const response = await customFetch.get(`/therapy/assessments?type=${type}`);
        console.log('Assessment response:', response.data);

        if (!response.data.assessment) {
          throw new Error('No assessment data returned from server');
        }

        setAssessment(response.data.assessment);

        // Initialize responses array with empty values
        const initialResponses = response.data.assessment.questions.map(question => ({
          questionId: question.questionId,
          question: question.text,
          answer: '',
          score: 0,
          category: question.category
        }));

        console.log('Initialized responses:', initialResponses);
        setResponses(initialResponses);
      } catch (error) {
        console.error('Error fetching assessment:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError(error.response?.data?.error || 'Failed to load assessment questions');

        // If the error is due to missing assessment data, we need to initialize it
        if (error.message === 'No assessment data returned from server' ||
            error.response?.status === 404) {
          console.log('Assessment data not found, may need initialization');
          setError('Assessment data not found. Please initialize the assessment data.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [type]);

  // Get current category and its questions
  const getCurrentCategory = () => {
    if (!assessment || !assessment.categories[currentCategoryIndex]) return null;
    return assessment.categories[currentCategoryIndex];
  };

  // Get questions for the current category
  const getCurrentCategoryQuestions = () => {
    if (!assessment) return [];
    const currentCategory = getCurrentCategory();
    if (!currentCategory) return [];

    return assessment.questions.filter(q => q.category === currentCategory.name);
  };

  // Get the current question
  const getCurrentQuestion = () => {
    const questions = getCurrentCategoryQuestions();
    if (!questions.length) return null;
    return questions[currentQuestionIndex];
  };

  // Handle response change
  const handleResponseChange = (value, score = 0) => {
    const question = getCurrentQuestion();
    if (!question) return;

    setResponses(prev => prev.map(response =>
      response.questionId === question.questionId
        ? { ...response, answer: value, score }
        : response
    ));
  };

  // Handle text input for open-ended questions
  const handleTextInput = (e) => {
    handleResponseChange(e.target.value);
  };

  // Navigate to the next question
  const goToNextQuestion = () => {
    const questions = getCurrentCategoryQuestions();

    if (currentQuestionIndex < questions.length - 1) {
      // Go to next question in current category
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Go to next category
      if (currentCategoryIndex < assessment.categories.length - 1) {
        setCurrentCategoryIndex(currentCategoryIndex + 1);
        setCurrentQuestionIndex(0);
      } else {
        // Assessment complete
        handleSubmit();
      }
    }
  };

  // Navigate to the previous question
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Go to previous question in current category
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // Go to previous category
      if (currentCategoryIndex > 0) {
        setCurrentCategoryIndex(currentCategoryIndex - 1);
        const prevCategoryQuestions = assessment.questions.filter(
          q => q.category === assessment.categories[currentCategoryIndex - 1].name
        );
        setCurrentQuestionIndex(prevCategoryQuestions.length - 1);
      }
    }
  };

  // Check if current question has a response
  const hasCurrentResponse = () => {
    const question = getCurrentQuestion();
    if (!question) return false;

    const response = responses.find(r => r.questionId === question.questionId);
    return response && response.answer !== '';
  };

  // Handle assessment submission
  const handleSubmit = () => {
    // Filter out empty responses
    const filledResponses = responses.filter(response => response.answer !== '');

    if (filledResponses.length === 0) {
      setError('Please answer at least one question');
      return;
    }

    setIsSubmitting(true);
    onComplete(filledResponses);
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    if (!assessment) return 0;

    const totalQuestions = assessment.questions.length;
    const answeredQuestions = responses.filter(r => r.answer !== '').length;

    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="therapy-assessment-loading">
        <FaSpinner className="spin" />
        <p>Loading assessment questions...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="therapy-assessment-error">
        <p>{error}</p>
        <button onClick={onSkip}>Skip Assessment</button>
      </div>
    );
  }

  // Render assessment
  const currentQuestion = getCurrentQuestion();
  const currentCategory = getCurrentCategory();

  if (!currentQuestion || !currentCategory) {
    return (
      <div className="therapy-assessment-error">
        <p>No questions available</p>
        <button onClick={onSkip}>Skip Assessment</button>
      </div>
    );
  }

  return (
    <div className="therapy-assessment">
      <div className="therapy-assessment-header">
        <h3>{assessment.name}</h3>
        <p>{assessment.description}</p>

        <div className="therapy-assessment-progress">
          <div
            className="therapy-assessment-progress-bar"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>

        <div className="therapy-assessment-category">
          <span className="therapy-assessment-category-label">Category:</span>
          <span className="therapy-assessment-category-name">{currentCategory.name}</span>
        </div>
      </div>

      <div className="therapy-assessment-content">
        <div className="therapy-assessment-question">
          <h4>{currentQuestion.text}</h4>

          {currentQuestion.type === 'scale' && (
            <div className="therapy-assessment-scale">
              {currentQuestion.options.map(option => (
                <button
                  key={option.value}
                  className={`therapy-scale-option ${
                    responses.find(r => r.questionId === currentQuestion.questionId)?.answer === option.value
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleResponseChange(option.value, option.score)}
                >
                  <span className="therapy-scale-value">{option.value}</span>
                  <span className="therapy-scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'multiple_choice' && (
            <div className="therapy-assessment-choices">
              {currentQuestion.options.map(option => (
                <button
                  key={option.value}
                  className={`therapy-choice-option ${
                    responses.find(r => r.questionId === currentQuestion.questionId)?.answer === option.value
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => handleResponseChange(option.value, option.score)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'open_ended' && (
            <div className="therapy-assessment-open-ended">
              <textarea
                value={responses.find(r => r.questionId === currentQuestion.questionId)?.answer || ''}
                onChange={handleTextInput}
                placeholder="Type your answer here..."
                rows={4}
              />
            </div>
          )}
        </div>
      </div>

      <div className="therapy-assessment-footer">
        <button
          className="therapy-assessment-skip"
          onClick={onSkip}
        >
          Skip Assessment
        </button>

        <div className="therapy-assessment-navigation">
          <button
            className="therapy-assessment-prev"
            onClick={goToPrevQuestion}
            disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
          >
            <FaArrowLeft />
            <span>Previous</span>
          </button>

          {isLastQuestion() ? (
            <button
              className="therapy-assessment-submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaClipboardCheck />
                  <span>Complete</span>
                </>
              )}
            </button>
          ) : (
            <button
              className="therapy-assessment-next"
              onClick={goToNextQuestion}
              disabled={!hasCurrentResponse() && currentQuestion.type !== 'open_ended'}
            >
              <span>Next</span>
              <FaArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Helper function to check if this is the last question
  function isLastQuestion() {
    return (
      currentCategoryIndex === assessment.categories.length - 1 &&
      currentQuestionIndex === getCurrentCategoryQuestions().length - 1
    );
  }
};

export default TherapyAssessment;
