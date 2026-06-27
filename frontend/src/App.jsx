import Navbar from "./components/common/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Backdrop from "./components/ui/Backdrop";

function App() {
  return (
    <>
      <Backdrop />
      <Navbar />
      <AppRoutes />
    </>
  );
}

export default App;
