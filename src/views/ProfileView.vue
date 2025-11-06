<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <h1
        class="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Perfil
      </h1>

      <div v-if="user">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Nome</label>
          <input
            v-model="user.nome"
            type="text"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <label class="block text-gray-700 mb-1 mt-4">Email</label>
          <input
            v-model="user.email"
            type="email"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          @click="updateProfile"
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition mb-3"
        >
          Salvar Alterações
        </button>

        <button
          @click="logout"
          class="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Sair
        </button>
      </div>

      <div v-else class="text-center text-gray-500">
        Carregando dados do usuário...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const user = ref(null);

async function fetchUser() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/usuarios/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    user.value = response.data;
  } catch {
    user.value = null;
  }
}

async function updateProfile() {
  try {
    const token = localStorage.getItem("token");
    await axios.put(`${import.meta.env.VITE_API_URL}/usuarios/${user.value.id}`, {
      nome: user.value.nome,
      email: user.value.email,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Perfil atualizado com sucesso!");
  } catch {
    alert("Erro ao atualizar perfil.");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

onMounted(fetchUser);
</script>