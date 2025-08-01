import { AppHeader } from '@/components/AppHeader'
import MealPlanner from '@/components/planner/MealPlanner'
import { getGeneratedImage } from './actions'
import { RECIPES, type Recipe } from '@/lib/data'

// Pre-fetches all recipe images on the server
async function getRecipesWithImages(): Promise<Recipe[]> {
  const recipesWithImages = await Promise.all(
    RECIPES.map(async (recipe) => {
      if (recipe.imageUrl.startsWith('https://placehold.co')) {
        const result = await getGeneratedImage({ prompt: recipe.name })
        if (result.success && result.data) {
          return { ...recipe, imageUrl: result.data.imageUrl }
        }
      }
      return recipe
    })
  )
  return recipesWithImages
}


export default async function Home() {
  const recipes = await getRecipesWithImages();
  
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Meal Planner" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <MealPlanner recipes={recipes} />
      </div>
    </div>
  )
}
