'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ChevronLeft,
  Clock,
  Flame,
  ImageIcon,
  Utensils,
} from 'lucide-react'
import { RECIPES } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useEffect, useState } from 'react'
import { getGeneratedImage } from '@/app/actions'
import { Skeleton } from '@/components/ui/skeleton'

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipe = RECIPES.find((r) => r.id === params.id)
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);

  useEffect(() => {
    if (!recipe) return;
    const fetchImage = async () => {
      setIsLoadingImage(true);
      const result = await getGeneratedImage({ prompt: recipe.name });
      if (result.success && result.data) {
        setImageUrl(result.data.imageUrl);
      } else {
        setImageUrl(recipe.imageUrl);
      }
      setIsLoadingImage(false);
    };
    
    if (recipe.imageUrl.startsWith('https://placehold.co')) {
       fetchImage();
    } else {
       setImageUrl(recipe.imageUrl);
       setIsLoadingImage(false);
    }
  }, [recipe]);

  if (!recipe) {
    notFound()
  }

  const nutritionData = [
    { name: 'Protein', value: recipe.nutrients.protein, fill: 'var(--color-protein)' },
    { name: 'Fat', value: recipe.nutrients.fat, fill: 'var(--color-fat)' },
    { name: 'Carbs', value: recipe.nutrients.carbs, fill: 'var(--color-carbs)' },
  ]
  
  const chartConfig = {
    protein: {
      label: "Protein (g)",
      color: "hsl(var(--chart-1))",
    },
    fat: {
      label: "Fat (g)",
      color: "hsl(var(--chart-2))",
    },
    carbs: {
      label: "Carbs (g)",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <Link href="/recipes">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to recipes</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold md:text-2xl">{recipe.name}</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative mb-6 h-64 w-full overflow-hidden rounded-lg md:h-96">
            {isLoadingImage && <Skeleton className="h-full w-full" />}
            {!isLoadingImage && imageUrl && (
              <Image
                src={imageUrl}
                alt={recipe.name}
                fill
                className="object-cover"
                data-ai-hint="recipe photography"
              />
            )}
             {!isLoadingImage && !imageUrl && (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <ImageIcon className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>

          <p className="mb-6 text-muted-foreground">{recipe.description}</p>

          <div className="mb-8 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Calories</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recipe.nutrients.calories}</div>
                <p className="text-xs text-muted-foreground">kcal</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prep Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recipe.prepTime}</div>
                <p className="text-xs text-muted-foreground">minutes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cook Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recipe.cookTime}</div>
                <p className="text-xs text-muted-foreground">minutes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Category</CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 <Badge variant="secondary" className="mt-2 text-sm capitalize">{recipe.category}</Badge>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <h2 className="mb-4 text-2xl font-headline">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between rounded-md bg-muted/50 p-2">
                    <span>{ing.name}</span>
                    <span className="font-medium">{ing.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <h2 className="mb-4 text-2xl font-headline">Instructions</h2>
              <ol className="list-inside list-decimal space-y-4">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-2xl font-headline">Nutritional Information</h2>
             <Card>
              <CardContent className="p-2 pt-4">
                <ChartContainer config={chartConfig} className="h-64 w-full">
                  <ResponsiveContainer>
                    <BarChart data={nutritionData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                      />
                      <YAxis
                        label={{ value: "Grams (g)", angle: -90, position: 'insideLeft', offset: -5 }}
                      />
                       <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Bar dataKey="value" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
             </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
