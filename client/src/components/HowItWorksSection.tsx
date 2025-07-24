import React from 'react';
import { UserPlus, Link, BookOpen } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Choose your role and create an account.',
      step: 1
    },
    {
      icon: Link,
      title: 'Connect',
      description: 'Teachers create classes, students join, and parents link to their children.',
      step: 2
    },
    {
      icon: BookOpen,
      title: 'Start Reading',
      description: 'Explore the library, complete assignments, and watch progress unfold.',
      step: 3
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple Steps to Get Started
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-8 w-8" />
              </div>
              <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;