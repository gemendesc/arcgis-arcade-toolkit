import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Layers,
  MapPin,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { ArcadeSnippet } from "../types";

interface LiveSimulatorProps {
  snippet: ArcadeSnippet;
}

const BIVARIATE_GRID: { code: string; color: string; label: string }[][] = [
  // Top row: C (Estresse Hídrico Crítico >= 70% Q95)
  [
    { code: "C1", color: "#4b83a6", label: "C1" },
    { code: "C2", color: "#5e5676", label: "C2" },
    { code: "C3", color: "#7a2e2e", label: "C3" },
  ],
  // Middle row: B (Atenção Hídrica 30–70% Q95)
  [
    { code: "B1", color: "#8cb4c9", label: "B1" },
    { code: "B2", color: "#9c8f96", label: "B2" },
    { code: "B3", color: "#b85d43", label: "B3" },
  ],
  // Bottom row: A (Conforto Hídrico < 30% Q95)
  [
    { code: "A1", color: "#dce6ec", label: "A1" },
    { code: "A2", color: "#e5bdb0", label: "A2" },
    { code: "A3", color: "#e4572e", label: "A3" },
  ],
];

const SEMAPHORE_STATES: {
  code: "01" | "02" | "03" | "04" | "05";
  color: string;
  label: string;
}[] = [
  { code: "01", color: "#b83b1d", label: "01 · Vencida sem Renovação Tempestiva / Embargada" },
  { code: "02", color: "#e4572e", label: "02 · Crítico (<= 30d) ou Urgente (< 120d s/ protocolo)" },
  { code: "03", color: "#24506b", label: "03 · Prorrogada Automaticamente (CONAMA 237/97 §4º)" },
  { code: "04", color: "#c98a2c", label: "04 · Em Renovação / Planejar Renovação (120 a 180d)" },
  { code: "05", color: "#2d6a4f", label: "05 · Vigente Regular (> 180 dias)" },
];

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({ snippet }) => {
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [showJson, setShowJson] = useState<boolean>(false);

  const safeIdx = scenarioIdx < snippet.scenarios.length ? scenarioIdx : 0;
  const activeScenario = snippet.scenarios[safeIdx];
  const { preview } = activeScenario;

  return (
    <div className="simulator-panel">
      <div className="simulator-header">
        <div className="simulator-title-row">
          <span className="simulator-badge">
            <Sparkles size={12} />
            Simulador de Retorno ArcGIS
          </span>
          <span className="mono-meta">
            Variáveis: {snippet.globalsUsed.join(", ")}
          </span>
        </div>

        <div className="scenario-tabs" role="tablist" aria-label="Cenários de teste">
          {snippet.scenarios.map((sc, idx) => (
            <button
              key={sc.id}
              type="button"
              role="tab"
              aria-selected={idx === safeIdx}
              className={`scenario-tab ${idx === safeIdx ? "active" : ""}`}
              onClick={() => setScenarioIdx(idx)}
            >
              <span className="scenario-tab-title">{sc.label}</span>
              <span className="scenario-tab-tag">{sc.shortTag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Superfície de Renderização segundo o Perfil Arcade */}
      <div className="simulator-stage">
        {preview.kind === "runtime-alert" && (
          <div className={`arcgis-card runtime-card tone-${preview.tone}`}>
            <div className="arcgis-window-bar">
              <span>ArcGIS Map Viewer · Atributo Calculado em Tempo de Execução</span>
              <span className={`status-pill tone-${preview.tone}`}>{preview.badge}</span>
            </div>
            <div className="runtime-body">
              <p className="runtime-headline">{preview.headline}</p>
              <ul className="runtime-lines">
                {preview.lines.map((ln, i) => (
                  <li key={i}>{ln}</li>
                ))}
              </ul>
              <div className="runtime-metrics">
                {preview.metrics.map((m, i) => (
                  <div key={i} className="runtime-metric-box">
                    <span className="mono-label">{m.label}</span>
                    <strong>{m.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {preview.kind === "field-maps" && (
          <div className="arcgis-card fieldmaps-card">
            <div className="arcgis-window-bar dark">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Smartphone size={13} />
                ArcGIS Field Maps · {preview.layerTitle}
              </span>
              <span className="gps-pill">{preview.gpsAccuracy}</span>
            </div>
            <div className="fieldmaps-body">
              <div className="fieldmaps-synth">
                <span className="mono-label">Retorno Consolidado da Expressão</span>
                <code>{preview.calculatedHeader}</code>
              </div>
              <div className="fieldmaps-grid">
                {preview.fields.map((f, i) => (
                  <div key={i} className="fieldmaps-input-row">
                    <div className="fieldmaps-label-line">
                      <span>{f.label}</span>
                      {f.auto && <span className="auto-calc-tag">Arcade Auto</span>}
                    </div>
                    <div className="fieldmaps-value-box">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {preview.kind === "popup-html" && (
          <div className="arcgis-card popup-chrome">
            <div className="arcgis-window-bar">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <Layers size={13} />
                {preview.layerTitle}
              </span>
              <span className="mono-meta">{preview.featureTitle}</span>
            </div>
            <div
              className="popup-rendered-html"
              dangerouslySetInnerHTML={{ __html: preview.html }}
            />
            {preview.omittedNullFields && preview.omittedNullFields.length > 0 && (
              <div className="popup-null-footnote">
                <strong>Higiene de dados ativa:</strong>{" "}
                {preview.omittedNullFields.join(" · ")}
              </div>
            )}
          </div>
        )}

        {preview.kind === "bivariate-3x3" && (
          <div className="arcgis-card bivariate-sim-card">
            <div className="arcgis-window-bar">
              <span>ArcGIS Symbology · Unique Values (Matriz Bivariada 3×3)</span>
              <span className="mono-meta">{preview.featureName}</span>
            </div>
            <div className="bivariate-sim-body">
              <div className="bivariate-matrix-wrap">
                <div className="biv-axis-y">↑ Q95 ANA</div>
                <div>
                  <div className="bivariate-grid-3x3">
                    {BIVARIATE_GRID.flat().map((cell) => {
                      const isActive = cell.code === preview.activeCode;
                      return (
                        <div
                          key={cell.code}
                          className={`biv-cell ${isActive ? "active" : ""}`}
                          style={{ backgroundColor: cell.color }}
                          title={cell.code}
                        >
                          <span>{cell.label}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="biv-axis-x">Conversão Antrópica (%) →</div>
                </div>
              </div>

              <div className="bivariate-sim-details">
                <span className="mono-label">Classe Retornada para o Renderizador</span>
                <div className="biv-returned-box">{preview.returnedLabel}</div>
                <div className="biv-inputs-pair">
                  <div>
                    <span className="mono-label">Eixo X (Uso do Solo)</span>
                    <strong>{preview.xValueLabel}</strong>
                  </div>
                  <div>
                    <span className="mono-label">Eixo Y (Pressão Hídrica)</span>
                    <strong>{preview.yValueLabel}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {preview.kind === "license-semaphore" && (
          <div className="arcgis-card semaphore-card">
            <div className="arcgis-window-bar">
              <span>Simbologia Operacional · Controle Jurídico CONAMA 237/97</span>
              <span className="mono-meta">{preview.featureName}</span>
            </div>
            <div className="semaphore-body">
              <div className="semaphore-list">
                {SEMAPHORE_STATES.map((st) => {
                  const active = st.code === preview.activeStateCode;
                  return (
                    <div
                      key={st.code}
                      className={`semaphore-row ${active ? "active" : ""}`}
                    >
                      <span
                        className="semaphore-dot"
                        style={{ backgroundColor: st.color }}
                      />
                      <span className="semaphore-label">{st.label}</span>
                      {active && <span className="semaphore-active-tag">ATIVO</span>}
                    </div>
                  );
                })}
              </div>
              <div className="semaphore-note-box">
                <div className="semaphore-days">{preview.daysRemainingLabel}</div>
                <p>{preview.conamaRuleNote}</p>
              </div>
            </div>
          </div>
        )}

        {preview.kind === "scale-labeling" && (
          <div className="arcgis-card scale-card">
            <div className="arcgis-window-bar">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <SlidersHorizontal size={13} />
                Canvas Cartográfico · Escala Atual ($view.scale = {preview.scaleLabel})
              </span>
              <span className="mono-meta">{preview.zoomHint}</span>
            </div>
            <div className="scale-canvas">
              {preview.features.map((feat, idx) => (
                <div key={idx} className="scale-feature-item">
                  <div className="scale-polygon-mock">
                    <MapPin size={13} />
                    <span className="scale-orig-name">
                      {feat.name} ({feat.areaHa.toLocaleString("pt-BR")} ha)
                    </span>
                  </div>
                  {feat.renderedLabel ? (
                    <pre className="map-halo-label">{feat.renderedLabel}</pre>
                  ) : (
                    <span className="suppressed-label-pill">
                      Rótulo suprimido nesta escala (&quot;&quot;)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {preview.kind === "dashboard-featureset" && (
          <div className="arcgis-card dashboard-fs-card">
            <div className="arcgis-window-bar dark">
              <span>ArcGIS Dashboards · {preview.widgetTitle}</span>
              <span className="gps-pill">Hash Join O(N + M)</span>
            </div>
            <div className="dashboard-fs-note">{preview.executionNote}</div>
            <div className="dashboard-table-wrap">
              <table className="dashboard-fs-table">
                <thead>
                  <tr>
                    <th>Bacia</th>
                    <th>Sub-bacia / UF</th>
                    <th style={{ textAlign: "right" }}>Supressão (ha)</th>
                    <th style={{ textAlign: "right" }}>Outorga (hm³)</th>
                    <th style={{ width: "26%" }}>Índice Pressão</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((r) => (
                    <tr key={r.cod_bacia}>
                      <td className="mono-cell">{r.cod_bacia}</td>
                      <td>
                        <strong>{r.nome_bacia}</strong>{" "}
                        <span className="uf-mini">{r.uf}</span>
                      </td>
                      <td className="mono-cell" style={{ textAlign: "right" }}>
                        {r.desmatamento_ha.toLocaleString("pt-BR", {
                          minimumFractionDigits: 1,
                        })}
                      </td>
                      <td className="mono-cell" style={{ textAlign: "right" }}>
                        {r.demanda_hidrica_hm3.toLocaleString("pt-BR", {
                          minimumFractionDigits: 1,
                        })}
                      </td>
                      <td>
                        <div className="fs-score-cell">
                          <div className="fs-score-track">
                            <div
                              className="fs-score-fill"
                              style={{
                                width: `${Math.min(r.indice_pressao, 100)}%`,
                                backgroundColor:
                                  r.indice_pressao >= 80 ? "#e4572e" : "#24506b",
                              }}
                            />
                          </div>
                          <span className="mono-cell">
                            {r.indice_pressao.toFixed(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {preview.kind === "dashboard-indicator" && (
          <div className="arcgis-card dashboard-kpi-wrap">
            <div className="arcgis-window-bar dark">
              <span>ArcGIS Dashboards · Widget Indicator</span>
              <span className="gps-pill">{preview.widgetTitle}</span>
            </div>
            <div
              className="dashboard-kpi-surface"
              style={{ backgroundColor: preview.backgroundColor }}
            >
              <div
                className="kpi-top-text"
                style={{ color: preview.topTextColor }}
              >
                {preview.topText}
              </div>
              <div
                className="kpi-middle-text"
                style={{ color: preview.middleTextColor }}
              >
                {preview.middleText}
              </div>
              <div
                className="kpi-bottom-text"
                style={{ color: preview.bottomTextColor }}
              >
                {preview.bottomText}
              </div>
            </div>
          </div>
        )}

        {preview.kind === "dashboard-list" && (
          <div className="arcgis-card dashboard-list-wrap">
            <div className="arcgis-window-bar dark">
              <span>ArcGIS Dashboards · Widget List (Advanced Formatting)</span>
              <span className="gps-pill">{preview.selectionSubtitle}</span>
            </div>
            <div className="dashboard-list-items">
              {preview.items.map((it, idx) => (
                <div
                  key={idx}
                  className="dash-list-card"
                  style={{ borderLeftColor: it.corBarra }}
                >
                  <div className="dash-list-top">
                    <strong>{it.tituloItem}</strong>
                    <span
                      className="dash-list-tag"
                      style={{
                        backgroundColor: it.corFundoTag,
                        color: it.corTextoTag,
                      }}
                    >
                      {it.rotuloStatus}
                    </span>
                  </div>
                  <div className="dash-list-sub">{it.subtituloBacia}</div>
                  <div className="dash-list-bar-bg">
                    <div
                      className="dash-list-bar-fill"
                      style={{
                        width: `${it.larguraPct}%`,
                        backgroundColor: it.corBarra,
                      }}
                    />
                  </div>
                  <div className="dash-list-metrics">
                    <span>
                      Supressão: <b>{it.metricaPrimaria}</b>
                    </span>
                    <span>
                      Demanda Hídrica: <b>{it.metricaSecundaria}</b>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Inspetor de Atributos de Entrada ($feature / $datapoint) */}
      <div className="simulator-inspector">
        <button
          type="button"
          className="inspector-toggle"
          onClick={() => setShowJson((prev) => !prev)}
        >
          <span>
            Inspecionar dicionário de entrada simulado (
            {snippet.globalsUsed.join(", ")})
          </span>
          {showJson ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {showJson && (
          <pre className="inspector-json">
            {JSON.stringify(activeScenario.inputContext, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
