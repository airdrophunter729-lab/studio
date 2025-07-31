'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { AppHeader } from '@/components/AppHeader'
import { RecipeCard } from '@/components/recipes/RecipeCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RECIPES } from '@/lib/data'
import { PlusCircle, Search } from 'lucide-react'

export default function RecipeLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(RECIPES.map((recipe) => recipe.category)),
    ]
    return ['all', ...uniqueCategories]
  }, [])

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter((recipe) => {
      const matchesCategory =
        selectedCategory === 'all' || recipe.category === selectedCategory
      const matchesSearch = recipe.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [searchTerm, selectedCategory])

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Recipe Library">
        <Link href="/recipes/new" passHref>
          <Button>
            <PlusCircle className="mr-2" />
            New Recipe
          </Button>
        </Link>
      </AppHeader>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="capitalize">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50">
            <p className="text-lg font-medium text-muted-foreground">
              No recipes found.
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
