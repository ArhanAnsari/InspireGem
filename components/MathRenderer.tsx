"use client";

import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  content: string;
  displayMode?: boolean; // true for block mode, false for inline mode
}

export default function MathRenderer({ content, displayMode = false }: MathRendererProps) {
  return displayMode ? <BlockMath>{content}</BlockMath> : <InlineMath>{content}</InlineMath>;
}
