import { createFileRoute } from '@tanstack/react-router'
import { HomeHero } from '../components/features/home/home-hero'

export const Route = createFileRoute('/')({ component: HomeHero })
