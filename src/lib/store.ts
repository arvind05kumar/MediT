import { Medicine, Pharmacy, Order, UserProfile, CartItem, PrescriptionData, RefillReminder } from '@/types';

// ==========================================
// SEED DATA FOR MEDIT PROTOTYPE
// ==========================================

export const INITIAL_PHARMACIES: Pharmacy[] = [
  {
    id: 'pharm-1',
    name: 'Apollo 24|7 Partner Pharmacy',
    licenseNo: 'DL-2023-AP-88412',
    address: 'Shop 14, Block B, Connaught Place',
    city: 'New Delhi',
    lat: 28.6315,
    lng: 77.2167,
    contact: '+91 98110 22334',
    rating: 4.9,
    isOpen: true,
  },
  {
    id: 'pharm-2',
    name: 'MedPlus Express Pharmacy',
    licenseNo: 'DL-2022-MP-67210',
    address: 'Plot 8, Main Ring Road, Defence Colony',
    city: 'New Delhi',
    lat: 28.5742,
    lng: 77.2341,
    contact: '+91 98711 44556',
    rating: 4.8,
    isOpen: true,
  },
  {
    id: 'pharm-3',
    name: 'Jan Aushadhi Generic Hub (Govt Approved)',
    licenseNo: 'DL-2024-JA-11980',
    address: 'Metro Station Gate 2, Lajpat Nagar',
    city: 'New Delhi',
    lat: 28.5678,
    lng: 77.2433,
    contact: '+91 98990 77889',
    rating: 4.7,
    isOpen: true,
  },
];

export const INITIAL_MEDICINES: Medicine[] = [
  // 1. Antibiotics & Anti-infectives (Rx)
  {
    id: 'med-1',
    name: 'Augmentin 625 Duo Tablet',
    brandName: 'Augmentin 625 Duo',
    saltComposition: 'Amoxycillin (500mg) + Clavulanic Acid (125mg)',
    category: 'antibiotics',
    price: 204.50,
    mrp: 228.00,
    requiresPrescription: true,
    stockQty: 45,
    pharmacyId: 'pharm-1',
    description: 'High-grade broad-spectrum antibiotic for bacterial infections of respiratory tract, skin, and urinary tract.',
    dosageForm: 'Tablet',
    packSize: '10 Tablets',
    manufacturer: 'GlaxoSmithKline Pharmaceuticals Ltd',
    genericAlternativeName: 'Moxclav 625 / Jan Aushadhi Amoxy-Clav',
    genericSavingsPrice: 85.00,
  },
  {
    id: 'med-2',
    name: 'Azithral 500 Tablet',
    brandName: 'Azithral 500',
    saltComposition: 'Azithromycin (500mg)',
    category: 'antibiotics',
    price: 132.00,
    mrp: 147.00,
    requiresPrescription: true,
    stockQty: 30,
    pharmacyId: 'pharm-1',
    description: 'Macrolide antibiotic used to treat bacterial throat, chest, and nasal infections.',
    dosageForm: 'Tablet',
    packSize: '5 Tablets',
    manufacturer: 'Alembic Pharmaceuticals Ltd',
    genericAlternativeName: 'Generic Azithromycin 500mg',
    genericSavingsPrice: 52.00,
  },

  // 2. Chronic Care - Diabetes
  {
    id: 'med-3',
    name: 'Glycomet-GP 2 Forte Tablet',
    brandName: 'Glycomet-GP 2 Forte',
    saltComposition: 'Metformin (1000mg) + Glimepiride (2mg)',
    category: 'chronic_diabetes',
    price: 178.00,
    mrp: 198.00,
    requiresPrescription: true,
    stockQty: 60,
    pharmacyId: 'pharm-1',
    description: 'Bitherapy oral anti-diabetic medication for long-term type-2 diabetes glycemic control.',
    dosageForm: 'Tablet',
    packSize: '15 Tablets',
    manufacturer: 'USV Ltd',
    genericAlternativeName: 'Jan Aushadhi Glimepiride + Metformin Forte',
    genericSavingsPrice: 62.00,
  },
  {
    id: 'med-4',
    name: 'Januvia 100mg Tablet',
    brandName: 'Januvia 100',
    saltComposition: 'Sitagliptin (100mg)',
    category: 'chronic_diabetes',
    price: 430.00,
    mrp: 460.00,
    requiresPrescription: true,
    stockQty: 25,
    pharmacyId: 'pharm-2',
    description: 'DPP-4 inhibitor for advanced blood glucose management.',
    dosageForm: 'Tablet',
    packSize: '7 Tablets',
    manufacturer: 'MSD Pharmaceuticals',
    genericAlternativeName: 'Zita 100 / Generic Sitagliptin',
    genericSavingsPrice: 165.00,
  },

  // 3. Chronic Care - Blood Pressure & Cardiac
  {
    id: 'med-5',
    name: 'Telma 40 Tablet',
    brandName: 'Telma 40',
    saltComposition: 'Telmisartan (40mg)',
    category: 'chronic_bp',
    price: 135.00,
    mrp: 152.00,
    requiresPrescription: true,
    stockQty: 80,
    pharmacyId: 'pharm-1',
    description: 'Angiotensin receptor blocker (ARB) for hypertension management and cardiovascular protection.',
    dosageForm: 'Tablet',
    packSize: '15 Tablets',
    manufacturer: 'Glenmark Pharmaceuticals Ltd',
    genericAlternativeName: 'Generic Telmisartan 40mg (Jan Aushadhi)',
    genericSavingsPrice: 42.00,
  },
  {
    id: 'med-6',
    name: 'Ecosprin 75 Tablet',
    brandName: 'Ecosprin 75',
    saltComposition: 'Aspirin (75mg)',
    category: 'chronic_bp',
    price: 9.80,
    mrp: 11.50,
    requiresPrescription: true,
    stockQty: 120,
    pharmacyId: 'pharm-1',
    description: 'Low-dose blood thinner / antiplatelet agent used for heart attack and stroke prevention.',
    dosageForm: 'Tablet',
    packSize: '14 Tablets',
    manufacturer: 'USV Ltd',
    genericAlternativeName: 'Generic Low Dose Aspirin 75',
    genericSavingsPrice: 5.00,
  },

  // 4. OTC - Fever, Pain, & Acidity
  {
    id: 'med-7',
    name: 'Dolo 650 Tablet',
    brandName: 'Dolo 650',
    saltComposition: 'Paracetamol (650mg)',
    category: 'otc',
    price: 32.50,
    mrp: 35.00,
    requiresPrescription: false,
    stockQty: 200,
    pharmacyId: 'pharm-1',
    description: 'Trusted antipyretic & analgesic for high fever, body pain, headache, and flu symptoms.',
    dosageForm: 'Tablet',
    packSize: '15 Tablets',
    manufacturer: 'Micro Labs Ltd',
    genericAlternativeName: 'Jan Aushadhi Paracetamol 650',
    genericSavingsPrice: 12.00,
  },
  {
    id: 'med-8',
    name: 'Pan-D Capsule',
    brandName: 'Pan-D',
    saltComposition: 'Pantoprazole (40mg) + Domperidone (30mg)',
    category: 'otc',
    price: 198.00,
    mrp: 220.00,
    requiresPrescription: true,
    stockQty: 75,
    pharmacyId: 'pharm-1',
    description: 'Proton pump inhibitor + prokinetic for severe GERD, heartburn, nausea, and acid reflux.',
    dosageForm: 'Capsule',
    packSize: '15 Capsules',
    manufacturer: 'Alkem Laboratories Ltd',
    genericAlternativeName: 'Generic Pantoprazole + Domperidone SR',
    genericSavingsPrice: 70.00,
  },
  {
    id: 'med-9',
    name: 'Digene Acidity Relief Gel Mint',
    brandName: 'Digene Gel',
    saltComposition: 'Magnesium Hydroxide + Aluminium Hydroxide + Simethicone',
    category: 'otc',
    price: 145.00,
    mrp: 160.00,
    requiresPrescription: false,
    stockQty: 50,
    pharmacyId: 'pharm-2',
    description: 'Sugar-free rapid acting antacid suspension for heartburn and bloating.',
    dosageForm: 'Syrup',
    packSize: '200ml Bottle',
    manufacturer: 'Abbott Healthcare',
  },
  {
    id: 'med-10',
    name: 'Combiflam Tablet',
    brandName: 'Combiflam',
    saltComposition: 'Ibuprofen (400mg) + Paracetamol (325mg)',
    category: 'otc',
    price: 48.00,
    mrp: 52.00,
    requiresPrescription: false,
    stockQty: 90,
    pharmacyId: 'pharm-2',
    description: 'Dual-action anti-inflammatory painkiller for toothache, joint pain, and sprains.',
    dosageForm: 'Tablet',
    packSize: '20 Tablets',
    manufacturer: 'Sanofi India Ltd',
  },
  {
    id: 'med-11',
    name: 'Allegra 120mg Tablet',
    brandName: 'Allegra 120',
    saltComposition: 'Fexofenadine (120mg)',
    category: 'otc',
    price: 215.00,
    mrp: 240.00,
    requiresPrescription: false,
    stockQty: 40,
    pharmacyId: 'pharm-1',
    description: 'Non-drowsy 24-hour antihistamine for allergic rhinitis, hives, and pollen allergies.',
    dosageForm: 'Tablet',
    packSize: '10 Tablets',
    manufacturer: 'Sanofi India Ltd',
    genericAlternativeName: 'Generic Fexofenadine 120mg',
    genericSavingsPrice: 78.00,
  },
  {
    id: 'med-12',
    name: 'ORS Electral Powder',
    brandName: 'Electral Sachet',
    saltComposition: 'Oral Rehydration Salts (WHO Formula)',
    category: 'otc',
    price: 22.00,
    mrp: 23.50,
    requiresPrescription: false,
    stockQty: 150,
    pharmacyId: 'pharm-1',
    description: 'WHO recommended formula for restoring fluids and essential electrolytes during dehydration.',
    dosageForm: 'Powder',
    packSize: '21.8g Sachet',
    manufacturer: 'FDC Ltd',
  },

  // 5. Baby Care & Personal Care
  {
    id: 'med-13',
    name: 'Sebamed Baby Diaper Rash Cream',
    brandName: 'Sebamed Baby',
    saltComposition: 'Micronized Titanium Dioxide + Panthenol',
    category: 'baby_care',
    price: 490.00,
    mrp: 530.00,
    requiresPrescription: false,
    stockQty: 20,
    pharmacyId: 'pharm-2',
    description: 'pH 5.5 clinically proven soothing barrier cream against infant diaper rash.',
    dosageForm: 'Cream',
    packSize: '100ml',
    manufacturer: 'Sebapharma GmbH',
  },
  {
    id: 'med-14',
    name: 'Calcimax 500 / Shelcal 500 Tablet',
    brandName: 'Shelcal 500',
    saltComposition: 'Elemental Calcium (500mg) + Vitamin D3 (250 IU)',
    category: 'personal_care',
    price: 125.00,
    mrp: 142.00,
    requiresPrescription: false,
    stockQty: 85,
    pharmacyId: 'pharm-1',
    description: 'Calcium & Vitamin D supplement for bone density, pregnancy support, and joint strength.',
    dosageForm: 'Tablet',
    packSize: '15 Tablets',
    manufacturer: 'Torrent Pharmaceuticals Ltd',
    genericAlternativeName: 'Jan Aushadhi Calcium + Vit D3',
    genericSavingsPrice: 45.00,
  },
  {
    id: 'med-15',
    name: 'Volini Pain Relief Gel',
    brandName: 'Volini Gel',
    saltComposition: 'Diclofenac Diethylamine (1.16%) + Methyl Salicylate + Menthol',
    category: 'personal_care',
    price: 150.00,
    mrp: 165.00,
    requiresPrescription: false,
    stockQty: 60,
    pharmacyId: 'pharm-1',
    description: 'Deep penetrating formula for rapid relief from backache, neck shoulder pain, and sports sprains.',
    dosageForm: 'Gel',
    packSize: '75g Tube',
    manufacturer: 'Sun Pharma',
  },

  // 6. Medical Devices
  {
    id: 'med-16',
    name: 'Omron HEM-7120 Digital BP Monitor',
    brandName: 'Omron BP Monitor',
    saltComposition: 'Oscillometric Blood Pressure & Pulse Sensor',
    category: 'devices',
    price: 1890.00,
    mrp: 2350.00,
    requiresPrescription: false,
    stockQty: 15,
    pharmacyId: 'pharm-1',
    description: 'Fully automatic digital arm blood pressure monitor with Intellisense technology & hypertension indicator.',
    dosageForm: 'Device',
    packSize: '1 Unit Kit',
    manufacturer: 'Omron Healthcare',
  },
  {
    id: 'med-17',
    name: 'Accu-Chek Active Blood Glucose Strips',
    brandName: 'Accu-Chek Active',
    saltComposition: 'Glucose Dehydrogenase Biosensor Strips',
    category: 'devices',
    price: 940.00,
    mrp: 1050.00,
    requiresPrescription: false,
    stockQty: 35,
    pharmacyId: 'pharm-2',
    description: 'Accurate home blood sugar test strips for diabetes monitoring.',
    dosageForm: 'Device',
    packSize: '50 Strips Pack',
    manufacturer: 'Roche Diabetes Care',
  },
  {
    id: 'med-18',
    name: 'Dr. Trust Digital Clinical Thermometer',
    brandName: 'Dr. Trust Thermometer',
    saltComposition: 'High Precision Fever Sensor',
    category: 'devices',
    price: 240.00,
    mrp: 350.00,
    requiresPrescription: false,
    stockQty: 50,
    pharmacyId: 'pharm-1',
    description: 'Fast 10-second waterproof digital thermometer with fever alarm.',
    dosageForm: 'Device',
    packSize: '1 Unit',
    manufacturer: 'Nureca Inc',
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-sih-demo-01',
  name: 'Arvind Kumar',
  phone: '+91 98765 43210',
  age: 42,
  addresses: [
    {
      id: 'addr-1',
      label: 'Home',
      street: 'Flat 402, Royal Palms Residency, Vasant Kunj',
      city: 'New Delhi',
      pincode: '110070',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      street: 'Tower B, Cyber Greens, DLF Phase 3',
      city: 'Gurugram',
      pincode: '122002',
      isDefault: false,
    },
  ],
  activeMedications: [
    'Ecosprin 75mg (Aspirin)',
    'Telmisartan 40mg (BP)',
  ],
  savedPrescriptions: [
    {
      id: 'rx-prev-101',
      date: '2026-08-15',
      doctor: 'Dr. S. K. Gupta, MD (Cardiology)',
      medicines: ['Telma 40mg', 'Ecosprin 75mg', 'Rosuvas 10mg'],
    },
  ],
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9842',
    userId: 'usr-sih-demo-01',
    customerName: 'Arvind Kumar',
    customerPhone: '+91 98765 43210',
    customerAge: 42,
    deliveryAddress: 'Flat 402, Royal Palms Residency, Vasant Kunj, New Delhi 110070',
    items: [
      {
        medicine: INITIAL_MEDICINES[0], // Augmentin 625 Duo
        quantity: 1,
      },
      {
        medicine: INITIAL_MEDICINES[7], // Pan-D Capsule
        quantity: 1,
      },
    ],
    totalAmount: 402.50,
    deliveryFee: 30.00,
    status: 'placed',
    deliveryType: 'emergency',
    prescriptionImageUrl: '/prescriptions/sample_prescription_1.jpg',
    aiExtractedData: {
      doctorName: 'Dr. Ramesh K. Verma (MBBS, MD)',
      date: '2026-09-08',
      medicines: [
        { name: 'Augmentin 625 Duo', dosage: '625mg', qty: '10 Tabs', confidence: 94 },
        { name: 'Pan-D Capsule', dosage: '40mg+30mg', qty: '10 Caps', confidence: 88 },
      ],
      confidenceAvg: 91,
    },
    assignedPharmacyId: 'pharm-1',
    assignedPharmacyName: 'Apollo 24|7 Partner Pharmacy',
    assignedDeliveryPartnerId: 'del-01',
    assignedDeliveryPartnerName: 'Vikram Singh (Rider #104)',
    assignedDeliveryPartnerPhone: '+91 98119 55667',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    estimatedDeliveryMinutes: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    statusHistory: [
      {
        status: 'placed',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        note: 'Emergency order placed with uploaded prescription.',
      },
    ],
  },
];

export const INITIAL_REFILL_REMINDERS: RefillReminder[] = [
  {
    id: 'refill-1',
    userId: 'usr-sih-demo-01',
    medicineId: 'med-5',
    medicineName: 'Telma 40 Tablet (Blood Pressure)',
    frequencyDays: 30,
    lastOrderedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    nextReminderDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toLocaleDateString('en-IN'),
    active: true,
  },
  {
    id: 'refill-2',
    userId: 'usr-sih-demo-01',
    medicineId: 'med-3',
    medicineName: 'Glycomet-GP 2 Forte (Diabetes)',
    frequencyDays: 30,
    lastOrderedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    nextReminderDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toLocaleDateString('en-IN'),
    active: true,
  },
];

// ==========================================
// CLIENT-SIDE REACTIVE STATE ENGINE
// ==========================================

const STORAGE_KEYS = {
  MEDICINES: 'medit_medicines_v1',
  PHARMACIES: 'medit_pharmacies_v1',
  ORDERS: 'medit_orders_v1',
  CART: 'medit_cart_v1',
  USER: 'medit_user_v1',
  REFILLS: 'medit_refills_v1',
};

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeToStore(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const MediTStore = {
  getMedicines(): Medicine[] {
    if (typeof window === 'undefined') return INITIAL_MEDICINES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      return data ? JSON.parse(data) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  },

  setMedicines(medicines: Medicine[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
    notify();
  },

  updateStock(medicineId: string, deltaQty: number) {
    const list = this.getMedicines();
    const updated = list.map((m) => {
      if (m.id === medicineId) {
        return { ...m, stockQty: Math.max(0, m.stockQty + deltaQty) };
      }
      return m;
    });
    this.setMedicines(updated);
  },

  toggleStockAvailable(medicineId: string) {
    const list = this.getMedicines();
    const updated = list.map((m) => {
      if (m.id === medicineId) {
        return { ...m, stockQty: m.stockQty > 0 ? 0 : 50 };
      }
      return m;
    });
    this.setMedicines(updated);
  },

  getPharmacies(): Pharmacy[] {
    if (typeof window === 'undefined') return INITIAL_PHARMACIES;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHARMACIES);
      return data ? JSON.parse(data) : INITIAL_PHARMACIES;
    } catch {
      return INITIAL_PHARMACIES;
    }
  },

  getUser(): UserProfile {
    if (typeof window === 'undefined') return INITIAL_USER;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  },

  getOrders(): Order[] {
    if (typeof window === 'undefined') return INITIAL_ORDERS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  },

  setOrders(orders: Order[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    notify();
  },

  addOrder(order: Order) {
    const orders = this.getOrders();
    const updated = [order, ...orders];
    this.setOrders(updated);
  },

  updateOrderStatus(orderId: string, newStatus: Order['status'], note: string, notesPharmacist?: string) {
    const orders = this.getOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          pharmacistNotes: notesPharmacist || o.pharmacistNotes,
          statusHistory: [
            ...o.statusHistory,
            {
              status: newStatus,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note,
            },
          ],
        };
      }
      return o;
    });
    this.setOrders(updated);
  },

  reassignPharmacy(orderId: string, targetPharmacyId: string) {
    const pharmacies = this.getPharmacies();
    const target = pharmacies.find((p) => p.id === targetPharmacyId);
    if (!target) return;

    const orders = this.getOrders();
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          assignedPharmacyId: target.id,
          assignedPharmacyName: target.name,
          statusHistory: [
            ...o.statusHistory,
            {
              status: o.status,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              note: `Stock routing: Reassigned order to ${target.name} due to local stock fulfillment.`,
            },
          ],
        };
      }
      return o;
    });
    this.setOrders(updated);
  },

  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setCart(cart: CartItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    notify();
  },

  addToCart(medicine: Medicine, qty: number = 1) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex((i) => i.medicine.id === medicine.id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({ medicine, quantity: qty });
    }
    this.setCart(cart);
  },

  removeFromCart(medicineId: string) {
    const cart = this.getCart();
    const updated = cart.filter((i) => i.medicine.id !== medicineId);
    this.setCart(updated);
  },

  updateCartQty(medicineId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(medicineId);
      return;
    }
    const cart = this.getCart();
    const item = cart.find((i) => i.medicine.id === medicineId);
    if (item) {
      item.quantity = quantity;
      this.setCart(cart);
    }
  },

  clearCart() {
    this.setCart([]);
  },

  getRefills(): RefillReminder[] {
    if (typeof window === 'undefined') return INITIAL_REFILL_REMINDERS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REFILLS);
      return data ? JSON.parse(data) : INITIAL_REFILL_REMINDERS;
    } catch {
      return INITIAL_REFILL_REMINDERS;
    }
  },

  toggleRefillActive(id: string) {
    const refills = this.getRefills();
    const updated = refills.map((r) => (r.id === id ? { ...r, active: !r.active } : r));
    localStorage.setItem(STORAGE_KEYS.REFILLS, JSON.stringify(updated));
    notify();
  },

  resetToDefaults() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(INITIAL_MEDICINES));
    localStorage.setItem(STORAGE_KEYS.PHARMACIES, JSON.stringify(INITIAL_PHARMACIES));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(INITIAL_USER));
    localStorage.setItem(STORAGE_KEYS.REFILLS, JSON.stringify(INITIAL_REFILL_REMINDERS));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    notify();
  },
};
