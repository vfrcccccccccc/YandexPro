<!-- src/pages/EarningsPage.vue -->

<template>
  <q-page class="bg-grey-3 column" style="display: grid; grid-template-rows: auto 1fr">
    <!-- Header card with chart -->
    <q-card flat class="q-pa-md round-borders">
      <div>
        <q-item style="padding: 0">
          <q-item-section
            class="text-h5 text-bold"
            @click="editField('pageTitle')"
            style="cursor: pointer"
          >
            {{ pageData.pageTitle }}
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              rounded
              class="text-white"
              style="background: #01965e; text-transform: none"
              @click="editField('supportButtonText')"
            >
              <span class="text-caption">{{ pageData.supportButtonText }}</span>
            </q-btn>
          </q-item-section>
        </q-item>

        <!-- Total display -->
        <div class="q-pa-md q-mt-sm text-center">
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

        <!-- Today section link -->
        <q-card-section class="bg-grey-3 q-mt-sm q-pa-none round-borders">
          <q-item clickable to="/money" class="q-pr-sm q-pl-md">
            <q-item-section>Сегодня</q-item-section>
            <q-item-section side class="text-black">
              <span class="text-h6">
                {{ formatCurrency(currentTotal) }}
                <q-icon size="sm" name="chevron_right" style="margin-top: -2px" />
              </span>
            </q-item-section>
          </q-item>
        </q-card-section>
      </div>
    </q-card>

    <!-- Balance and park info card -->
    <q-card flat class="q-pa-md q-mt-sm full-height round-borders">
      <div>
        <!-- Balance limit section -->
        <q-card-section class="bg-grey-3 q-pa-none round-borders">
          <q-item clickable class="q-px-sm" @click="editBalanceLimitSection">
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <q-icon name="lock" size="24px" />
            </q-item-section>

            <q-item-section>
              <div>{{ pageData.balanceLimit.title }}</div>
              <div class="text-caption" style="margin-top: -4px">
                {{ pageData.balanceLimit.status }}
              </div>
            </q-item-section>
            <q-item-section side class="text-black text-bold q-mr-sm">
              {{ formatCurrency(pageData.balanceLimit.amount) }}
            </q-item-section>
          </q-item>
        </q-card-section>

        <!-- Balance and park sections -->
        <q-card-section class="bg-grey-3 q-pa-none q-mt-md round-borders">
          <q-item clickable class="q-px-md" @click="editBalanceSection">
            <q-item-section>{{ pageData.balance.label }}</q-item-section>
            <q-item-section side class="text-black">
              <span class="text-h6">{{ formatCurrency(pageData.balance.amount) }}</span>
            </q-item-section>
          </q-item>

          <q-item clickable class="q-px-md q-mt-lg" @click="editParkSection">
            <q-item-section>
              <div>{{ pageData.park.label }}</div>
              <div class="text-caption" style="margin-top: -4px">{{ pageData.park.name }}</div>
            </q-item-section>
          </q-item>
        </q-card-section>
      </div>
    </q-card>

    <!-- Edit Dialog -->
    <q-dialog v-model="showEditDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ editDialogTitle }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-if="editingFieldType === 'simple'"
            v-model="editValue"
            dense
            autofocus
            @keyup.enter="saveEdit"
          />
          <div v-else-if="editingFieldType === 'balanceLimit'">
            <q-input v-model="editBalanceLimitTitle" label="Название" dense class="q-mb-sm" />
            <q-input v-model="editBalanceLimitStatus" label="Статус" dense class="q-mb-sm" />
            <q-input v-model="editBalanceLimitAmount" label="Сумма" dense />
          </div>
          <div v-else-if="editingFieldType === 'balance'">
            <q-input v-model="editBalanceLabel" label="Название" dense class="q-mb-sm" />
            <q-input v-model="editBalanceAmount" label="Сумма" dense />
          </div>
          <div v-else-if="editingFieldType === 'park'">
            <q-input v-model="editParkLabel" label="Название" dense class="q-mb-sm" />
            <q-input v-model="editParkName" label="Имя парка" dense />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Сохранить" @click="saveEdit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BarChart from '../components/BarChart.vue';
import { useEarningsChart } from '../composables/useEarningsChart';
import { formatCurrency } from 'src/utlis/formatCurrency';

// Chart composable
const {
  chartData,
  chartOptions,
  chartLabels,
  selectedBarIndex,
  currentTotal,
  currentOrderCount,
  initialize,
} = useEarningsChart();

// Local storage key for page data
const STORAGE_KEY = 'earningsPageData';

// Default page data
const defaultData = {
  pageTitle: 'Деньги',
  supportButtonText: 'Поддержка',
  balanceLimit: {
    title: 'Лимит баланса',
    status: 'Всё в порядке',
    amount: '0',
  },
  balance: {
    label: 'Баланс',
    amount: '32.8',
  },
  park: {
    label: 'Парк',
    name: 'Алмурут',
  },
};

// Page data state
const pageData = ref({ ...defaultData });

// Edit dialog state
const showEditDialog = ref(false);
const editDialogTitle = ref('');
const editingFieldType = ref<'simple' | 'balanceLimit' | 'balance' | 'park'>('simple');

// Edit form fields
const editValue = ref('');
const editBalanceLimitTitle = ref('');
const editBalanceLimitStatus = ref('');
const editBalanceLimitAmount = ref('');
const editBalanceLabel = ref('');
const editBalanceAmount = ref('');
const editParkLabel = ref('');
const editParkName = ref('');

// Methods
function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      pageData.value = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading earnings page data:', e);
    }
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pageData.value));
}

function editField(field: 'pageTitle' | 'supportButtonText') {
  editingFieldType.value = 'simple';
  editValue.value = pageData.value[field];

  const titles: Record<string, string> = {
    pageTitle: 'Название страницы',
    supportButtonText: 'Текст кнопки поддержки',
  };

  editDialogTitle.value = titles[field] || 'Редактировать';
  showEditDialog.value = true;
}

function editBalanceLimitSection() {
  editingFieldType.value = 'balanceLimit';
  editBalanceLimitTitle.value = pageData.value.balanceLimit.title;
  editBalanceLimitStatus.value = pageData.value.balanceLimit.status;
  editBalanceLimitAmount.value = pageData.value.balanceLimit.amount;
  editDialogTitle.value = 'Редактировать лимит баланса';
  showEditDialog.value = true;
}

function editBalanceSection() {
  editingFieldType.value = 'balance';
  editBalanceLabel.value = pageData.value.balance.label;
  editBalanceAmount.value = pageData.value.balance.amount;
  editDialogTitle.value = 'Редактировать баланс';
  showEditDialog.value = true;
}

function editParkSection() {
  editingFieldType.value = 'park';
  editParkLabel.value = pageData.value.park.label;
  editParkName.value = pageData.value.park.name;
  editDialogTitle.value = 'Редактировать парк';
  showEditDialog.value = true;
}

function saveEdit() {
  if (editingFieldType.value === 'simple') {
    if (editDialogTitle.value === 'Название страницы') {
      pageData.value.pageTitle = editValue.value;
    } else if (editDialogTitle.value === 'Текст кнопки поддержки') {
      pageData.value.supportButtonText = editValue.value;
    }
  } else if (editingFieldType.value === 'balanceLimit') {
    pageData.value.balanceLimit.title = editBalanceLimitTitle.value;
    pageData.value.balanceLimit.status = editBalanceLimitStatus.value;
    pageData.value.balanceLimit.amount = editBalanceLimitAmount.value;
  } else if (editingFieldType.value === 'balance') {
    pageData.value.balance.label = editBalanceLabel.value;
    pageData.value.balance.amount = editBalanceAmount.value;
  } else if (editingFieldType.value === 'park') {
    pageData.value.park.label = editParkLabel.value;
    pageData.value.park.name = editParkName.value;
  }

  saveData();
}

onMounted(() => {
  loadData();
  initialize();
});
</script>

<style scoped>
.round-borders {
  border-radius: 12px;
}
</style>
