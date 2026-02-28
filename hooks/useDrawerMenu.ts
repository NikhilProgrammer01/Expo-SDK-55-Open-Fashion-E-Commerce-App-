// hooks/useDrawerMenu.ts
import { useState } from 'react';

export function useDrawerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(p => !p);
  return { isOpen, open, close, toggle };
}