# Dashboard Development Guide

This project uses **Astro** as the main framework, integrating **React** (shadcn/ui) and **Vue** (shadcn-vue) side-by-side.

## Project Structure

- `src/components/react/ui`: React components (shadcn/ui)
- `src/components/vue/ui`: Vue components (shadcn-vue)
- `src/pages`: Astro pages
- `src/layouts`: Astro layouts
- `src/styles/global.css`: Shared Tailwind CSS (v4) styles

## Adding Components

### React (shadcn/ui)

To add a new React component, use the following command:

```bash
npx shadcn@latest add [component-name] -c components.react.json
```

Example:
```bash
npx shadcn@latest add card -c components.react.json
```

### Vue (shadcn-vue)

To add a new Vue component, use the following command:

```bash
npx shadcn-vue@latest add [component-name] -c components.json
```

Example:
```bash
npx shadcn-vue@latest add card -c components.json
```

## Development

Run the development server:

```bash
pnpm dev
```

## Best Practices

1. **Strictly use Context7**: Before making architectural changes, query the latest documentation.
2. **Shared Utilities**: Use `cn` from `@/lib/utils` for class merging in both frameworks.
3. **Icons**: Use `lucide-react` for React and `lucide-vue-next` for Vue.
