import { useEffect } from 'react';
import { useUiStore } from '../state/uiStore';

export function SelectionController() {
  const clearSelection = useUiStore((state) => state.clearSelection);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') clearSelection();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [clearSelection]);
  return null;
}
