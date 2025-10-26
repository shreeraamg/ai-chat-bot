import { cn } from '@/lib/utils'

const TypingIndicator = () => {
  return (
    <div className="flex self-start gap-1 px-2 py-3 bg-gray-200 rounded-lg">
      <Dot />
      <Dot className="[animation-delay:0.2s]" />
      <Dot className="[animation-delay:0.4s]" />
    </div>
  )
}

const Dot = ({ className }: { className?: string }) => (
  <span
    className={cn('w-1 h-1 rounded-full bg-gray-800 animate-pulse', className)}
  />
)

export default TypingIndicator
