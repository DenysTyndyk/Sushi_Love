import React from 'react';
import { useAppRouter } from '../context/AppRouterContext';

const NavLink = ({ to, className, children, ...rest }) => {
  const { navigate } = useAppRouter();

  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
};

export default NavLink;
