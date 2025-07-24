import React from 'react';
import { GraduationCap, BookOpen, Users } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: GraduationCap,
      title: 'For Students',
      description: 'Engage with interactive texts, track your progress, and earn rewards.',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      icon: BookOpen,
      title: 'For Teachers',
      description: 'Assign reading, monitor class performance, and access a rich library of resources.',
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    },
    {
      icon: Users,
      title: 'For Parents',
      description: 'Stay informed about your child\'s reading habits and progress.',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            A Platform for Everyone
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.bgColor} ${feature.borderColor} border-2 p-8 rounded-xl text-center hover:shadow-lg transition-shadow`}
            >
              <feature.icon className={`h-12 w-12 ${feature.iconColor} mx-auto mb-4`} />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;