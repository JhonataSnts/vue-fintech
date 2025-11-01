<template>
  <div class="dashboard">
    <h1>Painel Fintech</h1>
    <button @click="logout">Sair</button>
    <button @click="$router.push('/perfil')">Meu Perfil</button>

    <section class="saldo">
      <p>Saldo: R$ {{ saldo }}</p>
    </section>

    <section class="saldo">
  <p>Saldo: R$ {{ saldo }}</p>
  <button @click="depositarSaldo">Depositar R$100</button>
  </section>

    <section class="nova-transacao">
      <h2>Nova Transação</h2>
      <form @submit.prevent="enviarTransacao">
        <label for="to_user_id">Destinatário:</label>
        <select v-model="to_user_id" required>
          <option disabled value="">Selecione um usuário</option>
          <option v-for="usuario in usuarios" :key="usuario.id" :value="usuario.id">
            {{ usuario.nome }}
          </option>
        </select>

        <label for="amount">Valor:</label>
        <input type="number" v-model.number="amount" step="0.01" min="0.01" required />

        <button type="submit">Enviar</button>
      </form>
      <p v-if="mensagem" :class="{ erro: isErro }">{{ mensagem }}</p>
    </section>

    <section class="transacoes">
      <h2>Transações Recentes</h2>
      <div v-if="loading">Carregando transações...</div>
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
          <tr v-for="transacao in transacoes" :key="transacao.id">
            <td>{{ transacao.id }}</td>
            <td>{{ transacao.tipo }}</td>
            <td>{{ transacao.valor }}</td>
            <td>{{ transacao.status }}</td>
            <td>{{ transacao.data }}</td>
            <td>{{ transacao.remetente }}</td>
            <td>{{ transacao.destinatario }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api'; // sua instância axios já configurada com token

const saldo = ref('0,00');
const transacoes = ref([]);
const usuarios = ref([]);
const loading = ref(true);

const to_user_id = ref('');
const amount = ref(null);
const mensagem = ref('');
const isErro = ref(false);

// Busca dados do usuário autenticado
async function carregarUsuario() {
  try {
    const res = await api.get('usuarios/me');
    saldo.value = res.data.saldo;
  } catch (err) {
    console.error(err);
  }
}

async function depositarSaldo() {
  try {
    await api.post('transactions/deposit', { amount: 100 });
    await carregarUsuario();
    alert('Depósito realizado com sucesso!');
  } catch (err) {
    console.error(err);
    alert('Erro ao depositar.');
  }
}

// Busca lista de usuários para o dropdown (exceto você mesmo)
async function carregarUsuarios() {
  try {
    const res = await api.get('usuarios'); // supondo que exista endpoint GET /api/usuarios
    const me = await api.get('usuarios/me');
    usuarios.value = res.data.filter(u => u.id !== me.data.id);
  } catch (err) {
    console.error(err);
  }
}

// Busca transações do usuário
async function carregarTransacoes() {
  loading.value = true;
  try {
    const res = await api.get('transactions');
    transacoes.value = res.data.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Cria nova transação
async function enviarTransacao() {
  mensagem.value = '';
  isErro.value = false;

  if (!to_user_id.value || !amount.value) return;

  try {
    const res = await api.post('transactions', {
      to_user_id: parseInt(to_user_id.value),
      amount: parseFloat(amount.value)
    });

    mensagem.value = 'Transação realizada com sucesso!';
    isErro.value = false;

    // Atualiza saldo e transações
    await carregarUsuario();
    await carregarTransacoes();

    // Limpa formulário
    to_user_id.value = '';
    amount.value = null;
  } catch (err) {
    isErro.value = true;
    mensagem.value = err.response?.data?.message || 'Erro ao enviar transação';
  }
}

async function logout() {
  try {
    await api.post('logout');
    localStorage.removeItem('token');
    window.location.href = '/login';
  } catch (err) {
    console.error(err);
  }
}

onMounted(async () => {
  await carregarUsuario();
  await carregarUsuarios();
  await carregarTransacoes();
});
</script>

<style scoped>
.erro {
  color: red;
}
</style>