## ⚙️ Funcionalidades

- Login de usuário (autenticação via token da API)
- Dashboard com saldo e histórico de transações
- Pagamentos via PIX com QR Code gerado pelo PagBank (sandbox)
- Interface responsiva (Tailwind + Vue 3)

## 🔗 Integração com a API

A aplicação consome os seguintes endpoints da API Fintech:

| Método | Endpoint | Descrição |
|--------|-----------|------------|
| POST | `/api/login` | Autentica o usuário e retorna token Bearer |
| GET | `/api/transactions` | Lista transações do usuário |
| POST | `/api/pix/create` | Gera QR Code PIX (PagBank) |