import React, { useMemo, useState } from "react";
import { Check, Copy, Download, FileCode2 } from "lucide-react";

interface ArcadeCodeBlockProps {
  code: string;
  fileName: string;
  repoPath: string;
}

type TokenType =
  | "comment"
  | "string"
  | "keyword"
  | "global"
  | "builtin"
  | "number"
  | "plain";

interface CodeToken {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  "var",
  "for",
  "in",
  "if",
  "else",
  "return",
  "function",
  "true",
  "false",
  "null",
]);

const ARCADE_BUILTINS = new Set([
  "FeatureSetByPortalItem",
  "FeatureSetByName",
  "FeatureSet",
  "Portal",
  "Filter",
  "GroupBy",
  "OrderBy",
  "Intersects",
  "Intersection",
  "BufferGeodetic",
  "AreaGeodetic",
  "DistanceGeodetic",
  "Distance",
  "Geometry",
  "Centroid",
  "First",
  "Count",
  "Push",
  "Concatenate",
  "DefaultValue",
  "IsEmpty",
  "HasKey",
  "When",
  "IIf",
  "Text",
  "Upper",
  "Proper",
  "Left",
  "Trim",
  "UrlEncode",
  "Round",
  "Floor",
  "Abs",
  "Min",
  "Max",
  "Sum",
  "Constrain",
  "DateDiff",
  "Now",
  "Atan",
  "Exp",
  "PI",
  "TextFormatting",
]);

function tokenizeArcade(source: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  const regex =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\$[a-zA-Z_]\w*|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_]\w*\b)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(source)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "plain",
        value: source.slice(lastIndex, match.index),
      });
    }

    const val = match[0];
    if (val.startsWith("/*") || val.startsWith("//")) {
      tokens.push({ type: "comment", value: val });
    } else if (val.startsWith('"') || val.startsWith("'")) {
      tokens.push({ type: "string", value: val });
    } else if (val.startsWith("$")) {
      tokens.push({ type: "global", value: val });
    } else if (/^\d/.test(val)) {
      tokens.push({ type: "number", value: val });
    } else if (KEYWORDS.has(val)) {
      tokens.push({ type: "keyword", value: val });
    } else if (ARCADE_BUILTINS.has(val)) {
      tokens.push({ type: "builtin", value: val });
    } else {
      tokens.push({ type: "plain", value: val });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < source.length) {
    tokens.push({ type: "plain", value: source.slice(lastIndex) });
  }

  return tokens;
}

export const ArcadeCodeBlock: React.FC<ArcadeCodeBlockProps> = ({
  code,
  fileName,
  repoPath,
}) => {
  const [copied, setCopied] = useState(false);

  const normalizedCode = useMemo(() => code.replace(/\r\n/g, "\n").trim(), [code]);
  const tokens = useMemo(() => tokenizeArcade(normalizedCode), [normalizedCode]);
  const lineCount = useMemo(
    () => normalizedCode.split("\n").length,
    [normalizedCode]
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(normalizedCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback para navegadores restritos
      const textarea = document.createElement("textarea");
      textarea.value = normalizedCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([normalizedCode + "\n"], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="code-panel">
      <div className="code-toolbar">
        <div className="code-file-meta">
          <FileCode2 size={15} className="code-file-icon" />
          <span className="code-filepath">{repoPath}</span>
          <span className="code-lines-badge">{lineCount} linhas</span>
        </div>

        <div className="code-actions">
          <button
            type="button"
            className="code-action-btn"
            onClick={handleDownload}
            title={`Baixar arquivo ${fileName}`}
          >
            <Download size={13} />
            <span>.arcade</span>
          </button>
          <button
            type="button"
            className={`code-action-btn primary ${copied ? "copied" : ""}`}
            onClick={handleCopy}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? "Expressão copiada" : "Copiar código"}</span>
          </button>
        </div>
      </div>

      <div className="code-scroll">
        <pre className="arcade-pre" aria-label={`Código Arcade ${fileName}`}>
          <code>
            {tokens.map((tok, idx) =>
              tok.type === "plain" ? (
                <React.Fragment key={idx}>{tok.value}</React.Fragment>
              ) : (
                <span key={idx} className={`tok-${tok.type}`}>
                  {tok.value}
                </span>
              )
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};
