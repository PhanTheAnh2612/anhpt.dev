import { createFileRoute } from '@tanstack/react-router'
import { WorldMap } from '../components/features/journey/world-map'

export const Route = createFileRoute('/journey')({ component: WorldMap })
