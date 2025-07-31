'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { getRecipeSuggestions } from '@/app/actions'
import { Loader2, Lightbulb } from 'lucide-react'

const suggestionSchema = z.object({
  dietaryRestrictions: z.string().optional(),
  availableIngredients: z.string().min(1, 'Please list at least one ingredient.'),
  healthGoals: z.string().optional(),
})

type SuggestionFormData = z.infer<typeof suggestionSchema>

export default function SmartSuggestionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SuggestionFormData>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      dietaryRestrictions: '',
      availableIngredients: '',
      healthGoals: '',
    },
  })

  const onSubmit = async (data: SuggestionFormData) => {
    setIsLoading(true)
    setError(null)
    setSuggestions([])

    const result = await getRecipeSuggestions({
        dietaryRestrictions: data.dietaryRestrictions || "None",
        availableIngredients: data.availableIngredients,
        healthGoals: data.healthGoals || "None",
    });

    if (result.success && result.data?.recipes) {
      setSuggestions(result.data.recipes)
    } else {
      setError(result.error || 'An unknown error occurred.')
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Your Next Meal</CardTitle>
        <CardDescription>
          Tell us what you have and what you're looking for, and our AI will suggest some recipes for you.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="availableIngredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Ingredients</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., chicken breast, broccoli, rice, soy sauce" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dietaryRestrictions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dietary Restrictions (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., vegetarian, gluten-free, dairy-free" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="healthGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health Goals (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., low-carb, high-protein" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-stretch">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking...
                </>
              ) : (
                'Get Suggestions'
              )}
            </Button>
            
            {error && <p className="mt-4 text-center text-sm text-destructive">{error}</p>}
            
            {suggestions.length > 0 && (
              <div className="mt-6 w-full">
                <h3 className="mb-4 text-lg font-semibold">Here are some ideas:</h3>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
                      <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
