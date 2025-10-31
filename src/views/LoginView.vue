<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm">
      <h1 class="text-2xl font-semibold mb-6 text-center">Login Fintech</h1>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full border rounded-lg p-2"
            placeholder="seu@email.com"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium mb-1">Senha</label>
          <input
            v-model="password"
            type="password"
            class="w-full border rounded-lg p-2"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>

      <p v-if="error" class="text-red-500 text-sm mt-4">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

const login = async () => {
  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    });

    localStorage.setItem('token', response.data.access_token);
    alert('Login realizado com sucesso!');
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Falha no login.';
  }
};
</script>

<style>
body {
  font-family: sans-serif;
}
</style>