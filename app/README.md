# Root Page (`/`)

## Overview

This is the root entry point of the application, located at `app/page.tsx`. Its sole responsibility is to redirect users to the main dashboard page at `/dashboard`.

## Component Structure

- **`HomePage` (`page.tsx`)**: A simple client component that uses the `useRouter` hook from `next/navigation` to perform an immediate client-side redirect.

## Key Features

- **Automatic Redirect**: Uses a `useEffect` hook to call `router.replace('/dashboard')` as soon as the component mounts. `router.replace` is used instead of `router.push` to prevent the root page from being added to the browser's history stack.
- **Loading State**: While the redirect is happening (which is nearly instantaneous), a simple loading spinner and text ("Weiterleitung zum Dashboard...") are displayed to provide user feedback.

## File Location

`app/page.tsx`

## AI Agent Notes

This page is purely for navigation and contains no business logic or data. When asked to modify the application's landing page, the agent should understand that the actual content is at `/dashboard` and this page just handles the initial routing.
