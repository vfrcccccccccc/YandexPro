<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer bordered class="bottom-nav row items-end justify-around q-pa-sm bg-white">
      <router-link
        to="/orders"
        class="column items-center"
        :class="isActive('/orders') ? 'text-black' : 'text-grey'"
      >
        <q-icon name="near_me" />
        <div class="text-caption">Заказы</div>
      </router-link>
      <router-link
        to="/earnings"
        class="column items-center"
        :class="isActive('/earnings') || isActive('/money') ? 'text-black' : 'text-grey'"
      >
        <q-icon name="account_balance_wallet" />
        <div class="text-caption">Деньги</div>
      </router-link>
      <div class="column items-center text-grey">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-chat-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9 9 0 0 0 8 15"
          />
        </svg>
        <div class="text-caption">Чаты</div>
      </div>
      <router-link
        to="/"
        class="column items-center"
        :class="isActive('/') ? 'text-black' : 'text-grey'"
      >
        <q-avatar size="20px">
          <img :src="avatarUrl || '/statics/avatar-placeholder.png'" />
        </q-avatar>
        <div class="text-caption">Профиль</div>
      </router-link>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { type Ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'IndexPage',
  setup() {
    const STORAGE_KEY = 'driverProfileData';
    const avatarUrl: Ref<string> = ref('');

    const profileData = ref();

    const loadData = (): void => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }

      try {
        profileData.value = JSON.parse(stored);
        console.log('profileData.value', profileData.value?.avatarUrl);

        const avatar = profileData.value?.avatarUrl;

        // If avatar is a string (URL or data URL), use it directly.
        if (!avatar) {
          avatarUrl.value = '';
        } else if (typeof avatar === 'string') {
          avatarUrl.value = avatar;
        } else if (avatar instanceof Blob || avatar instanceof File) {
          // Only use FileReader for Blob/File objects
          const reader = new FileReader();
          reader.onload = (e: ProgressEvent<FileReader>) => {
            avatarUrl.value = (e.target?.result as string) ?? '';
          };
          reader.readAsDataURL(avatar);
        } else {
          // Fallback: coerce to string
          avatarUrl.value = String(avatar);
        }
      } catch (e) {
        console.error('Error loading profile data:', e);
      }
      console.log('avatarUrl.value', avatarUrl.value);
    };

    onMounted(() => {
      loadData();
    });

    const route = useRoute();

    const isActive = (to: string) => {
      return route.path === to;
    };

    return {
      avatarUrl,
      isActive,
    };
  },
};
</script>

<style scoped>
.bottom-nav a {
  text-decoration: none;
}
</style>
