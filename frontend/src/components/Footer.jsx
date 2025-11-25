import { useLocation } from 'react-router-dom'
import { Github, Linkedin } from './Icons'

export function Footer() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  if (!isHome) {
    return (
      <footer className="absolute bottom-0 left-0 right-0 p-inset">
        <div className="flex items-center justify-center">
          <a
            href="mailto:dhruv.malpani2005@gmail.com?subject=Bug Report: Secret Santa Matching"
            className="text-sm text-white/50 hover:text-white hover:underline transition-colors"
          >
            See a bug?
          </a>
        </div>
      </footer>
    )
  }

  return (
    <footer className="absolute bottom-0 left-0 right-0 p-inset">
      {/* Social Links - Centered with white borders and subtle glow */}
      <div className="flex items-center justify-center gap-6">
        <a
          href="https://www.linkedin.com/in/dhruv-malpani"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-white bg-white/10 p-3 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          aria-label="Dhruv's LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/wasifumair/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-white bg-white/10 p-3 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          aria-label="Wasif's LinkedIn"
        >
          <Linkedin className="h-5 w-5" />
        </a>
        <a
          href="https://github.com/DhrvM/SecretSanta"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-white bg-white/10 p-3 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-sm transition-all hover:bg-white/20 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </footer>
  )
}
