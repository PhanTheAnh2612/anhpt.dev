# React Patterns source coverage

Editorial reconciliation for `D:\Learning Material\React - Patterns.pdf`.
The source outline contains 40 substantive chapters plus its conclusion. The
public syllabus modernizes the underlying problems instead of reproducing every
legacy pattern name as a standalone post.

| Source chapter or group                                                | Syllabus destination                                 | Editorial treatment                                                                                       |
| ---------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Overview React                                                         | Steps 1–5                                            | Current component, state, API, accessibility, and Effect foundations                                      |
| Singleton, Provider, Observer                                          | Step 6: Context, state, or an external store         | Replace blanket patterns with ownership, provider lifetime, and `useSyncExternalStore`                    |
| Proxy, Mediator/Middleware, Command                                    | Step 7: events, reducers, middleware, and commands   | Keep infrastructure uses; prefer callbacks and pure reducers for UI flow                                  |
| Prototype, Factory, Flyweight, Mixin, Module                           | Steps 8–9                                            | Keep JavaScript literacy; prefer functions, ES modules, Hooks, normalization, and measured virtualization |
| Container/Presentational                                               | Step 2: boundaries and state ownership               | Replace naming split with feature ownership and portable view contracts                                   |
| Render Props, Hooks, HOC, Compound                                     | Step 3: composition APIs                             | Prefer custom Hooks, Context, children/slots, and accessible compound controls; retain legacy literacy    |
| Overview Next.js                                                       | Steps 10–14                                          | Framework-neutral rendering decisions with current React and framework integration notes                  |
| CSR, SSR, Static Rendering, ISR                                        | Step 10: rendering modes by route                    | Choose from freshness, personalization, cache, and interaction constraints                                |
| Progressive Hydration, Streaming SSR, RSC, Selective Hydration         | Step 13: streaming, hydration, and Server Components | Replace obsolete framing with shell/reveal, deterministic hydration, and server/client boundaries         |
| Islands Architecture                                                   | Step 14: islands and partial interactivity           | Compare independent hydration roots with one React application                                            |
| Core Web Vitals optimization, Optimize loading sequence                | Step 15: Core Web Vitals and loading sequence        | Use current LCP, INP, and CLS plus field and trace diagnosis                                              |
| Static Import, Dynamic Import, Route Based Splitting, Bundle Splitting | Step 16: code-splitting boundaries                   | Split routes and optional capabilities; verify real production chunks                                     |
| Import on Visibility, Import on Interaction, Preload, Prefetch         | Step 17: visibility, interaction, or intent          | Choose triggers from likelihood, urgency, accessibility, cost, and safety                                 |
| PRPL, Tree Shaking, List Virtualization                                | Step 18: tree shaking, budgets, and virtualization   | Replace acronym-first advice with measurable delivery budgets and DOM contracts                           |
| Conclusion                                                             | Step 19: measured compiler rollout and navigation    | Finish with evidence-first optimization and a linked syllabus                                             |

## Coverage result

Every substantive source topic has a public destination. Legacy React patterns
are either replaced by current React tools, retained as code-reading literacy,
or explicitly bounded to the infrastructure cases where they remain useful.
