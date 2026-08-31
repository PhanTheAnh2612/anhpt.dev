import { Link } from '@tanstack/react-router'

const navigation = [
  ['Journey', '/journey'],
  ['Courses', '/courses'],
  ['Guild Hall', '/guild-hall'],
  ['Badges', '/badges'],
  ['Secret Base', '/secret-base'],
  ['Journal', '/journal'],
] as const

export function SiteNavigation() {
  return (
    <nav aria-label="Primary navigation" className="site-navigation">
      <Link className="brand" to="/">
        <span className="brand-orb" aria-hidden="true" />
        anhpt.dev
      </Link>
      <div className="nav-links">
        {navigation.map(([label, to]) => (
          <Link key={to} activeProps={{ className: 'is-active' }} to={to}>
            {label}
          </Link>
        ))}
      </div>
      <div className="player-status" aria-label="Anh, level 18">
        <span>Lv. 18 Anh</span>
        <span className="hearts" aria-hidden="true">
          ♥ ♥ ♥ ♥ ♥
        </span>
      </div>
    </nav>
  )
}
