import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/util/utils';

const SelectNative = ({
  className,
  children,
  ...props
}: React.ComponentProps<'select'>) => {
  return (
    <div className="relative flex">
      <select
        data-slot="select-native"
        className={cn(
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer border-input text-foreground focus-visible:border-ring focus-visible:ring-ring/50 has-[option[disabled]:checked]:text-muted-foreground inline-flex w-full cursor-pointer appearance-none items-center rounded-md border text-sm shadow-2xs outline-hidden transition-[color,box-shadow] [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-scrollbar]:hidden',
          props.multiple === true
            ? '[&_option:checked]:bg-accent [&_option]:bg-background [&_optgroup]:bg-background py-1 *:px-3 *:py-1 [&_optgroup]:dark:bg-[#0F0F12] [&_option]:dark:bg-[#0F0F12]'
            : '[&_option]:bg-background [&_optgroup]:bg-background h-9 ps-3 pe-8 [&_optgroup]:dark:bg-[#0F0F12] [&_option]:dark:bg-[#0F0F12]',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {props.multiple !== true && (
        <span className="peer-aria-invalid:text-destructive/80 text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center peer-disabled:opacity-50">
          <ChevronDownIcon size={16} aria-hidden="true" />
        </span>
      )}
    </div>
  );
};

export { SelectNative };
