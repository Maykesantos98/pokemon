# Pokédex Shards — Catálogo do Servidor

Site estático (GitHub Pages) com o catálogo de **Pokémon Shards** e **Items** do servidor,
mais um guia de **Dicas de Formação** de time. Visual retrô-moderno inspirado no aparelho Pokédex.

## Páginas

| Arquivo | O que é |
|---|---|
| `index.html` | Catálogo de Pokémon Shards — busca, filtros por estrela/Mega/Z e cópia do shard pro gift code. |
| `items.html` | Catálogo de Items (1160) — filtros por poder e qualidade; descrições traduzidas pro português. |
| `dicas.html` | Análise do catálogo: tier list por pontuação de família, prioridade de shards, times prontos e recomendador interativo. |
| `pokemons_shards.html` | Redireciona pra `index.html` (versão antiga). |

## Estrutura

```
.
├── index.html
├── items.html
├── dicas.html
├── pokemons_shards.html      # redirect
└── assets/
    ├── css/
    │   └── styles.css        # design system Pokédex (compartilhado)
    └── js/
        ├── app.js            # helpers compartilhados (toast, copiar, ícones)
        ├── pt.js             # tradutor das descrições de item (EN → PT)
        ├── pokemons-data.js  # base dos Pokémon (const POKEMONS)
        └── items-data.js     # base dos itens (const ITEMS)
```

## Como usar os gift codes

No `gift.csv` use o formato `{ID=QUANTIDADE}`:

- Shard de Pokémon: `{20011=100}` dá 100 shards (cobre **a família evolutiva inteira**).
- Item: `{521=10}` dá 10 unidades do item de ID 521.

Cada card tem um botão **Copiar** que joga o código pronto no clipboard.

## Como a análise de formação funciona

Cada **linha evolutiva** recebe um *poder de linha*:

```
poder = (maior estrela da linha × 10) + (tem Mega ? 25 : 0) + (tem Z-Awake ? 8 : 0)
```

Esse score alimenta a tier list (S/A/B/C/D), a prioridade de shards e o recomendador.

## Rodando localmente

É HTML estático puro — basta abrir os arquivos no navegador, ou servir a pasta:

```bash
python -m http.server 8000
# abre http://localhost:8000
```
