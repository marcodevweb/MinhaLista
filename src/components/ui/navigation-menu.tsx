import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IconChevronDown, IconChevronRight } from "@tabler/icons-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type NavigationMenuSize = "default" | "compact";
export type NavigationMenuAlign = "start" | "center" | "end";

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  size?: NavigationMenuSize;
  delayDuration?: number;
  skipDelayOnSwitch?: boolean;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export type NavigationMenuListProps = React.HTMLAttributes<HTMLUListElement>;
export type NavigationMenuItemProps = React.HTMLAttributes<HTMLLIElement>;

export interface NavigationMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showChevron?: boolean;
}

export interface NavigationMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  align?: NavigationMenuAlign;
}

export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  active?: boolean;
}

export type NavigationMenuIconProps = React.HTMLAttributes<HTMLSpanElement>;
export type NavigationMenuDescriptionProps = React.HTMLAttributes<HTMLSpanElement>;

export interface NavigationMenuSubProps {
  children: React.ReactNode;
}

export type NavigationMenuSubTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
export type NavigationMenuSubContentProps = React.HTMLAttributes<HTMLDivElement>;
export type NavigationMenuGroupProps = React.HTMLAttributes<HTMLDivElement>;
export type NavigationMenuGroupHeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

const NavigationMenuSizeContext = React.createContext<NavigationMenuSize>("default");
const useNavSize = () => React.useContext(NavigationMenuSizeContext);

export const NavigationMenu = React.forwardRef<HTMLElement, NavigationMenuProps>(
  function NavigationMenu(
    {
      size = "default",
      className,
      children,
      value: valueProp,
      defaultValue,
      onValueChange,
      ...props
    },
    ref,
  ) {
    const [activeItem, setActiveItem] = React.useState<string | null>(valueProp ?? defaultValue ?? null);

    const handleValueChange = (val: string | null) => {
      setActiveItem(val);
      onValueChange?.(val);
    };

    const ctxValue = React.useMemo(() => ({ activeItem, setActiveItem: handleValueChange }), [activeItem]);

    return (
      <NavigationMenuSizeContext.Provider value={size}>
        <div
          ref={ref as any}
          className={cn("relative inline-flex items-center", className)}
          {...props}
        >
          <NavigationMenuContext.Provider value={ctxValue}>
            {children}
          </NavigationMenuContext.Provider>
        </div>
      </NavigationMenuSizeContext.Provider>
    );
  }
);

interface NavContextType {
  activeItem: string | null;
  setActiveItem: (val: string | null) => void;
}
const NavigationMenuContext = React.createContext<NavContextType>({ activeItem: null, setActiveItem: () => {} });

export const NavigationMenuList = React.forwardRef<HTMLUListElement, NavigationMenuListProps>(
  function NavigationMenuList({ className, style, ...props }, ref) {
    const size = useNavSize();
    return (
      <ul
        ref={ref}
        style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0, alignItems: 'center', gap: '4px', ...style }}
        className={cn(className)}
        {...props}
      />
    );
  }
);

export const NavigationMenuItem = React.forwardRef<HTMLLIElement, NavigationMenuItemProps & { value?: string }>(
  function NavigationMenuItem({ className, style, value, children, ...props }, ref) {
    const [isOpen, setIsOpen] = React.useState(false);
    const itemRef = React.useRef<HTMLLIElement>(null);

    React.useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <li ref={(node) => {
        (itemRef as any).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as any).current = node;
      }} style={{ listStyle: 'none', margin: 0, padding: 0, position: 'relative', ...style }} className={cn(className)} {...props}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;
          if (child.type === NavigationMenuTrigger) {
            return React.cloneElement(child as any, {
              onClick: () => setIsOpen(!isOpen),
              isOpen,
            });
          }
          if (child.type === NavigationMenuContent) {
            return isOpen ? child : null;
          }
          return child;
        })}
      </li>
    );
  }
);

export const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuTriggerProps & { isOpen?: boolean }>(
  function NavigationMenuTrigger({ className, showChevron = true, children, isOpen, ...props }, ref) {
    const size = useNavSize();
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "group/nav-item relative inline-flex select-none items-center gap-1.5 rounded-xl font-medium outline-none transition-colors duration-100 text-gray-700 hover:text-gray-900 hover:bg-gray-100 m-0",
          isOpen && "text-gray-900 bg-gray-100",
          size === "compact" ? "px-2.5 py-1.5 text-[13px]" : "px-3 py-2 text-[14px]",
          className,
        )}
        {...props}
      >
        {children}
        {showChevron && (
          <IconChevronDown
            size={size === "compact" ? 12 : 14}
            stroke={2}
            className={cn("shrink-0 text-gray-500 transition-transform duration-200", isOpen && "rotate-180")}
          />
        )}
      </button>
    );
  }
);

export const NavigationMenuContent = React.forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  function NavigationMenuContent({ className, width = "w-[24rem]", children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute left-0 top-full mt-2 z-50 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 text-gray-900 shadow-xl",
          width,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  function NavigationMenuLink({ className, asChild, active, children, ...props }, ref) {
    const size = useNavSize();
    const linkClass = cn(
      "group/nav-link inline-flex select-none items-center gap-1.5 rounded-xl font-medium outline-none transition-colors duration-100 text-gray-700 hover:text-gray-900 hover:bg-gray-100",
      active && "text-gray-900 bg-gray-100",
      size === "compact" ? "px-2.5 py-1.5 text-[13px]" : "px-3 py-2 text-[14px]",
      className,
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        className: cn(linkClass, (children.props as any).className),
        ...props,
      } as any);
    }

    return (
      <a ref={ref} className={linkClass} {...props}>
        {children}
      </a>
    );
  }
);

export const NavigationMenuIcon = React.forwardRef<HTMLSpanElement, NavigationMenuIconProps>(
  function NavigationMenuIcon({ className, ...props }, ref) {
    const size = useNavSize();
    return (
      <span
        ref={ref}
        className={cn("inline-flex shrink-0 items-center justify-center text-gray-500 group-hover/nav-item:text-gray-900", size === "compact" ? "size-4" : "size-5", className)}
        {...props}
      />
    );
  }
);

export const NavigationMenuDescription = React.forwardRef<HTMLSpanElement, NavigationMenuDescriptionProps>(
  function NavigationMenuDescription({ className, ...props }, ref) {
    const size = useNavSize();
    return <span ref={ref} className={cn("block text-gray-500 leading-snug", size === "compact" ? "text-[11px]" : "text-[12px]", className)} {...props} />;
  }
);

export function NavigationMenuSub({ children }: NavigationMenuSubProps) {
  return <div className="relative">{children}</div>;
}

export const NavigationMenuSubTrigger = React.forwardRef<HTMLButtonElement, NavigationMenuSubTriggerProps>(
  function NavigationMenuSubTrigger({ className, children, onClick, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn("relative flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-sm outline-none text-gray-900 hover:bg-gray-100", className)}
        {...props}
      >
        {children}
        <span className="ml-auto flex items-center">
          <IconChevronRight size={14} stroke={2} />
        </span>
      </button>
    );
  }
);

export const NavigationMenuSubContent = React.forwardRef<HTMLDivElement, NavigationMenuSubContentProps>(
  function NavigationMenuSubContent({ className, children, ...props }, ref) {
    return <div ref={ref} className={cn("overflow-hidden pl-4", className)} {...props}>{children}</div>;
  }
);

export const NavigationMenuGroup = React.forwardRef<HTMLDivElement, NavigationMenuGroupProps>(
  function NavigationMenuGroup({ className, children, ...props }, ref) {
    return <div ref={ref} role="group" className={cn("flex flex-col", className)} {...props}>{children}</div>;
  }
);

export const NavigationMenuGroupHeading = React.forwardRef<HTMLHeadingElement, NavigationMenuGroupHeadingProps>(
  function NavigationMenuGroupHeading({ className, children, ...props }, ref) {
    return <h4 ref={ref} className={cn("px-2.5 py-1.5 text-[11px] font-medium tracking-[0.02em] text-gray-500", className)} {...props}>{children}</h4>;
  }
);
