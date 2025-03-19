
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SignupButtonProps {
  isLoading: boolean;
}

const SignupButton: React.FC<SignupButtonProps> = ({ isLoading }) => {
  return (
    <Button
      type="submit"
      className="w-full bg-primary-600 hover:bg-primary-700 text-white"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Account...
        </>
      ) : (
        'Sign Up'
      )}
    </Button>
  );
};

export default SignupButton;
