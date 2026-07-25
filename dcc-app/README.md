# Da Consciência ao Comportamento — App

App Next.js com login protegido, liberado automaticamente para quem compra na Hotmart.
Conteúdo real dos 40 dias já embutido em `lib/movements.ts`.

## O que já está pronto

- Login com e-mail e senha (`/login`), todas as outras rotas protegidas por middleware
- Webhook da Hotmart (`/api/webhooks/hotmart`) que cria o acesso automaticamente quando alguém compra, e revoga em caso de reembolso/chargeback
- E-mail automático com login e senha para o comprador (via Resend)
- Home, 40 Movimentos, Diário, Dashboard e Plano de Manutenção, com progresso e respostas salvos de verdade no banco por usuário
- Visual já aplicado com os tokens de marca (cores, tipografia Fraunces + Karla)

## O que ainda não está incluído (próximos passos sugeridos)

- Fluxo de "esqueci minha senha" (hoje, se perder a senha, você reenvia manualmente pelo banco ou reprocessa o webhook)
- Troca de senha pelo próprio usuário
- Painel administrativo para você ver todos os compradores

---

## Passo 1 — Rodar localmente (opcional, mas recomendado pra testar antes)

Pré-requisitos: [Node.js 18+](https://nodejs.org) instalado.

```bash
cd da-consciencia-ao-comportamento
npm install
cp .env.example .env
```

Preencha o `.env`:
- `DATABASE_URL`: veja o Passo 2 pra criar o banco
- `NEXTAUTH_SECRET`: rode `openssl rand -base64 32` no terminal e cole o resultado
- `NEXTAUTH_URL`: deixe `http://localhost:3000` por enquanto

```bash
npx prisma db push   # cria as tabelas no banco
npm run dev           # abre em http://localhost:3000
```

Pra testar sem esperar uma compra real, crie um usuário manualmente:

```bash
npx prisma studio
```
Isso abre uma interface visual do banco. Crie uma linha na tabela `User` com:
- `email`: seu e-mail de teste
- `passwordHash`: gere um hash rodando no terminal:
  ```bash
  node -e "require('bcryptjs').hash('minhasenha123', 10).then(console.log)"
  ```
  e cole o resultado nesse campo.

---

## Passo 2 — Criar o banco de dados (Postgres)

O jeito mais simples é usar o **Neon** (gratuito, integra direto com a Vercel) ou o **Vercel Postgres**.

**Opção Neon (recomendado):**
1. Crie conta em [neon.tech](https://neon.tech)
2. Crie um projeto novo
3. Copie a "Connection string" — é o valor de `DATABASE_URL`

**Opção Vercel Postgres:**
1. No painel da Vercel, depois de importar o projeto (Passo 4), vá em **Storage → Create Database → Postgres**
2. A `DATABASE_URL` é preenchida automaticamente nas variáveis de ambiente do projeto

---

## Passo 3 — Subir pro GitHub

```bash
git init
git add .
git commit -m "Primeira versão do app"
```

Crie um repositório novo em [github.com/new](https://github.com/new) (pode ser privado) e depois:

```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

---

## Passo 4 — Deploy na Vercel

1. Entre em [vercel.com/new](https://vercel.com/new) e importe o repositório que você acabou de criar
2. A Vercel detecta automaticamente que é um projeto Next.js
3. Antes de clicar em "Deploy", adicione as variáveis de ambiente (**Environment Variables**):

| Nome | Valor |
|---|---|
| `DATABASE_URL` | a connection string do Passo 2 |
| `NEXTAUTH_SECRET` | o valor gerado com `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://SEU-PROJETO.vercel.app` (o mesmo domínio que a Vercel vai te dar) |
| `HOTMART_HOTTOK` | um token que você escolhe agora (qualquer string única e difícil de adivinhar) — vai usar o mesmo no Passo 5 |
| `RESEND_API_KEY` | veja o Passo 6 |
| `EMAIL_FROM` | um e-mail do seu domínio, ex: `acesso@seudominio.com` |

4. Clique em **Deploy**
5. Depois que o deploy terminar, copie a URL final (ex: `https://dcc-app.vercel.app`) e atualize a variável `NEXTAUTH_URL` com ela, se for diferente do que você colocou. Redeploy se precisar mudar.

### Criar as tabelas no banco de produção

Depois do primeiro deploy, rode uma vez (do seu computador, apontando pro banco de produção):

```bash
DATABASE_URL="a-mesma-url-de-producao" npx prisma db push
```

---

## Passo 5 — Configurar o Webhook na Hotmart

1. No painel da Hotmart, vá em **Ferramentas → Webhook** (ou **Notificações**, dependendo da versão do painel)
2. Crie um novo webhook apontando para:
   ```
   https://SEU-PROJETO.vercel.app/api/webhooks/hotmart
   ```
3. No campo de token/HOTTOK, cole o mesmo valor que você colocou em `HOTMART_HOTTOK` na Vercel
4. Selecione os eventos:
   - `PURCHASE_APPROVED` (libera acesso)
   - `PURCHASE_COMPLETE` (libera acesso)
   - `PURCHASE_REFUNDED`, `PURCHASE_CHARGEBACK`, `PURCHASE_CANCELED`, `PURCHASE_EXPIRED`, `PURCHASE_PROTEST` (revogam acesso)
5. Salve

Assim que alguém compra, a Hotmart chama esse endereço automaticamente, o app cria o acesso e dispara o e-mail com login e senha.

---

## Passo 6 — Configurar o envio de e-mail (Resend)

1. Crie conta em [resend.com](https://resend.com) (tem plano gratuito)
2. Verifique um domínio seu (ou use o domínio de teste deles pra começar)
3. Gere uma API Key e cole em `RESEND_API_KEY` na Vercel
4. Redeploy o projeto na Vercel pra aplicar a variável nova

Sem essa chave configurada, o app ainda libera o acesso normalmente, só não envia o e-mail automático — nesse caso, a senha fica registrada nos logs da Vercel (**Deployments → Functions → Logs**) pra você repassar manualmente se precisar.

---

## Testando o fluxo completo

Na Hotmart, use o modo de **compra de teste** do seu produto. Confirme que:
1. O e-mail com login e senha chega
2. Login funciona em `https://SEU-PROJETO.vercel.app/login`
3. As telas carregam e "Marcar como concluído" salva o progresso
4. Simule um reembolso de teste e confirme que o login para de funcionar

---

## Estrutura do projeto

```
app/
  login/                    tela de login
  (app)/                    tudo protegido por autenticação
    home/
    movimentos/
      [dia]/                detalhe de cada um dos 40 dias
    diario/
    dashboard/
    manutencao/
  api/
    auth/[...nextauth]/     NextAuth
    webhooks/hotmart/       recebe eventos de compra da Hotmart
    progress/               salva progresso do usuário
lib/
  movements.ts              conteúdo completo dos 40 dias
  auth.ts                   configuração de login
  prisma.ts                 conexão com banco
prisma/
  schema.prisma             modelos User e Progress
```
