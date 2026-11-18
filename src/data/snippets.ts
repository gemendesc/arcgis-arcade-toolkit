import type { ArcadeSnippet, CategoryKey } from "../types";

import raw01 from "../../expressions/runtime-spatial/01-sobreposicao-uc-ti.arcade?raw";
import raw02 from "../../expressions/runtime-spatial/02-conformidade-app-hidrografia.arcade?raw";
import raw03 from "../../expressions/runtime-spatial/03-autopreenchimento-campo-ottobacias.arcade?raw";
import raw04 from "../../expressions/popups/04-ficha-executiva-socioambiental.arcade?raw";
import raw05 from "../../expressions/popups/05-sparkline-svg-desmatamento-prodes.arcade?raw";
import raw06 from "../../expressions/popups/06-central-links-contextuais-webgis.arcade?raw";
import raw07 from "../../expressions/symbology-labeling/07-matriz-bivariada-pressao-hidrica.arcade?raw";
import raw08 from "../../expressions/symbology-labeling/08-semaforo-vigencia-licencas-outorgas.arcade?raw";
import raw09 from "../../expressions/symbology-labeling/09-rotulos-adaptativos-escala.arcade?raw";
import raw10 from "../../expressions/dashboards/10-data-expression-ranking-bacias-uf.arcade?raw";
import raw11 from "../../expressions/dashboards/11-indicador-kpi-variacao-anual-yoy.arcade?raw";
import raw12 from "../../expressions/dashboards/12-lista-avancada-cards-monitoramento.arcade?raw";

export const CATEGORY_META: Record<
  CategoryKey,
  { label: string; shortLabel: string; description: string }
> = {
  todos: {
    label: "Todas as Expressões (12)",
    shortLabel: "Todas (12)",
    description:
      "Visão completa das 12 expressões reutilizáveis cobrindo análise espacial geodésica, pop-ups HTML/SVG, cartografia condicional e ArcGIS Dashboards.",
  },
  "runtime-spatial": {
    label: "01 · Análise Espacial & Campo",
    shortLabel: "Espacial & Campo",
    description:
      "Cruzamentos topológicos sob demanda (Intersects, Intersection, BufferGeodetic, AreaGeodetic) e autopreenchimento inteligente no ArcGIS Field Maps.",
  },
  popups: {
    label: "02 · Pop-ups Dinâmicos (HTML/SVG)",
    shortLabel: "Pop-ups HTML/SVG",
    description:
      "Fichas socioambientais responsivas com omissão de campos nulos, gráficos embutidos em SVG puro e botões de deep-link parametrizados.",
  },
  "symbology-labeling": {
    label: "03 · Simbologia & Rotulagem",
    shortLabel: "Simbologia & Rótulos",
    description:
      "Matrizes coropléticas bivariadas 3×3, semáforos jurídicos de licenças/outorgas (CONAMA 237/97) e rótulos adaptativos por escala ($view.scale).",
  },
  dashboards: {
    label: "04 · ArcGIS Dashboards & KPIs",
    shortLabel: "ArcGIS Dashboards",
    description:
      "Data Expressions com Hash Join O(N+M) entre camadas distintas, indicadores executivos com variação homóloga (YoY) e cards avançados para Listas.",
  },
};

export const SNIPPETS: ArcadeSnippet[] = [
  {
    id: "sobreposicao-uc-ti",
    number: "01",
    title: "Sobreposição Geodésica com Terras Indígenas e Unidades de Conservação",
    fileName: "01-sobreposicao-uc-ti.arcade",
    repoPath: "expressions/runtime-spatial/01-sobreposicao-uc-ti.arcade",
    category: "runtime-spatial",
    categoryLabel: "Análise Espacial & Campo",
    profiles: ["Popup", "Attribute Rule", "Field Calculation"],
    globalsUsed: ["$feature"],
    keyFunctions: [
      "FeatureSetByPortalItem",
      "Filter",
      "Intersects",
      "Intersection",
      "AreaGeodetic",
    ],
    domainContext: "Licenciamento Ambiental · Monitoramento de Petróleo, Energia & Mineração (FUNAI / ICMBio)",
    summary:
      "Cruza em tempo de execução o polígono do ativo analisado contra os Feature Services oficiais de Terras Indígenas e Unidades de Conservação, computando o recorte geométrico exato (ha) e a proporção sobreposta.",
    engineeringNote:
      "Aplica Filter() antes de Intersects() para pushdown SQL no Feature Service e utiliza AreaGeodetic(..., 'hectares') para neutralizar distorções de projeção Web Mercator (EPSG:3857).",
    complexity: "Indexada Espacial",
    code: raw01,
    scenarios: [
      {
        id: "bloco-solimoes",
        label: "Bloco Onshore Solimões (AM)",
        shortTag: "Crítico · TI + UC",
        inputContext: {
          codigo_ativo: "BM-SOL-14",
          tipologia: "Bloco Exploratório Onshore",
          area_geodesica_ha: 48250.0,
          spatialReference: "EPSG:3857 (Web Mercator)",
        },
        preview: {
          kind: "runtime-alert",
          tone: "critical",
          badge: "ALERTA CRÍTICO · 2 SOBREPOSIÇÕES",
          headline:
            "ALERTA CRÍTICO — 2 sobreposição(ões) detectada(s) | Soma bruta: 14.892,40 ha (30,9% do ativo)",
          lines: [
            "• [TI - Homologada] TI Vale do Rio Biá: 11.420,15 ha (23,7%)",
            "• [UC - Uso Sustentável] RESEX Médio Juruá: 3.472,25 ha (7,2%)",
          ],
          metrics: [
            { label: "Área Geodésica Avaliada", value: "48.250,0 ha" },
            { label: "Área Restrita Interceptada", value: "14.892,40 ha" },
            { label: "Comprometimento Territorial", value: "30,9%" },
          ],
        },
      },
      {
        id: "lt-cerrado",
        label: "Faixa de Servidão LT 500 kV (TO)",
        shortTag: "Atenção · APA",
        inputContext: {
          codigo_ativo: "LT-500-MIRACEMA",
          tipologia: "Linha de Transmissão (Faixa 60 m)",
          area_geodesica_ha: 1640.5,
          spatialReference: "EPSG:4674 (SIRGAS 2000)",
        },
        preview: {
          kind: "runtime-alert",
          tone: "warning",
          badge: "INTERSEÇÃO EM APA · USO SUSTENTÁVEL",
          headline:
            "ALERTA CRÍTICO — 1 sobreposição(ões) detectada(s) | Soma bruta: 218,60 ha (13,3% do ativo)",
          lines: [
            "• [UC - Uso Sustentável] APA Serra do Lajeado: 218,60 ha (13,3%)",
          ],
          metrics: [
            { label: "Área Geodésica Avaliada", value: "1.640,5 ha" },
            { label: "Área em UC Interceptada", value: "218,60 ha" },
            { label: "Comprometimento Territorial", value: "13,3%" },
          ],
        },
      },
      {
        id: "ufv-caatinga",
        label: "Complexo Fotovoltaico (PI)",
        shortTag: "Conforme · 0%",
        inputContext: {
          codigo_ativo: "UFV-SERTAO-08",
          tipologia: "Geração Solar Centralizada",
          area_geodesica_ha: 920.0,
          spatialReference: "EPSG:3857 (Web Mercator)",
        },
        preview: {
          kind: "runtime-alert",
          tone: "ok",
          badge: "REGULAR · SEM SOBREPOSIÇÃO",
          headline:
            "CONFORME — Nenhuma sobreposição direta com TIs ou UCs (920,0 ha avaliados).",
          lines: [
            "Nenhuma geometria ativa da FUNAI ou do CNUC interceptou o polígono consultado.",
          ],
          metrics: [
            { label: "Área Geodésica Avaliada", value: "920,0 ha" },
            { label: "Área Restrita Interceptada", value: "0,00 ha" },
            { label: "Status Ambiental", value: "Livre de TIs/UCs" },
          ],
        },
      },
    ],
  },
  {
    id: "conformidade-app-hidrografia",
    number: "02",
    title: "Distância Geodésica a Recursos Hídricos e Checagem de Faixa de APP",
    fileName: "02-conformidade-app-hidrografia.arcade",
    repoPath: "expressions/runtime-spatial/02-conformidade-app-hidrografia.arcade",
    category: "runtime-spatial",
    categoryLabel: "Análise Espacial & Campo",
    profiles: ["Popup", "Field Maps Calculated Expression"],
    globalsUsed: ["$feature", "$map"],
    keyFunctions: ["BufferGeodetic", "Intersects", "DistanceGeodetic", "When"],
    domainContext: "Código Florestal (Lei nº 12.651/2012, Art. 4º) · Recursos Hídricos (ANA)",
    summary:
      "Gera um raio geodésico de busca de 600 m a partir de uma intervenção, identifica o curso d'água mais próximo e confronta a distância medida com a faixa marginal legal exigida conforme a largura do rio (30 m a 500 m).",
    engineeringNote:
      "Restringe espacialmente a busca com BufferGeodetic(geom, 600, 'meters') antes do loop, reduzindo drasticamente o número de vértices hidrográficos processados no dispositivo.",
    complexity: "Indexada Espacial",
    code: raw02,
    scenarios: [
      {
        id: "conflito-app-50m",
        label: "Canteiro de Obras em Rio de 28 m",
        shortTag: "Conflito APP",
        inputContext: {
          intervencao: "Praça de Apoio Logístico KM 42",
          rio_mais_proximo: "Rio das Velhas",
          largura_m: 28,
          distancia_medida_m: 31.4,
        },
        preview: {
          kind: "runtime-alert",
          tone: "critical",
          badge: "CONFLITO DE APP · LEI 12.651/2012",
          headline:
            "CONFLITO DE APP — Intervenção a 31,4 m de Rio das Velhas (largura: 28 m | APP exigida: 50 m | déficit: 18,6 m).",
          lines: [
            "Calha regular entre 10 m e 50 m exige recuo marginal mínimo de 50 metros (Art. 4º, I, 'b').",
          ],
          metrics: [
            { label: "Distância Geodésica", value: "31,4 m" },
            { label: "Faixa Legal Exigida", value: "50 m (rio 10–50 m)" },
            { label: "Déficit de Recuo", value: "-18,6 m" },
          ],
        },
      },
      {
        id: "conforme-corrego",
        label: "Subestação próxima a Córrego (<10 m)",
        shortTag: "Conforme (+14,8 m)",
        inputContext: {
          intervencao: "Subestação Coletora 138 kV",
          rio_mais_proximo: "Córrego Taquaraçu",
          largura_m: 6,
          distancia_medida_m: 44.8,
        },
        preview: {
          kind: "runtime-alert",
          tone: "ok",
          badge: "RECUO RESPEITADO · FORA DE APP",
          headline:
            "CONFORME — A 44,8 m de Córrego Taquaraçu (APP mínima: 30 m | folga: +14,8 m).",
          lines: [
            "Cursos d'água naturais com menos de 10 m de largura exigem faixa marginal de 30 metros.",
          ],
          metrics: [
            { label: "Distância Geodésica", value: "44,8 m" },
            { label: "Faixa Legal Exigida", value: "30 m (rio < 10 m)" },
            { label: "Margem de Segurança", value: "+14,8 m" },
          ],
        },
      },
      {
        id: "rio-grande-porte",
        label: "Captação Industrial em Rio > 200 m",
        shortTag: "Conflito (APP 200 m)",
        inputContext: {
          intervencao: " Pátio de Bombeamento Auxiliar",
          rio_mais_proximo: "Rio Tocantins",
          largura_m: 340,
          distancia_medida_m: 142.0,
        },
        preview: {
          kind: "runtime-alert",
          tone: "critical",
          badge: "CONFLITO DE APP · GRANDE CURSO D'ÁGUA",
          headline:
            "CONFLITO DE APP — Intervenção a 142,0 m de Rio Tocantins (largura: 340 m | APP exigida: 200 m | déficit: 58,0 m).",
          lines: [
            "Rios com largura de 200 m a 600 m exigem APP de 200 m; exige autorização específica de utilidade pública/interesse social.",
          ],
          metrics: [
            { label: "Distância Geodésica", value: "142,0 m" },
            { label: "Faixa Legal Exigida", value: "200 m (rio 200–600 m)" },
            { label: "Déficit de Recuo", value: "-58,0 m" },
          ],
        },
      },
    ],
  },
  {
    id: "autopreenchimento-campo-ottobacias",
    number: "03",
    title: "Autopreenchimento Territorial em Campo (Município, Ottobacia e GMS)",
    fileName: "03-autopreenchimento-campo-ottobacias.arcade",
    repoPath: "expressions/runtime-spatial/03-autopreenchimento-campo-ottobacias.arcade",
    category: "runtime-spatial",
    categoryLabel: "Análise Espacial & Campo",
    profiles: ["Field Maps (Calculated)", "Attribute Rules"],
    globalsUsed: ["$feature", "$map"],
    keyFunctions: ["Centroid", "First", "Intersects", "Floor", "Atan", "Exp"],
    domainContext: "Coleta de Dados em Campo · Hidrologia & Vistorias Técnicas (IBGE / ANA)",
    summary:
      "Preenche automaticamente no formulário do ArcGIS Field Maps o município/UF, o código IBGE, a Ottobacia Nível 5 da ANA e converte as coordenadas capturadas pelo GNSS para Graus, Minutos e Segundos (GMS).",
    engineeringNote:
      "Inclui desprojeção trigonométrica direta de EPSG:3857 para WGS84/SIRGAS 2000 e solicita includeGeometry = false nas camadas de referência para acelerar formulários móveis.",
    complexity: "Indexada Espacial",
    code: raw03,
    scenarios: [
      {
        id: "vistoria-mg",
        label: "Monitoramento Qualidade da Água (MG)",
        shortTag: "Juiz de Fora · Bacia Paraíba do Sul",
        inputContext: {
          spatialReference: { wkid: 3857 },
          x: -4827281.4,
          y: -2482914.2,
          modo_coleta: "GNSS RTK / Online",
        },
        preview: {
          kind: "field-maps",
          layerTitle: "Vistorias_Hidrologicas_2026",
          gpsAccuracy: "Precisão GNSS: ± 0,8 m · SIRGAS 2000",
          calculatedHeader:
            "Juiz de Fora/MG (IBGE 3136702) | Rio Paraibuna [Otto 86294] | Coord: 21°45'38.4\"S  43°21'50.1\"W",
          fields: [
            { label: "Município / UF (Auto)", value: "Juiz de Fora/MG (3136702)", auto: true },
            { label: "Ottobacia ANA Nível 5 (Auto)", value: "Rio Paraibuna [Otto 86294]", auto: true },
            { label: "Coordenada Laudo GMS (Auto)", value: "21°45'38.4\"S  43°21'50.1\"W", auto: true },
            { label: "Responsável Técnico", value: "Equipe Geociências / Campo", auto: false },
          ],
        },
      },
      {
        id: "vistoria-urucuia",
        label: "Inspeção de Outorga Oeste da Bahia (BA)",
        shortTag: "São Desidério · Aquífero Urucuia",
        inputContext: {
          spatialReference: { wkid: 4674 },
          x: -45.9752,
          y: -12.3584,
          modo_coleta: "Pacote Offline (.mmpk)",
        },
        preview: {
          kind: "field-maps",
          layerTitle: "Fiscalizacao_Usos_Consuntivos",
          gpsAccuracy: "Precisão GNSS: ± 1,4 m · Mapa Offline (.mmpk)",
          calculatedHeader:
            "São Desidério/BA (IBGE 2928901) | Rio Grande Médio [Otto 74582] | Coord: 12°21'30.2\"S  45°58'30.7\"W",
          fields: [
            { label: "Município / UF (Auto)", value: "São Desidério/BA (2928901)", auto: true },
            { label: "Ottobacia ANA Nível 5 (Auto)", value: "Rio Grande Médio [Otto 74582]", auto: true },
            { label: "Coordenada Laudo GMS (Auto)", value: "12°21'30.2\"S  45°58'30.7\"W", auto: true },
            { label: "Tipo de Captação", value: "Barramento / Pivô Central", auto: false },
          ],
        },
      },
      {
        id: "vistoria-costeira",
        label: "Ponto Costeiro / Estuarino (PA)",
        shortTag: "Soure · Marajó",
        inputContext: {
          spatialReference: { wkid: 4326 },
          x: -48.5231,
          y: -0.7168,
          modo_coleta: "GNSS Embarcado",
        },
        preview: {
          kind: "field-maps",
          layerTitle: "Monitoramento_Zona_Costeira",
          gpsAccuracy: "Precisão GNSS: ± 2,1 m · Embarcação",
          calculatedHeader:
            "Soure/PA (IBGE 1507904) | Foz Amazonas / Marajó [Otto 49912] | Coord: 00°43'00.5\"S  48°31'23.2\"W",
          fields: [
            { label: "Município / UF (Auto)", value: "Soure/PA (1507904)", auto: true },
            { label: "Ottobacia ANA Nível 5 (Auto)", value: "Foz Amazonas / Marajó [Otto 49912]", auto: true },
            { label: "Coordenada Laudo GMS (Auto)", value: "00°43'00.5\"S  48°31'23.2\"W", auto: true },
            { label: "Sensibilidade Ambiental ISL", value: "ISL 10 — Manguezal", auto: false },
          ],
        },
      },
    ],
  },
  {
    id: "ficha-executiva-socioambiental",
    number: "04",
    title: "Ficha Técnica Socioambiental Responsiva com Ocultação de Nulos",
    fileName: "04-ficha-executiva-socioambiental.arcade",
    repoPath: "expressions/popups/04-ficha-executiva-socioambiental.arcade",
    category: "popups",
    categoryLabel: "Pop-ups Dinâmicos (HTML/SVG)",
    profiles: ["Popup Element (Text / HTML)"],
    globalsUsed: ["$feature"],
    keyFunctions: ["DefaultValue", "When", "IsEmpty", "Trim", "Text"],
    domainContext: "Observatórios Socioambientais · Transição Energética & Infraestrutura",
    summary:
      "Gera um card HTML editorial compatível com o sanitizador do ArcGIS Online, adaptando a faixa superior e o badge à criticidade do ativo e omitindo automaticamente atributos nulos ou zerados.",
    engineeringNote:
      "A função interna LinhaAtributo() elimina o problema clássico de pop-ups com dezenas de células em branco quando uma mesma camada armazena tipologias heterogêneas (ex.: blocos de petróleo sem MW vs. eólicas sem outorga hídrica).",
    complexity: "Leve O(1)",
    code: raw04,
    scenarios: [
      {
        id: "bloco-petroleo",
        label: "Bloco Onshore na Amazônia (Crítico)",
        shortTag: "Crítico · Sem Potência MW",
        inputContext: {
          nome_ativo: "Bloco Exploratório Solimões Oriental BM-SOL-14",
          tipologia: "Óleo & Gás Onshore",
          uf: "AM",
          grau_risco: "CRÍTICO",
          municipio_bacia: "Barcelos/AM · Bacia do Rio Negro",
          fase_licenca: "Licença Prévia em Análise (EIA/RIMA)",
          orgao_ambiental: "IBAMA / Dilic",
          potencia_mw: null,
          vazao_m3s: 0.42,
          dist_ti_km: 0,
          num_processo: "02001.008412/2024-19",
        },
        preview: {
          kind: "popup-html",
          layerTitle: "Ativos Monitorados — Transição Energética",
          featureTitle: "BM-SOL-14 (AM)",
          omittedNullFields: ["Potência Instalada (potencia_mw = null omitido automaticamente)"],
          html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;border:1px solid #cfd4d0;border-top:4px solid #b83b1d;background:#f6f7f5;border-radius:2px;overflow:hidden;">
            <div style="padding:10px 12px;background:#eceeeb;border-bottom:1px solid #cfd4d0;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <div>
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#646c72;font-weight:700;">Óleo &amp; Gás Onshore · AM</div>
                <div style="font-size:14.5px;font-weight:800;color:#1e2328;margin-top:2px;line-height:1.2;">Bloco Exploratório Solimões Oriental BM-SOL-14</div>
              </div>
              <span style="background:#fbeae5;color:#b83b1d;border:1px solid #b83b1d;padding:2px 7px;font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;">CRÍTICO</span>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;width:44%;">Município / Bacia</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">Barcelos/AM · Bacia do Rio Negro</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Fase de Licenciamento</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">Licença Prévia em Análise (EIA/RIMA)</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Órgão Licenciador</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">IBAMA / Dilic</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Outorga Hídrica (ANA)</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">0,42 m³/s</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Distância à TI mais próxima</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#b83b1d;font-size:12.5px;font-weight:700;text-align:right;">SOBREPOSIÇÃO DIRETA (0,0 km)</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Processo Administrativo</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12px;font-family:monospace;font-weight:600;text-align:right;">02001.008412/2024-19</td></tr>
            </table>
          </div>`,
        },
      },
      {
        id: "complexo-eolico",
        label: "Complexo Eólico-Solar (Moderado)",
        shortTag: "Moderado · Sem Outorga Hídrica",
        inputContext: {
          nome_ativo: "Complexo Híbrido Eólico-Solar Sertão Setentrional",
          tipologia: "Geração Renovável 500 kV",
          uf: "RN",
          grau_risco: "MODERADO",
          municipio_bacia: "Macau/RN · Bacia Piranhas-Açu",
          fase_licenca: "Licença de Instalação (LI)",
          orgao_ambiental: "IDEMA-RN",
          potencia_mw: 412.5,
          vazao_m3s: null,
          dist_ti_km: 92.4,
          num_processo: null,
        },
        preview: {
          kind: "popup-html",
          layerTitle: "Ativos Monitorados — Transição Energética",
          featureTitle: "MON-ENE-003 (RN)",
          omittedNullFields: [
            "Outorga Hídrica (vazao_m3s = null)",
            "Processo Administrativo (num_processo = null)",
          ],
          html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;border:1px solid #cfd4d0;border-top:4px solid #24506b;background:#f6f7f5;border-radius:2px;overflow:hidden;">
            <div style="padding:10px 12px;background:#eceeeb;border-bottom:1px solid #cfd4d0;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <div>
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#646c72;font-weight:700;">Geração Renovável 500 kV · RN</div>
                <div style="font-size:14.5px;font-weight:800;color:#1e2328;margin-top:2px;line-height:1.2;">Complexo Híbrido Eólico-Solar Sertão Setentrional</div>
              </div>
              <span style="background:#dce6ec;color:#24506b;border:1px solid #24506b;padding:2px 7px;font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;">MODERADO</span>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;width:44%;">Município / Bacia</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">Macau/RN · Bacia Piranhas-Açu</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Fase de Licenciamento</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">Licença de Instalação (LI)</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Órgão Licenciador</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">IDEMA-RN</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Potência Instalada</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:700;text-align:right;">412,5 MW</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Distância à TI mais próxima</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">92,4 km</td></tr>
            </table>
          </div>`,
        },
      },
      {
        id: "estacao-monitoramento",
        label: "Estação Fluviométrica Restaurada (Baixo)",
        shortTag: "Baixo Risco · Regular",
        inputContext: {
          nome_ativo: "Núcleo de Restauração Ciliar Alto Rio Doce",
          tipologia: "Recuperação Hidroambiental",
          uf: "MG",
          grau_risco: "BAIXO",
          municipio_bacia: "Mariana/MG · Bacia do Rio Doce",
          fase_licenca: "Termo de Compromisso Vigente",
          orgao_ambiental: "SEMAD-MG / IGAM",
          potencia_mw: null,
          vazao_m3s: null,
          dist_ti_km: 34.2,
          num_processo: "1370.01.0004912/2025",
        },
        preview: {
          kind: "popup-html",
          layerTitle: "Projetos de Conservação & Recursos Hídricos",
          featureTitle: "REST-DOCE-09 (MG)",
          omittedNullFields: [
            "Potência Instalada (potencia_mw = null)",
            "Outorga Hídrica (vazao_m3s = null)",
          ],
          html: `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;border:1px solid #cfd4d0;border-top:4px solid #2d6a4f;background:#f6f7f5;border-radius:2px;overflow:hidden;">
            <div style="padding:10px 12px;background:#eceeeb;border-bottom:1px solid #cfd4d0;display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
              <div>
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:#646c72;font-weight:700;">Recuperação Hidroambiental · MG</div>
                <div style="font-size:14.5px;font-weight:800;color:#1e2328;margin-top:2px;line-height:1.2;">Núcleo de Restauração Ciliar Alto Rio Doce</div>
              </div>
              <span style="background:#e6f2ec;color:#2d6a4f;border:1px solid #2d6a4f;padding:2px 7px;font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;">BAIXO</span>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;width:44%;">Município / Bacia</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">Mariana/MG · Bacia do Rio Doce</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Fase de Licenciamento</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">Termo de Compromisso Vigente</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Órgão Licenciador</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">SEMAD-MG / IGAM</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Distância à TI mais próxima</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12.5px;font-weight:600;text-align:right;">34,2 km</td></tr>
              <tr><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#646c72;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Processo Administrativo</td><td style="padding:6px 10px;border-bottom:1px solid #e3e6e2;color:#1e2328;font-size:12px;font-family:monospace;font-weight:600;text-align:right;">1370.01.0004912/2025</td></tr>
            </table>
          </div>`,
        },
      },
    ],
  },
  {
    id: "sparkline-svg-desmatamento-prodes",
    number: "05",
    title: "Gráfico Embutido em SVG Inline — Série PRODES e Balanço de Cobertura",
    fileName: "05-sparkline-svg-desmatamento-prodes.arcade",
    repoPath: "expressions/popups/05-sparkline-svg-desmatamento-prodes.arcade",
    category: "popups",
    categoryLabel: "Pop-ups Dinâmicos (HTML/SVG)",
    profiles: ["Popup Element (Text / HTML + SVG)"],
    globalsUsed: ["$feature"],
    keyFunctions: ["Max", "Sum", "Constrain", "Round", "Text"],
    domainContext: "Sensoriamento Remoto · PRODES/INPE & MapBiomas",
    summary:
      "Constrói em tempo de execução um gráfico de colunas em SVG vetorial puro (2019–2024) acoplado a uma barra empilhada de cobertura do solo, renderizando instantaneamente ao clicar no município.",
    engineeringNote:
      "Evita carregar componentes pesados de gráficos nativos do Map Viewer, mantendo escala proporcional automática via Max(serie) e destacando o último ano em terracota (#e4572e).",
    complexity: "Leve O(1)",
    code: raw05,
    scenarios: [
      {
        id: "fronteira-matopiba",
        label: "São Desidério/BA (Fronteira MATOPIBA)",
        shortTag: "125,2 mil ha (6 anos)",
        inputContext: {
          nm_mun: "São Desidério - BA",
          desmat_2019_2024_ha: [14800, 16200, 19450, 24100, 27800, 22900],
          pct_veg_nativa: 38.2,
          pct_agropecuaria: 58.6,
        },
        preview: {
          kind: "popup-html",
          layerTitle: "Monitoramento Municipal PRODES + MapBiomas",
          featureTitle: "São Desidério / BA (2928901)",
          html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f6f7f5;border:1px solid #cfd4d0;padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
              <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#1e2328;">Supressão Vegetal Anual (ha)</strong>
              <span style="font-size:11px;font-family:monospace;color:#b83b1d;font-weight:700;">Acumulado: 125.250 ha</span>
            </div>
            <svg viewBox="0 0 280 86" width="100%" height="86" style="background:#eceeeb;border:1px solid #dcdfdc;display:block;margin-bottom:10px;">
              <line x1="6" y1="64" x2="274" y2="64" stroke="#b2b9b4" stroke-width="1" />
              <rect x="10" y="35.3" width="30" height="28.7" fill="#24506b" rx="1" /><text x="25" y="31.3" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">14.8k</text><text x="25" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2019</text>
              <rect x="55" y="32.5" width="30" height="31.5" fill="#24506b" rx="1" /><text x="70" y="28.5" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">16.2k</text><text x="70" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2020</text>
              <rect x="100" y="26.2" width="30" height="37.8" fill="#24506b" rx="1" /><text x="115" y="22.2" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">19.5k</text><text x="115" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2021</text>
              <rect x="145" y="17.2" width="30" height="46.8" fill="#24506b" rx="1" /><text x="160" y="13.2" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">24.1k</text><text x="160" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2022</text>
              <rect x="190" y="10" width="30" height="54" fill="#24506b" rx="1" /><text x="205" y="7.5" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">27.8k</text><text x="205" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2023</text>
              <rect x="235" y="19.5" width="30" height="44.5" fill="#e4572e" rx="1" /><text x="250" y="15.5" text-anchor="middle" font-size="8.5" fill="#b83b1d" font-weight="700" font-family="monospace">22.9k</text><text x="250" y="79" text-anchor="middle" font-size="9" fill="#1e2328" font-weight="700" font-family="monospace">2024</text>
            </svg>
            <div style="font-size:10.5px;color:#3d454b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Composição Territorial (MapBiomas)</div>
            <div style="display:flex;height:10px;width:100%;border-radius:1px;overflow:hidden;border:1px solid #b2b9b4;">
              <div style="width:38.2%;background:#2d6a4f;"></div>
              <div style="width:58.6%;background:#e4572e;"></div>
              <div style="width:3.2%;background:#9aa3a8;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:10.5px;color:#3d454b;margin-top:5px;font-family:monospace;">
              <span style="color:#2d6a4f;font-weight:700;">■ Nativa: 38,2%</span>
              <span style="color:#b83b1d;font-weight:700;">■ Agro: 58,6%</span>
              <span>■ Outros: 3,2%</span>
            </div>
          </div>`,
        },
      },
      {
        id: "arco-amz-pa",
        label: "Altamira/PA (Amazônia Oriental)",
        shortTag: "312,4 mil ha (Queda 2024)",
        inputContext: {
          nm_mun: "Altamira - PA",
          desmat_2019_2024_ha: [56900, 62400, 68100, 59300, 38400, 27300],
          pct_veg_nativa: 86.5,
          pct_agropecuaria: 11.4,
        },
        preview: {
          kind: "popup-html",
          layerTitle: "Monitoramento Municipal PRODES + MapBiomas",
          featureTitle: "Altamira / PA (1500602)",
          html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f6f7f5;border:1px solid #cfd4d0;padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
              <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#1e2328;">Supressão Vegetal Anual (ha)</strong>
              <span style="font-size:11px;font-family:monospace;color:#b83b1d;font-weight:700;">Acumulado: 312.400 ha</span>
            </div>
            <svg viewBox="0 0 280 86" width="100%" height="86" style="background:#eceeeb;border:1px solid #dcdfdc;display:block;margin-bottom:10px;">
              <line x1="6" y1="64" x2="274" y2="64" stroke="#b2b9b4" stroke-width="1" />
              <rect x="10" y="18.9" width="30" height="45.1" fill="#24506b" rx="1" /><text x="25" y="14.9" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">56.9k</text><text x="25" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2019</text>
              <rect x="55" y="14.5" width="30" height="49.5" fill="#24506b" rx="1" /><text x="70" y="10.5" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">62.4k</text><text x="70" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2020</text>
              <rect x="100" y="10" width="30" height="54" fill="#24506b" rx="1" /><text x="115" y="7.5" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">68.1k</text><text x="115" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2021</text>
              <rect x="145" y="17" width="30" height="47" fill="#24506b" rx="1" /><text x="160" y="13" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">59.3k</text><text x="160" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2022</text>
              <rect x="190" y="33.5" width="30" height="30.5" fill="#24506b" rx="1" /><text x="205" y="29.5" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">38.4k</text><text x="205" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2023</text>
              <rect x="235" y="42.4" width="30" height="21.6" fill="#e4572e" rx="1" /><text x="250" y="38.4" text-anchor="middle" font-size="8.5" fill="#b83b1d" font-weight="700" font-family="monospace">27.3k</text><text x="250" y="79" text-anchor="middle" font-size="9" fill="#1e2328" font-weight="700" font-family="monospace">2024</text>
            </svg>
            <div style="font-size:10.5px;color:#3d454b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Composição Territorial (MapBiomas)</div>
            <div style="display:flex;height:10px;width:100%;border-radius:1px;overflow:hidden;border:1px solid #b2b9b4;">
              <div style="width:86.5%;background:#2d6a4f;"></div>
              <div style="width:11.4%;background:#e4572e;"></div>
              <div style="width:2.1%;background:#9aa3a8;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:10.5px;color:#3d454b;margin-top:5px;font-family:monospace;">
              <span style="color:#2d6a4f;font-weight:700;">■ Nativa: 86,5%</span>
              <span style="color:#b83b1d;font-weight:700;">■ Agro: 11,4%</span>
              <span>■ Outros: 2,1%</span>
            </div>
          </div>`,
        },
      },
      {
        id: "consolidado-mt",
        label: "Sorriso/MT (Fronteira Consolidada)",
        shortTag: "18,4 mil ha · 76% Agro",
        inputContext: {
          nm_mun: "Sorriso - MT",
          desmat_2019_2024_ha: [3800, 4100, 3200, 2900, 2400, 2000],
          pct_veg_nativa: 21.8,
          pct_agropecuaria: 76.1,
        },
        preview: {
          kind: "popup-html",
          layerTitle: "Monitoramento Municipal PRODES + MapBiomas",
          featureTitle: "Sorriso / MT (5107925)",
          html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f6f7f5;border:1px solid #cfd4d0;padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px;">
              <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#1e2328;">Supressão Vegetal Anual (ha)</strong>
              <span style="font-size:11px;font-family:monospace;color:#b83b1d;font-weight:700;">Acumulado: 18.400 ha</span>
            </div>
            <svg viewBox="0 0 280 86" width="100%" height="86" style="background:#eceeeb;border:1px solid #dcdfdc;display:block;margin-bottom:10px;">
              <line x1="6" y1="64" x2="274" y2="64" stroke="#b2b9b4" stroke-width="1" />
              <rect x="10" y="14" width="30" height="50" fill="#24506b" rx="1" /><text x="25" y="10" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">3.8k</text><text x="25" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2019</text>
              <rect x="55" y="10" width="30" height="54" fill="#24506b" rx="1" /><text x="70" y="7.5" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">4.1k</text><text x="70" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2020</text>
              <rect x="100" y="21.9" width="30" height="42.1" fill="#24506b" rx="1" /><text x="115" y="17.9" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">3.2k</text><text x="115" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2021</text>
              <rect x="145" y="25.8" width="30" height="38.2" fill="#24506b" rx="1" /><text x="160" y="21.8" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">2.9k</text><text x="160" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2022</text>
              <rect x="190" y="32.4" width="30" height="31.6" fill="#24506b" rx="1" /><text x="205" y="28.4" text-anchor="middle" font-size="8.5" fill="#3d454b" font-family="monospace">2.4k</text><text x="205" y="79" text-anchor="middle" font-size="9" fill="#646c72" font-family="monospace">2023</text>
              <rect x="235" y="37.7" width="30" height="26.3" fill="#e4572e" rx="1" /><text x="250" y="33.7" text-anchor="middle" font-size="8.5" fill="#b83b1d" font-weight="700" font-family="monospace">2.0k</text><text x="250" y="79" text-anchor="middle" font-size="9" fill="#1e2328" font-weight="700" font-family="monospace">2024</text>
            </svg>
            <div style="font-size:10.5px;color:#3d454b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px;">Composição Territorial (MapBiomas)</div>
            <div style="display:flex;height:10px;width:100%;border-radius:1px;overflow:hidden;border:1px solid #b2b9b4;">
              <div style="width:21.8%;background:#2d6a4f;"></div>
              <div style="width:76.1%;background:#e4572e;"></div>
              <div style="width:2.1%;background:#9aa3a8;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:10.5px;color:#3d454b;margin-top:5px;font-family:monospace;">
              <span style="color:#2d6a4f;font-weight:700;">■ Nativa: 21,8%</span>
              <span style="color:#b83b1d;font-weight:700;">■ Agro: 76,1%</span>
              <span>■ Outros: 2,1%</span>
            </div>
          </div>`,
        },
      },
    ],
  },
  {
    id: "central-links-contextuais-webgis",
    number: "06",
    title: "Central de Ações e Deep Links Parametrizados (Experience Builder & Bases Oficiais)",
    fileName: "06-central-links-contextuais-webgis.arcade",
    repoPath: "expressions/popups/06-central-links-contextuais-webgis.arcade",
    category: "popups",
    categoryLabel: "Pop-ups Dinâmicos (HTML/SVG)",
    profiles: ["Popup Element (Text / HTML)"],
    globalsUsed: ["$feature"],
    keyFunctions: ["Centroid", "UrlEncode", "Atan", "Exp", "Text"],
    domainContext: "Arquitetura de Ecossistemas ArcGIS Online (Web Map ↔ Experience Builder)",
    summary:
      "Transforma o Pop-up em um hub operacional gerando URLs dinâmicas com filtro de datasource para o ArcGIS Experience Builder (#data_s=...), câmera 3D oblíqua no Google Earth Web e consulta direta ao panorama IBGE.",
    engineeringNote:
      "Aplica UrlEncode() sobre chaves alfanuméricas para evitar quebra de query strings e converte automaticamente coordenadas Web Mercator para graus decimais WGS84.",
    complexity: "Leve O(1)",
    code: raw06,
    scenarios: [
      {
        id: "deep-link-balsas",
        label: "Polo Agrícola Balsas (MA)",
        shortTag: "IBGE 2101400",
        inputContext: {
          codigo_ativo: "MON-MAT-019",
          cd_mun: "2101400",
          lat: -7.5325,
          lon: -46.0356,
        },
        preview: {
          kind: "popup-html",
          layerTitle: "Hub Territorial Integrado",
          featureTitle: "Balsas / MA — MON-MAT-019",
          html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f6f7f5;border:1px solid #cfd4d0;padding:10px;">
            <div style="font-size:10px;font-family:monospace;color:#646c72;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Centroide WGS84: -7.532500, -46.035600</div>
            <a href="https://experience.arcgis.com/" target="_blank" rel="noopener noreferrer" style="display:block;padding:7px 10px;margin-bottom:6px;background:#24506b;color:#ffffff;text-decoration:none;font-size:11.5px;font-weight:700;border-radius:2px;text-align:center;">Filtrar Dossiê no Experience Builder ↗</a>
            <a href="https://earth.google.com/web/@-7.532500,-46.035600,450a,3500d,35y,0h,0t,0r" target="_blank" rel="noopener noreferrer" style="display:block;padding:6px 10px;margin-bottom:6px;background:#eceeeb;color:#1e2328;border:1px solid #b2b9b4;text-decoration:none;font-size:11.5px;font-weight:600;border-radius:2px;text-align:center;">Inspecionar Cena 3D no Google Earth Web ↗</a>
            <a href="https://cidades.ibge.gov.br/brasil/panorama?cod=2101400" target="_blank" rel="noopener noreferrer" style="display:block;padding:6px 10px;background:#eceeeb;color:#1e2328;border:1px solid #b2b9b4;text-decoration:none;font-size:11.5px;font-weight:600;border-radius:2px;text-align:center;">Consultar Perfil Municipal IBGE (2101400) ↗</a>
          </div>`,
        },
      },
      {
        id: "deep-link-foz",
        label: "Margem Equatorial Offshore (AP)",
        shortTag: "Offshore · Sem Município",
        inputContext: {
          codigo_ativo: "FZA-M-59",
          cd_mun: null,
          lat: 3.8412,
          lon: -49.7128,
        },
        preview: {
          kind: "popup-html",
          layerTitle: "Monitor Oceano & Margem Equatorial",
          featureTitle: "Bloco FZA-M-59 (Águas Profundas)",
          omittedNullFields: ["Botão IBGE Cidades omitido automaticamente (feição marítima cd_mun = null)"],
          html: `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f6f7f5;border:1px solid #cfd4d0;padding:10px;">
            <div style="font-size:10px;font-family:monospace;color:#646c72;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Centroide WGS84: 3.841200, -49.712800</div>
            <a href="https://experience.arcgis.com/" target="_blank" rel="noopener noreferrer" style="display:block;padding:7px 10px;margin-bottom:6px;background:#24506b;color:#ffffff;text-decoration:none;font-size:11.5px;font-weight:700;border-radius:2px;text-align:center;">Filtrar Dossiê no Experience Builder ↗</a>
            <a href="https://earth.google.com/web/@3.841200,-49.712800,450a,3500d,35y,0h,0t,0r" target="_blank" rel="noopener noreferrer" style="display:block;padding:6px 10px;background:#eceeeb;color:#1e2328;border:1px solid #b2b9b4;text-decoration:none;font-size:11.5px;font-weight:600;border-radius:2px;text-align:center;">Inspecionar Cena 3D no Google Earth Web ↗</a>
          </div>`,
        },
      },
    ],
  },
  {
    id: "matriz-bivariada-pressao-hidrica",
    number: "07",
    title: "Classificação Multicritério Bivariada (3×3) — Conversão Vegetal × Estresse Hídrico",
    fileName: "07-matriz-bivariada-pressao-hidrica.arcade",
    repoPath: "expressions/symbology-labeling/07-matriz-bivariada-pressao-hidrica.arcade",
    category: "symbology-labeling",
    categoryLabel: "Simbologia & Rotulagem",
    profiles: ["Visualization (Unique Values)"],
    globalsUsed: ["$feature"],
    keyFunctions: ["IsEmpty", "When", "DefaultValue"],
    domainContext: "Cartografia Temática Bivariada · Recursos Hídricos & Uso do Solo",
    summary:
      "Discretiza em tempo real a taxa de conversão antrópica da bacia e o comprometimento quantitativo da vazão outorgável (Q95 ANA), classificando cada feição em uma matriz coroplética 3×3 (A1 a C3).",
    engineeringNote:
      "Opera inteiramente sobre atributos numéricos da própria feição (O(1) sem chamadas externas), permitindo renderização fluida mesmo em camadas com milhares de microbacias ou municípios.",
    complexity: "Leve O(1)",
    code: raw07,
    scenarios: [
      {
        id: "bacia-c3",
        label: "Sub-bacia Rio das Fêmeas (BA)",
        shortTag: "Classe C3 · Crítico Duplo",
        inputContext: {
          sub_bacia: "Rio das Fêmeas / Urucuia",
          pct_area_convertida: 64.2,
          pct_comprometimento_q95: 86.0,
        },
        preview: {
          kind: "bivariate-3x3",
          activeCode: "C3",
          returnedLabel: "C3 — Crítico Duplo (Alta Conversão + Alto Estresse Hídrico)",
          xValueLabel: "Conversão Antrópica: 64,2% (>= 50%)",
          yValueLabel: "Demanda / Q95: 86,0% (>= 70%)",
          featureName: "Sub-bacia Rio das Fêmeas / BA",
        },
      },
      {
        id: "bacia-a3",
        label: "Médio Teles Pires Sequeiro (MT)",
        shortTag: "Classe A3 · Fronteira Seca",
        inputContext: {
          sub_bacia: "Médio Teles Pires",
          pct_area_convertida: 58.5,
          pct_comprometimento_q95: 14.2,
        },
        preview: {
          kind: "bivariate-3x3",
          activeCode: "A3",
          returnedLabel: "A3 — Fronteira Seca (Alta Conversão + Baixa Demanda Azul)",
          xValueLabel: "Conversão Antrópica: 58,5% (>= 50%)",
          yValueLabel: "Demanda / Q95: 14,2% (< 30%)",
          featureName: "Sub-bacia Médio Teles Pires / MT",
        },
      },
      {
        id: "bacia-a1",
        label: "Alto Rio Juruena Preservado (AM/MT)",
        shortTag: "Classe A1 · Conservação",
        inputContext: {
          sub_bacia: "Alto Rio Juruena",
          pct_area_convertida: 6.8,
          pct_comprometimento_q95: 4.1,
        },
        preview: {
          kind: "bivariate-3x3",
          activeCode: "A1",
          returnedLabel: "A1 — Conservação Integral (Baixa Conversão + Conforto Hídrico)",
          xValueLabel: "Conversão Antrópica: 6,8% (< 20%)",
          yValueLabel: "Demanda / Q95: 4,1% (< 30%)",
          featureName: "Sub-bacia Alto Rio Juruena",
        },
      },
    ],
  },
  {
    id: "semaforo-vigencia-licencas-outorgas",
    number: "08",
    title: "Semáforo Temporal para Licenças Ambientais, Outorgas e Condicionantes",
    fileName: "08-semaforo-vigencia-licencas-outorgas.arcade",
    repoPath: "expressions/symbology-labeling/08-semaforo-vigencia-licencas-outorgas.arcade",
    category: "symbology-labeling",
    categoryLabel: "Simbologia & Rotulagem",
    profiles: ["Visualization (Symbology)", "Popup"],
    globalsUsed: ["$feature"],
    keyFunctions: ["DateDiff", "Now", "Floor", "IsEmpty"],
    domainContext: "Conformidade Regulatória · Resolução CONAMA nº 237/1997 (Art. 18, § 4º)",
    summary:
      "Calcula dinamicamente os dias restantes até o vencimento da licença/outorga e verifica se houve protocolo de renovação com antecedência mínima de 120 dias (prorrogação automática legal).",
    engineeringNote:
      "Dispensa rotinas diárias de banco de dados para atualizar colunas de status vencido: o cálculo contra Now() garante precisão jurídica exata sempre que o Web Map ou Dashboard é aberto.",
    complexity: "Leve O(1)",
    code: raw08,
    scenarios: [
      {
        id: "prorrogada-conama",
        label: "LO Ferrovia — Vencida c/ Protocolo >= 120d",
        shortTag: "Prorrogada CONAMA §4º",
        inputContext: {
          licenca: "LO nº 1.492/2020 — Malha Ferroviária Sudeste",
          data_vencimento: "2026-09-15",
          data_protocolo_renovacao: "2026-04-10 (158 dias antes)",
          hoje_simulado: "2026-11-18",
        },
        preview: {
          kind: "license-semaphore",
          activeStateCode: "03",
          returnedClass: "03 - Prorrogada Automaticamente (CONAMA 237/97 §4º)",
          daysRemainingLabel: "Expirada há 64 dias · Protocolada c/ 158 dias de antecedência",
          conamaRuleNote:
            "Art. 18 §4º CONAMA 237/97: requerida com antecedência mínima de 120 dias, a licença permanece válida até manifestação definitiva do órgão ambiental.",
          featureName: "LO Malha Ferroviária Sudeste",
        },
      },
      {
        id: "urgente-sem-protocolo",
        label: "Outorga Captação — Faltam 85 dias s/ Protocolo",
        shortTag: "Urgente (< 120 dias)",
        inputContext: {
          licenca: "Outorga ANA nº 884/2022 — Captação Superficial",
          data_vencimento: "2027-02-11",
          data_protocolo_renovacao: null,
          hoje_simulado: "2026-11-18",
        },
        preview: {
          kind: "license-semaphore",
          activeStateCode: "02",
          returnedClass: "02 - Urgente: Prazo Limite CONAMA (< 120 dias s/ protocolo)",
          daysRemainingLabel: "Restam 85 dias corridos · Sem protocolo registrado",
          conamaRuleNote:
            "Janela de prorrogação automática (120 dias) ultrapassada sem protocolo; requer providência imediata junto ao órgão gestor.",
          featureName: "Outorga Superficial Ponto 04",
        },
      },
      {
        id: "vencida-irregular",
        label: "LI Subestação — Vencida s/ Renovação",
        shortTag: "Irregular / Vencida",
        inputContext: {
          licenca: "LI nº 309/2023 — Subestação Seccionadora",
          data_vencimento: "2026-10-01",
          data_protocolo_renovacao: null,
          hoje_simulado: "2026-11-18",
        },
        preview: {
          kind: "license-semaphore",
          activeStateCode: "01",
          returnedClass: "01 - Vencida sem Renovação Tempestiva",
          daysRemainingLabel: "Vencida há 48 dias · Sem protocolo tempestivo",
          conamaRuleNote:
            "Operação ou instalação desamparada de título vigente; bloqueio visual prioritário no painel de conformidade.",
          featureName: "Subestação Seccionadora 230 kV",
        },
      },
    ],
  },
  {
    id: "rotulos-adaptativos-escala",
    number: "09",
    title: "Rotulagem Multilinha Adaptativa por Escala Cartográfica ($view.scale)",
    fileName: "09-rotulos-adaptativos-escala.arcade",
    repoPath: "expressions/symbology-labeling/09-rotulos-adaptativos-escala.arcade",
    category: "symbology-labeling",
    categoryLabel: "Simbologia & Rotulagem",
    profiles: ["Labeling"],
    globalsUsed: ["$feature", "$view"],
    keyFunctions: ["Proper", "Upper", "Left", "Text"],
    domainContext: "Generalização Cartográfica em WebGIS · Unidades de Conservação (SNUC)",
    summary:
      "Controla a densidade informacional dos rótulos conforme o nível de zoom do usuário ($view.scale): exibe apenas siglas de grandes unidades em escala macro, nome + grupo SNUC em escala regional e ficha multilinha em escala local.",
    engineeringNote:
      "Substitui a duplicação de 3 camadas idênticas com faixas de visibilidade distintas no Web Map, mantendo uma única camada fácil de manter na legenda.",
    complexity: "Leve O(1)",
    code: raw09,
    scenarios: [
      {
        id: "escala-macro",
        label: "Escala Macro (1 : 3.500.000)",
        shortTag: "Visão Bioma",
        inputContext: {
          "$view.scale": 3500000,
          regra_ativa: "Apenas siglas de UCs >= 100.000 ha; unidades menores suprimidas",
        },
        preview: {
          kind: "scale-labeling",
          scaleDenominator: 3500000,
          scaleLabel: "1 : 3.500.000",
          zoomHint: "Generalização máxima: evita colisão de textos na visão nacional/bioma.",
          features: [
            { name: "PARNA Montanhas do Tumucumaque", areaHa: 3865188, renderedLabel: "PNMT" },
            { name: "RESEX Chico Mendes", areaHa: 931537, renderedLabel: "RESEX-CM" },
            { name: "RPPN Fazenda Vagafogo", areaHa: 46, renderedLabel: "" },
          ],
        },
      },
      {
        id: "escala-regional",
        label: "Escala Regional (1 : 1.000.000)",
        shortTag: "Visão Bacia / UF",
        inputContext: {
          "$view.scale": 1000000,
          regra_ativa: "Nome compacto + Grupo SNUC [PI/US] para UCs >= 10.000 ha",
        },
        preview: {
          kind: "scale-labeling",
          scaleDenominator: 1000000,
          scaleLabel: "1 : 1.000.000",
          zoomHint: "Escala intermediária estadual: identifica categoria SNUC sem poluir o mapa.",
          features: [
            {
              name: "PARNA Montanhas do Tumucumaque",
              areaHa: 3865188,
              renderedLabel: "Parna montanhas do tumucumaque [PI]",
            },
            {
              name: "RESEX Chico Mendes",
              areaHa: 931537,
              renderedLabel: "Resex chico mendes [US]",
            },
            { name: "RPPN Fazenda Vagafogo", areaHa: 46, renderedLabel: "" },
          ],
        },
      },
      {
        id: "escala-local",
        label: "Escala Local (1 : 150.000)",
        shortTag: "Inspeção Detalhada",
        inputContext: {
          "$view.scale": 150000,
          regra_ativa: "Todas as UCs rotuladas com bloco técnico de 2 linhas (Esfera + Grupo + Área ha)",
        },
        preview: {
          kind: "scale-labeling",
          scaleDenominator: 150000,
          scaleLabel: "1 : 150.000",
          zoomHint: "Escala de projeto/licenciamento: exibe todas as unidades inclusive RPPNs locais.",
          features: [
            {
              name: "PARNA Montanhas do Tumucumaque",
              areaHa: 3865188,
              renderedLabel: "PNMT — Parna montanhas do tumucumaque\nFEDERAL · SNUC PI · 3.865.188 ha",
            },
            {
              name: "RESEX Chico Mendes",
              areaHa: 931537,
              renderedLabel: "RESEX-CM — Resex chico mendes\nFEDERAL · SNUC US · 931.537 ha",
            },
            {
              name: "RPPN Fazenda Vagafogo",
              areaHa: 46,
              renderedLabel: "RPPN-FV — Rppn fazenda vagafogo\nPARTICULAR · SNUC US · 46 ha",
            },
          ],
        },
      },
    ],
  },
  {
    id: "data-expression-ranking-bacias-uf",
    number: "10",
    title: "Data Expression Multi-Camadas — Pressão Hídrica e Desmatamento por Bacia",
    fileName: "10-data-expression-ranking-bacias-uf.arcade",
    repoPath: "expressions/dashboards/10-data-expression-ranking-bacias-uf.arcade",
    category: "dashboards",
    categoryLabel: "ArcGIS Dashboards & KPIs",
    profiles: ["Dashboards — Data Expression"],
    globalsUsed: ["Portal"],
    keyFunctions: ["FeatureSetByPortalItem", "Filter", "GroupBy", "HasKey", "FeatureSet", "OrderBy"],
    domainContext: "Engenharia de Painéis Executivos · Cruzamento de Serviços Independentes",
    summary:
      "Agrega no servidor duas Hosted Feature Layers independentes (Alertas de Supressão × Outorgas ANA) por código de bacia, executa Hash Join em memória e devolve um FeatureSet virtual ordenado por Índice de Pressão Combinada.",
    engineeringNote:
      "Substitui loops aninhados O(N×M) por indexação em dicionário O(N+M) após GroupBy() sem geometria (includeGeometry = false), reduzindo o tempo de carga do Dashboard de >12s para <600ms.",
    complexity: "Agregação Server-Side",
    code: raw10,
    scenarios: [
      {
        id: "recorte-matopiba",
        label: "Recorte Bacias do Cerrado / MATOPIBA",
        shortTag: "Top 4 Sub-bacias",
        inputContext: {
          camada_1: "Alertas_Supressao_Vegetal (ano >= 2022)",
          camada_2: "Outorgas_ANA_Consuntivas (Irrigação / Mineração)",
          join_key: "cod_bacia (Hash Join em memória)",
        },
        preview: {
          kind: "dashboard-featureset",
          widgetTitle: "Saída Virtual FeatureSet → Serial Chart / Table",
          executionNote: "2 requisições REST GroupBy() · 0 geometrias trafegadas · Ordenado por indice_pressao DESC",
          rows: [
            {
              cod_bacia: "7458",
              nome_bacia: "Rio Grande / Urucuia",
              uf: "BA",
              desmatamento_ha: 84210.5,
              demanda_hidrica_hm3: 1420.8,
              num_outorgas: 318,
              indice_pressao: 96.4,
            },
            {
              cod_bacia: "7422",
              nome_bacia: "Rio Corrente",
              uf: "BA",
              desmatamento_ha: 61480.0,
              demanda_hidrica_hm3: 985.4,
              num_outorgas: 204,
              indice_pressao: 85.2,
            },
            {
              cod_bacia: "2614",
              nome_bacia: "Alto Rio Parnaíba / Balsas",
              uf: "MA",
              desmatamento_ha: 72900.2,
              demanda_hidrica_hm3: 310.6,
              num_outorgas: 89,
              indice_pressao: 78.9,
            },
            {
              cod_bacia: "2341",
              nome_bacia: "Rio Formoso do Araguaia",
              uf: "TO",
              desmatamento_ha: 29450.0,
              demanda_hidrica_hm3: 890.2,
              num_outorgas: 162,
              indice_pressao: 68.0,
            },
          ],
        },
      },
      {
        id: "recorte-amazonia",
        label: "Recorte Bacias Amazônicas Meridionais",
        shortTag: "Pressão Florestal",
        inputContext: {
          camada_1: "Alertas_Supressao_Vegetal (Amazônia Legal)",
          camada_2: "Outorgas_ANA_Consuntivas",
          join_key: "cod_bacia (Hash Join em memória)",
        },
        preview: {
          kind: "dashboard-featureset",
          widgetTitle: "Saída Virtual FeatureSet → Serial Chart / Table",
          executionNote: "Mesma expressão aplicada sobre filtro regional da Amazônia Meridional",
          rows: [
            {
              cod_bacia: "1742",
              nome_bacia: "Médio Rio Xingu / Iriri",
              uf: "PA",
              desmatamento_ha: 98400.0,
              demanda_hidrica_hm3: 64.2,
              num_outorgas: 27,
              indice_pressao: 82.1,
            },
            {
              cod_bacia: "1589",
              nome_bacia: "Alto Teles Pires",
              uf: "MT",
              desmatamento_ha: 44120.5,
              demanda_hidrica_hm3: 412.0,
              num_outorgas: 143,
              indice_pressao: 74.6,
            },
            {
              cod_bacia: "1390",
              nome_bacia: " Bacia do Rio Machado",
              uf: "RO",
              desmatamento_ha: 51800.0,
              demanda_hidrica_hm3: 95.5,
              num_outorgas: 54,
              indice_pressao: 63.8,
            },
          ],
        },
      },
    ],
  },
  {
    id: "indicador-kpi-variacao-anual-yoy",
    number: "11",
    title: "Indicador Executivo (KPI) com Variação Homóloga (YoY) e Semáforo de Meta",
    fileName: "11-indicador-kpi-variacao-anual-yoy.arcade",
    repoPath: "expressions/dashboards/11-indicador-kpi-variacao-anual-yoy.arcade",
    category: "dashboards",
    categoryLabel: "ArcGIS Dashboards & KPIs",
    profiles: ["Dashboards — Indicator"],
    globalsUsed: ["$datapoint", "$reference"],
    keyFunctions: ["DefaultValue", "When", "IIf", "Text"],
    domainContext: "Monitoramento Executivo de Metas Climáticas e Desmatamento",
    summary:
      "Formata dinamicamente o widget Indicator comparando a soma filtrada no ciclo atual ($datapoint) contra o ciclo homólogo anterior ($reference) e contra o teto anual institucional (15.000 ha).",
    engineeringNote:
      "Inverte corretamente a polaridade semafórica para indicadores de pressão ambiental (onde redução percentual aciona paleta verde de conformidade e crescimento aciona alerta terracota).",
    complexity: "Leve O(1)",
    code: raw11,
    scenarios: [
      {
        id: "kpi-alta-critica",
        label: "Alta Crítica Acima da Meta (+24,8%)",
        shortTag: "Limite Excedido",
        inputContext: {
          "$datapoint.sum_area_suprimida_ha": 18720,
          "$reference.sum_area_suprimida_ha": 15000,
          metaAnualMax: 15000,
        },
        preview: {
          kind: "dashboard-indicator",
          widgetTitle: " Área Suprimida Acumulada no Ciclo",
          topText: "LIMITE EXCEDIDO (+3.720 ha acima do teto)",
          topTextColor: "#b83b1d",
          middleText: "18.720 ha",
          middleTextColor: "#b83b1d",
          bottomText: "▲ +24,8% vs. ciclo anterior (+3.720 ha)",
          bottomTextColor: "#b83b1d",
          backgroundColor: "#fdf4f1",
        },
      },
      {
        id: "kpi-queda-positiva",
        label: "Redução Consistente (-22,4%)",
        shortTag: "Dentro da Meta",
        inputContext: {
          "$datapoint.sum_area_suprimida_ha": 11180,
          "$reference.sum_area_suprimida_ha": 14410,
          metaAnualMax: 15000,
        },
        preview: {
          kind: "dashboard-indicator",
          widgetTitle: "Área Suprimida Acumulada no Ciclo",
          topText: "DENTRO DO LIMITE ANUAL (74,5% do teto)",
          topTextColor: "#24506b",
          middleText: "11.180 ha",
          middleTextColor: "#2d6a4f",
          bottomText: "▼ -22,4% vs. ciclo anterior (-3.230 ha)",
          bottomTextColor: "#2d6a4f",
          backgroundColor: "#f2f8f5",
        },
      },
      {
        id: "kpi-estavel",
        label: "Estabilidade Operacional (+0,8%)",
        shortTag: "Variação Neutra",
        inputContext: {
          "$datapoint.sum_area_suprimida_ha": 13410,
          "$reference.sum_area_suprimida_ha": 13300,
          metaAnualMax: 15000,
        },
        preview: {
          kind: "dashboard-indicator",
          widgetTitle: "Área Suprimida Acumulada no Ciclo",
          topText: "DENTRO DO LIMITE ANUAL (89,4% do teto)",
          topTextColor: "#24506b",
          middleText: "13.410 ha",
          middleTextColor: "#1e2328",
          bottomText: "● 0,8% vs. ciclo anterior (+110 ha)",
          bottomTextColor: "#646c72",
          backgroundColor: "#f6f7f5",
        },
      },
    ],
  },
  {
    id: "lista-avancada-cards-monitoramento",
    number: "12",
    title: "Cards Executivos para Widget List com Barra Proporcional e Pílulas de Status",
    fileName: "12-lista-avancada-cards-monitoramento.arcade",
    repoPath: "expressions/dashboards/12-lista-avancada-cards-monitoramento.arcade",
    category: "dashboards",
    categoryLabel: "ArcGIS Dashboards & KPIs",
    profiles: ["Dashboards — List (Advanced)"],
    globalsUsed: ["$datapoint", "$reference"],
    keyFunctions: ["Constrain", "Round", "When", "Max", "Text"],
    domainContext: "Salas de Situação · Priorização Territorial de Municípios Críticos",
    summary:
      "Calcula atributos visuais injetáveis no Line Item Template do widget List, gerando barras horizontais proporcionais ao maior valor da seleção atual ($reference.max_desmatamento_ha) e tags de prioridade P1/P2/P3.",
    engineeringNote:
      "Garante largura mínima de 4% via Constrain(..., 4, 100) para feições não zeradas, preservando legibilidade visual mesmo quando o líder do ranking possui ordem de grandeza muito superior.",
    complexity: "Leve O(1)",
    code: raw12,
    scenarios: [
      {
        id: "ranking-fronteira",
        label: "Seleção Ativa: Fronteira Cerrado-Amazônia",
        shortTag: "4 Municípios Ranqueados",
        inputContext: {
          "$reference.max_desmatamento_ha": 27800,
          ordenacao_widget: "desmatamento_ha DESC",
        },
        preview: {
          kind: "dashboard-list",
          widgetTitle: "Municípios Prioritários na Seleção do Mapa",
          selectionSubtitle: "Referência máxima ($reference): 27.800 ha/ano",
          items: [
            {
              tituloItem: "São Desidério (BA)",
              subtituloBacia: "Bacia: Rio Grande / Urucuia · Bioma Cerrado",
              rotuloStatus: "PRIORIDADE P1",
              larguraPct: 100,
              corBarra: "#e4572e",
              corFundoTag: "#fbeae5",
              corTextoTag: "#b83b1d",
              metricaPrimaria: "27.800 ha",
              metricaSecundaria: "216,0 hm³/ano",
            },
            {
              tituloItem: "Balsas (MA)",
              subtituloBacia: "Bacia: Alto Rio Parnaíba · Bioma Cerrado",
              rotuloStatus: "PRIORIDADE P1",
              larguraPct: 76.6,
              corBarra: "#e4572e",
              corFundoTag: "#fbeae5",
              corTextoTag: "#b83b1d",
              metricaPrimaria: "21.300 ha",
              metricaSecundaria: "48,4 hm³/ano",
            },
            {
              tituloItem: "Formosa do Rio Preto (BA)",
              subtituloBacia: "Bacia: Rio Preto · Bioma Cerrado",
              rotuloStatus: "ATENÇÃO P2",
              larguraPct: 55.4,
              corBarra: "#24506b",
              corFundoTag: "#dce6ec",
              corTextoTag: "#1b3c51",
              metricaPrimaria: "15.400 ha",
              metricaSecundaria: "62,1 hm³/ano",
            },
            {
              tituloItem: " Porto Nacional (TO)",
              subtituloBacia: "Bacia: Médio Tocantins · Bioma Cerrado",
              rotuloStatus: "MONITORAMENTO P3",
              larguraPct: 21.2,
              corBarra: "#5c768d",
              corFundoTag: "#eceeeb",
              corTextoTag: "#3d454b",
              metricaPrimaria: "5.890 ha",
              metricaSecundaria: "14,2 hm³/ano",
            },
          ],
        },
      },
    ],
  },
];
