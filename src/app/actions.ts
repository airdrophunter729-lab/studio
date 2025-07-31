'use server'

import {
  suggestRecipes,
  type SuggestRecipesInput,
} from '@/ai/flows/smart-recipe-suggestion'
import { generateImage, type GenerateImageInput } from '@/ai/flows/generate-image-flow'


export async function getRecipeSuggestions(input: SuggestRecipesInput) {
  try {
    const result = await suggestRecipes(input)
    return { success: true, data: result }
  } catch (error) {
    console.error('Error in getRecipeSuggestions:', error)
    return { success: false, error: 'Failed to get recipe suggestions from AI.' }
  }
}

export async function getGeneratedImage(input: GenerateImageInput) {
  try {
    const result = await generateImage(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in getGeneratedImage:', error);
    return { success: false, error: 'Failed to generate image from AI.' };
  }
}
