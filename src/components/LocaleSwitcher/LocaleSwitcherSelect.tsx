'use client';

import { useTransition } from 'react';
import type { Locale } from '@/src/i18n/config';
import {
  Button,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
} from '@fluentui/react-components';

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
  onSetLocaleClick: (locale: Locale) => Promise<void>;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
  onSetLocaleClick,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function onChange(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      onSetLocaleClick(locale);
    });
  }

  return (
    <div className="relative">
      {/* This Component of FluentUI is causing us to disable the React Strict Mode that is not a good Idea 
        Enable Strict mode when Fluent UI fix the Issue https://github.com/microsoft/fluentui/issues/31429
    */}
      <Menu>
        <MenuTrigger disableButtonEnhancement aria-label={label}>
          <Button icon={isPending ? <Spinner /> : null}>{defaultValue}</Button>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>
            {items.map((item) => (
              <MenuItem
                onClick={() => {
                  onChange(item.value);
                }}
                key={item.value}
              >
                {item.label}
              </MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
}
