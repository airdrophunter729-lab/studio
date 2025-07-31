'use client'

import { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Planner, Ingredient } from '@/lib/types'
import { ScrollArea } from '../ui/scroll-area'
import { Download } from 'lucide-react'

type ShoppingListDialogProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  planner: Planner
}

export function ShoppingListDialog({ isOpen, onOpenChange, planner }: ShoppingListDialogProps) {
  const shoppingList = useMemo(() => {
    const allIngredients: Ingredient[] = []
    Object.values(planner).forEach(dayPlan => {
      Object.values(dayPlan).forEach(recipe => {
        if (recipe) {
          allIngredients.push(...recipe.ingredients)
        }
      })
    })

    // Simple aggregation for now, just lists all ingredients.
    // A more advanced version could combine quantities.
    return allIngredients
  }, [planner])

  const handleDownload = () => {
    const listText = shoppingList
      .map(item => `- ${item.name} (${item.quantity})`)
      .join('\n');
    
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Your Shopping List</DialogTitle>
          <DialogDescription>
            Here are all the ingredients you need for your planned meals this week.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <ScrollArea className="h-72 w-full rounded-md border p-4">
                {shoppingList.length > 0 ? (
                    <ul className="space-y-2">
                        {shoppingList.map((item, index) => (
                            <li key={index} className="flex justify-between">
                                <span>{item.name}</span>
                                <span className="text-muted-foreground">{item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-muted-foreground">Your shopping list is empty. Add some meals to your planner!</p>
                )}
            </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={handleDownload} disabled={shoppingList.length === 0} variant="default">
            <Download className="mr-2 h-4 w-4" />
            Download List
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
