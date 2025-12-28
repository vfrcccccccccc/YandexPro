<!-- src/pages/OrdersPage.vue -->

<template>
  <q-page class="orders-page">
    <div class="map-container">
      <iframe
        class="map-iframe"
        :src="pageData.mapUrl"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen="true"
        @click="editField('mapUrl')"
      ></iframe>
    </div>

    <div
      ref="bottomSheet"
      class="bottom-sheet shadow-up-8 q-pa-md"
      :style="sheetStyle"
      :class="{ 'is-dragging': isDragging }"
    >
      <!-- Pointer-based drag handle -->
      <div
        ref="dragHandle"
        class="drag-handle"
        role="button"
        aria-label="Drag sheet"
        @pointerdown.prevent="onPointerDown"
      />

      <div class="row items-center justify-between no-wrap q-mb-md">
        <div class="col-6 row items-center no-wrap" style="border-right: 1px solid #e0e0e0">
          <q-img
            src="/media/ic_launcher_foreground_mongochrome.png"
            height="40px"
            width="40px"
            style="filter: brightness(0%)"
          />
          <div @click="editStatsItem('priority')" style="cursor: pointer">
            <div class="text-caption">{{ pageData.stats.priority.label }}</div>
            <div class="text-weight-medium" style="font-size: 18px; margin-top: -4px">
              {{ pageData.stats.priority.value }}
            </div>
          </div>
        </div>
        <div class="col-6 row items-center no-wrap q-ml-md">
          <q-icon name="account_balance_wallet" size="28px" class="q-mr-sm" />
          <div @click="editStatsItem('orders')" style="cursor: pointer">
            <div class="text-caption">{{ pageData.stats.orders.label }}</div>
            <div class="text-weight-medium" style="font-size: 18px; margin-top: -4px">
              {{ pageData.stats.orders.value }}
            </div>
          </div>
        </div>
      </div>

      <q-card flat class="q-px-md round-borders bg-grey-3">
        <q-list>
          <q-item
            clickable
            v-ripple
            class="goal-item text-secondary"
            @click="editGoalItem('selectGoal')"
          >
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#4063de"
              >
                <path
                  d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Z"
                />
              </svg>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ pageData.goals.selectGoal.label }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label
                class="text-weight-medium text-secondary"
                style="font-size: 18px; margin-top: -4px"
              >
                {{ pageData.goals.selectGoal.value }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="goal-item" @click="editGoalItem('dailyGoal')">
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#d38300"
              >
                <path
                  d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Z"
                />
              </svg>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ pageData.goals.dailyGoal.caption }}</q-item-label>
              <q-item-label>{{ pageData.goals.dailyGoal.progress }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label
                class="text-weight-medium text-black"
                style="font-size: 18px; margin-top: -4px"
              >
                {{ pageData.goals.dailyGoal.reward }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple class="goal-item" @click="editGoalItem('weeklyGoal')">
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#d38300"
              >
                <path
                  d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240ZM330-120 120-330v-300l210-210h300l210 210v300L630-120H330Z"
                />
              </svg>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ pageData.goals.weeklyGoal.caption }}</q-item-label>
              <q-item-label>{{ pageData.goals.weeklyGoal.progress }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label
                class="text-weight-medium text-black"
                style="font-size: 18px; margin-top: -4px"
              >
                {{ pageData.goals.weeklyGoal.reward }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="q-mt-md">
          <q-btn
            outline
            rounded
            :label="pageData.moreGoalsButtonText"
            @click="editField('moreGoalsButtonText')"
            class="full-width text-caption"
            style="text-transform: none"
            padding="8px"
          />
        </div>

        <q-list class="q-mt-md">
          <q-item clickable v-ripple class="goal-item" @click="editBonusSchedule">
            <q-item-section avatar class="q-pr-md" style="min-width: 0px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#4063de"
              >
                <path
                  d="m363-310 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM480-28 346-160H160v-186L28-480l132-134v-186h186l134-132 134 132h186v186l132 134-132 134v186H614L480-28Z"
                />
              </svg>
            </q-item-section>
            <q-item-section>
              <q-item-label caption>{{ pageData.bonusSchedule.caption }}</q-item-label>
              <q-item-label>{{ pageData.bonusSchedule.time }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label
                class="text-weight-medium text-black"
                style="font-size: 18px; margin-top: -4px"
              >
                {{ pageData.bonusSchedule.bonus }}
              </q-item-label>
              <q-item-label caption>{{ pageData.bonusSchedule.perOrder }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

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
          <div v-else-if="editingFieldType === 'stats'">
            <q-input v-model="editStatsLabel" label="Название" dense class="q-mb-sm" />
            <q-input v-model="editStatsValue" label="Значение" dense />
          </div>
          <div v-else-if="editingFieldType === 'goal'">
            <q-input v-model="editGoalLabel" label="Название" dense class="q-mb-sm" />
            <q-input v-model="editGoalValue" label="Значение" dense class="q-mb-sm" />
            <q-input v-model="editGoalCaption" label="Подзаголовок" dense class="q-mb-sm" />
            <q-input v-model="editGoalProgress" label="Прогресс" dense class="q-mb-sm" />
            <q-input v-model="editGoalReward" label="Награда" dense />
          </div>
          <div v-else-if="editingFieldType === 'bonus'">
            <q-input v-model="editBonusCaption" label="Название" dense class="q-mb-sm" />
            <q-input v-model="editBonusTime" label="Время" dense class="q-mb-sm" />
            <q-input v-model="editBonusBonus" label="Бонус" dense class="q-mb-sm" />
            <q-input v-model="editBonusPerOrder" label="За заказ" dense />
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
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';

const STORAGE_KEY = 'ordersPageData';

const defaultData = {
  mapUrl:
    'https://yandex.com/map-widget/v1/?ll=74.614545%2C42.871460&mode=poi&poi%5Bpoint%5D=74.594545%2C42.881519&poi%5Buri%5D=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgk3NzEyOTAxMjUSItCa0YvRgNCz0YvQt9GB0YLQsNC9LCDQkdC40YjQutC10LoiCg0YNZVCFf6AK0I%2C&z=12',
  stats: {
    priority: { label: 'Приоритет', value: '+42' },
    orders: { label: 'О заказов', value: '0 KGS' },
  },
  goals: {
    selectGoal: {
      label: 'Выбрать цель',
      value: 'до 2 500,0 KGS',
    },
    dailyGoal: {
      caption: 'Цель на день',
      progress: '0/5 · Ещё 5 часов',
      reward: '+ 150,0 KGS',
    },
    weeklyGoal: {
      caption: 'Цель на неделю',
      progress: '0/15 · Ещё 4 дня',
      reward: '+ 700,0 KGS',
    },
  },
  moreGoalsButtonText: 'Еще цели',
  bonusSchedule: {
    caption: 'Расписание бонусов',
    time: '16:30 — 18:49',
    bonus: '+7 — 10%',
    perOrder: 'за заказ',
  },
};

const pageData = ref({ ...JSON.parse(JSON.stringify(defaultData)) });
const showEditDialog = ref(false);
const editDialogTitle = ref('');
const editingField = ref<string | null>(null);
const editingFieldType = ref<'simple' | 'stats' | 'goal' | 'bonus'>('simple');

// Simple field editing
const editValue = ref('');

// Stats editing
const editStatsLabel = ref('');
const editStatsValue = ref('');

// Goal editing
const editGoalLabel = ref('');
const editGoalValue = ref('');
const editGoalCaption = ref('');
const editGoalProgress = ref('');
const editGoalReward = ref('');

// Bonus editing
const editBonusCaption = ref('');
const editBonusTime = ref('');
const editBonusBonus = ref('');
const editBonusPerOrder = ref('');

const loadData = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      pageData.value = JSON.parse(stored);
    } catch (e) {
      console.error('Error loading orders page data:', e);
    }
  }
};

const saveData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pageData.value));
};

const editField = (field: string) => {
  editingField.value = field;
  editingFieldType.value = 'simple';
  editValue.value = pageData.value[field];

  const titles: Record<string, string> = {
    mapUrl: 'URL карты',
    moreGoalsButtonText: 'Текст кнопки',
  };

  editDialogTitle.value = titles[field] || 'Редактировать';
  showEditDialog.value = true;
};

const editStatsItem = (key: string) => {
  editingField.value = key;
  editingFieldType.value = 'stats';
  const item = pageData.value.stats[key];
  editStatsLabel.value = item.label;
  editStatsValue.value = item.value;
  editDialogTitle.value = `Редактировать: ${item.label}`;
  showEditDialog.value = true;
};

const editGoalItem = (key: string) => {
  editingField.value = key;
  editingFieldType.value = 'goal';
  const goal = pageData.value.goals[key];

  editGoalLabel.value = goal.label || '';
  editGoalValue.value = goal.value || '';
  editGoalCaption.value = goal.caption || '';
  editGoalProgress.value = goal.progress || '';
  editGoalReward.value = goal.reward || '';

  editDialogTitle.value = `Редактировать: ${goal.caption || goal.label}`;
  showEditDialog.value = true;
};

const editBonusSchedule = () => {
  editingField.value = 'bonusSchedule';
  editingFieldType.value = 'bonus';

  editBonusCaption.value = pageData.value.bonusSchedule.caption;
  editBonusTime.value = pageData.value.bonusSchedule.time;
  editBonusBonus.value = pageData.value.bonusSchedule.bonus;
  editBonusPerOrder.value = pageData.value.bonusSchedule.perOrder;

  editDialogTitle.value = 'Редактировать расписание бонусов';
  showEditDialog.value = true;
};

const saveEdit = () => {
  if (!editingField.value) return;

  if (editingFieldType.value === 'simple') {
    pageData.value[editingField.value] = editValue.value;
  } else if (editingFieldType.value === 'stats') {
    const item = pageData.value.stats[editingField.value];
    item.label = editStatsLabel.value;
    item.value = editStatsValue.value;
  } else if (editingFieldType.value === 'goal') {
    const goal = pageData.value.goals[editingField.value];
    if (editGoalLabel.value) goal.label = editGoalLabel.value;
    if (editGoalValue.value) goal.value = editGoalValue.value;
    if (editGoalCaption.value) goal.caption = editGoalCaption.value;
    if (editGoalProgress.value) goal.progress = editGoalProgress.value;
    if (editGoalReward.value) goal.reward = editGoalReward.value;
  } else if (editingFieldType.value === 'bonus') {
    pageData.value.bonusSchedule.caption = editBonusCaption.value;
    pageData.value.bonusSchedule.time = editBonusTime.value;
    pageData.value.bonusSchedule.bonus = editBonusBonus.value;
    pageData.value.bonusSchedule.perOrder = editBonusPerOrder.value;
  }

  saveData();
};

// Bottom sheet drag functionality
const bottomSheet = ref<HTMLElement | null>(null);
const dragHandle = ref<HTMLElement | null>(null);

const sheetOffset = ref(0);
const isDragging = ref(false);

let sheetHeight = 0;
const peekHeight = 100;
let maxOffset = 0;

let pointerId: number | null = null;
let startPointerY = 0;
let startOffset = 0;

let lastY = 0;
let lastT = 0;
let lastVel = 0;

const sheetStyle = computed(() => ({
  transform: `translateY(${sheetOffset.value}px)`,
  willChange: 'transform',
}));

function updateSheetMeasurements() {
  sheetHeight = bottomSheet.value?.clientHeight || 0;
  maxOffset = Math.max(0, sheetHeight - peekHeight);
  if (sheetOffset.value > maxOffset) sheetOffset.value = maxOffset;
}

onMounted(() => {
  loadData();
  void nextTick(updateSheetMeasurements);
  window.addEventListener('resize', updateSheetMeasurements);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSheetMeasurements);
  removeMoveUpListeners();
});

function onPointerDown(e: PointerEvent) {
  if (e.button && e.button !== 0) return;

  try {
    (e.target as Element).setPointerCapture?.(e.pointerId);
  } catch {
    // ignore
  }

  pointerId = e.pointerId;
  startPointerY = e.clientY;
  startOffset = sheetOffset.value;
  isDragging.value = true;

  lastY = e.clientY;
  lastT = performance.now();
  lastVel = 0;

  window.addEventListener('pointermove', onPointerMove as EventListener);
  window.addEventListener('pointerup', onPointerUp as EventListener);
  window.addEventListener('pointercancel', onPointerUp as EventListener);
}

function onPointerMove(e: PointerEvent) {
  if (!isDragging.value || e.pointerId !== pointerId) return;

  const dy = e.clientY - startPointerY;
  const raw = startOffset + dy;

  sheetOffset.value = Math.min(Math.max(0, raw), maxOffset);

  const now = performance.now();
  const dt = now - lastT;
  if (dt > 0) {
    const vy = (e.clientY - lastY) / dt;
    lastVel = vy;
    lastY = e.clientY;
    lastT = now;
  }
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerId !== pointerId) return;

  try {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  } catch {
    // ignore
  }

  const velocityThreshold = 0.5 / 1000;
  const flickDown = lastVel > velocityThreshold;
  const flickUp = lastVel < -velocityThreshold;

  const threshold = maxOffset * 0.5;
  let target = 0;

  if (flickDown) {
    target = maxOffset;
  } else if (flickUp) {
    target = 0;
  } else {
    target = sheetOffset.value > threshold ? maxOffset : 0;
  }

  sheetOffset.value = target;

  isDragging.value = false;
  pointerId = null;
  removeMoveUpListeners();
}

function removeMoveUpListeners() {
  window.removeEventListener('pointermove', onPointerMove as EventListener);
  window.removeEventListener('pointerup', onPointerUp as EventListener);
  window.removeEventListener('pointercancel', onPointerUp as EventListener);
}
</script>

<style scoped>
.round-borders {
  border-radius: 12px;
}

.orders-page {
  position: relative;
  overflow: hidden;
}

.map-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-iframe {
  border: none;
}

.bottom-sheet {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: white;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  max-height: 85vh;
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom, 24px);
  transition: transform 0.28s cubic-bezier(0.22, 0.9, 0.27, 1);
  will-change: transform;
}

.bottom-sheet.is-dragging {
  transition: none;
}

.drag-handle {
  width: 48px;
  height: 5px;
  background: #e0e0e0;
  border-radius: 100px;
  margin: 0 auto 16px;
  cursor: grab;
  touch-action: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.goal-item {
  padding-left: 0;
  padding-right: 0;
}
</style>
