import Link from "next/link";
import React from "react";

interface NavLinkProps {
  as?: string;
  href: string;
  [key: string]: string | unknown; // Allow any additional props
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  (props, ref) => {
    const { as, href, ...rest } = props;
    return (
      <Link href={href as string} as={as as string} legacyBehavior>
        <a ref={ref} {...rest} />
      </Link>
    );
  },
);
NavLink.displayName = "NavLink";
