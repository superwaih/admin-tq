'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BannerProps {
  variant: 'blue' | 'teal' | 'violet';
  icon?: React.ReactNode;
  strong: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

const VARIANT_CLASSES = {
  blue: 'bg-brand',
  teal: 'bg-teal',
  violet: 'bg-violet',
};

export function Banner({ variant, icon, strong, body, actionLabel, onAction, onDismiss }: BannerProps) {
  const [visible, setVisible] = useState(true);

  function dismiss() {
    setVisible(false);
    onDismiss?.();
  }

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={cn('rounded-r-md rounded-b-md px-3 py-2.5 flex items-center gap-2.5 overflow-hidden', VARIANT_CLASSES[variant])}
        >
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <strong className="text-xs text-white font-bold">{strong}</strong>
          <span className="text-xs text-white/80">{body}</span>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="ml-auto flex-shrink-0 bg-white/18 hover:bg-white/30 border border-white/26 text-white text-[11px] font-bold px-2.5 py-1 rounded transition-all whitespace-nowrap"
            >
              {actionLabel}
            </button>
          )}
          <button
            onClick={dismiss}
            className="flex-shrink-0 text-white/50 hover:text-white text-base leading-none bg-none border-none ml-1 transition-colors"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
