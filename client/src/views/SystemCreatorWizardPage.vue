<script setup lang="ts">
import { ref, computed, onMounted, markRaw, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NButton, NSpace, NSteps, NStep, useMessage, NSpin } from 'naive-ui'
import { useAuthStore } from '@/stores/auth.store'
import { useSystemCreatorsStore } from '@/stores/system-creators.store'
import AppLayout from '@/components/layout/AppLayout/AppLayout.vue'
import ScWizardStep1Basic from '@/features/system-creators/components/ScWizardStep1Basic.vue'
import ScWizardStep2Fields from '@/features/system-creators/components/ScWizardStep2Fields.vue'
import ScWizardStep3Relations from '@/features/system-creators/components/ScWizardStep3Relations.vue'
import ScWizardStep4Access from '@/features/system-creators/components/ScWizardStep4Access.vue'
import ScWizardStep5Review from '@/features/system-creators/components/ScWizardStep5Review.vue'
import ScWizardStep6Layout from '@/features/system-creators/components/ScWizardStep6Layout.vue'
import type { CreateScModule } from '@/types/system-creator'

const authStore = useAuthStore()
const scStore = useSystemCreatorsStore()
const router = useRouter()
const message = useMessage()

const currentStep = ref(1)
const generating = ref(false)

const moduleConfig = ref<CreateScModule>({
  name: '',
  label: '',
  menuLabel: '',
  description: '',
  fields: [],
  relations: [],
  accessLevel: 'admin',
})

const steps = [
  { title: 'Basic Info', component: markRaw(ScWizardStep1Basic) as Component },
  { title: 'Fields', component: markRaw(ScWizardStep2Fields) as Component },
  { title: 'Relations', component: markRaw(ScWizardStep3Relations) as Component },
  { title: 'Access', component: markRaw(ScWizardStep4Access) as Component },
  { title: 'Layout', component: markRaw(ScWizardStep6Layout) as Component },
  { title: 'Review', component: markRaw(ScWizardStep5Review) as Component },
]

const currentComponent = computed(() => steps[currentStep.value - 1].component)

const canProceed = computed(() => {
  const c = moduleConfig.value
  switch (currentStep.value) {
    case 1:
      return c.name && c.label && c.menuLabel
    case 2:
      return c.fields.length > 0 && c.fields.every((f) => f.name && f.label)
    default:
      return true
  }
})

function next() {
  if (currentStep.value < 6) currentStep.value++
}

function back() {
  if (currentStep.value > 1) currentStep.value--
}

async function generate() {
  generating.value = true
  try {
    await scStore.generate(moduleConfig.value)
    message.success('Module generated successfully! Server restarting...')
    setTimeout(() => {
      router.push('/dashboard/system-creators')
    }, 2000)
  } catch (e: any) {
    message.error(e.response?.data?.message || 'Failed to generate module')
  } finally {
    generating.value = false
  }
}

onMounted(async () => {
  await authStore.fetchProfile()
})
</script>

<template>
  <AppLayout v-if="authStore.user" :user="authStore.user">
    <NCard title="Create New Module" class="max-w-4xl mx-auto">
      <NSteps :current="currentStep" :status="generating ? 'process' : 'process'" class="mb-8">
        <NStep v-for="(step, i) in steps" :key="i" :title="step.title" />
      </NSteps>

      <div class="min-h-[300px] mb-6">
        <NSpin :show="generating">
          <component :is="currentComponent" v-model="moduleConfig" />
        </NSpin>
      </div>

      <NSpace justify="end">
        <NButton v-if="currentStep > 1" :disabled="generating" @click="back">Back</NButton>
        <NButton v-if="currentStep < 6" type="primary" :disabled="!canProceed || generating" @click="next">Next</NButton>
        <NButton v-if="currentStep === 6" type="primary" :loading="generating" :disabled="generating" @click="generate">
          Generate Module
        </NButton>
      </NSpace>
    </NCard>
  </AppLayout>
</template>
