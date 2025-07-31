'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Recipe, Planner, Day, MealSlot } from '@/lib/types'
import { DAYS, MEAL_SLOTS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ChefHat, ImageIcon, ShoppingCart, Trash2 } from 'lucide-react'
import { ShoppingListDialog } from './ShoppingListDialog'
import { getGeneratedImage } from '@/app/actions'
import { Skeleton } from '../ui/skeleton'

type MealPlannerProps = {
  recipes: Recipe[]
}

const RecipeImage = ({ recipe }: { recipe: Recipe }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setIsLoading(true);
      const result = await getGeneratedImage({ prompt: recipe.name });
      if (result.success && result.data) {
        setImageUrl(result.data.imageUrl);
      } else {
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

  if (isLoading) {
    return <Skeleton className="h-16 w-16" />;
  }

  if (!imageUrl) {
     return <div className="flex h-16 w-16 items-center justify-center bg-muted rounded-md"><ImageIcon className="text-muted-foreground" /></div>;
  }

  return (
    <Image
      src={imageUrl}
      alt={recipe.name}
      fill
      className="object-cover"
      data-ai-hint="recipe ingredient"
    />
  );
};


export default function MealPlanner({ recipes }: MealPlannerProps) {
  const [planner, setPlanner] = useState<Planner>({})
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [isShoppingListOpen, setShoppingListOpen] = useState(false)

  const handleSlotClick = (day: Day, meal: MealSlot) => {
    if (selectedRecipe) {
      setPlanner((prev) => ({
        ...prev,
        [day]: {
          ...prev[day],
          [meal]: selectedRecipe,
        },
      }))
      setSelectedRecipe(null)
    }
  }

  const handleRecipeSelect = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
  }

  const clearSlot = (day: Day, meal: MealSlot) => {
    setPlanner((prev) => {
      const newDayPlan = { ...prev[day] }
      delete newDayPlan[meal]
      if (Object.keys(newDayPlan).length === 0) {
        const newPlanner = { ...prev }
        delete newPlanner[day]
        return newPlanner
      }
      return {
        ...prev,
        [day]: newDayPlan,
      }
    })
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>This Week's Meals</CardTitle>
              <Button onClick={() => setShoppingListOpen(true)}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Generate Shopping List
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea>
              <div className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))]">
                <div className="sticky left-0 bg-card"></div>
                {DAYS.map((day) => (
                  <div key={day} className="p-2 text-center font-bold">
                    {day}
                  </div>
                ))}
                {MEAL_SLOTS.map((meal) => (
                  <>
                    <div
                      key={meal}
                      className="sticky left-0 flex items-center justify-center bg-card p-2 font-bold"
                    >
                      {meal}
                    </div>
                    {DAYS.map((day) => {
                      const recipe = planner[day]?.[meal]
                      return (
                        <div
                          key={`${day}-${meal}`}
                          onClick={() => handleSlotClick(day, meal)}
                          className={cn(
                            'group relative m-1 h-32 cursor-pointer rounded-lg border-2 border-dashed bg-muted/50 transition-colors',
                            selectedRecipe ? 'border-primary/50 hover:bg-primary/10' : 'border-border',
                            recipe && 'border-solid border-transparent bg-card p-2'
                          )}
                        >
                          {recipe ? (
                            <>
                              <Image src={recipe.imageUrl} alt={recipe.name} fill className="rounded-md object-cover opacity-20"/>
                              <div className="relative z-10 flex h-full flex-col justify-between">
                                <p className="text-xs font-semibold">{recipe.name}</p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    clearSlot(day, meal)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </>
                          ) : (
                             <div className="flex h-full items-center justify-center">
                                <ChefHat className="h-8 w-8 text-muted-foreground/50"/>
                             </div>
                          )}
                        </div>
                      )
                    })}
                  </>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Available Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">Select a recipe to add it to the planner.</p>
            <ScrollArea className="h-[60vh]">
              <div className="space-y-2">
                {recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    onClick={() => handleRecipeSelect(recipe)}
                    className={cn(
                      'flex cursor-pointer items-center gap-4 rounded-lg border p-2 transition-all',
                      selectedRecipe?.id === recipe.id ? 'border-primary bg-primary/10 shadow-md' : 'hover:bg-muted/80'
                    )}
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                      <RecipeImage recipe={recipe} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{recipe.name}</h4>
                      <p className="text-sm text-muted-foreground">{recipe.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <ShoppingListDialog 
        isOpen={isShoppingListOpen}
        onOpenChange={setShoppingListOpen}
        planner={planner}
      />
    </div>
  )
}
