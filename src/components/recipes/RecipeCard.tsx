'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/lib/types';
import { Clock } from 'lucide-react';
import { RecipeImage } from './RecipeImage';
import { getGeneratedImage } from '@/app/actions';


type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe: initialRecipe }: RecipeCardProps) {
  const [recipe, setRecipe] = useState(initialRecipe);

  useEffect(() => {
    async function fetchImage() {
      if (recipe.imageUrl.startsWith('https://placehold.co')) {
        const result = await getGeneratedImage({ prompt: recipe.name });
        if (result.success && result.data) {
          setRecipe(prev => ({...prev, imageUrl: result.data.imageUrl}));
        }
      }
    }
    // We don't generate images on the recipe list page anymore to avoid rate limiting.
    // User can click to see the full image on the detail page.
    // fetchImage(); 
  }, []); // Run only once

  return (
    <Link href={`/recipes/${recipe.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <RecipeImage recipe={recipe} imageHint="recipe food" />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <Badge variant="secondary" className="mb-2 capitalize">
            {recipe.category}
          </Badge>
          <CardTitle className="mb-1 text-lg font-headline">
            {recipe.name}
          </CardTitle>
          <CardDescription className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1.5 h-4 w-4" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
