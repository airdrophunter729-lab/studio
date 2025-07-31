export interface Ingredient {
  name: string
  quantity: string
}

export interface Nutrients {
  calories: number
  protein: number
  fat: number
  carbs: number
}

export interface Recipe {
  id: string
  name:string
  category: string
  description: string
  ingredients: Ingredient[]
  instructions: string[]
  imageUrl: string
  nutrients: Nutrients
  prepTime: number // in minutes
  cookTime: number // in minutes
}

export type MealSlot = 'Breakfast' | 'Lunch' | 'Dinner'
export const MEAL_SLOTS: MealSlot[] = ['Breakfast', 'Lunch', 'Dinner']

export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
export const DAYS: Day[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export type Planner = {
  [day in Day]?: {
    [meal in MealSlot]?: Recipe | null
  }
}
