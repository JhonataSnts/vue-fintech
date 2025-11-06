<template>
  <div class="dashboard">
    <h1>Painel Fintech</h1>
    <button @click="logout">Sair</button>
    <button @click="$router.push('/perfil')">Meu Perfil</button>

    <section class="saldo">
      <p>Saldo: R$ {{ saldo }}</p>
      <button @click="depositarSaldo">Depositar R$100</button>
    </section>

    <!-- PIX -->
    <section>
      <PixPayment @saldo-atualizado="atualizarPainel" />
    </section>
  </div>

  <section class="transacoes">
  <h2>Transações Recentes</h2>
  <div v-if="!transacoes.length">Nenhuma transação encontrada</div>
  <table v-else>
    <thead>
      <tr>
        <th>ID</th>
        <th>Tipo</th>
        <th>Valor</th>
        <th>Status</th>
        <th>Data</th>
        <th>Remetente</th>
        <th>Destinatário</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="t in transacoes" :key="t.id">
        <td>{{ t.id }}</td>
        <td>{{ t.tipo }}</td>
        <td>{{ t.valor }}</td>
        <td>{{ t.status }}</td>
        <td>{{ t.data }}</td>
        <td>{{ t.remetente }}</td>
        <td>{{ t.destinatario }}</td>
      </tr>
    </tbody>
  </table>
</section>
</template>

<script setup>
import PixPayment from '../components/PixPayment.vue'
import { ref, onMounted } from 'vue'
import api from '../services/api'

const saldo = ref(0)
const token = localStorage.getItem('token')
const transacoes = ref([])

// Atualiza o saldo no backend
async function carregarUsuario() {
  try {
    const res = await api.get('usuarios/me')
    saldo.value = parseFloat(res.data.saldo)
  } catch (err) {
    console.error(err)
  }
}

async function atualizarPainel() {
  await carregarUsuario()
  await carregarTransacoes()
}

async function carregarTransacoes() {
  try {
    const res = await api.get('transactions', {
      headers: { Authorization: `Bearer ${token}` }
    })
    transacoes.value = res.data.data || []
  } catch (err) {
    console.error('Erro ao carregar transações:', err.response?.data || err)
  }
}

onMounted(async () => {
  await carregarUsuario()
  await carregarTransacoes()
})

// Corrigido — adicionando o token no header
async function depositarSaldo() {
  try {
    const res = await api.post(
      'deposit',
      { amount: 100 },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    saldo.value = parseFloat(res.data.saldo)
    alert('Depósito realizado com sucesso!')
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

onMounted(() => {
  carregarUsuario()
})
</script>