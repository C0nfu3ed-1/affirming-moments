
import React from 'react';

const SignupHeader: React.FC = () => {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Start Your Affirmation Journey
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Sign up today to receive daily affirmations tailored to your preferences.
      </p>
    </div>
  );
};

export default SignupHeader;
