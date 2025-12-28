<template>
  <q-page class="bg-grey-3">
    <q-card flat class="q-pa-md round-borders">
      <!-- Header with period toggle -->
      <div class="row">
        <div class="nav col-2 flex justify-start items-center">
          <router-link to="/earnings" class="text-black">
            <q-icon name="arrow_back" size="24px" />
          </router-link>
        </div>

        <div class="col-8 flex justify-center items-center">
          <q-btn-toggle
            v-model="selectedPeriod"
            toggle-color="white"
            toggle-text-color="black"
            color="grey-3"
            text-color="grey"
            no-caps
            unelevated
            class="bg-grey-3 rounded-borders"
            style="padding: 2px"
            :options="periodOptions"
            @update:model-value="onPeriodChange"
          />
        </div>
        <div class="col-2" />
      </div>

      <!-- Total display -->
      <div class="q-pa-md q-mt-lg text-center">
        <div class="text-h4">{{ formatCurrency(currentTotal) }}</div>
        <div style="margin-top: -4px; font-size: 16px">{{ currentOrderCount }} заказов</div>
      </div>

      <!-- Chart -->
      <div style="height: 100px">
        <bar-chart :data="chartData" :options="chartOptions" />
      </div>
      <div class="row justify-around text-center">
        <div v-for="(day, index) in chartLabels" :key="index" class="col">
          <div
            :class="{
              'text-black': index === selectedBarIndex,
              'text-grey-7': index !== selectedBarIndex,
            }"
          >
            {{ day.value }}
          </div>
          <div
            :class="{
              'text-black': index === selectedBarIndex,
              'text-grey-7': index !== selectedBarIndex,
            }"
            style="margin-top: -4px"
          >
            {{ day.label }}
          </div>
        </div>
      </div>
    </q-card>

    <!-- Payment breakdown chips -->
    <q-card flat class="round-borders q-pa-md q-mt-sm">
      <div>
        <q-chip
          v-for="(chip, index) in paymentChips"
          :key="index"
          dense
          color="grey-3"
          class="text-caption"
          style="padding: 12px"
          :label="chip.label"
        />
      </div>
    </q-card>

    <!-- Orders list -->
    <q-card flat class="q-pa-md q-mt-sm round-borders">
      <div class="text-h6 q-mb-md">{{ formattedDateRange }}</div>
      <q-separator />

      <q-list separator>
        <q-item
          v-for="(order, index) in currentOrders"
          :key="index"
          clickable
          v-ripple
          class="q-px-none"
          @click="editOrder(index)"
        >
          <q-item-section avatar class="q-pr-md" style="min-width: 0px">
            <q-img
              src="/media/ic_car_16.webp"
              height="20px"
              width="20px"
              style="filter: brightness(0%)"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ order.time }}</q-item-label>
            <q-item-label caption style="max-width: 70%">{{ order.address }}</q-item-label>
          </q-item-section>
          <q-item-section
            side
            :class="{ 'text-red': order.amount < 0, 'text-grey-7': order.amount > 0 }"
          >
            {{ formatCurrency(order.amount) }}
          </q-item-section>
        </q-item>
      </q-list>

      <q-btn
        flat
        color="primary"
        label="Добавить заказ"
        class="full-width q-mt-md"
        @click="addOrder"
      />
    </q-card>

    <!-- Edit Order Dialog -->
    <q-dialog v-model="showOrderDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">
            {{ editingOrderIndex === -1 ? 'Добавить заказ' : 'Редактировать заказ' }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="editingOrder.time" label="Время" dense />
          <q-input v-model="editingOrder.address" label="Адрес" dense class="q-mt-sm" />
          <q-input
            v-model.number="editingOrder.amount"
            label="Сумма"
            type="number"
            dense
            class="q-mt-sm"
          />
          <q-select
            v-model="editingOrder.paymentType"
            :options="paymentTypeOptions"
            label="Способ оплаты"
            dense
            class="q-mt-sm"
            emit-value
            map-options
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-if="editingOrderIndex !== -1"
            flat
            label="Удалить"
            color="negative"
            @click="deleteOrder"
          />
          <q-btn flat label="Отмена" color="grey-7" v-close-popup />
          <q-btn flat label="Сохранить" color="primary" @click="saveOrder" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import BarChart from '../components/BarChart.vue';
import { useEarningsChart } from '../composables/useEarningsChart';
import { driverDataService } from '../services/driverDataService';
import type { Order } from '../services/driverDataService';
import { formatCurrency } from 'src/utlis/formatCurrency';

// Chart composable
const {
  selectedPeriod,
  selectedBarIndex,
  selectedDate,
  chartData,
  chartOptions,
  chartLabels,
  currentTotal,
  currentOrders,
  currentOrderCount,
  initialize,
  onPeriodChange,
  getFormattedDateRange,
  updateChartData,
} = useEarningsChart();

// Period toggle options
const periodOptions = [
  {
    label: 'День',
    value: 'day',
    class: 'text-caption',
    attrs: { style: 'border-radius: 6px !important' },
  },
  {
    label: 'Неделя',
    value: 'week',
    class: 'text-caption',
    attrs: { style: 'border-radius: 6px !important' },
  },
  {
    label: 'Месяц',
    value: 'month',
    class: 'text-caption',
    attrs: { style: 'border-radius: 6px !important' },
  },
];

// Payment type options
const paymentTypeOptions = [
  { label: 'Картой', value: 'card' },
  { label: 'Наличными', value: 'cash' },
  { label: 'Бонусы', value: 'bonus' },
];

// Order editing state
const showOrderDialog = ref(false);
const editingOrderIndex = ref(-1);
const editingOrder = ref<Order>({
  time: '',
  address: '',
  amount: 0,
  paymentType: 'card',
});

// Computed
const formattedDateRange = computed(() => getFormattedDateRange());

const paymentChips = computed(() => {
  const orders = currentOrders.value;
  const positiveOrders = orders.filter((o) => o.amount > 0);

  // Calculate totals by payment type
  const cardTotal = positiveOrders
    .filter((o) => o.paymentType === 'card')
    .reduce((sum, o) => sum + o.amount, 0);

  const cashTotal = positiveOrders
    .filter((o) => o.paymentType === 'cash')
    .reduce((sum, o) => sum + o.amount, 0);

  const bonusTotal = positiveOrders
    .filter((o) => o.paymentType === 'bonus')
    .reduce((sum, o) => sum + o.amount, 0);

  const grossTotal = cardTotal + cashTotal + bonusTotal;

  // Calculate taxes
  const serviceFee = grossTotal * 0.07;
  const partnerFee = grossTotal * 0.02;
  const incomeTax = grossTotal * 0.05;

  return [
    { label: `Картой ${formatCurrency(cardTotal)}`, amount: cardTotal },
    { label: `Наличными ${formatCurrency(cashTotal)}`, amount: cashTotal },
    { label: `Бонусы ${formatCurrency(bonusTotal)}`, amount: bonusTotal },
    { label: `Комиссии сервиса -${formatCurrency(serviceFee)}`, amount: -serviceFee },
    { label: `Комиссии партнёра -${formatCurrency(partnerFee)}`, amount: -partnerFee },
    {
      label: `Подоходный налог и страх.взносы: -${formatCurrency(incomeTax)}`,
      amount: -incomeTax,
    },
  ];
});

// Methods
function editOrder(index: number) {
  editingOrderIndex.value = index;
  const order = currentOrders.value[index];
  editingOrder.value = order
    ? { ...order }
    : { time: '', address: '', amount: 0, paymentType: 'card' };
  showOrderDialog.value = true;
}

function addOrder() {
  editingOrderIndex.value = -1;
  editingOrder.value = { time: '', address: '', amount: 0, paymentType: 'card' };
  showOrderDialog.value = true;
}

function saveOrder() {
  const data = driverDataService.getDataForDate(selectedDate.value);

  if (editingOrderIndex.value === -1) {
    data.orders.push({ ...editingOrder.value });
  } else {
    data.orders[editingOrderIndex.value] = { ...editingOrder.value };
  }

  driverDataService.saveDataForDate(selectedDate.value, data);
  updateChartData();
  showOrderDialog.value = false;
}

function deleteOrder() {
  if (editingOrderIndex.value !== -1) {
    const data = driverDataService.getDataForDate(selectedDate.value);
    data.orders.splice(editingOrderIndex.value, 1);
    driverDataService.saveDataForDate(selectedDate.value, data);
    updateChartData();
  }
  showOrderDialog.value = false;
}

onMounted(() => {
  initialize();
});
</script>

<style lang="scss" scoped>
.rounded-borders {
  border-radius: 8px !important;
}
.round-borders {
  border-radius: 20px !important;
}
</style>
