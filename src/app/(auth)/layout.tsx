const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <section className="container" data-type='narrow'>{children}</section>;
};

export default AuthLayout;
