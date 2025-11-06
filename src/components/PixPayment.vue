<template>
  <div class="pix-container">
    <h2>Depósito via PIX</h2>

    <form @submit.prevent="createPix">
      <label>Valor:</label>
      <input type="number" v-model="amount" min="1" step="0.01" />

      <label>Descrição:</label>
      <input type="text" v-model="description" />

      <button type="submit" :disabled="loading">Gerar QR Code</button>
    </form>

    <div v-if="transaction">
      <h3>Status: {{ transaction.status }}</h3>
      <img v-if="transaction.qr_image_url" :src="transaction.qr_image_url" alt="QR Code PIX" />
      <button @click="simulatePayment" :disabled="simulating">Simular Pagamento</button>
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

// Simular pagamento (Webhook fake)
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

    // ✅ Agora o emit está no lugar certo
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
.pix-container {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 10px;
  background: #f9f9f9;
}
</style>