// This is a simple test script to verify the section separators implementation
// Run this in the browser console to check if the sections are properly separated

(function testSectionSeparators() {
  console.log('Testing section separators...');
  
  // Check if section separators are present
  const separators = document.querySelectorAll('.section-separator');
  console.log(`Found ${separators.length} section separators`);
  
  // Check if section containers are present
  const primarySections = document.querySelectorAll('.section-container.primary-section');
  const secondarySections = document.querySelectorAll('.section-container.secondary-section');
  const featuredSections = document.querySelectorAll('.section-container.featured-section');
  
  console.log(`Found ${primarySections.length} primary sections`);
  console.log(`Found ${secondarySections.length} secondary sections`);
  console.log(`Found ${featuredSections.length} featured sections`);
  
  // Check if the Mental Health Quiz section is properly styled
  const quizSection = document.querySelector('.mental-health-quiz-header');
  if (quizSection) {
    console.log('Mental Health Quiz section is properly styled');
  } else {
    console.log('Mental Health Quiz section is not found or not properly styled');
  }
  
  // Check if section titles are enhanced
  const enhancedTitles = document.querySelectorAll('.section-title-enhanced');
  console.log(`Found ${enhancedTitles.length} enhanced section titles`);
  
  console.log('Section separators test completed');
})();
