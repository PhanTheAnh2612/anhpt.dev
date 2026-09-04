import { createFileRoute } from '@tanstack/react-router'
import { GuildHall } from '../components/features/guild/guild-hall'
import { guildProfile } from '../content/guild-profile'

export const Route = createFileRoute('/guild-hall')({
  component: GuildHallPage,
})
function GuildHallPage() {
  return <GuildHall profile={guildProfile} />
}
