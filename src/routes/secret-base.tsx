import { createFileRoute } from '@tanstack/react-router'
import { SecretBaseScene } from '../components/features/discovery/secret-base-scene'

export const Route = createFileRoute('/secret-base')({
  component: SecretBaseScene,
})
