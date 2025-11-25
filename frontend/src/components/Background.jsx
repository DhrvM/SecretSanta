import { useLocation } from 'react-router-dom'

export function Background() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Handle correct path for both local dev and GitHub Pages
  // import.meta.env.BASE_URL is '/' in dev and '/SecretSanta/' in prod (if configured)
  const bgSrc = `${import.meta.env.BASE_URL}Background.png`.replace('//', '/')

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl">
      {/* Background Image */}
      <img
        src={bgSrc}
        alt="Cozy Christmas living room"
        className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${!isHome ? 'blur-sm scale-105' : ''}`}
      />
      {/* Very subtle dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  )
}
