
export enum Category {
  SEASONAL = 'Mavsumiy maxsus kiyim',
  WINTER = 'Issiqlashtirilgan kiyim',
  FOOTWEAR = 'Maxsus poyabzal',
  HEADWEAR = 'Bosh kiyimlar',
  EYE = 'Ko\'zlarni himoyalovchi',
  RESPIRATORY = 'Nafas olish organlari',
  HEIGHT = 'Balandlikda ishlash',
  WELDING = 'Payvandlash ishlari',
  ELECTRICAL = 'Elektr xavfsizligi',
  HANDS = 'Qo\'llarni himoyalovchi',
  HEARING = 'Eshitish qobiliyati',
  HYGIENE = 'Gigiena vositalari'
}

export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface PPEItem {
  id: string;
  name: string;
  category: Category;
  gost: string;
  image: string;
  description: string;
  materials: string;
  specs: TechnicalSpec[];
  colors: string[];
  totalQuantity: number;
}
