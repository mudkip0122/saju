'use client'

import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastState = { id: number; tone: 'success' | 'error'; message: string } | null

export function ToastView({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-6"
    >
      {toast && (
        <div
          key={toast.id}
          role="status"
          className={cn(
            'animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-[0_18px_40px_-18px_oklch(0.3_0.1_292/0.45)]',
            toast.tone === 'success'
              ? 'border-primary/25 bg-card'
              : 'border-destructive/35 bg-card',
          )}
        >
          {toast.tone === 'success' ? (
            <CheckCircle2 className="text-primary mt-0.5 size-5 shrink-0" aria-hidden />
          ) : (
            <AlertCircle className="text-destructive mt-0.5 size-5 shrink-0" aria-hidden />
          )}
          <p className="flex-1 text-sm leading-relaxed font-medium">{toast.message}</p>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/30 -mt-0.5 rounded-md p-1 transition-colors focus-visible:ring-4 focus-visible:outline-none"
          >
            <X className="size-4" aria-hidden />
            <span className="sr-only">닫기</span>
          </button>
        </div>
      )}
    </div>
  )
}
