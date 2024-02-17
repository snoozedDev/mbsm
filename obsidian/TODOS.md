- Migrate all API calls to server actions.
- Modify `ReactQuery` implementation so that all pages can be SSR'd with Metadata. Check out [this implementation](https://github.com/developedbyed/next14-query-combo-cache-destroyer/blob/master/lib/query-provider.tsx), accompanied by [this video](https://www.youtube.com/watch?v=9kjc6SWxBIA).
- For some reason, Vercel deployments need to be retried once to succeed. See [this doc](https://vercel.com/docs/monorepos/turborepo).
- Implement user account

- Figure out how to display clerk data on the UI
