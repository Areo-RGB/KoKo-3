# Task Completion Checklist

## Pre-Completion Requirements
- [ ] Code follows project conventions (check `code_style_conventions.md`)
- [ ] All imports are correct and organized
- [ ] TypeScript types are properly defined
- [ ] Components use proper Server/Client component patterns
- [ ] TailwindCSS classes follow mobile-first responsive design
- [ ] Accessibility requirements are met (semantic HTML, ARIA labels)

## Code Quality Checks
- [ ] Run `pnpm lint` - no errors or warnings
- [ ] Run `pnpm format` - code properly formatted
- [ ] Run `pnpm build:clean` - builds successfully
- [ ] Test functionality in development server
- [ ] Check console for errors/warnings
- [ ] Verify responsive design on different screen sizes

## File Organization
- [ ] Files follow naming conventions (lowercase-with-dashes)
- [ ] Components use default exports
- [ ] Route-specific logic in `_components/` or `_lib/`
- [ ] Global components in `/components`
- [ ] Proper path aliases (`@/`) used consistently

## TypeScript & Type Safety
- [ ] All props have explicit types
- [ ] Function signatures are typed
- [ ] No `any` types unless absolutely necessary
- [ ] Strict TypeScript settings respected
- [ ] Type imports used where appropriate

## Performance & Best Practices
- [ ] Images use Next.js `<Image>` component
- [ ] Heavy components use dynamic imports
- [ ] Client components are minimal and focused
- [ ] State is properly managed
- [ ] No memory leaks in useEffect hooks

## Testing & Verification
- [ ] Functionality works as expected
- [ ] Edge cases are handled
- [ ] Error states are managed
- [ ] Loading states are provided
- [ ] Offline functionality (if applicable) works

## Final Checks
- [ ] Documentation updated if needed
- [ ] README files updated for new features
- [ ] Git commit ready with descriptive message
- [ ] No console errors in production build
- [ ] PWA features (if applicable) function correctly

## AI Agent Specific
- [ ] Code generation didn't introduce TODOs or placeholders
- [ ] All required functionality is implemented
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Early returns used to reduce nesting
- [ ] Boolean variables use auxiliary verbs (`isLoading`, `hasError`)

## Static Export Requirements (Critical)
- [ ] No server-side API routes used at runtime
- [ ] All data is statically available or fetched client-side
- [ ] Dynamic routes have `generateStaticParams` if needed
- [ ] Images use `unoptimized: true` for static export
- [ ] Build generates static files successfully