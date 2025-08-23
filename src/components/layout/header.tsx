import { CurrencySelector } from '@/components/currency/currency-selector';
import { SidebarTrigger } from '@/components/ui/sidebar';

type HeaderProps = {
  title: string;
  description?: string;
};

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex items-center gap-4 border-b bg-card p-4 h-16 shrink-0">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl font-headline">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <CurrencySelector />
      </div>
    </header>
  );
}
