import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      {/* Main */}
      <main className="">{children}</main>
    </div>
  );
};
export default Layout;
