<template>
  <div class="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 shadow-sm border border-gray-200">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      💸 Depósito via PIX
    </h2>

    <!-- Formulário PIX -->
    <form @submit.prevent="createPix" class="space-y-4">
      <div>
        <label class="block text-gray-600 text-sm font-medium mb-1">Valor</label>
        <input
          type="number"
          v-model="amount"
          min="1"
          step="0.01"
          class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition p-2"
        />
      </div>

      <div>
        <label class="block text-gray-600 text-sm font-medium mb-1">Descrição</label>
        <input
          type="text"
          v-model="description"
          placeholder="Ex: Depósito de teste"
          class="w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition p-2"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
      >
        <span v-if="loading">Gerando QR Code...</span>
        <span v-else>Gerar QR Code</span>
      </button>
    </form>

    <!-- Exibir QR Code e status -->
    <div v-if="transaction" class="mt-6 text-center">
      <div class="flex flex-col items-center gap-3">
        <h3
          class="text-sm font-semibold"
          :class="{
            'text-yellow-600': transaction.status === 'pending',
            'text-green-600': transaction.status === 'completed',
          }"
        >
          Status: {{ transaction.status }}
        </h3>

        <div v-if="transaction.qr_image_url" class="bg-white p-4 rounded-xl shadow-md">
          <img
            :src="transaction.qr_image_url"
            alt="QR Code PIX"
            class="w-48 h-48 object-contain"
          />
        </div>

        <button
          @click="simulatePayment"
          :disabled="simulating"
          class="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
        >
          <span v-if="simulating">Simulando...</span>
          <span v-else>Simular Pagamento</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, defineEmits } from 'vue'

const emit = defineEmits(['saldo-atualizado'])

const amount = ref(10.0)
const description = ref('Depósito de teste')
const transaction = ref(null)
const loading = ref(false)
const simulating = ref(false)

const token = localStorage.getItem('token') || ''

// Criar QR Code PIX
const createPix = async () => {
  loading.value = true
  try {
    const response = await axios.post(
      'http://localhost:8000/api/pix/create',
      { amount: amount.value, description: description.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    transaction.value = response.data.transaction
  } catch (error) {
    console.error('Erro ao criar PIX:', error.response?.data || error)
    alert('Erro ao criar PIX.')
  } finally {
    loading.value = false
  }
}

// Simular pagamento
const simulatePayment = async () => {
  if (!transaction.value) return
  simulating.value = true
  try {
    const response = await axios.post(
      `http://localhost:8000/api/pix/simulate/${transaction.value.id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )

    transaction.value = response.data.transaction

    // ✅ Atualiza saldo no painel
    if (response.data.new_balance) {
      emit('saldo-atualizado', response.data.new_balance)
    }

    alert('Pagamento simulado com sucesso!')
  } catch (error) {
    console.error('Erro ao simular pagamento:', error.response?.data || error)
    alert('Erro ao simular pagamento.')
  } finally {
    simulating.value = false
  }
}
</script>

<style scoped>
/* Adiciona leve transição ao mudar status */
.pix-container {
  transition: all 0.3s ease;
}
</style>