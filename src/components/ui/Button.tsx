export function Button({ className = '', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`btn-primary ${className}`} {...props}>
      {children}
    </button>
  )
}
