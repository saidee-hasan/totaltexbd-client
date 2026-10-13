import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

const Container = ({ children, className = "", as: Component = "div", ...props }: ContainerProps) => {
  return (
    <Component 
      className={`max-w-[1400px] w-full mx-auto px-6 md:px-12 lg:px-16 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
