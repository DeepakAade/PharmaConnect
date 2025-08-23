import { Header } from '@/components/layout/header';
import { FindManufacturerForm } from '@/components/medicines/find-manufacturer-form';

export default function FindManufacturerPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Find a Manufacturer"
        description="Find the nearest manufacturer for out-of-stock medicines."
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <FindManufacturerForm />
      </main>
    </div>
  );
}
