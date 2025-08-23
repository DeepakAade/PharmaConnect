import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Factory } from 'lucide-react';
import Link from 'next/link';

export default function ManufacturerLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Factory className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="mt-4 text-2xl font-headline">
            Manufacturer Portal
          </CardTitle>
          <CardDescription>
            Access your dashboard to manage medicines and collaborate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="yourcompany@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            {/* In a real app, this would be a server action */}
            <Button asChild className="w-full">
              <Link href="/manufacturer/dashboard">Login</Link>
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link
              href="#"
              className="underline text-muted-foreground hover:text-primary"
            >
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
