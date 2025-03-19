
import React from 'react';

interface SignupErrorProps {
  error: string | null;
}

const SignupError: React.FC<SignupErrorProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
      {error}
    </div>
  );
};

export default SignupError;
