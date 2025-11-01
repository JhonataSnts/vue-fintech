<template>
  <div class="profile">
    <h1>Meu Perfil</h1>

    <form @submit.prevent="atualizarPerfil">
      <label>Nome</label>
      <input v-model="nome" required />

      <label>Email</label>
      <input v-model="email" type="email" required />

      <button type="submit">Atualizar</button>
    </form>

    <p v-if="mensagem">{{ mensagem }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const nome = ref('');
const email = ref('');
const id = ref(null);
const mensagem = ref('');

async function carregarPerfil() {
  try {
    const res = await api.get('usuarios/me');
    id.value = res.data.id;
    nome.value = res.data.nome;
    email.value = res.data.email;
  } catch (err) {
    console.error(err);
    mensagem.value = 'Erro ao carregar perfil.';
  }
}

async function atualizarPerfil() {
  try {
    const res = await api.put(`usuarios/${id.value}`, {
      nome: nome.value,
      email: email.value,
    });
    mensagem.value = 'Perfil atualizado com sucesso!';
  } catch (err) {
    mensagem.value = err.response?.data?.message || 'Erro ao atualizar perfil.';
  }
}

onMounted(carregarPerfil);
</script>