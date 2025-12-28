// ==========================================
// src/services/driverDataService.ts
// ==========================================
// Centralized data management service

export type PaymentType = 'card' | 'cash' | 'bonus';

export interface Order {
  time: string;
  address: string;
  amount: number;
  paymentType: PaymentType;
}

export interface DayData {
  date: string;
  orders: Order[];
}

const STORAGE_KEY = 'driverData';

class DriverDataService {
  private static instance: DriverDataService;

  private constructor() {}

  static getInstance(): DriverDataService {
    if (!DriverDataService.instance) {
      DriverDataService.instance = new DriverDataService();
    }
    return DriverDataService.instance;
  }

  // Initialize data if needed
  initializeData(monthsBack = 4): void {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const allData: Record<string, DayData> = {};
    const endDate = this.getToday();
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - monthsBack);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = this.formatDate(currentDate);
      allData[dateStr] = {
        date: dateStr,
        orders: this.generateRandomOrders(1, 6),
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }

  // Get data for a specific date
  getDataForDate(date: string): DayData {
    try {
      const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return allData[date] || { date, orders: [] };
    } catch {
      return { date, orders: [] };
    }
  }

  // Save data for a specific date
  saveDataForDate(date: string, data: DayData): void {
    const allData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    allData[date] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
  }

  // Generate random orders for initialization
  private generateRandomOrders(min: number, max: number): Order[] {
    const count = this.randomInt(min, max);
    const orders: Order[] = [];
    const paymentTypes: PaymentType[] = ['card', 'cash', 'bonus'];
    const streets = [
      'Чуй',
      'Манаса',
      'Фрунзе',
      'Киевская',
      'Боконбаева',
      'Абдрахманова',
      'Токтогула',
      'Горького',
      'Исанова',
      'Жибек Жолу',
      'Московская',
      'Исы Ахунбаева',
    ];

    for (let i = 0; i < count; i++) {
      const hour = this.randomInt(7, 22);
      const minute = this.randomInt(0, 59);
      const street = streets[this.randomInt(0, streets.length - 1)];
      const house = this.randomInt(1, 300);

      orders.push({
        time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        address: `Заказ улица ${street}, ${house}`,
        amount: parseFloat(this.randomFloat(100, 350).toFixed(1)),
        paymentType: paymentTypes[this.randomInt(0, paymentTypes.length - 1)]!,
      });
    }

    return orders;
  }

  // Utility: Format date as YYYY-MM-DD
  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Utility: Parse YYYY-MM-DD to Date
  parseDate(dateStr: string): Date {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return new Date(NaN);
    return new Date(y, m - 1, d);
  }

  // Utility: Get today's date at midnight
  private getToday(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // Random number utilities
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}

export const driverDataService = DriverDataService.getInstance();
