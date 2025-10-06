# Gemini Project Instructions

This document provides specific instructions and context for the Koko-3 project for the Gemini AI.

## Project Overview

Koko-3 is a web application designed for personal training and workout tracking. It includes features like a workout timer, exercise library, and performance tracking. The project is built with Next.js and TypeScript.

## Tech Stack

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui
*   **Data:** JSON files in the `data` directory

## Getting Started

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```
2.  **Run the development server:**
    ```bash
    pnpm dev
    ```
3.  **Open the application:**
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Guidelines

*   **Code Style:** Follow the existing code style and conventions. Use the provided ESLint and Prettier configurations to maintain consistency.
*   **Component Structure:** Use the `components` directory for reusable UI components. Page-specific components should be located in the `app` directory.
*   **Data Management:** Data is stored in JSON files in the `data` directory. Use the provided data fetching utilities in `lib/data.ts`.
*   **State Management:** For simple state management, use React's built-in hooks. For more complex state, consider using a library like Zustand or React Context.
*   **Testing:** (To be defined)
*   **Commits:** Follow the conventional commit format.
