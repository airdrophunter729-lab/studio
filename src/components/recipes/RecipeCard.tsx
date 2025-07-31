'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Recipe } from '@/lib/types';
import { Clock, ImageIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getGeneratedImage } from '@/app/actions';
import { Skeleton } from '../ui/skeleton';

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      const result = await getGeneratedImage({ prompt: recipe.name });
      if (result.success && result.data) {
        setImageUrl(result.data.imageUrl);
      } else {
        // Fallback to placeholder if generation fails
        setImageUrl(recipe.imageUrl);
      }
      setIsLoading(false);
    };

    if (recipe.imageUrl.startsWith('https://placehold.co')) {
       fetchImage();
    } else {
       setImageUrl(recipe.imageUrl);
       setIsLoading(false);
    }
  }, [recipe.name, recipe.imageUrl]);

  return (
    <Link href={`/recipes/${recipe.id}`} className="group">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            {isLoading && <Skeleton className="h-full w-full" />}
            {!isLoading && imageUrl && (
              <Image
                src={imageUrl}
                alt={recipe.name}
                fill
                className="object-cover"
                data-ai-hint="recipe food"
              />
            )}
             {!isLoading && !imageUrl && (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
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
