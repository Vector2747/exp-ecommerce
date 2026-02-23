import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'

import {
  /*useQuery,
  useMutation,
  useQueryClient,*/
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { ClerkProvider } from '@clerk/clerk-react'

import * as Sentry from "@sentry/react";

// Import your Publishable Key
console.log(import.meta.env);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
console.log("PUBLISHABLE_KEY", PUBLISHABLE_KEY)

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

// Create a client
const queryClient = new QueryClient()



Sentry.init({
  dsn: "https://a6e4ed9df3f2c12e2118d53c2582f759@o4510928775610368.ingest.de.sentry.io/4510928796123216",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  enableLogs : true,
  integrations: [
    Sentry.replayIntegration()
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
