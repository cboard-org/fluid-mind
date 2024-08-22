'use client';

import React, { useEffect, useState } from 'react';
import {
  createDOMRenderer,
  RendererProvider,
  FluentProvider,
  webDarkTheme,
  SSRProvider,
} from '@fluentui/react-components';

const renderer = createDOMRenderer();

/**
 * Providers component.
 *
 * This component wraps other components with a set of providers
 * for Fluent UI, SSR, and a custom renderer.
 *
 * @param {Object} props - The properties for the Providers component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the Providers.
 * @returns {React.Element} The Providers component with child components.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  // If the component has mounted, return a set of providers.
  return (
    <RendererProvider renderer={renderer || createDOMRenderer()}>
      <SSRProvider>
        <FluentProvider theme={webDarkTheme} style={{ width: '100%', height: '100%' }}>
          {children}
        </FluentProvider>
      </SSRProvider>
    </RendererProvider>
  );
}
