'use client'

import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, PlusCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  quantity: z.string().min(1, 'Quantity is required'),
})

const recipeSchema = z.object({
  name: z.string().min(3, 'Recipe name must be at least 3 characters'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  prepTime: z.coerce.number().min(0, 'Prep time must be a positive number'),
  cookTime: z.coerce.number().min(0, 'Cook time must be a positive number'),
  ingredients: z.array(ingredientSchema).min(1, 'At least one ingredient is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  nutrients: z.object({
    calories: z.coerce.number().min(0, 'Calories must be a positive number'),
    protein: z.coerce.number().min(0, 'Protein must be a positive number'),
    fat: z.coerce.number().min(0, 'Fat must be a positive number'),
    carbs: z.coerce.number().min(0, 'Carbs must be a positive number'),
  }),
})

type RecipeFormData = z.infer<typeof recipeSchema>

export function RecipeForm() {
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      prepTime: 0,
      cookTime: 0,
      ingredients: [{ name: '', quantity: '' }],
      instructions: '',
      nutrients: { calories: 0, protein: 0, fat: 0, carbs: 0 },
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  })

  const onSubmit = (data: RecipeFormData) => {
    console.log('New Recipe Data:', data)
    toast({
      title: 'Recipe Created!',
      description: `The recipe for "${data.name}" has been saved.`,
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Recipe Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Recipe Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} placeholder="e.g., Dinner, Breakfast"/>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prepTime">Prep Time (minutes)</Label>
              <Input id="prepTime" type="number" {...register('prepTime')} />
              {errors.prepTime && <p className="text-sm text-destructive">{errors.prepTime.message}</p>}
            </div>
            <div>
              <Label htmlFor="cookTime">Cook Time (minutes)</Label>
              <Input id="cookTime" type="number" {...register('cookTime')} />
              {errors.cookTime && <p className="text-sm text-destructive">{errors.cookTime.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor={`ingredients.${index}.name`}>Name</Label>
                <Input {...register(`ingredients.${index}.name`)} />
                 {errors.ingredients?.[index]?.name && <p className="text-sm text-destructive">{errors.ingredients[index]?.name?.message}</p>}
              </div>
              <div className="flex-1">
                <Label htmlFor={`ingredients.${index}.quantity`}>Quantity</Label>
                <Input {...register(`ingredients.${index}.quantity`)} />
                {errors.ingredients?.[index]?.quantity && <p className="text-sm text-destructive">{errors.ingredients[index]?.quantity?.message}</p>}
              </div>
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {errors.ingredients?.root && <p className="text-sm text-destructive">{errors.ingredients.root.message}</p>}
          <Button type="button" variant="outline" onClick={() => append({ name: '', quantity: '' })}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Ingredient
          </Button>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea {...register('instructions')} rows={8} placeholder="List the steps to prepare your recipe..."/>
          {errors.instructions && <p className="text-sm text-destructive">{errors.instructions.message}</p>}
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Nutritional Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
                <Label htmlFor="nutrients.calories">Calories</Label>
                <Input id="nutrients.calories" type="number" {...register('nutrients.calories')} />
                {errors.nutrients?.calories && <p className="text-sm text-destructive">{errors.nutrients.calories.message}</p>}
            </div>
            <div>
                <Label htmlFor="nutrients.protein">Protein (g)</Label>
                <Input id="nutrients.protein" type="number" {...register('nutrients.protein')} />
                {errors.nutrients?.protein && <p className="text-sm text-destructive">{errors.nutrients.protein.message}</p>}
            </div>
            <div>
                <Label htmlFor="nutrients.fat">Fat (g)</Label>
                <Input id="nutrients.fat" type="number" {...register('nutrients.fat')} />
                {errors.nutrients?.fat && <p className="text-sm text-destructive">{errors.nutrients.fat.message}</p>}
            </div>
            <div>
                <Label htmlFor="nutrients.carbs">Carbs (g)</Label>
                <Input id="nutrients.carbs" type="number" {...register('nutrients.carbs')} />
                {errors.nutrients?.carbs && <p className="text-sm text-destructive">{errors.nutrients.carbs.message}</p>}
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" variant="default">
          Save Recipe
        </Button>
      </div>
    </form>
  )
}
