import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-alternative-medications.ts';
import '@/ai/flows/scan-receipt.ts';
import '@/ai/flows/find-nearest-manufacturer.ts';
