const STARS = [
  { top: '6%', left: '12%', size: 3, delay: '0s' },
  { top: '11%', left: '78%', size: 2, delay: '0.6s' },
  { top: '18%', left: '32%', size: 2, delay: '1.4s' },
  { top: '24%', left: '89%', size: 3, delay: '0.2s' },
  { top: '33%', left: '6%', size: 2, delay: '1.9s' },
  { top: '41%', left: '68%', size: 2, delay: '1.1s' },
  { top: '52%', left: '21%', size: 3, delay: '2.4s' },
  { top: '59%', left: '92%', size: 2, delay: '0.8s' },
  { top: '68%', left: '44%', size: 2, delay: '1.6s' },
  { top: '76%', left: '9%', size: 3, delay: '0.4s' },
  { top: '84%', left: '73%', size: 2, delay: '2.1s' },
  { top: '92%', left: '28%', size: 2, delay: '1.2s' },
]

export function Starfield() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {STARS.map((star, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-primary/50"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  )
}
