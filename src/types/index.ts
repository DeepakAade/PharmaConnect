export type Medicine = {
  id: string;
  name: string;
  manufacturer: string;
  form: 'Tablet' | 'Capsule' | 'Liquid' | 'Syrup' | 'Injection' | 'Ointment';
  therapeuticCategory: 'Analgesic' | 'Antibiotic' | 'Antiviral' | 'Cardiovascular' | 'Respiratory' | 'Gastrointestinal';
  imageUrl: string;
  price: number;
  inStock: boolean;
};

export type Manufacturer = {
  id: string;
  name: string;
  location: string;
  logoUrl: string;
};
