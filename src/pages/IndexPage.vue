<!-- src/pages/DriverProfilePage.vue -->

<template>
  <q-page class="bg-grey-3">
    <!-- Header: avatar + name + vehicle -->
    <div class="row items-center q-pa-sm">
      <q-avatar size="64px" @click="editAvatar" style="cursor: pointer">
        <img :src="profileData.avatarUrl" alt="avatar" />
      </q-avatar>

      <div class="q-ml-sm">
        <div class="text-h5 text-bold" @click="editField('driverName')" style="cursor: pointer">
          {{ profileData.driverName }}<q-icon size="md" name="chevron_right" style="margin: -4px" />
        </div>
        <div
          class="text-caption text-weight-regular"
          @click="editField('vehicleInfo')"
          style="cursor: pointer"
        >
          {{ profileData.vehicleInfo }}
        </div>
      </div>
    </div>

    <q-card flat class="q-pa-md round-borders">
      <!-- Driver card area -->
      <div>
        <div class="row items-center">
          <q-img src="/media/taxi.webp" class="self-end" height="40px" width="40px" />
          <div class="column">
            <div
              class="text-subtitle1 text-h6"
              @click="editField('driverTitle')"
              style="cursor: pointer"
            >
              {{ profileData.driverTitle }}
            </div>
            <div
              class="text-caption text-grey"
              style="margin-top: -6px; cursor: pointer"
              @click="editField('companyName')"
            >
              {{ profileData.companyName }}
            </div>
          </div>
          <q-btn
            flat
            :label="profileData.servicesButtonText"
            @click="editField('servicesButtonText')"
            class="q-ml-auto"
            style="
              text-transform: none;
              border-radius: 9999px;
              font-size: 12px;
              border: 1px solid;
              border-color: silver;
            "
          />
        </div>

        <!-- stats -->
        <div class="row q-mt-sm q-gutter-x-sm">
          <div
            class="column justify-around stat-box bg-grey-3"
            @click="editField('rating')"
            style="cursor: pointer"
          >
            <div class="q-pa-sm">
              <div class="text-bold">{{ profileData.rating }}</div>
              <div class="text-caption">{{ profileData.ratingLabel }}</div>
            </div>
            <q-img
              src="/media/star.png"
              class="self-end"
              height="50%"
              width="50%"
              style="margin-right: -2px; margin-bottom: -4px"
            />
          </div>

          <div
            class="column justify-around stat-box bg-grey-3 overflow-hidden"
            @click="editField('level')"
            style="cursor: pointer"
          >
            <div class="q-pa-sm">
              <div class="text-bold">{{ profileData.level }}</div>
              <div class="text-caption">{{ profileData.levelLabel }}</div>
            </div>
            <q-img
              src="/media/bronze_medal.png"
              class="self-end"
              height="50%"
              width="50%"
              style="margin-right: -10px; margin-bottom: -16px; rotate: -5deg"
            />
          </div>

          <div
            class="column justify-around stat-box bg-grey-3"
            @click="editField('activity')"
            style="cursor: pointer"
          >
            <div class="q-pa-sm">
              <div class="text-bold">{{ profileData.activity }}</div>
              <div class="text-caption">{{ profileData.activityLabel }}</div>
            </div>
            <q-img
              src="/media/image-fotor-bg-remover-20251006174646.png"
              class="self-end"
              height="50%"
              width="50%"
              style="margin-right: -4px; margin-bottom: -4px"
            />
          </div>
        </div>

        <!-- options list -->
        <q-list class="bg-grey-3 q-mt-md q-pt-sm q-pb-sm round-borders">
          <q-item clickable @click="editMenuOption('park')">
            <q-item-section>{{ profileData.menuOptions.park.label }}</q-item-section>
            <q-item-section side class="text-black">
              <span
                >{{ profileData.menuOptions.park.value }}
                <q-icon size="sm" name="chevron_right" style="margin-top: -2px" />
              </span>
            </q-item-section>
          </q-item>
          <q-separator spaced class="q-mx-sm" />

          <q-item clickable @click="editMenuOption('tariffs')">
            <q-item-section>{{ profileData.menuOptions.tariffs.label }}</q-item-section>
            <q-item-section side class="text-black">
              <span
                >{{ profileData.menuOptions.tariffs.value }}
                <q-icon size="sm" name="chevron_right" style="margin-top: -2px" />
              </span>
            </q-item-section>
          </q-item>
          <q-separator spaced class="q-mx-sm" />

          <q-item clickable @click="editMenuOption('payment')">
            <q-item-section>{{ profileData.menuOptions.payment.label }}</q-item-section>
            <q-item-section side class="text-black">
              <span><q-icon size="sm" name="chevron_right" style="margin-top: -2px" /></span>
            </q-item-section>
          </q-item>
          <q-separator spaced class="q-mx-sm" />

          <q-item clickable @click="editMenuOption('tariffOptions')">
            <q-item-section>{{ profileData.menuOptions.tariffOptions.label }}</q-item-section>
            <q-item-section side class="text-black">
              <span><q-icon size="sm" name="chevron_right" style="margin-top: -2px" /></span>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card>

    <!-- Lower quick actions -->
    <div class="q-mt-sm">
      <q-card flat class="q-pa-sm round-borders">
        <q-list>
          <q-item clickable class="q-px-sm" @click="editQuickAction('diagnostics')">
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <div
                class="flex items-center justify-center bg-grey-3"
                style="width: 36px; height: 36px; border-radius: 14px"
              >
                <q-img
                  src="/media/bottom_camera.png"
                  height="20px"
                  width="20px"
                  style="filter: brightness(0%)"
                />
              </div>
            </q-item-section>
            <q-item-section>{{ profileData.quickActions.diagnostics.label }}</q-item-section>
            <q-item-section side>
              <q-badge rounded color="red" style="padding: 1px">
                <div class="items-center justify-center flex" style="width: 15px; height: 15px">
                  {{ profileData.quickActions.diagnostics.badge }}
                </div>
              </q-badge>
            </q-item-section>
            <q-item-section side style="padding-left: 0px">
              <q-icon size="sm" name="chevron_right" class="text-black" />
            </q-item-section>
          </q-item>

          <q-separator spaced class="q-ml-xl q-mr-md q-mt-sm" />

          <q-item clickable class="q-px-sm" @click="editQuickAction('photoControl')">
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <div
                class="flex items-center justify-center bg-grey-3"
                style="width: 36px; height: 36px; border-radius: 14px"
              >
                <q-img
                  src="/media/photo.png"
                  height="20px"
                  width="20px"
                  style="filter: brightness(0%)"
                />
              </div>
            </q-item-section>
            <q-item-section>{{ profileData.quickActions.photoControl.label }}</q-item-section>
            <q-item-section side>
              <q-icon size="sm" name="chevron_right" class="text-black" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <div class="q-mt-sm">
      <q-card flat class="q-pa-sm round-borders">
        <q-list>
          <q-item clickable class="q-px-sm" @click="editQuickAction('yandexFuel')">
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <div
                class="flex items-center justify-center bg-grey-3"
                style="width: 36px; height: 36px; border-radius: 14px"
              >
                <q-icon name="local_gas_station" size="20px" />
              </div>
            </q-item-section>
            <q-item-section>{{ profileData.quickActions.yandexFuel.label }}</q-item-section>
            <q-item-section side>
              <q-icon size="sm" name="chevron_right" class="text-black" />
            </q-item-section>
          </q-item>

          <q-separator spaced class="q-ml-xl q-mr-md q-mt-sm" />

          <q-item clickable class="q-px-sm" @click="editQuickAction('proBenefits')">
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <div
                class="flex items-center justify-center bg-grey-3"
                style="width: 36px; height: 36px; border-radius: 14px"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#000000"
                >
                  <path
                    d="M263.72-96Q234-96 213-117.15T192-168v-456q0-29.7 21.15-50.85Q234.3-696 264-696h72v-16q0-60 40.5-106T480-864q60 0 102 42t42 102v24h72q29.7 0 50.85 21.15Q768-653.7 768-624v456q0 29.7-21.16 50.85Q725.68-96 695.96-96H263.72Zm.28-72h432v-456h-72v60q0 15.3-10.29 25.65Q603.42-528 588.21-528t-25.71-10.35Q552-548.7 552-564v-60H408v60q0 15.3-10.29 25.65Q387.42-528 372.21-528t-25.71-10.35Q336-548.7 336-564v-60h-72v456Zm144-528h144v-24q0-29.7-21.21-50.85-21.21-21.15-51-21.15T429-770.85Q408-749.7 408-720v24ZM264-168v-456 456Z"
                  />
                </svg>
              </div>
            </q-item-section>
            <q-item-section>{{ profileData.quickActions.proBenefits.label }}</q-item-section>
            <q-item-section side>
              <q-icon size="sm" name="chevron_right" class="text-black" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <div class="q-mt-sm">
      <q-card flat class="q-pa-sm round-borders">
        <q-list>
          <q-item clickable class="q-px-sm" @click="editQuickAction('training')">
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <div
                class="flex items-center justify-center bg-grey-3"
                style="width: 36px; height: 36px; border-radius: 14px"
              >
                <q-icon name="waving_hand" size="20px" />
              </div>
            </q-item-section>
            <q-item-section>{{ profileData.quickActions.training.label }}</q-item-section>
            <q-item-section side>
              <q-icon size="sm" name="chevron_right" class="text-black" />
            </q-item-section>
          </q-item>

          <q-separator spaced class="q-ml-xl q-mr-md q-mt-sm" />

          <q-item clickable class="q-px-sm" @click="editQuickAction('settings')">
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <div
                class="flex items-center justify-center bg-grey-3"
                style="width: 36px; height: 36px; border-radius: 14px"
              >
                <q-icon name="settings" size="20px" />
              </div>
            </q-item-section>
            <q-item-section>{{ profileData.quickActions.settings.label }}</q-item-section>
            <q-item-section side>
              <q-icon size="sm" name="chevron_right" class="text-black" />
            </q-item-section>
          </q-item>

          <q-separator spaced class="q-ml-xl q-mr-md q-mt-sm" />

          <q-item clickable class="q-px-sm" @click="editQuickAction('logout')">
            <q-item-section avatar class="q-pr-sm" style="min-width: 0px">
              <div
                class="flex items-center justify-center bg-grey-3"
                style="width: 36px; height: 36px; border-radius: 14px"
              >
                <q-icon name="logout" size="20px" />
              </div>
            </q-item-section>
            <q-item-section>{{ profileData.quickActions.logout.label }}</q-item-section>
            <q-item-section side>
              <q-icon size="sm" name="chevron_right" class="text-black" />
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
          <q-input v-model="editValue" dense autofocus @keyup.enter="saveEdit" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Сохранить" @click="saveEdit" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Avatar Upload Dialog -->
    <q-dialog v-model="showAvatarDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Изменить аватар</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="newAvatarUrl" label="URL изображения" dense @keyup.enter="saveAvatar" />
          <div class="q-mt-sm text-caption text-grey">Или используйте файл:</div>
          <q-file
            v-model="avatarFile"
            label="Выбрать файл"
            accept="image/*"
            @update:model-value="onAvatarFileSelect"
            class="q-mt-xs"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Отмена" v-close-popup />
          <q-btn flat label="Сохранить" @click="saveAvatar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { ref, onMounted, type Ref } from 'vue';

type MenuOptionKey = 'park' | 'tariffs' | 'payment' | 'tariffOptions';
type QuickActionKey =
  | 'diagnostics'
  | 'photoControl'
  | 'yandexFuel'
  | 'proBenefits'
  | 'training'
  | 'settings'
  | 'logout';

interface MenuOption {
  label: string;
  value?: string;
}

interface MenuOptions {
  park: MenuOption;
  tariffs: MenuOption;
  payment: MenuOption;
  tariffOptions: MenuOption;
}

interface QuickAction {
  label: string;
  badge?: string;
}

interface QuickActions {
  diagnostics: QuickAction;
  photoControl: QuickAction;
  yandexFuel: QuickAction;
  proBenefits: QuickAction;
  training: QuickAction;
  settings: QuickAction;
  logout: QuickAction;
}

interface ProfileData {
  avatarUrl: string;
  driverName: string;
  vehicleInfo: string;
  driverTitle: string;
  companyName: string;
  servicesButtonText: string;
  rating: string;
  ratingLabel: string;
  level: string;
  levelLabel: string;
  activity: string;
  activityLabel: string;
  menuOptions: MenuOptions;
  quickActions: QuickActions;
}

type ProfileFieldKey = keyof Omit<ProfileData, 'menuOptions' | 'quickActions'>;

type EditingField =
  | ProfileFieldKey
  | { type: 'menuOption'; key: MenuOptionKey }
  | { type: 'quickAction'; key: QuickActionKey }
  | null;

export default {
  name: 'IndexPage',
  setup() {
    const STORAGE_KEY = 'driverProfileData';

    const defaultData: ProfileData = {
      avatarUrl: '/icons/favicon-32x32.png',
      driverName: 'Самат',
      vehicleInfo: 'Kia K5 · 01KG790AQL',
      driverTitle: 'Водитель',
      companyName: 'Алмурут',
      servicesButtonText: 'Мои сервисы',
      rating: '5.00',
      ratingLabel: 'Рейтинг',
      level: '—',
      levelLabel: 'Уровень',
      activity: '97',
      activityLabel: 'Активность',
      menuOptions: {
        park: { label: 'Парк', value: 'Алмрут' },
        tariffs: { label: 'Тарифы', value: '0 из 4' },
        payment: { label: 'Оплата', value: '' },
        tariffOptions: { label: 'Опции для тарифов', value: '' },
      },
      quickActions: {
        diagnostics: { label: 'Диагностика', badge: '1' },
        photoControl: { label: 'Фотоконтроль' },
        yandexFuel: { label: 'Яндекс Заправки' },
        proBenefits: { label: 'Выгода с Про' },
        training: { label: 'Обучение' },
        settings: { label: 'Настройки' },
        logout: { label: 'Выход' },
      },
    };

    const profileData: Ref<ProfileData> = ref({ ...defaultData });
    const showEditDialog: Ref<boolean> = ref(false);
    const showAvatarDialog: Ref<boolean> = ref(false);
    const editDialogTitle: Ref<string> = ref('');
    const editValue: Ref<string> = ref('');
    const editingField: Ref<EditingField> = ref(null);
    const newAvatarUrl: Ref<string> = ref('');
    const avatarFile: Ref<File | null> = ref(null);

    const loadData = (): void => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          profileData.value = JSON.parse(stored) as ProfileData;
        } catch (e) {
          console.error('Error loading profile data:', e);
        }
      }
    };

    const saveData = (): void => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData.value));
    };

    const editField = (field: keyof Omit<ProfileData, 'menuOptions' | 'quickActions'>): void => {
      editingField.value = field;
      // Only access string fields of ProfileData
      editValue.value = profileData.value[field];

      const titles: Record<string, string> = {
        driverName: 'Имя водителя',
        vehicleInfo: 'Информация о транспорте',
        driverTitle: 'Должность',
        companyName: 'Название компании',
        servicesButtonText: 'Текст кнопки',
        rating: 'Рейтинг',
        level: 'Уровень',
        activity: 'Активность',
      };

      editDialogTitle.value = titles[field as string] || 'Редактировать';
      showEditDialog.value = true;
    };

    const editMenuOption = (option: MenuOptionKey): void => {
      editingField.value = { type: 'menuOption', key: option };
      const current = profileData.value.menuOptions[option];
      editValue.value = current.value || current.label;
      editDialogTitle.value = `Редактировать: ${current.label}`;
      showEditDialog.value = true;
    };

    const saveEdit = (): void => {
      if (typeof editingField.value === 'string') {
        // narrowed to ProfileFieldKey (excludes menuOptions and quickActions)
        const field = editingField.value;
        profileData.value[field] = editValue.value;
      } else if (editingField.value && editingField.value.type === 'menuOption') {
        const option = profileData.value.menuOptions[editingField.value.key];
        if (option.value !== undefined) {
          option.value = editValue.value;
        } else {
          option.label = editValue.value;
        }
      } else if (editingField.value && editingField.value.type === 'quickAction') {
        const action = profileData.value.quickActions[editingField.value.key];
        if (action.badge !== undefined) {
          action.badge = editValue.value;
        } else {
          action.label = editValue.value;
        }
      }
      saveData();
    };

    const editQuickAction = (action: QuickActionKey): void => {
      editingField.value = { type: 'quickAction', key: action };
      const current = profileData.value.quickActions[action];
      editValue.value = current.badge || current.label;
      editDialogTitle.value = `Редактировать: ${current.label}`;
      showEditDialog.value = true;

      saveData();
    };

    const editAvatar = (): void => {
      newAvatarUrl.value = profileData.value.avatarUrl;
      avatarFile.value = null;
      showAvatarDialog.value = true;
    };

    const onAvatarFileSelect = (file: File | null): void => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          newAvatarUrl.value = (e.target?.result as string) ?? '';
        };
        reader.readAsDataURL(file);
      }
    };

    const saveAvatar = (): void => {
      if (newAvatarUrl.value) {
        profileData.value.avatarUrl = newAvatarUrl.value;
        saveData();
      }
    };

    onMounted(() => {
      loadData();
    });

    return {
      profileData,
      showEditDialog,
      showAvatarDialog,
      editDialogTitle,
      editValue,
      newAvatarUrl,
      avatarFile,
      editField,
      editMenuOption,
      editQuickAction,
      saveEdit,
      editAvatar,
      onAvatarFileSelect,
      saveAvatar,
    };
  },
};
</script>

<style scoped>
.stat-box {
  border-radius: 12px;
  flex: 1 1 0;
  text-align: left;
}

.round-borders {
  border-radius: 12px;
}
</style>
