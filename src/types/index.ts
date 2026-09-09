export type UserRole = 'customer' | 'delivery' | 'pharmacist';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  age: number;
  addresses: {
    id: string;
    label: string;
    street: string;
    city: string;
    pincode: string;
    isDefault: boolean;
  }[];
  activeMedications: string[];
  savedPrescriptions: {
    id: string;
    date: string;
    doctor: string;
    medicines: string[];
    imageUrl?: string;
  }[];
}

export interface Medicine {
  id: string;
  name: string;
  brandName: string;
  saltComposition: string;
  category: 'otc' | 'chronic_diabetes' | 'chronic_bp' | 'baby_care' | 'personal_care' | 'devices' | 'antibiotics';
  price: number;
  mrp: number;
  requiresPrescription: boolean;
  stockQty: number;
  pharmacyId: string;
  description: string;
  dosageForm: string; // 'Tablet', 'Capsule', 'Syrup', 'Device'
  packSize: string;
  manufacturer: string;
  genericAlternativeId?: string;
  genericAlternativeName?: string;
  genericSavingsPrice?: number;
  image?: string;
}

export interface Pharmacy {
  id: string;
  name: string;
  licenseNo: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  contact: string;
  rating: number;
  isOpen: boolean;
}

export type OrderStatus =
  | 'placed'
  | 'prescription_verified'
  | 'assigned_to_pharmacy'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'flagged_prescription';

export type DeliveryType = 'normal' | 'emergency';

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface ExtractedMedicine {
  name: string;
  dosage: string;
  qty: string;
  frequency?: string;
  confidence: number; // 0 to 100
  matchedMedicineId?: string;
}

export interface PrescriptionData {
  id: string;
  orderId?: string;
  imageUrl: string;
  doctorName: string;
  clinicHospital: string;
  date: string;
  patientAge?: number;
  extractedMedicines: ExtractedMedicine[];
  rawText?: string;
  verifiedBy?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  customerAge: number;
  deliveryAddress: string;
  items: CartItem[];
  totalAmount: number;
  deliveryFee: number;
  status: OrderStatus;
  deliveryType: DeliveryType;
  prescriptionId?: string;
  prescriptionImageUrl?: string;
  aiExtractedData?: {
    doctorName?: string;
    date?: string;
    medicines: ExtractedMedicine[];
    confidenceAvg: number;
  };
  assignedPharmacyId: string;
  assignedPharmacyName: string;
  assignedDeliveryPartnerId?: string;
  assignedDeliveryPartnerName?: string;
  assignedDeliveryPartnerPhone?: string;
  paymentMethod: 'upi' | 'card' | 'cod';
  paymentStatus: 'paid' | 'pending';
  estimatedDeliveryMinutes: number;
  createdAt: string;
  updatedAt: string;
  pharmacistNotes?: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface DrugInteractionResult {
  hasInteraction: boolean;
  warnings: {
    medicines: string[];
    severity: 'High' | 'Moderate' | 'Low';
    explanation: string;
    recommendation: string;
  }[];
  clinicalNotes: string;
}

export interface GenericSuggestionResult {
  hasGeneric: boolean;
  brandedName: string;
  genericName: string;
  saltComposition: string;
  originalPrice: number;
  genericPrice: number;
  savingsAmount: number;
  savingsPercentage: number;
  availabilityInStock: boolean;
  genericMedicineId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  disclaimerShown?: boolean;
  suggestedActions?: string[];
  suggestedMedicines?: Medicine[];
}

export interface RefillReminder {
  id: string;
  userId: string;
  medicineId: string;
  medicineName: string;
  frequencyDays: number;
  lastOrderedDate: string;
  nextReminderDate: string;
  active: boolean;
}
