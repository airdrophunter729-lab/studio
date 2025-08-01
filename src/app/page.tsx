import { AppHeader } from '@/components/AppHeader'
import MealPlanner from '@/components/planner/MealPlanner'
import { RECIPES, type Recipe } from '@/lib/data'

export default async function Home() {
  // We will pass the recipes directly without pre-fetching images
  // to avoid hitting API rate limits on the home page.
  // Images will now be generated on the recipe detail page.
  const recipes: Recipe[] = RECIPES;
  
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Meal Planner" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <MealPlanner recipes={recipes} />
      </div>
    </div>
  )
}
