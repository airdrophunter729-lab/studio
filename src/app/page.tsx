import { AppHeader } from '@/components/AppHeader'
import MealPlanner from '@/components/planner/MealPlanner'
import { RECIPES } from '@/lib/data'

export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Meal Planner" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <MealPlanner recipes={RECIPES} />
      </div>
    </div>
  )
}
