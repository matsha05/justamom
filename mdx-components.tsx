import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
    return {
        // Use default components with custom styling via CSS
        ...components,
    };
}
