<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <h1 class="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Login
      </h1>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            v-model="email"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            v-model="password"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          Entrar
        </button>
      </form>

      <p v-if="error" class="text-red-500 text-sm text-center mt-3">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const password = ref("");
const error = ref("");

async function login() {
  error.value = ""; // limpa erro anterior

  try {
    const response = await axios.post("http://localhost:8000/api/login", {
      email: email.value,
      password: password.value,
    });

    // ✅ Salva token e usuário
    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    // Redireciona
    window.location.href = "/dashboard";
  } catch (err) {
    console.error(err.response?.data || err);
    error.value = "Credenciais inválidas. Tente novamente.";
  }
}
</script>