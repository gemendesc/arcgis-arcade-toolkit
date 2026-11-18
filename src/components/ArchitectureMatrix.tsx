import React from "react";

interface DecisionRow {
  scenario: string;
  recommendation: "Arcade Runtime" | "ETL Python / PostGIS";
  rationale: string;
}

const DECISION_ROWS: DecisionRow[] = [
  {
    scenario:
      "Fichas HTML responsivas, ocultação de atributos nulos, deep links e mini-gráficos SVG no Pop-up",
    recommendation: "Arcade Runtime",
    rationale:
      "Execução O(1) restrita exclusivamente à feição clicada pelo usuário, evitando dezenas de colunas puramente cosméticas no banco de dados.",
  },
  {
    scenario:
      "Semáforo jurídico de vencimento de licenças ambientais, condicionantes e outorgas (DateDiff contra Now())",
    recommendation: "Arcade Runtime",
    rationale:
      "Garante precisão diária exata no instante de abertura do Web Map ou Dashboard sem depender de rotinas noturnas de atualização cadastral.",
  },
  {
    scenario:
      "Interseção geodésica sob demanda em 1 feição (clique no Pop-up ou coleta móvel no ArcGIS Field Maps)",
    recommendation: "Arcade Runtime",
    rationale:
      "Dispara consulta espacial indexada para um único polígono/ponto contra bases oficiais vivas (TIs, UCs, Ottobacias ANA).",
  },
  {
    scenario:
      "Agregação cruzada de duas camadas independentes do Portal já resumidas por UF ou Bacia (< 2.000 grupos)",
    recommendation: "Arcade Runtime",
    rationale:
      "Data Expression com GroupBy() server-side + Hash Join O(N+M) em memória resolve painéis executivos sem criar camadas intermediárias duplicadas.",
  },
  {
    scenario:
      "Simbologia de mapa exigindo Intersects() polígono-a-polígono em camadas com > 5.000 feições simultâneas",
    recommendation: "ETL Python / PostGIS",
    rationale:
      "Chamar FeatureSet dentro do perfil Visualization multiplica requisições REST por feição visível; deve ser pré-calculado com índices GiST no PostGIS/GeoPandas.",
  },
  {
    scenario:
      "Séries históricas decenais multi-fontes, estatística não-paramétrica (Spearman) e geração de Vector Tiles (.pbf)",
    recommendation: "ETL Python / PostGIS",
    rationale:
      "Modelagem dimensional, junções pesadas e entrega vetorial ST_AsMVT pertencem a um pipeline reprodutível de engenharia de dados espaciais.",
  },
];

export const ArchitectureMatrix: React.FC = () => {
  return (
    <section id="arquitetura" className="arch-section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">03 · Engenharia de Performance & Arquitetura Esri</div>
          <h2 className="section-title">
            Quando usar Arcade em Tempo de Execução vs. Pré-processamento ETL / PostGIS
          </h2>
          <p className="section-lead">
            Expressões Arcade são poderosas, mas não substituem bancos espaciais em cargas analíticas
            massivas. Abaixo estão as diretrizes arquiteturais aplicadas nos snippets deste repositório
            para manter <em>Web Maps</em> e <em>ArcGIS Dashboards</em> responsivos em produção.
          </p>
        </div>

        <div className="pillars-grid">
          <article className="pillar-card">
            <span className="mono-label">Regra 01 · Precisão Cartográfica</span>
            <h3>Geodésia Obrigatória no Território Brasileiro</h3>
            <p>
              Mapas base em Web Mercator (<code>EPSG:3857</code>) distorcem áreas em até{" "}
              <strong className="ink-terra">+13% a +38%</strong> nas latitudes do Cerrado, Sudeste e Sul.
              Todas as rotinas métricas deste toolkit utilizam estritamente{" "}
              <code>AreaGeodetic()</code>, <code>BufferGeodetic()</code> e{" "}
              <code>DistanceGeodetic()</code>.
            </p>
          </article>

          <article className="pillar-card">
            <span className="mono-label">Regra 02 · Tráfego REST & SQL Pushdown</span>
            <h3>Filter() e Projeção de Colunas antes da Topologia</h3>
            <p>
              Chamadas a <code>FeatureSetByPortalItem()</code> declaram apenas os atributos estritamente
              necessários, omitem geometria (<code>includeGeometry = false</code>) em agregações tabulares
              e aplicam <code>Filter()</code> antes de <code>Intersects()</code>.
            </p>
          </article>

          <article className="pillar-card">
            <span className="mono-label">Regra 03 · Complexidade Algorítmica</span>
            <h3>Eliminação de Queries N+1 via Hash Join O(N + M)</h3>
            <p>
              Em <em>Data Expressions</em> que combinam duas camadas distintas do Portal, nunca se executa{" "}
              <code>Filter()</code> dentro de laços <code>for</code>. Ambas as fontes são resumidas via{" "}
              <code>GroupBy()</code> no servidor e unidas em memória por dicionário indexado.
            </p>
          </article>
        </div>

        <div className="matrix-table-wrap">
          <table className="arch-table">
            <thead>
              <tr>
                <th style={{ width: "36%" }}>Problema Técnico de Geoinformação</th>
                <th style={{ width: "18%" }}>Decisão Recomendada</th>
                <th>Justificativa de Engenharia</th>
              </tr>
            </thead>
            <tbody>
              {DECISION_ROWS.map((row, idx) => (
                <tr key={idx}>
                  <td className="arch-scenario">{row.scenario}</td>
                  <td>
                    <span
                      className={`arch-badge ${
                        row.recommendation === "Arcade Runtime" ? "arcade" : "postgis"
                      }`}
                    >
                      {row.recommendation}
                    </span>
                  </td>
                  <td className="arch-rationale">{row.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
