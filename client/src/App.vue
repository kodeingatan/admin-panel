<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider, NGlobalStyle } from 'naive-ui'
import { themeOverrides } from '@/plugins/naiveui'
import AccessDeniedAlert from '@/components/common/AccessDeniedAlert.vue'
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-global-style />
    <AccessDeniedAlert />
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <RouterView v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
