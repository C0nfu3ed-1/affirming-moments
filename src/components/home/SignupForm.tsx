
import SignupHeader from './signup/SignupHeader';
import SignupFormContainer from './signup/SignupFormContainer';

const SignupForm = () => {
  return (
    <section id="signup" className="py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <SignupHeader />
        <SignupFormContainer />
      </div>
    </section>
  );
};

export default SignupForm;
