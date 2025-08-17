import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Contact from "../components/Contact";
import Home from "../pages/Home";
import ShadeandTint from "../pages/ShadeandTint";
import Likeshade from "../pages/Likeshade";
import Gradientgen from "../pages/Gradientgen";
import PaletteGenerator from "../pages/PaletteGenerator";
import ImageColorPicker from "../pages/ImageColorPicker";
import ColorNames from "../pages/ColorNames";
import ContrastChecker from "../components/ContrastChecker";
import ColorHarmony from "../components/ColorHarmony";
import ColorBlindnessSimulator from "../components/ColorBlindnessSimulator";
import CSSGenerator from "../components/CSSGenerator";
import EyeDropper from "../components/EyeDropper";
import BrandGenerator from "../components/BrandGenerator";
import DemoWebsite from "../components/DemoWebsite";
import WebsitePreview from "../components/WebsitePreview";
import WebsitePreviewFull from "../pages/WebsitePreviewFull";
import UIDesignGuide from "../pages/UIDesignGuide";
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
                path: "/image-picker",
                element: <ImageColorPicker />
            },
            {
                path: "/color-names",
                element: <ColorNames />
            },
            {
                path: "/contrast-checker",
                element: <ContrastChecker />
            },
            {
                path: "/color-harmony",
                element: <ColorHarmony />
            },
            {
                path: "/color-blindness",
                element: <ColorBlindnessSimulator />
            },
            {
                path: "/css-generator",
                element: <CSSGenerator />
            },
            {
                path: "/eye-dropper",
                element: <EyeDropper />
            },
            {
                path: "/brand-generator",
                element: <BrandGenerator />
            },
            {
                path: "/demo-website",
                element: <DemoWebsite />
            },
            {
                path: "/website-preview",
                element: <WebsitePreview />
            },
            {
                path: "/website-preview-full",
                element: <WebsitePreviewFull />
            },
            {
                path: "/ui-design-guide",
                element: <UIDesignGuide />
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