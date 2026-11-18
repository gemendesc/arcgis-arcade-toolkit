export type CategoryKey =
  | "todos"
  | "runtime-spatial"
  | "popups"
  | "symbology-labeling"
  | "dashboards";

export type SimulatorKind =
  | "runtime-alert"
  | "field-maps"
  | "popup-html"
  | "bivariate-3x3"
  | "license-semaphore"
  | "scale-labeling"
  | "dashboard-featureset"
  | "dashboard-indicator"
  | "dashboard-list";

export interface RuntimeAlertPreview {
  kind: "runtime-alert";
  tone: "critical" | "warning" | "ok";
  badge: string;
  headline: string;
  lines: string[];
  metrics: { label: string; value: string }[];
}

export interface FieldMapsPreview {
  kind: "field-maps";
  layerTitle: string;
  gpsAccuracy: string;
  calculatedHeader: string;
  fields: { label: string; value: string; auto?: boolean }[];
}

export interface PopupHtmlPreview {
  kind: "popup-html";
  layerTitle: string;
  featureTitle: string;
  html: string;
  omittedNullFields?: string[];
}

export interface BivariatePreview {
  kind: "bivariate-3x3";
  activeCode: string; // e.g. "C3", "B2", "A1"
  returnedLabel: string;
  xValueLabel: string;
  yValueLabel: string;
  featureName: string;
}

export interface SemaphorePreview {
  kind: "license-semaphore";
  activeStateCode: "01" | "02" | "03" | "04" | "05";
  returnedClass: string;
  daysRemainingLabel: string;
  conamaRuleNote: string;
  featureName: string;
}

export interface ScaleLabelPreview {
  kind: "scale-labeling";
  scaleDenominator: number;
  scaleLabel: string;
  zoomHint: string;
  features: {
    name: string;
    areaHa: number;
    renderedLabel: string; // "" means suppressed at current scale
  }[];
}

export interface DashboardFeatureSetPreview {
  kind: "dashboard-featureset";
  widgetTitle: string;
  executionNote: string;
  rows: {
    cod_bacia: string;
    nome_bacia: string;
    uf: string;
    desmatamento_ha: number;
    demanda_hidrica_hm3: number;
    num_outorgas: number;
    indice_pressao: number;
  }[];
}

export interface DashboardIndicatorPreview {
  kind: "dashboard-indicator";
  widgetTitle: string;
  topText: string;
  topTextColor: string;
  middleText: string;
  middleTextColor: string;
  bottomText: string;
  bottomTextColor: string;
  backgroundColor: string;
}

export interface DashboardListPreview {
  kind: "dashboard-list";
  widgetTitle: string;
  selectionSubtitle: string;
  items: {
    tituloItem: string;
    subtituloBacia: string;
    rotuloStatus: string;
    larguraPct: number;
    corBarra: string;
    corFundoTag: string;
    corTextoTag: string;
    metricaPrimaria: string;
    metricaSecundaria: string;
  }[];
}

export type ScenarioPreview =
  | RuntimeAlertPreview
  | FieldMapsPreview
  | PopupHtmlPreview
  | BivariatePreview
  | SemaphorePreview
  | ScaleLabelPreview
  | DashboardFeatureSetPreview
  | DashboardIndicatorPreview
  | DashboardListPreview;

export interface SimulationScenario {
  id: string;
  label: string;
  shortTag: string;
  inputContext: Record<string, unknown>;
  preview: ScenarioPreview;
}

export interface ArcadeSnippet {
  id: string;
  number: string;
  title: string;
  fileName: string;
  repoPath: string;
  category: Exclude<CategoryKey, "todos">;
  categoryLabel: string;
  profiles: string[];
  globalsUsed: string[];
  keyFunctions: string[];
  domainContext: string;
  summary: string;
  engineeringNote: string;
  complexity: "Leve O(1)" | "Indexada Espacial" | "Agregação Server-Side";
  code: string;
  scenarios: SimulationScenario[];
}
