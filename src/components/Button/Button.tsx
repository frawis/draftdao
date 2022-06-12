import React from 'react'
import { clsxm } from 'lib/utils'

interface BtnPropsWithChildren {}

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, BtnPropsWithChildren {
  block?: boolean
  children: React.ReactNode
  className?: string
  color?: 'primary' | 'success' | 'danger' | 'warning' | 'secondary' | 'tertiary'
  disabled?: boolean
  outline?: boolean
  rounded?: boolean
  size?: 'sm' | 'md' | 'lg'
  submit?: boolean
}

type ButtonRef = React.ForwardedRef<HTMLButtonElement>

const style = {
  rounded: 'rounded-full',
  block: 'flex justify-center w-full',
  default: 'focus:outline-none shadow font-medium transition ease-in duration-200',
  disabled: 'opacity-80 cursor-not-allowed',
  sizes: {
    sm: 'px-6 py-1 text-sm',
    md: 'px-6 py-2',
    lg: 'px-6 py-3 text-lg',
  },
  color: {
    primary: {
      bg: 'text-white hover:text-cyan-100 bg-cyan-500 hover:bg-cyan-600 focus:ring-2 focus:ring-offset-2 focus:ring-cyan-700 focus:ring-offset-cyan-200',
      outline: `border-cyan-700 border-2 text-cyan-700 active:bg-cyan-700 active:text-white`,
    },
    success: {
      bg: `bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-700 focus:ring-offset-green-200`,
      outline: `border-green-700 border-2 text-green-700 active:bg-green-700 active:text-white`,
    },
    danger: {
      bg: `bg-red-600 focus:ring-2 focus:ring-offset-2 focus:ring-red-600 focus:ring-offset-red-200`,
      outline: `border-red-600 border-2 text-red-600 active:bg-red-600 active:text-white`,
    },
    warning: {
      bg: `bg-yellow-500 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 focus:ring-offset-yellow-200`,
      outline: `border-yellow-500 border-2 text-yellow-500 active:bg-yellow-500 active:text-white`,
    },
    secondary: {
      bg: `bg-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-teal-700 focus:ring-offset-teal-200`,
      outline: `border-teal-700 border-2 text-teal-700 active:bg-teal-700 active:text-white`,
    },
    tertiary: {
      bg: `bg-pink-700 focus:ring-2 focus:ring-offset-2 focus:ring-pink-700 focus:ring-offset-pink-200`,
      outline: `border-pink-700 border-2 text-pink-700 active:bg-pink-700 active:text-white`,
    },
  },
}

const colors = (outline: boolean) => ({
  primary: outline ? style.color.primary.outline : style.color.primary.bg,
  success: outline ? style.color.success.outline : style.color.success.bg,
  danger: outline ? style.color.danger.outline : style.color.danger.bg,
  warning: outline ? style.color.warning.outline : style.color.warning.bg,
  secondary: outline ? style.color.secondary.outline : style.color.secondary.bg,
  tertiary: outline ? style.color.tertiary.outline : style.color.tertiary.bg,
})

const Button = React.forwardRef(
  (
    {
      block = false,
      children,
      className,
      color,
      disabled = false,
      outline = false,
      rounded,
      size = 'md',
      submit,
      ...props
    }: BtnProps,
    ref: ButtonRef
  ) => (
    <button
      ref={ref}
      {...props}
      type={submit ? 'submit' : 'button'}
      disabled={disabled}
      className={clsxm(
        className,
        block ? style.block : '',
        disabled ? style.disabled : '',
        style.sizes[size],
        style.default,
        rounded ? style.rounded : 'rounded',
        color ? colors(outline)[color] : colors(outline).primary
      )}
    >
      {children}
    </button>
  )
)

Button.displayName = 'Button'

export default Button
