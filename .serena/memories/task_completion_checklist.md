# Task Completion Checklist

## Pre-Development
1. Understand the existing code structure and conventions
2. Check for existing similar implementations
3. Review the feature's README.md if available
4. Identify required dependencies and ensure they're available

## During Development
1. Follow existing code patterns and conventions
2. Use TypeScript strict typing
3. Implement proper error handling
4. Add appropriate JSDoc comments for complex functions
5. Ensure responsive design with Tailwind CSS
6. Use existing UI components from shadcn/ui when possible

## Code Quality Checks (MANDATORY)
After completing any coding task, run these commands in order:

1. **Format Code**: `pnpm format` - Fix code formatting
2. **Lint Check**: `pnpm lint` - Check for code quality issues
3. **Type Check**: Implicit in Next.js build, but can run `npx tsc --noEmit`
4. **Build Test**: `pnpm build` - Ensure the project builds successfully

## Testing
1. **Unit Tests**: `pnpm test` - Run Jest tests if applicable
2. **Manual Testing**: Test the feature in development mode
3. **Cross-browser Testing**: Verify functionality works across browsers
4. **Responsive Testing**: Check mobile and desktop layouts

## Post-Development
1. **Documentation**: Update or create README.md for the feature
2. **Performance**: Check for performance implications
3. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
4. **Data Generation**: Run `pnpm generate:sessions` or `pnpm generate:warmups` if data files were modified

## Pre-Commit Checklist
- [ ] Code formatted with Prettier
- [ ] ESLint passes without errors
- [ ] TypeScript compiles without errors
- [ ] Project builds successfully
- [ ] All tests pass
- [ ] Feature works as expected in development
- [ ] Documentation updated if necessary

## Notes for AI Agents
- NEVER commit changes unless explicitly requested
- Always run the code quality commands after making changes
- Pay attention to the existing component structure in each feature
- Use the appropriate data types from `_lib/types.ts` files
- Follow the import restrictions for client vs server components