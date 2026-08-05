# Resolver a inconsistência de timestamps em team_players

Há uma divergência conhecida entre a migration de `team_players` e o Model `TeamPlayer`. Este passo a elimina antes que qualquer código dependa dela.

## Objetivo

Alinhar a tabela `team_players` com o Model `TeamPlayer`, removendo as colunas `created_at`/`updated_at` que nunca são preenchidas.

## Contexto

A migration `2026_07_30_054055_create_team_players_table.php` cria `created_at`/`updated_at` (via `timestamps()`), mas o Model `app/Models/TeamPlayer.php` declara `public $timestamps = false` — ou seja, o Eloquent nunca preenche essas colunas, que ficariam eternamente `NULL`. A decisão de projeto ([../../07-BancoDeDados.md](../../07-BancoDeDados.md), seção 4) é resolver isso cedo. Como o vínculo de escalação não precisa de auditoria própria (o `Team` pai já tem timestamps), a opção adotada é **remover as colunas da tabela**, mantendo o Model como está.

## Pré-requisitos

- [passo2.md](passo2.md) concluído (migrations aplicadas).

## Arquivos que serão criados

- `database/migrations/<timestamp>_remove_timestamps_from_team_players_table.php` (gerada com `php artisan make:migration remove_timestamps_from_team_players_table --no-interaction`).

## Arquivos que serão modificados

- Nenhum. O Model `TeamPlayer` permanece com `$timestamps = false`; a migration original **não** é editada.

## O que implementar

1. Gerar a nova migration de ajuste com o Artisan.
2. No `up()`: remover as colunas `created_at` e `updated_at` da tabela `team_players` (via `dropColumn`).
3. No `down()`: recriar as colunas (via `timestamps()`), garantindo reversibilidade.
4. Executar `php artisan migrate`.

## Regras de negócio envolvidas

- Nenhuma RN funcional — é um ajuste de consistência de schema. Indiretamente sustenta a confiabilidade do histórico de escalações (entidade `TeamPlayer`, [../../06-Entidades.md](../../06-Entidades.md)).

## Fluxo

```
Desenvolvedor
    ↓
make:migration (nova migration de ajuste)
    ↓
up(): dropColumn / down(): timestamps()
    ↓
php artisan migrate
    ↓
Tabela team_players sem colunas mortas
```

## Critérios de aceite

- ☐ Nova migration criada (a original intocada).
- ☐ `php artisan migrate` executado sem erro.
- ☐ Tabela `team_players` sem `created_at`/`updated_at` no MySQL.
- ☐ `php artisan migrate:rollback --step=1` seguido de `migrate` funciona (migration reversível).
- ☐ Comentário obsoleto sobre timestamps na migration original pode ser ignorado (não editar arquivo já aplicado).

## Observações

- **Por que remover em vez de ativar timestamps no Model**: a linha do tempo da escalação é a do Match Day/Team; timestamps no pivô seriam redundância sem consulta que os use.
- **Armadilha**: se este passo for executado em um banco com dados reais futuros, `dropColumn` é destrutivo — aqui é seguro pois o banco acabou de ser criado.
- Referências: [../../07-BancoDeDados.md](../../07-BancoDeDados.md) (seção 4), [../../09-Migrations.md](../../09-Migrations.md) (seção 5).

## Dependências

**Depende de:**
- [passo2.md](passo2.md)

**Desbloqueia:**
- [../sprint4/passo5.md](../sprint4/passo5.md) (persistência de escalações usa `team_players` já consistente)
