'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { findManufacturer } from '@/app/find-manufacturer/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Factory, Info, Loader2, MapPin, Search, CheckCircle2 } from 'lucide-react';
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
          Searching...
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" />
          Find Manufacturer
        </>
      )}
    </Button>
  );
}

export function FindManufacturerForm() {
  const initialState = { status: 'idle' as const, message: '' };
  const [state, formAction] = useFormState(findManufacturer, initialState);
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Search for Medicine</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="medicineName">
                Medicine Name
              </Label>
              <Input
                id="medicineName"
                name="medicineName"
                placeholder="e.g., 'Amoxicillin 250mg'"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userLocation">Your Location (City or ZIP code)</Label>
               <Input
                id="userLocation"
                name="userLocation"
                placeholder="e.g., 'New York' or '10001'"
                required
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
              AI Search Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pending && (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            )}
            {state.status === 'success' && state.data ? (
                <Alert variant={state.data.inStock ? 'default' : 'destructive'}>
                  {state.data.inStock ? <CheckCircle2 className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                  <AlertTitle>{state.data.inStock ? 'In Stock!' : 'Out of Stock'}</AlertTitle>
                  <AlertDescription>
                    {state.message}
                     {state.data.nearestManufacturer && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-semibold flex items-center gap-2"><Factory/> Suggested Manufacturer</h4>
                            <p className="flex items-center gap-2 mt-1"><b className="font-medium">{state.data.nearestManufacturer.name}</b></p>
                            <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="w-4 h-4"/>{state.data.nearestManufacturer.location}</p>
                        </div>
                     )}
                  </AlertDescription>
                </Alert>
            ) : !pending ? (
              <div className="text-center text-muted-foreground py-10">
                <Search className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-4">
                  Results will appear here.
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
