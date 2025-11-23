'use client';

import { NewsCategory } from '@/types/news';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CategoryFilterProps {
  selectedCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'science', label: 'Science' },
  { value: 'world', label: 'World' },
  { value: 'sports', label: 'Sports' },
];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <Tabs value={selectedCategory} onValueChange={(v) => onCategoryChange(v as NewsCategory)}>
      <TabsList className="w-full justify-start overflow-x-auto">
        {CATEGORIES.map((category) => (
          <TabsTrigger key={category.value} value={category.value}>
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
