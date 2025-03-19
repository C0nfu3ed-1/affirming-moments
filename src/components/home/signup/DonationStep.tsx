
import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface DonationStepProps {
  formData: {
    donation: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  recaptchaRef: React.RefObject<ReCAPTCHA>;
  handleCaptchaChange: (value: string | null) => void;
}

const DonationStep: React.FC<DonationStepProps> = ({ 
  formData, 
  handleChange, 
  recaptchaRef, 
  handleCaptchaChange 
}) => {
  return (
    <>
      <div className="space-y-4 py-4">
        <div className="rounded-lg bg-primary-50 p-4 border border-primary-100">
          <h4 className="font-medium text-primary-800 mb-2">Support Our Mission</h4>
          <p className="text-sm text-gray-600 mb-4">
            Your donation helps us provide affirmations to those who need them most but can't afford it.
          </p>
          <div className="flex items-center">
            <input
              id="donation"
              name="donation"
              type="checkbox"
              checked={formData.donation}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="donation" className="ml-2 block text-sm text-gray-700">
              Yes, I'd like to donate through PayPal
            </label>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="mb-2 text-sm text-gray-600">Please verify you're human</div>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is Google's test key, replace with your actual site key in production
          onChange={handleCaptchaChange}
        />
        <p className="text-xs text-gray-500 mt-2">
          This helps us prevent spam and automated signups.
        </p>
      </div>
    </>
  );
};

export default DonationStep;
