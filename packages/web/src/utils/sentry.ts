import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'

Sentry.init({
  dsn: 'https://7b4bfa4ab1f34120928729ddd18c688c@o1424894.ingest.sentry.io/6773130',
  integrations: [new BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

export const reportError = (err: Error, data?: any) => {
  Sentry.captureMessage(
    JSON.stringify({
      err: err.message,
      data: data
    })
  )
}
