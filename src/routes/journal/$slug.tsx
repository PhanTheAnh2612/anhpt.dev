import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { AuthArticleNavigation } from '../../components/features/discovery/auth-article-navigation'
import { ReactComponentArticleNavigation } from '../../components/features/discovery/react-component-article-navigation'
import { MarkdownContent } from '../../components/features/markdown/markdown-content'
import { getContent, getContentByKind } from '../../lib/content'

export const Route = createFileRoute('/journal/$slug')({
  loader: ({ params }) => {
    const entry = getContent('journal', params.slug)
    if (!entry) throw notFound()
    return entry
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const canonicalUrl = `https://anhpt.dev/journal/${loaderData.slug}`
    const socialImage = loaderData.socialImage || loaderData.thumbnail
    const socialImageUrl = socialImage
      ? `https://anhpt.dev${socialImage}`
      : undefined
    return {
      meta: [
        { title: `${loaderData.title} | anhpt.dev` },
        { name: 'description', content: loaderData.description },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: loaderData.title },
        { property: 'og:description', content: loaderData.description },
        { property: 'og:url', content: canonicalUrl },
        { property: 'og:site_name', content: 'anhpt.dev' },
        { property: 'article:published_time', content: loaderData.date },
        ...(socialImageUrl
          ? [
              { property: 'og:image', content: socialImageUrl },
              { property: 'og:image:width', content: '1200' },
              { property: 'og:image:height', content: '675' },
              {
                property: 'og:image:alt',
                content: `Pixel art cover for ${loaderData.title}`,
              },
            ]
          : []),
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: loaderData.title },
        { name: 'twitter:description', content: loaderData.description },
        ...(socialImageUrl
          ? [
              { name: 'twitter:image', content: socialImageUrl },
              {
                name: 'twitter:image:alt',
                content: `Pixel art cover for ${loaderData.title}`,
              },
            ]
          : []),
      ],
      links: [{ rel: 'canonical', href: canonicalUrl }],
    }
  },
  component: Entry,
})
function Entry() {
  const entry = Route.useLoaderData()
  return (
    <main className="page-shell">
      <article className="article-panel">
        <Link className="back-link" to="/journal">
          ← Back to Journal
        </Link>
        <p className="eyebrow">{entry.date}</p>
        <h1>{entry.title}</h1>
        <p className="article-description">{entry.description}</p>
        <div className="markdown-renderer">
          <MarkdownContent entry={entry} />
        </div>
        <AuthArticleNavigation
          entry={entry}
          entries={getContentByKind('journal')}
        />
        <ReactComponentArticleNavigation
          entry={entry}
          entries={getContentByKind('journal')}
        />
      </article>
    </main>
  )
}
