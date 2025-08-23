import { Header } from '@/components/layout/header';
import { SuggestionForm } from '@/components/suggestions/suggestion-form';

export default function SuggestionsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="AI Medication Suggestions"
        description="Find related or alternative medications."
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <SuggestionForm />
      </main>
    </div>
  );
}
