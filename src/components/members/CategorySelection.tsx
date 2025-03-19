
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const categories = [
  { id: 'morning', name: 'Morning Motivation' },
  { id: 'confidence', name: 'Confidence Boosters' },
  { id: 'gratitude', name: 'Gratitude & Appreciation' },
  { id: 'success', name: 'Success Mindset' },
  { id: 'mindfulness', name: 'Mindfulness & Peace' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'relationships', name: 'Relationship Happiness' },
  { id: 'career', name: 'Career & Purpose' },
];

interface CategorySelectionProps {
  onChange: (categories: string[]) => void;
  selectedCategories: string[];
}

const CategorySelection = ({ onChange, selectedCategories: propSelectedCategories = [] }: CategorySelectionProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(propSelectedCategories);
  
  useEffect(() => {
    setSelectedCategories(propSelectedCategories);
  }, [propSelectedCategories]);
  
  const toggleCategory = (categoryId: string) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updatedCategories);
    onChange(updatedCategories);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Select the types of affirmations you'd like to receive (choose multiple):
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`
              flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
              ${selectedCategories.includes(category.id)
                ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800'}
              border
            `}
          >
            {selectedCategories.includes(category.id) ? (
              <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2 animate-scale-in" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 mr-2"></div>
            )}
            <span className="text-sm font-medium">
              {category.name}
            </span>
          </div>
        ))}
      </div>
      
      {selectedCategories.length === 0 && (
        <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
          Please select at least one category to receive affirmations.
        </p>
      )}
    </div>
  );
};

export default CategorySelection;
