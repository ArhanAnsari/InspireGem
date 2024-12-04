//components/MathRenderer.tsx
"use client";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  content: string;
  displayMode?: boolean; // true for block mode, false for inline mode
}

export default function MathRenderer({ content, displayMode = false }: MathRendererProps) {
  try {
    if (!content) return <p>No content provided</p>;
    return displayMode ? <BlockMath>{content}</BlockMath> : <InlineMath>{content}</InlineMath>;
  } catch (error) {
    console.error("Error rendering math content:", error);
    return <p>Error rendering math content</p>;
  }
}
