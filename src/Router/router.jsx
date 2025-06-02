import { createBrowserRouter } from "react-router-dom";
import ShadeandTint from "../components/ShadeandTint";
import App from "../App";
import Home from "../components/Home";
import Gradientgen from "../components/Gradientgen";
import Likeshade from "../components/Likeshade";
import PaletteGenerator from "../components/PaletteGenerator";
import Contact from "../components/Contact";

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
                element: <h1>Page not found</h1>    
            }
        ]

    }
]);

export default router;