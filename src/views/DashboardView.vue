<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-blue-600 text-white shadow-md">
      <div class="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        <h1 class="text-2xl font-bold">Fintech Dashboard</h1>
        <div class="flex gap-4">
          <button
            @click="$router.push('/perfil')"
            class="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
          >
            Meu Perfil
          </button>
          <button
            @click="logout"
            class="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </div>
    </header>

    <!-- Conteúdo principal -->
    <main class="max-w-6xl mx-auto py-10 px-6">
      <!-- Card do Saldo -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow p-6 text-center">
          <h2 class="text-gray-500 text-sm uppercase">Saldo Atual</h2>
          <p class="text-4xl font-semibold text-green-600 mt-2">R$ {{ saldo }}</p>
          <button
            @click="depositarSaldo"
            class="mt-4 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg transition"
          >
            Depositar R$100
          </button>
        </div>

        <!-- PIX -->
        <div class="bg-white rounded-2xl shadow p-6">
          <PixPayment @saldo-atualizado="atualizarPainel" />
        </div>
      </section>

      <!-- Transações -->
      <section class="bg-white rounded-2xl shadow p-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-800">Transações Recentes</h2>

        <div v-if="!transacoes.length" class="text-gray-500 text-center py-6">
          Nenhuma transação encontrada.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-100 text-gray-700 uppercase text-sm">
                <th class="py-2 px-4">ID</th>
                <th class="py-2 px-4">Tipo</th>
                <th class="py-2 px-4">Valor</th>
                <th class="py-2 px-4">Status</th>
                <th class="py-2 px-4">Data</th>
                <th class="py-2 px-4">Remetente</th>
                <th class="py-2 px-4">Destinatário</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="t in transacoes"
                :key="t.id"
                class="border-t hover:bg-gray-50 transition"
              >
                <td class="py-2 px-4">{{ t.id }}</td>
                <td class="py-2 px-4 capitalize">{{ t.tipo }}</td>
                <td class="py-2 px-4 text-green-600 font-medium">
                  R$ {{ parseFloat(t.valor).toFixed(2) }}
                </td>
                <td class="py-2 px-4">
                  <span
                    :class="{
                      'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm': t.status === 'pending',
                      'bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm': t.status === 'completed',
                      'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm': t.status === 'failed',
                    }"
                  >
                    {{ t.status }}
                  </span>
                </td>
                <td class="py-2 px-4">{{ t.data }}</td>
                <td class="py-2 px-4">{{ t.remetente }}</td>
                <td class="py-2 px-4">{{ t.destinatario }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PixPayment from '../components/PixPayment.vue'
import api from '../services/api'

const saldo = ref(0)
const transacoes = ref([])
const token = localStorage.getItem('token')

async function carregarUsuario() {
  try {
    const res = await api.get('usuarios/me')
    saldo.value = parseFloat(res.data.saldo)
  } catch (err) {
    console.error(err)
  }
}

async function carregarTransacoes() {
  try {
    const res = await api.get('transactions', {
      headers: { Authorization: `Bearer ${token}` },
    })
    transacoes.value = res.data.data || []
  } catch (err) {
    console.error('Erro ao carregar transações:', err.response?.data || err)
  }
}

async function atualizarPainel() {
  await carregarUsuario()
  await carregarTransacoes()
}

async function depositarSaldo() {
  try {
    const res = await api.post(
      'deposit',
      { amount: 100 },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    saldo.value = parseFloat(res.data.saldo)
  } catch (err) {
    console.error('Erro ao depositar:', err.response?.data || err)
    alert('Erro ao depositar saldo.')
  }
}

async function logout() {
  try {
    await api.post('logout')
    localStorage.removeItem('token')
    window.location.href = '/login'
  } catch (err) {
    console.error(err)
  }
}

onMounted(async () => {
  await carregarUsuario()
  await carregarTransacoes()
})
</script>