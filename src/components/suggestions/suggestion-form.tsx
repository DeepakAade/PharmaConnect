'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getSuggestions } from '@/app/suggestions/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Lightbulb, List, Loader2, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full md:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Get Suggestions
        </>
      )}
    </Button>
  );
}

export function SuggestionForm() {
  const initialState = { status: 'idle' as const, message: '' };
  const [state, formAction] = useFormState(getSuggestions, initialState);
  const { pending } = useFormStatus();
  const { toast } = useToast();

  useEffect(() => {
    if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Describe Your Needs</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="searchCriteria">
                Medicine, Ingredient, or Symptoms
              </Label>
              <Input
                id="searchCriteria"
                name="searchCriteria"
                placeholder="e.g., 'Headache', 'Ibuprofen'"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userInput">Describe Your Needs</Label>
              <Textarea
                id="userInput"
                name="userInput"
                placeholder="e.g., 'Looking for a pain reliever that is gentle on the stomach.'"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicationHistory">Medication History (Optional)</Label>
              <Textarea
                id="medicationHistory"
                name="medicationHistory"
                placeholder="e.g., 'Allergic to aspirin, currently taking Lisinopril.'"
                rows={3}
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-primary" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pending && (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-8 w-1/3 mt-4" />
                <Skeleton className="h-20 w-full" />
              </div>
            )}
            {state.status === 'success' && state.data ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <List /> Suggested Alternatives
                  </h3>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-muted-foreground">
                    {state.data.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>AI Reasoning</AlertTitle>
                  <AlertDescription>{state.data.reasoning}</AlertDescription>
                </Alert>
              </div>
            ) : !pending ? (
              <div className="text-center text-muted-foreground py-10">
                <Sparkles className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4">
                  Your AI-powered suggestions will appear here.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
