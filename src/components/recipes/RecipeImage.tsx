// A simple component to render the recipe image.
// It receives the final URL as a prop, so it doesn't need to be async or a client component.
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import type { Recipe } from '@/lib/types';

type RecipeImageProps = {
    recipe: Recipe;
    imageHint?: string;
    className?: string;
};

export function RecipeImage({ recipe, imageHint, className }: RecipeImageProps) {
  if (!recipe.imageUrl || recipe.imageUrl.startsWith('https://placehold.co')) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      src={recipe.imageUrl}
      alt={recipe.name}
      fill
      className={`object-cover ${className}`}
      data-ai-hint={imageHint}
    />
  );
}
