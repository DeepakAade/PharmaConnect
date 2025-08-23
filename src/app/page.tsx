import { MedicineList } from '@/components/medicines/medicine-list';
import { Header } from '@/components/layout/header';
import { medicines } from '@/lib/data';

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Medicines" description="Browse medicines from direct manufacturers." />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <MedicineList medicines={medicines} />
      </main>
    </div>
  );
}
