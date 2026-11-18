import React, { useMemo, useState } from "react";
import { Search, Terminal, X } from "lucide-react";
import { ArcadeCodeBlock } from "./components/ArcadeCodeBlock";
import { ArchitectureMatrix } from "./components/ArchitectureMatrix";
import { LiveSimulator } from "./components/LiveSimulator";
import { CATEGORY_META, SNIPPETS } from "./data/snippets";
import type { CategoryKey } from "./types";

const CATEGORY_ORDER: CategoryKey[] = [
  "todos",
  "runtime-spatial",
  "popups",
  "symbology-labeling",
  "dashboards",
];

export const App: React.FC = () => {
  const [category, setCategory] = useState<CategoryKey>("todos");
  const [query, setQuery] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>(SNIPPETS[0].id);

  const filteredSnippets = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SNIPPETS.filter((s) => {
      const matchesCat = category === "todos" || s.category === category;
      if (!matchesCat) return false;
      if (!q) return true;

      const haystack = [
        s.number,
        s.title,
        s.domainContext,
        s.summary,
        s.profiles.join(" "),
        s.keyFunctions.join(" "),
        s.globalsUsed.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [category, query]);

  const activeSnippet = useMemo(() => {
    const found = filteredSnippets.find((s) => s.id === selectedId);
    return found ?? filteredSnippets[0] ?? SNIPPETS[0];
  }, [filteredSnippets, selectedId]);

  const handleCategoryChange = (nextCat: CategoryKey) => {
    setCategory(nextCat);
    const firstInCat = SNIPPETS.find(
      (s) => nextCat === "todos" || s.category === nextCat
    );
    if (firstInCat) {
      setSelectedId(firstInCat.id);
    }
  };

  return (
    <div className="page-root">
      {/* Cabeçalho Editorial Suíço Técnico */}
      <header className="site-header">
        <div className="container header-inner">
          <div className="header-brand">
            <a
              href="https://georgemendes.net"
              target="_blank"
              rel="noreferrer"
              className="brand-name"
            >
              GEORGE MENDES
            </a>
            <span className="brand-sep">/</span>
            <span className="brand-project">arcgis-arcade-toolkit</span>
          </div>

          <nav className="header-nav" aria-label="Navegação principal">
            <a href="#catalogo">Catálogo &amp; Simulador</a>
            <a href="#arquitetura">Performance &amp; Arquitetura</a>
            <a
              href="https://georgemendes.net"
              target="_blank"
              rel="noreferrer"
            >
              Portfólio
            </a>
            <a
              href="https://github.com/gemendesc/arcgis-arcade-toolkit"
              target="_blank"
              rel="noreferrer"
              className="nav-repo-link"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      </header>

      {/* 01 · Hero Editorial */}
      <section className="hero-section">
        <div className="container">
          <div className="eyebrow">
            01 · Biblioteca Técnica &amp; Simulador para Ecossistema Esri
          </div>
          <h1 className="hero-title">
            ArcGIS Arcade Toolkit para Monitoramento Territorial, Licenciamento e Dashboards
          </h1>
          <p className="hero-lead">
            Coleção curada de expressões <strong>ArcGIS Arcade</strong> prontas para produção em{" "}
            <em>ArcGIS Online</em>, <em>Dashboards</em>, <em>Experience Builder</em> e{" "}
            <em>Field Maps</em> — cobrindo interseções espaciais geodésicas sob demanda, fichas
            HTML/SVG sem campos nulos, matrizes coropléticas bivariadas, semáforos regulatórios
            (CONAMA / ANA) e agregações multi-camadas em memória.
          </p>

          <div className="hero-stats-grid">
            <div className="stat-card">
              <span className="mono-label">Acervo Técnico</span>
              <strong>12 Expressões (.arcade)</strong>
              <span className="stat-sub">Código puro comentado e pronto para uso</span>
            </div>
            <div className="stat-card">
              <span className="mono-label">Cobertura de Perfis</span>
              <strong>Pop-up · Simbologia · Dashboard · Campo</strong>
              <span className="stat-sub">Map Viewer, Field Maps e Data Expressions</span>
            </div>
            <div className="stat-card">
              <span className="mono-label">Rigor Cartográfico</span>
              <strong>100% Funções Geodésicas</strong>
              <span className="stat-sub">Sem distorção planar Web Mercator no Brasil</span>
            </div>
            <div className="stat-card">
              <span className="mono-label">Validação Rápida</span>
              <strong>Simulador Ao Vivo + GeoJSON</strong>
              <span className="stat-sub">Cenários reais do setor socioambiental e hídrico</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 · Catálogo Interativo + Simulador */}
      <section id="catalogo" className="catalog-section">
        <div className="container">
          <div className="catalog-top-bar">
            <div>
              <div className="eyebrow">02 · Explorador de Expressões &amp; Preview</div>
              <h2 className="section-title">
                Selecione um snippet para simular o retorno visual e copiar o código
              </h2>
            </div>

            <div className="search-box">
              <Search size={15} className="search-icon" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar por função (GroupBy, AreaGeodetic), perfil ou tema..."
                aria-label="Filtrar expressões Arcade"
              />
              {query && (
                <button
                  type="button"
                  className="clear-search-btn"
                  onClick={() => setQuery("")}
                  aria-label="Limpar busca"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Abas de Categoria */}
          <div className="category-bar" role="tablist" aria-label="Categorias de snippets">
            {CATEGORY_ORDER.map((catKey) => {
              const count =
                catKey === "todos"
                  ? SNIPPETS.length
                  : SNIPPETS.filter((s) => s.category === catKey).length;
              return (
                <button
                  key={catKey}
                  type="button"
                  role="tab"
                  aria-selected={category === catKey}
                  className={`cat-pill ${category === catKey ? "active" : ""}`}
                  onClick={() => handleCategoryChange(catKey)}
                >
                  <span>{CATEGORY_META[catKey].shortLabel}</span>
                  {catKey !== "todos" && <span className="cat-count">{count}</span>}
                </button>
              );
            })}
          </div>

          <p className="category-desc">{CATEGORY_META[category].description}</p>

          {filteredSnippets.length === 0 ? (
            <div className="empty-state">
              <p>
                Nenhuma expressão encontrada para <strong>&ldquo;{query}&rdquo;</strong> nesta
                categoria.
              </p>
              <button
                type="button"
                className="reset-filter-btn"
                onClick={() => {
                  setCategory("todos");
                  setQuery("");
                }}
              >
                Restaurar todas as 12 expressões
              </button>
            </div>
          ) : (
            <div className="workbench-grid">
              {/* Índice Lateral de Expressões */}
              <aside className="snippet-sidebar" aria-label="Lista de expressões">
                {filteredSnippets.map((item) => {
                  const isSelected = item.id === activeSnippet.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`snippet-nav-card ${isSelected ? "active" : ""}`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <div className="snippet-nav-top">
                        <span className="snippet-num">#{item.number}</span>
                        <span className="snippet-complexity">{item.complexity}</span>
                      </div>
                      <strong className="snippet-nav-title">{item.title}</strong>
                      <div className="snippet-nav-profiles">
                        {item.profiles.map((p) => (
                          <span key={p} className="mini-profile-tag">
                            {p}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </aside>

              {/* Painel Principal: Metadados + Simulador + Código Arcade */}
              <main className="snippet-detail">
                <div className="detail-header-card">
                  <div className="detail-meta-row">
                    <span className="detail-index-tag">
                      EXPRESSÃO {activeSnippet.number} / 12 · {activeSnippet.categoryLabel}
                    </span>
                    <div className="detail-profiles">
                      {activeSnippet.profiles.map((prof) => (
                        <span key={prof} className="profile-badge">
                          {prof}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="detail-title">{activeSnippet.title}</h3>
                  <div className="detail-domain">{activeSnippet.domainContext}</div>
                  <p className="detail-summary">{activeSnippet.summary}</p>

                  <div className="engineering-callout">
                    <div className="eng-callout-label">
                      <Terminal size={13} />
                      <span>Nota de Engenharia &amp; Otimização</span>
                    </div>
                    <p>{activeSnippet.engineeringNote}</p>
                  </div>

                  <div className="functions-strip">
                    <span className="mono-label">Funções Arcade Chave:</span>
                    <div className="fn-chips">
                      {activeSnippet.keyFunctions.map((fn) => (
                        <code key={fn} className="fn-chip">
                          {fn}()
                        </code>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulador Visual Ao Vivo */}
                <LiveSimulator key={activeSnippet.id} snippet={activeSnippet} />

                {/* Bloco de Código Fonte .arcade */}
                <ArcadeCodeBlock
                  code={activeSnippet.code}
                  fileName={activeSnippet.fileName}
                  repoPath={activeSnippet.repoPath}
                />
              </main>
            </div>
          )}
        </div>
      </section>

      {/* 03 · Matriz Arquitetural e Performance */}
      <ArchitectureMatrix />

      {/* Rodapé Técnico Alinhado ao Portfólio */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong className="footer-brand">GEORGE MENDES</strong>
            <p>
              Engenheiro Ambiental e Sanitarista · Especialista em Geotecnologias e Desenvolvimento
              WebGIS. Biblioteca técnica de expressões ArcGIS Arcade aplicadas ao monitoramento
              socioambiental, transição energética e recursos hídricos.
            </p>
          </div>
          <div className="footer-links">
            <a href="https://georgemendes.net" target="_blank" rel="noreferrer">
              Portfólio Principal (georgemendes.net) ↗
            </a>
            <a
              href="https://github.com/gemendesc/arcgis-arcade-toolkit"
              target="_blank"
              rel="noreferrer"
            >
              Repositório &amp; Arquivos .arcade no GitHub ↗
            </a>
            <a
              href="https://www.linkedin.com/in/gemendesc"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn (in/gemendesc) ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
