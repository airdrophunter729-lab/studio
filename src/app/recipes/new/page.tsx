import { AppHeader } from '@/components/AppHeader'
import { RecipeForm } from '@/components/recipes/RecipeForm'

export default function NewRecipePage() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Create New Recipe" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <RecipeForm />
        </div>
      </div>
    </div>
  )
}
