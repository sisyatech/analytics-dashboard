import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/shared/theme-provider";
import AppRoutes from "@/routes/AppRoutes";

const App = () => {
	return (
		<BrowserRouter>
			<ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
				<AppRoutes />
			</ThemeProvider>
		</BrowserRouter>
	);
};

export default App;
