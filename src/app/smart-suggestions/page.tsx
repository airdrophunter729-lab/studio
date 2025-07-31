import { AppHeader } from '@/components/AppHeader'
import SmartSuggestionForm from '@/components/ai/SmartSuggestionForm'

export default function SmartSuggestionsPage() {
  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Smart Suggestions" />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <SmartSuggestionForm />
        </div>
      </div>
    </div>
  )
}
