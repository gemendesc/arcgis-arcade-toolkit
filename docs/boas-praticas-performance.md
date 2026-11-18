# Engenharia de Performance e Arquitetura em ArcGIS Arcade

Expressões **ArcGIS Arcade** executam sob demanda no cliente (navegador / *ArcGIS Maps SDK for JavaScript* / *Field Maps*) ou traduzem subconjuntos para SQL nos serviços REST (*Hosted Feature Layers* / *ArcGIS Enterprise*). Em projetos institucionais com dezenas de milhares de polígonos — como monitoramento de desmatamento, blocos de petróleo e gás, outorgas hídricas ou infraestrutura linear — escolhas incorretas de funções degradam drasticamente o tempo de resposta de *Web Maps* e *Dashboards*.

Este guia sintetiza os padrões arquiteturais adotados neste toolkit.

---

## 1. *Pushdown* de Consultas SQL antes de Operações Espaciais

Nunca passe um `FeatureSet` bruto diretamente para `Intersects()` ou loops `for` quando for possível restringir atributos primeiro.

- **Anti-padrão (lento):** iterar sobre todas as Unidades de Conservação do Brasil no cliente e testar condição `if (uc.situacao == 'Ativa')` dentro do laço.
- **Padrão recomendado:** encadear `Filter(FeatureSetByPortalItem(...), "situacao = 'Ativa'")` **antes** de `Intersects()`, e declarar explicitamente a lista mínima de colunas no 4º parâmetro (`fields`) de `FeatureSetByPortalItem`. Quando a geometria não é necessária (ex.: *Data Expressions* tabulares em Dashboards), passe `includeGeometry = false` (`5º argumento`), reduzindo o payload HTTP em até **85–95%**.

```js
// Bom: solicita apenas 3 colunas sem geometria e delega o GROUP BY ao banco do Feature Service
var fs = Filter(
    FeatureSetByPortalItem(Portal("https://www.arcgis.com"), "ITEM_ID", 0, ["cod_bacia", "area_ha"], false),
    "ano_deteccao >= 2022"
);
var resumo = GroupBy(fs, ["cod_bacia"], [{ name: "soma_ha", expression: "area_ha", statistic: "SUM" }]);
```

---

## 2. Prevenção de *Queries* `N+1` e *Hash Join* em Memória (`O(N + M)`)

Em **Data Expressions** do *ArcGIS Dashboards*, um erro recorrente ao cruzar duas camadas (ex.: *Alertas de Desmatamento* × *Outorgas da ANA*) é executar `Filter()` na segunda camada **dentro** do loop `for` da primeira camada — disparando centenas de requisições REST sequenciais (`N+1 queries`) e causando *timeout* no widget.

**Solução adotada no snippet `10-data-expression-ranking-bacias-uf.arcade`:**
1. Agregar a Camada A no servidor com `GroupBy()`;
2. Agregar a Camada B no servidor com `GroupBy()`;
3. Materializar a Camada B em um dicionário chave-valor (`var indice = {}`);
4. Percorrer a Camada A uma única vez consultando `indice[chave]` em tempo constante `O(1)`.

---

## 3. Precisão Cartográfica no Brasil: Funções Planares vs. Geodésicas

A maioria dos *Web Maps* no ArcGIS Online utiliza o *Basemap* padrão em **Web Mercator Auxiliary Sphere (`EPSG:3857`)**, cuja distorção areal cresce com `sec²(φ)` conforme nos afastamos da linha do Equador:

- No extremo norte/equatorial (ex.: Amapá / Foz do Amazonas, `φ ≈ 0°–2°`), o erro planar é pequeno (`< 0,5%`);
- No Cerrado meridional, Sudeste e Sul (ex.: Minas Gerais, Paraná, Rio Grande do Sul, `φ ≈ 20°S–32°S`), `Area()` e `Buffer()` planares em `EPSG:3857` **superestimam áreas em 13% a 38%** e deformam raios métricos de APP.

**Regra estrita deste repositório:**
- Sempre utilizar **`AreaGeodetic(geom, 'hectares')`**, **`LengthGeodetic(geom, 'kilometers')`**, **`BufferGeodetic(geom, dist, 'meters')`** e **`DistanceGeodetic(p1, p2, 'meters')`** em cálculos territoriais, ambientais e legais.

---

## 4. Sanitização HTML e SVG Inline em Pop-ups e Listas

O *ArcGIS Map Viewer*, *Experience Builder* e *ArcGIS Dashboards* aplicam sanitização estrita sobre retornos HTML (`type: 'text'`):
- Tags `<script>`, `<style>`, `<iframe>` (exceto domínios liberados) e eventos `onclick` são removidos;
- Todo o estilo deve ser escrito em **`style="..."` inline** nos próprios elementos `<div>`, `<table>`, `<span>` e `<svg>`;
- Para mini-gráficos (*sparklines* e barras proporcionais), **SVG inline (`<svg viewBox="...">` + `<rect>` + `<text>`)** e barras flexbox CSS renderizam instantaneamente sem carregar instâncias pesadas de gráficos Dojo/Calcite por clique.

---

## 5. Matriz de Decisão Arquitetural: Arcade em Tempo de Execução vs. ETL (Python / PostGIS)

Nem toda lógica espacial deve residir no Arcade. Abaixo está o critério adotado em projetos de produção:

| Cenário Técnico | Recomendação | Justificativa de Engenharia |
| :--- | :--- | :--- |
| Formatação condicional, KPIs YoY, ocultação de campos nulos e mini-gráficos em Pop-up | **ArcGIS Arcade (Runtime)** | Custo computacional desprezível (`O(1)` por feição clicada) e evita poluir o banco com colunas puramente visuais. |
| Semáforo de vigência de licenças/outorgas (`DateDiff` contra `Now()`) | **ArcGIS Arcade (Runtime)** | Sempre reflete o dia exato de abertura do mapa, eliminando *cron jobs* noturnos apenas para atualizar status vencido. |
| Interseção espacial sob demanda ao clicar em **1 feição** no Pop-up ou ao coletar **1 ponto** no *Field Maps* | **ArcGIS Arcade (Runtime)** | Executa apenas para a geometria em foco (`1 query` espacial indexada), garantindo resultado sempre sincronizado com bases vivas. |
| Simbologia em camada com `> 5.000` polígonos exigindo `Intersects()` contra outra camada complexa | **ETL Pré-processado (Python / PostGIS)** | Simbologia com `FeatureSet` força o navegador a cruzar geometrias para cada feição visível, inviabilizando o carregamento do mapa. |
| Séries históricas pesadas (ex.: 1.873 municípios × 12 anos × 4 bases oficiais com testes de Spearman) | **Banco Espacial (PostGIS + Views / MVT)** | Operações relacionais massivas, índices GiST e geração de *Vector Tiles* (`ST_AsMVT`) pertencem ao backend geoespacial. |
