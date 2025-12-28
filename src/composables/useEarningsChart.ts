// ==========================================
// src/composables/useEarningsChart.ts
// ==========================================
// Unified chart composable

import { ref, computed, reactive } from 'vue';
import type { ChartData, ChartOptions, TooltipItem, ChartEvent, ActiveElement } from 'chart.js';
import { driverDataService } from '../services/driverDataService';
import {
  DateRange,
  getWeekDates,
  getMonthDates,
  getWeekNumber,
  formatDate,
  parseDate,
} from '../utlis/dateUtils';
import { formatCurrency } from 'src/utlis/formatCurrency';

export type Period = 'day' | 'week' | 'month';

interface ChartLabel {
  label: string;
  value: string;
}

const TAX_RATES = {
  SERVICE_FEE: 0.07,
  PARTNER_FEE: 0.02,
  INCOME_TAX: 0.05,
} as const;

const LOCALE = {
  dayNames: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
  monthNames: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  monthNamesFull: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ],
} as const;

export function useEarningsChart() {
  // State
  const selectedPeriod = ref<Period>('day');
  const selectedBarIndex = ref(6);
  const chartLabels = ref<ChartLabel[]>([]);

  // small reactive version counter — used to force recomputation of computed values that
  // depend on external (non-reactive) data from driverDataService
  const dataVersion = ref(0);

  // Chart data
  const chartData = ref<ChartData<'bar'>>({
    labels: [],
    datasets: [
      {
        backgroundColor: [],
        data: [],
        borderRadius: 5,
        borderSkipped: false,
        barThickness: 'flex',
        barPercentage: 1.2,
      },
    ],
  });

  // Chart options with proper typing
  const chartOptions = reactive<ChartOptions<'bar'>>({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 12, left: 0, right: 0, bottom: 0 },
    },
    onClick: (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        onBarClick(elements[0]?.index ?? 0);
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context: TooltipItem<'bar'>) => {
            const value = context.parsed?.y ?? 0;
            return `${formatCurrency(value)}`;
          },
          title: (contexts: TooltipItem<'bar'>[]) => {
            const index = contexts[0]?.dataIndex ?? 0;
            return getTooltipTitle(index);
          },
        },
      },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'end',
        clamp: true,
        offset: -4,
        formatter: (value: number) => formatCurrency(value, { currency: null }),
        font: { size: 12, weight: '400' },
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false, drawOnChartArea: false, drawTicks: false },
        ticks: { display: false },
      },
      y: { display: false, beginAtZero: true, grid: { display: false } },
    },
  } as unknown as ChartOptions<'bar'>);

  // Computed
  const dateRanges = computed(() => getDateRanges(selectedPeriod.value));

  const selectedDateRange = computed(() => {
    const ranges = dateRanges.value;
    const index = Math.min(selectedBarIndex.value, ranges.length - 1);
    return ranges[index] ?? new DateRange([formatDate(new Date())]);
  });

  const selectedDate = computed(() => selectedDateRange.value.end);

  const currentTotal = computed(() => {
    const data = chartData.value.datasets[0]?.data ?? [];
    const value = data[selectedBarIndex.value];
    return typeof value === 'number' ? value : 0;
  });

  const currentOrders = computed(() => {
    // read `dataVersion` to create a reactive dependency
    void dataVersion.value;

    return selectedDateRange.value.dates.flatMap(
      (date) => driverDataService.getDataForDate(date).orders,
    );
  });

  const currentOrderCount = computed(() => currentOrders.value.filter((o) => o.amount > 0).length);

  // Methods
  function initialize(): void {
    driverDataService.initializeData();
    updateChartData();
  }

  function getDateRanges(period: Period): DateRange[] {
    const today = new Date();
    const ranges: DateRange[] = [];

    if (period === 'day') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        ranges.push(new DateRange([formatDate(date)]));
      }
    } else if (period === 'week') {
      for (let i = 3; i >= 0; i--) {
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() - i * 7);
        ranges.push(getWeekDates(endDate));
      }
    } else {
      for (let i = 3; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        ranges.push(getMonthDates(date.getFullYear(), date.getMonth()));
      }
    }

    return ranges;
  }

  function computeNetTotal(dateRange: DateRange): number {
    let grossTotal = 0;

    dateRange.dates.forEach((date) => {
      const dayData = driverDataService.getDataForDate(date);
      const positiveOrders = dayData.orders.filter((o) => o.amount > 0);
      grossTotal += positiveOrders.reduce((sum, o) => sum + o.amount, 0);
    });

    const totalTaxes =
      grossTotal * (TAX_RATES.SERVICE_FEE + TAX_RATES.PARTNER_FEE + TAX_RATES.INCOME_TAX);

    return grossTotal - totalTaxes;
  }

  function updateChartData(): void {
    const ranges = dateRanges.value;
    const labels: string[] = [];
    const chartLbls: ChartLabel[] = [];
    const data: number[] = [];

    ranges.forEach((range) => {
      const total = computeNetTotal(range);
      const date = parseDate(range.end);
      const label = formatChartLabel(date);

      labels.push(label.value);
      chartLbls.push(label);
      data.push(total);
    });

    // Ensure selected index is valid
    if (selectedBarIndex.value >= ranges.length) {
      selectedBarIndex.value = ranges.length - 1;
    }

    const backgroundColors = data.map((_, index) =>
      index === selectedBarIndex.value ? '#4063de' : '#d1d1d1',
    );

    chartLabels.value = chartLbls;
    chartData.value = {
      labels,
      datasets: [
        {
          backgroundColor: backgroundColors,
          data,
          borderRadius: 5,
          barThickness: 'flex',
          barPercentage: 1.2,
        },
      ],
    };

    // Bump version so computed values depending on external service re-evaluate
    dataVersion.value++;
  }

  function formatChartLabel(date: Date): ChartLabel {
    const period = selectedPeriod.value;

    if (period === 'day') {
      return {
        label: LOCALE.dayNames[date.getDay()]!,
        value: date.getDate().toString(),
      };
    } else if (period === 'week') {
      return {
        label: LOCALE.monthNames[date.getMonth()]!,
        value: `нед ${getWeekNumber(date)}`,
      };
    } else {
      return {
        label: date.getFullYear().toString(),
        value: LOCALE.monthNames[date.getMonth()]!,
      };
    }
  }

  function getTooltipTitle(index: number): string {
    const ranges = dateRanges.value;
    const range =
      ranges[index] ?? ranges[ranges.length - 1] ?? new DateRange([formatDate(new Date())]);
    const startDate = parseDate(range.start);
    const endDate = parseDate(range.end);

    if (selectedPeriod.value === 'day') {
      return `${endDate.getDate()} ${LOCALE.monthNamesFull[endDate.getMonth()]}`;
    } else if (selectedPeriod.value === 'week') {
      return `${startDate.getDate()} ${LOCALE.monthNamesFull[startDate.getMonth()]} - ${endDate.getDate()} ${LOCALE.monthNamesFull[endDate.getMonth()]}`;
    } else {
      return LOCALE.monthNamesFull[endDate.getMonth()]!;
    }
  }

  function onPeriodChange(period: Period): void {
    selectedPeriod.value = period;
    selectedBarIndex.value = period === 'day' ? 6 : period === 'week' ? 3 : 3;
    updateChartData();
  }

  function onBarClick(index: number): void {
    selectedBarIndex.value = index;
    updateChartData();
  }

  function getFormattedDateRange(): string {
    const range = selectedDateRange.value;
    const startDate = parseDate(range.start);
    const endDate = parseDate(range.end);

    if (selectedPeriod.value === 'day') {
      return `${endDate.getDate()} ${LOCALE.monthNamesFull[endDate.getMonth()]}`;
    } else if (selectedPeriod.value === 'week') {
      return `${startDate.getDate()} ${LOCALE.monthNamesFull[startDate.getMonth()]} - ${endDate.getDate()} ${LOCALE.monthNamesFull[endDate.getMonth()]}`;
    } else {
      return `${new Date().getDate()} ${LOCALE.monthNamesFull[endDate.getMonth()]}`;
    }
  }

  return {
    // State
    selectedPeriod,
    selectedBarIndex,
    selectedDate,
    selectedDateRange,
    chartData,
    chartOptions,
    chartLabels,

    // Computed
    currentTotal,
    currentOrders,
    currentOrderCount,

    // Methods
    initialize,
    onPeriodChange,
    onBarClick,
    updateChartData,
    getFormattedDateRange,
  };
}
