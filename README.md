## ⚙️ Funcionalidades

- Login de usuário (autenticação via token da API)
- Dashboard com saldo e histórico de transações
- Pagamentos via PIX com QR Code gerado pelo PagBank (sandbox)
- Interface responsiva (Tailwind + Vue 3)


<img width="1286" height="655" alt="Captura de tela de 2025-11-06 16-12-09" src="https://github.com/user-attachments/assets/32df0d45-cf1e-491e-bfd0-b28ec1361a78" />

<img width="1291" height="640" alt="Captura de tela de 2025-11-06 16-11-19" src="https://github.com/user-attachments/assets/d9d43c29-79b5-4943-832b-1e8b43b61838" />

<img width="1021" height="632" alt="Captura de tela de 2025-11-06 16-13-31" src="https://github.com/user-attachments/assets/a29eee4b-fc2d-4e29-8d1a-0926f0b2bdf1" />

## 🔗 Integração com a API

A aplicação consome os seguintes endpoints da API Fintech:

| Método | Endpoint | Descrição |
|--------|-----------|------------|
| POST | `/api/login` | Autentica o usuário e retorna token Bearer |
| GET | `/api/transactions` | Lista transações do usuário |
| POST | `/api/pix/create` | Gera QR Code PIX (PagBank) |
