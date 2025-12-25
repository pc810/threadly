export const AppPageTitle = ({
  children,
  ...props
}: React.ComponentProps<"h1">) => {
  return (
    <h1 className="text-3xl font-extrabold pt-6 pb-4" {...props}>
      {children}
    </h1>
  );
};
