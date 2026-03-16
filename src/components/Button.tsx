interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  // Check if custom styling is provided
  const hasCustomStyling =
    className.includes("bg-") || className.includes("text-");

  if (hasCustomStyling) {
    // When custom styling is provided, just apply the base styles and custom className
    return (
      <button
        className={`px-6 py-2 text-sm border transition-all duration-300 hover:shadow-md ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  // Default button styling when no custom styling is provided
  const baseStyles =
    "px-6 py-2 text-sm border transition-all duration-300 hover:shadow-md";

  const variants = {
    primary:
      "border-black  text-black  bg-transparent hover:bg-black hover:text-white  ",
    secondary:
      "border-black  text-black  bg-transparent hover:bg-black hover:text-white  ",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
