import { Header } from '@/components/layout/header';
import { ScanReceipt } from '@/components/scan/scan-receipt';

export default function ScanPage() {
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Scan Doctor's Receipt"
        description="Use your camera to scan a medical receipt and extract the details."
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <ScanReceipt />
      </main>
    </div>
  );
}
