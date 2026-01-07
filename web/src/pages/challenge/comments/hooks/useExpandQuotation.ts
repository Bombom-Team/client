import { useCallback, useEffect, useRef, useState } from 'react';

interface UseExpandQuotationParams {
  quotation: string | undefined;
  maxLines: number;
}

const useExpandQuotation = ({
  quotation,
  maxLines,
}: UseExpandQuotationParams) => {
  const [expanded, setExpanded] = useState(false);
  const [needExpansion, setNeedExpansion] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!quoteRef.current) return;

    const quoteElement = quoteRef.current;
    const lineHeight = parseFloat(getComputedStyle(quoteElement).lineHeight);
    const maxHeight = lineHeight * maxLines;

    setNeedExpansion(quoteElement.scrollHeight > maxHeight);
  }, [quotation, maxLines]);

  return {
    expanded,
    needExpansion,
    quoteRef,
    toggleExpanded,
  };
};

export default useExpandQuotation;
