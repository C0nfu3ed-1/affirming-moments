
import { FC } from 'react';

interface Testimonial {
  name: string;
  role: string;
  content: string;
  featured?: boolean;
}

const TestimonialsSection: FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Sarah J.",
      role: "Teacher",
      content: "These daily affirmations have completely changed my morning routine. I feel more centered and positive throughout the day.",
    },
    {
      name: "Michael T.",
      role: "Entrepreneur",
      content: "As someone who deals with a lot of pressure, these affirmations help me stay grounded and focused on what really matters.",
      featured: true,
    },
    {
      name: "Elena R.",
      role: "Healthcare Professional",
      content: "The personalized categories are perfect. I choose affirmations that align with my goals, and they arrive just when I need them.",
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Hear from people who have transformed their daily routines with our affirmations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div 
              key={i}
              className={`rounded-xl p-6 shadow-lg border transition-all duration-300 animate-fade-in animation-delay-${i*200} ${
                testimonial.featured 
                  ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20 transform hover:scale-105' 
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 transform hover:scale-102'
              }`}
            >
              <div className="mb-4">
                {"★★★★★".split('').map((star, j) => (
                  <span key={j} className="text-yellow-400 text-lg">
                    {star}
                  </span>
                ))}
              </div>
              <p className="italic mb-6 text-gray-700 dark:text-gray-300">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold mr-3">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
