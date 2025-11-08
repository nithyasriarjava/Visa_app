import React from 'react'
import { cn } from '../../lib/utils'

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl',
    destructive: 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300 shadow-sm hover:shadow-md',
    secondary: 'bg-orange-100 text-orange-700 hover:bg-orange-200 shadow-sm hover:shadow-md',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-800',
  }

  const sizes = {
    default: 'h-11 px-6 py-2',
    sm: 'h-9 rounded-lg px-4 text-sm',
    lg: 'h-12 rounded-xl px-8 text-lg',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

export { Button }