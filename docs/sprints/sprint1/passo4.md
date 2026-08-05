# Verificar e completar a autenticação (Breeze)

O sistema exige login para todas as telas de gestão (RF14). Este passo garante que o fluxo de autenticação está funcional antes de criarmos qualquer tela de negócio.

## Objetivo

Ter login/logout funcionando de ponta a ponta, com um usuário administrador criado, e o middleware `auth` disponível para proteger as rotas futuras.

## Contexto

O projeto foi gerado a partir do starter kit "blank" com `laravel/breeze` presente no `composer.json`, mas o único conteúdo atual é a página `welcome.tsx` e a rota `GET /`. É preciso verificar o que o scaffold realmente instalou: se as rotas de autenticação (`/login`, `/logout`) e as páginas React correspondentes existem; caso não existam, o scaffold do Breeze (stack React/Inertia) deve ser aplicado/completado. Todas as rotas de negócio das próximas sprints serão registradas dentro de `Route::middleware('auth')` ([../../12-Routes.md](../../12-Routes.md)).

## Pré-requisitos

- [passo2.md](passo2.md) concluído (tabela `users` migrada).

## Arquivos que serão criados

- Conforme o scaffold do Breeze gerar (rotas de auth, controllers de auth, páginas React de login) — a lista exata depende do que já existe; documentar o resultado no PR.

## Arquivos que serão modificados

- `routes/web.php` (inclusão das rotas de auth, se necessário).
- `database/seeders/DatabaseSeeder.php` — garantir a criação de um usuário administrador conhecido para desenvolvimento (o seeder atual já cria `test@example.com`; ajustar nome/credenciais para o admin do IBFC se desejado).

## O que implementar

1. Inspecionar o que o Breeze já instalou (`php artisan route:list` — procurar rotas `login`, `logout`).
2. Se ausente, executar o scaffold do Breeze para a stack React/Inertia e revisar os arquivos gerados.
3. Garantir que existe um usuário de desenvolvimento criado via seeder.
4. Testar manualmente: acessar `/login`, autenticar, ser redirecionado; fazer logout.

## Regras de negócio envolvidas

- RF14 ([../../01-Requisitos.md](../../01-Requisitos.md)) — autenticação obrigatória. Não há níveis de permissão: o único ator é o Administrador ([../../17-CasosDeUso.md](../../17-CasosDeUso.md)).

## Fluxo

```
Usuário
    ↓
GET /login (página React via Inertia)
    ↓
POST /login (credenciais)
    ↓
Middleware auth passa a liberar rotas protegidas
    ↓
Redirect para a área autenticada
```

## Critérios de aceite

- ☐ `php artisan route:list` mostra rotas de login/logout.
- ☐ Login funcional com o usuário do seeder.
- ☐ Logout funcional.
- ☐ Uma rota protegida de teste redireciona visitante não autenticado para `/login`.
- ☐ Nenhum registro público de novos usuários exposto (se o Breeze gerar rota de `register`, avaliar removê-la ou mantê-la restrita — o sistema tem um único ator).

## Observações

- **Armadilha**: o starter "blank" pode ter vindo sem as rotas de auth publicadas mesmo com o Breeze no composer — por isso o passo começa com verificação, não com instalação às cegas.
- **Boas práticas**: manter as páginas de auth geradas pelo Breeze com o mínimo de customização nesta fase; ajustes visuais ficam para a Sprint 8.
- Referências: [../../01-Requisitos.md](../../01-Requisitos.md) (RF14, seção 7), [../../12-Routes.md](../../12-Routes.md).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)

**Desbloqueia:**
- [passo8.md](passo8.md)
- [../sprint2/passo3.md](../sprint2/passo3.md)
- [../sprint3/passo2.md](../sprint3/passo2.md)
