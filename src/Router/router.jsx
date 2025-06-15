import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Contact from "../components/Contact";
import Home from "../pages/Home";
import ShadeandTint from "../pages/ShadeandTint";
import Likeshade from "../pages/Likeshade";
import Gradientgen from "../pages/Gradientgen";
import PaletteGenerator from "../pages/PaletteGenerator";
import PagenotFound from "../pages/PagenotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/shade",
                element: <ShadeandTint />
            },
            {
                path: "/gradient",
                element: <Gradientgen />
            },
            {
                path: "/likeshades",
                element: <Likeshade />
            },
            {
                path: "/pallet",
                element: <PaletteGenerator />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "*",
                element: <PagenotFound />   
            }
        ]

    }
]);

export default router;