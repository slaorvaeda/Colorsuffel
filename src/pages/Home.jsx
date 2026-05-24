// @ts-nocheck — Three.js types vs IDE checker; file is plain JSX.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { HiAdjustmentsHorizontal, HiPaintBrush, HiPhoto, HiSquares2X2 } from 'react-icons/hi2';

/** @type {[number, number, number, number]} */
const easeOutBezier = [0.22, 1, 0.36, 1];

const fadeUp = (reduce) => ({
  hidden: { opacity: 0, y: reduce ? 0 : 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduce ? 0.01 : 0.55, ease: easeOutBezier },
  },
});

const stagger = (reduce) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: reduce ? 0 : 0.09,
      delayChildren: reduce ? 0 : 0.06,
    },
  },
});

const cardSpring = (reduce) => ({
  hidden: {
    opacity: 0,
    y: reduce ? 0 : 40,
    rotate: reduce ? 0 : -2,
    scale: reduce ? 1 : 0.92,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: reduce
      ? { duration: 0.01 }
      : { type: 'spring', stiffness: 76, damping: 15, mass: 0.65 },
  },
});

const highlightItem = (reduce) => ({
  hidden: { opacity: 0, x: reduce ? 0 : 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: reduce ? { duration: 0.01 } : { type: 'spring', stiffness: 85, damping: 18 },
  },
});

/** Mix: smooth sans · tangy display · script — cycles on hero. */
const HERO_FONT_CYCLE = [
  {
    id: 'nunito',
    label: 'Nunito — soft & smooth',
    kind: 'sans',
    family: '"Nunito", ui-sans-serif, system-ui, sans-serif',
    weight: 800,
    tracking: '0.02em',
    sizeClass:
      'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] leading-[0.98] sm:leading-[0.97]',
  },
  {
    id: 'bebas',
    label: 'Bebas Neue — loud display',
    kind: 'tangy',
    family: '"Bebas Neue", ui-sans-serif, system-ui, sans-serif',
    weight: 400,
    tracking: '0.1em',
    className: 'uppercase',
    sizeClass:
      'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] leading-[0.92] sm:leading-[0.9]',
  },
  {
    id: 'caveat',
    label: 'Caveat — handwritten',
    kind: 'script',
    family: '"Caveat", cursive, ui-serif, serif',
    weight: 700,
    tracking: '0.04em',
    sizeClass:
      'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[8.75rem] leading-[0.95] sm:leading-[0.93]',
  },
  {
    id: 'quicksand',
    label: 'Quicksand — rounded sans',
    kind: 'sans',
    family: '"Quicksand", ui-sans-serif, system-ui, sans-serif',
    weight: 700,
    tracking: '0.03em',
    sizeClass:
      'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] leading-[0.98] sm:leading-[0.97]',
  },
  {
    id: 'righteous',
    label: 'Righteous — retro block',
    kind: 'tangy',
    family: '"Righteous", cursive, system-ui, sans-serif',
    weight: 400,
    tracking: '0.03em',
    sizeClass:
      'text-[2.65rem] min-[400px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9rem] leading-[1.02] sm:leading-[0.98]',
  },
  {
    id: 'pacifico',
    label: 'Pacifico — surf script',
    kind: 'script',
    family: '"Pacifico", cursive, serif',
    weight: 400,
    tracking: '0.06em',
    sizeClass:
      'text-5xl min-[400px]:text-6xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-[8.25rem] leading-[1.08] sm:leading-[1.05]',
  },
  {
    id: 'jakarta',
    label: 'Plus Jakarta — crisp UI',
    kind: 'sans',
    family: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
    weight: 800,
    tracking: '-0.03em',
    sizeClass:
      'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] leading-[0.98] sm:leading-[0.97]',
  },
  {
    id: 'staatliches',
    label: 'Staatliches — poster sharp',
    kind: 'tangy',
    family: '"Staatliches", ui-sans-serif, system-ui, sans-serif',
    weight: 400,
    tracking: '0.12em',
    className: 'uppercase',
    sizeClass:
      'text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] leading-[0.92] sm:leading-[0.9]',
  },
  {
    id: 'great',
    label: 'Great Vibes — flourish script',
    kind: 'script',
    family: '"Great Vibes", cursive, serif',
    weight: 400,
    tracking: '0.1em',
    sizeClass:
      'text-5xl min-[400px]:text-6xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-[8.5rem] leading-[1.06] sm:leading-[1.03]',
  },
];

const tools = [
  {
    title: 'Gradients',
    description: 'Multi-stop gradients with live preview and copy-ready CSS.',
    to: '/gradient',
    accent: 'from-violet-500 via-fuchsia-500 to-cyan-400',
    Icon: HiPaintBrush,
    panelClass:
      'col-span-full lg:col-span-2 lg:row-span-2 lg:row-start-1 lg:col-start-1 min-h-[260px] sm:min-h-[300px] lg:min-h-0',
  },
  {
    title: 'Image picker',
    description: 'Sample dominant tones from any upload for mood boards.',
    to: '/image-picker',
    accent: 'from-sky-400 to-cyan-300',
    Icon: HiPhoto,
    panelClass: 'col-span-full lg:col-span-2 lg:row-start-1 lg:col-start-3 min-h-[200px]',
  },
  {
    title: 'Palettes',
    description: 'Harmonious sets tuned for interfaces and brand systems.',
    to: '/pallet',
    accent: 'from-emerald-400 to-teal-300',
    Icon: HiSquares2X2,
    panelClass: 'col-span-full lg:col-span-1 lg:row-start-2 lg:col-start-3 min-h-[200px]',
  },
  {
    title: 'Shade & tint',
    description: 'Ladder steps from a single hue for UI states and depth.',
    to: '/shade',
    accent: 'from-amber-400 to-orange-400',
    Icon: HiAdjustmentsHorizontal,
    panelClass: 'col-span-full lg:col-span-1 lg:row-start-2 lg:col-start-4 min-h-[200px]',
  },
];

const highlights = [
  {
    title: 'Contrast checker',
    body: 'WCAG-style checks before you ship components.',
    to: '/contrast-checker',
  },
  {
    title: 'Color names',
    body: 'Search human-readable labels alongside hex values.',
    to: '/color-names',
  },
  {
    title: 'Demo layouts',
    body: 'Preview palettes on realistic marketing blocks.',
    to: '/demo-website',
  },
];

/** Decorative SVG in the top-right of each bento card (uses currentColor). */
function BentoCornerArt({ to }) {
  const wrap =
    'pointer-events-none absolute right-1 top-1 h-[4.75rem] w-[4.75rem] text-violet-500/40 transition-all duration-300 group-hover:scale-105 group-hover:text-violet-600/55 sm:right-2 sm:top-2 sm:h-[5.25rem] sm:w-[5.25rem] dark:text-fuchsia-400/30 dark:group-hover:text-cyan-300/45';
  if (to === '/gradient') {
    return (
      <svg className={wrap} viewBox="0 0 88 88" fill="none" aria-hidden>
        <defs>
          <linearGradient id="bento-cg-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d="M68 6C52 22 28 18 10 34c18 10 36 8 54-4-8 18-22 32-42 38"
          stroke="url(#bento-cg-a)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="70" cy="20" r="5" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
        <path d="M14 74c16-8 34-6 52 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
      </svg>
    );
  }
  if (to === '/image-picker') {
    return (
      <svg className={wrap} viewBox="0 0 88 88" fill="none" aria-hidden>
        <path
          d="M56 10h22v22M10 56v22h22"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <circle cx="44" cy="44" r="16" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
        <circle cx="44" cy="44" r="5" fill="currentColor" opacity="0.25" />
      </svg>
    );
  }
  if (to === '/pallet') {
    return (
      <svg className={wrap} viewBox="0 0 88 88" fill="none" aria-hidden>
        <rect x="46" y="10" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.4" opacity="0.45" />
        <rect x="22" y="26" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
        <rect x="50" y="36" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
        <path d="M18 62h52" stroke="currentColor" strokeWidth="1" strokeDasharray="4 5" opacity="0.4" />
      </svg>
    );
  }
  if (to === '/shade') {
    return (
      <svg className={wrap} viewBox="0 0 88 88" fill="none" aria-hidden>
        <rect x="22" y="26" width="48" height="5" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="26" y="38" width="40" height="5" rx="1.5" fill="currentColor" opacity="0.42" />
        <rect x="30" y="50" width="32" height="5" rx="1.5" fill="currentColor" opacity="0.32" />
        <rect x="34" y="62" width="24" height="5" rx="1.5" fill="currentColor" opacity="0.22" />
        <path
          d="M72 14v22M83 25H61"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.45"
        />
      </svg>
    );
  }
  return null;
}

const Home = () => {
  const canvasRef = useRef(/** @type {HTMLCanvasElement | null} */ (null));
  /** @type {React.MutableRefObject<THREE.Object3D[]>} */
  const particlesRef = useRef([]);
  const reduceMotion = useReducedMotion();
  const [heroFontIdx, setHeroFontIdx] = useState(0);
  const bentoSectionRef = useRef(/** @type {HTMLElement | null} */ (null));
  const bentoGlowRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const bentoCardRefs = useRef(/** @type {(HTMLDivElement | null)[]} */ ([]));

  const { scrollYProgress } = useScroll();
  const meshParallaxY = useTransform(scrollYProgress, (p) => (reduceMotion ? 0 : p * -72));
  const meshParallaxYSpring = useSpring(meshParallaxY, {
    stiffness: 100,
    damping: 28,
    mass: 0.45,
  });

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(() => {
      setHeroFontIdx((i) => (i + 1) % HERO_FONT_CYCLE.length);
    }, 1650);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 80,
    });
  }, []);

  useLayoutEffect(() => {
    if (reduceMotion || !bentoSectionRef.current) return undefined;
    gsap.registerPlugin(ScrollTrigger);
    const section = bentoSectionRef.current;
    const cards = bentoCardRefs.current.filter(Boolean);
    if (cards.length === 0) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 56, rotateX: 10, transformOrigin: '50% 0%' },
        {
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: { each: 0.11, from: 'start' },
        },
      );

      if (bentoGlowRef.current) {
        gsap.to(bentoGlowRef.current, {
          opacity: 0.42,
          scale: 1.06,
          duration: 4.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, [reduceMotion]);

  useEffect(() => {
    const initThreeJS = () => {
      if (!canvasRef.current) return undefined;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / Math.max(window.innerHeight, 1),
        0.1,
        1000,
      );
      const renderer = new THREE.WebGLRenderer({ 
        canvas: canvasRef.current, 
        alpha: true,
        antialias: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const particleGeometry = new THREE.SphereGeometry(0.08, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x6366f1,
        transparent: true,
        opacity: 0.35,
      });

      for (let i = 0; i < 40; i += 1) {
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.set(
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 18,
        );
        particle.userData.velocity = {
          x: (Math.random() - 0.5) * 0.018,
          y: (Math.random() - 0.5) * 0.018,
          z: (Math.random() - 0.5) * 0.018,
        };
        scene.add(particle);
        particlesRef.current.push(particle);
      }

      const sphereGeometry = new THREE.SphereGeometry(0.45, 14, 14);
      const sphereMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xc084fc,
        transparent: true,
        opacity: 0.22,
      });

      for (let i = 0; i < 4; i += 1) {
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
        );
        sphere.userData.velocity = {
          x: (Math.random() - 0.5) * 0.008,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.008,
        };
        scene.add(sphere);
        particlesRef.current.push(sphere);
      }

      camera.position.z = 10;

      let raf = 0;
      const animate = () => {
        raf = requestAnimationFrame(animate);
        particlesRef.current.forEach((particle) => {
          if (particle.userData.velocity) {
            particle.position.x += particle.userData.velocity.x;
            particle.position.y += particle.userData.velocity.y;
            particle.position.z += particle.userData.velocity.z;
            if (Math.abs(particle.position.x) > 9) particle.userData.velocity.x *= -1;
            if (Math.abs(particle.position.y) > 9) particle.userData.velocity.y *= -1;
            if (Math.abs(particle.position.z) > 9) particle.userData.velocity.z *= -1;
            particle.rotation.x += 0.008;
            particle.rotation.y += 0.008;
          }
        });
        renderer.render(scene, camera);
      };

      const handleResize = () => {
        camera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      const handleMouseMove = (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        camera.position.x = mouseX * 1.2;
        camera.position.y = mouseY * 1.2;
        camera.lookAt(0, 0, 0);
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('mousemove', handleMouseMove);
      animate();

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        renderer.dispose();
        particlesRef.current = [];
      };
    };

    return initThreeJS();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.22] dark:opacity-[0.18]"
        aria-hidden
      />

      {/* Top gradient mesh — subtle scroll parallax */}
      <motion.div
        style={{ y: meshParallaxYSpring }}
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(139,92,246,0.18),transparent_55%),radial-gradient(900px_480px_at_100%_20%,rgba(56,189,248,0.12),transparent_50%),radial-gradient(800px_400px_at_0%_60%,rgba(244,114,182,0.1),transparent_45%)] dark:bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(139,92,246,0.25),transparent_55%),radial-gradient(900px_480px_at_100%_20%,rgba(56,189,248,0.14),transparent_50%)]"
        aria-hidden
      />

      <div className="relative z-10">
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-3 pb-20 pt-14 sm:px-4 md:pb-28 md:pt-24">
          {/* Ambient floating blobs */}
          {!reduceMotion && (
            <>
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-500/20 md:left-0"
                animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [1, 1.06, 1] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -right-10 top-40 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl dark:bg-sky-400/15 md:right-4"
                animate={{ y: [0, 22, 0], x: [0, -12, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute bottom-32 left-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-fuchsia-400/20 blur-3xl dark:bg-fuchsia-500/15"
                animate={{ y: [0, 14, 0], opacity: [0.55, 0.85, 0.55] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              />
            </>
          )}
          <motion.div
            className="mx-auto max-w-5xl text-center"
            initial="hidden"
            animate="visible"
            variants={stagger(reduceMotion)}
          >
            <motion.p
              variants={fadeUp(reduceMotion)}
              className="font-code text-[11px] font-medium uppercase tracking-[0.35em] text-violet-600 dark:text-violet-300"
              animate={
                reduceMotion
                  ? undefined
                  : { opacity: [0.85, 1, 0.85], letterSpacing: ['0.32em', '0.38em', '0.32em'] }
              }
              transition={reduceMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              Design systems · UI · Brand
            </motion.p>
            <motion.h1
              variants={fadeUp(reduceMotion)}
              className="relative mt-5 flex min-h-[1.15em] flex-col items-center justify-center px-1"
            >
              <span className="sr-only">ColorSuffel</span>
              <motion.span
                key={HERO_FONT_CYCLE[heroFontIdx].id}
                aria-hidden
                data-font-kind={HERO_FONT_CYCLE[heroFontIdx].kind}
                className={`hero-outline-title inline-block ${HERO_FONT_CYCLE[heroFontIdx].sizeClass} ${HERO_FONT_CYCLE[heroFontIdx].className ?? ''}`}
                style={{
                  fontFamily: HERO_FONT_CYCLE[heroFontIdx].family,
                  fontWeight: HERO_FONT_CYCLE[heroFontIdx].weight,
                  letterSpacing: HERO_FONT_CYCLE[heroFontIdx].tracking,
                }}
                initial={
                  reduceMotion ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 14, filter: 'blur(8px)' }
                }
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={
                  reduceMotion
                    ? { duration: 0.01 }
                    : { duration: 0.48, ease: easeOutBezier, type: 'tween' }
                }
              >
              ColorSuffel
              </motion.span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${HERO_FONT_CYCLE[heroFontIdx].id}-label`}
                  initial={reduceMotion ? false : { opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
                  transition={{ duration: 0.28, ease: easeOutBezier }}
                  className="font-code mt-4 inline-block max-w-[min(100%,22rem)] text-[10px] font-medium uppercase leading-relaxed tracking-[0.22em] text-zinc-500 dark:text-zinc-400 sm:text-[11px]"
                  aria-live="polite"
                >
                  {HERO_FONT_CYCLE[heroFontIdx].label}
                </motion.span>
              </AnimatePresence>
            </motion.h1>
            <motion.p
              variants={fadeUp(reduceMotion)}
              className="font-editorial mt-4 text-2xl italic leading-snug text-zinc-600 dark:text-zinc-300 md:text-3xl"
            >
              Precision color tooling for modern product teams.
            </motion.p>
            <motion.p
              variants={fadeUp(reduceMotion)}
              className="font-body mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base"
            >
              Build gradients, extract palettes from imagery, and ship accessible interfaces—with
              exports your engineers can paste straight into CSS or Tailwind.
            </motion.p>

            <motion.div
              variants={fadeUp(reduceMotion)}
              className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <motion.div whileHover={reduceMotion ? undefined : { scale: 1.04 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
            <Link
              to="/gradient"
                className="font-ui inline-flex min-w-[200px] items-center justify-center rounded-full bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:shadow-white/10 dark:hover:bg-zinc-100"
            >
                Open gradient lab
            </Link>
              </motion.div>
              <motion.div whileHover={reduceMotion ? undefined : { scale: 1.04 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
            <Link
              to="/image-picker"
                className="font-ui inline-flex min-w-[200px] items-center justify-center rounded-full border border-zinc-300 bg-white/80 px-8 py-3.5 text-sm font-semibold text-zinc-800 backdrop-blur transition hover:border-zinc-400 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
              >
                Extract from image
              </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Bento workspace — glass grid (theme-aware + GSAP + Framer) */}
        <section
          ref={bentoSectionRef}
          className="relative isolate overflow-hidden bg-gradient-to-b from-zinc-100 via-violet-50/35 to-sky-50/25 py-16 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950 md:py-24"
          aria-labelledby="bento-workspace-heading"
        >
          {/* Starfield — subtle dots for light / bright dots for dark */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35] dark:hidden"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, rgba(24,24,27,0.11) 1px, transparent 1.1px)',
              backgroundSize: '44px 48px',
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 hidden opacity-[0.55] dark:block"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, rgba(255,255,255,0.16) 1px, transparent 1.1px)',
              backgroundSize: '44px 48px',
            }}
            aria-hidden
          />
          {/* Nebula glow */}
          <div
            ref={bentoGlowRef}
            className="pointer-events-none absolute left-1/2 top-[18%] h-[min(520px,70vw)] w-[min(900px,95vw)] -translate-x-1/2 rounded-full opacity-[0.42] blur-3xl dark:opacity-[0.32]"
            style={{
              background:
                'radial-gradient(closest-side, rgba(34,211,238,0.28), transparent 72%), radial-gradient(closest-side, rgba(167,139,250,0.35), transparent 70%)',
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_18%,rgba(139,92,246,0.14),transparent_58%),radial-gradient(ellipse_70%_50%_at_85%_50%,rgba(56,189,248,0.12),transparent_55%),radial-gradient(ellipse_60%_45%_at_12%_58%,rgba(244,114,182,0.1),transparent_50%)] dark:bg-[radial-gradient(ellipse_90%_55%_at_50%_20%,rgba(56,189,248,0.12),transparent_58%),radial-gradient(ellipse_70%_50%_at_85%_55%,rgba(168,85,247,0.16),transparent_55%),radial-gradient(ellipse_60%_45%_at_10%_60%,rgba(244,114,182,0.08),transparent_50%)]"
            aria-hidden
          />

          <div className="relative z-10 mx-auto max-w-6xl px-4">
            <motion.div
              className="mx-auto mb-12 max-w-3xl text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={stagger(reduceMotion)}
            >
              <motion.p
                variants={fadeUp(reduceMotion)}
                className="font-code text-[11px] font-medium uppercase tracking-[0.32em] text-violet-700 dark:text-cyan-300/90"
              >
                ✦ Color workspace
              </motion.p>
              <motion.h2
                id="bento-workspace-heading"
                variants={fadeUp(reduceMotion)}
                className="font-display mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl md:leading-[1.08] dark:text-white"
              >
                Build gradients — then ship them anywhere.
              </motion.h2>
              <motion.p
                variants={fadeUp(reduceMotion)}
                className="font-body mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-600 md:text-base dark:text-zinc-400"
              >
                Glass panels below mirror a deployment grid: pick a tile, open the tool, copy CSS or
                Tailwind in one flow.
              </motion.p>
            </motion.div>

            <div className="grid auto-rows-fr gap-4 [perspective:1400px] sm:gap-5 lg:grid-cols-4 lg:grid-rows-2">
              {tools.map((tool, i) => (
                <div
                  key={tool.to}
                  ref={(el) => {
                    bentoCardRefs.current[i] = el;
                  }}
                  className={`${tool.panelClass} min-h-0`}
                >
                  <motion.div
                    className="h-full"
                    whileHover={
                      reduceMotion ? undefined : { y: -8, transition: { type: 'spring', stiffness: 380, damping: 22 } }
                    }
                    whileTap={reduceMotion ? undefined : { scale: 0.985 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Link
                      to={tool.to}
                      className="group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-[1.4rem] border border-zinc-200/90 bg-gradient-to-b from-white to-zinc-50/95 p-6 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_18px_48px_-26px_rgba(15,23,42,0.1)] backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-300 hover:border-violet-300/90 hover:shadow-[0_1px_0_rgba(255,255,255,1)_inset,0_0_0_1px_rgba(139,92,246,0.12)_inset,0_20px_44px_-18px_rgba(139,92,246,0.15)] sm:p-7 dark:border-white/[0.09] dark:from-white/[0.09] dark:to-white/[0.02] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_60px_-32px_rgba(0,0,0,0.75)] dark:hover:border-cyan-400/35 dark:hover:from-white/[0.12] dark:hover:shadow-[0_0_0_1px_rgba(34,211,238,0.12)_inset,0_0_48px_-12px_rgba(34,211,238,0.18)]"
                    >
                      <BentoCornerArt to={tool.to} />
                      <div
                        className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${tool.accent} opacity-[0.14] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.28] dark:opacity-[0.22] dark:group-hover:opacity-[0.38]`}
                        aria-hidden
                      />
                      <span
                        className={`relative mb-5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.accent} text-white shadow-lg ring-1 ring-zinc-900/10 dark:ring-white/20`}
                      >
                        <tool.Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <h3 className="relative text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl dark:text-white">
                        {tool.title}
                      </h3>
                      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-zinc-600 sm:text-[0.9375rem] dark:text-zinc-400">
                        {tool.description}
                      </p>
                      <span className="relative mt-6 inline-flex items-center gap-2 font-code text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-700 transition group-hover:text-violet-900 dark:text-cyan-200/90 dark:group-hover:text-cyan-100">
                        Launch
                        <span aria-hidden className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="mx-auto max-w-6xl px-4 py-12 md:py-14">
          <motion.div
            className="mx-auto grid max-w-4xl grid-cols-2 gap-6 rounded-2xl border border-zinc-200/80 bg-white/60 px-6 py-8 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/50 md:grid-cols-4 md:gap-4 md:px-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger(reduceMotion)}
          >
            {[
              { label: 'Core tools', value: '12+' },
              { label: 'Export modes', value: 'CSS·TW' },
              { label: 'Focus', value: 'A11y' },
              { label: 'Workflow', value: 'Live' },
            ].map((row) => (
              <motion.div key={row.label} variants={cardSpring(reduceMotion)} className="text-center md:text-left">
                <p className="font-code text-2xl font-semibold tabular-nums text-zinc-900 dark:text-white md:text-3xl">
                  {row.value}
                </p>
                <p className="font-ui mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {row.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Split feature + highlights */}
        <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <motion.div
              className="lg:col-span-5"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp(reduceMotion)}
            >
              <p className="font-code text-[11px] font-medium uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">
                Why teams use it
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white md:text-4xl">
                Built for handoff, not just exploration.
            </h2>
              <p className="font-body mt-4 text-zinc-600 dark:text-zinc-400">
                Consistent naming, multiple spaces, and outputs that match how front-end teams work
                today.
              </p>
              <ul className="font-body mt-8 space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                <li className="flex gap-3">
                  <span className="font-code mt-0.5 text-emerald-600 dark:text-emerald-400">01</span>
                  <span>Shades and tints for hover, pressed, and disabled states.</span>
                  </li>
                <li className="flex gap-3">
                  <span className="font-code mt-0.5 text-emerald-600 dark:text-emerald-400">02</span>
                  <span>Contrast checking before you lock brand colors.</span>
                  </li>
                <li className="flex gap-3">
                  <span className="font-code mt-0.5 text-emerald-600 dark:text-emerald-400">03</span>
                  <span>Gradients with stops you can reorder and copy as CSS.</span>
                  </li>
                </ul>
            </motion.div>

            <motion.div
              className="space-y-4 lg:col-span-7"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger(reduceMotion)}
            >
              {highlights.map((h) => (
                <motion.div key={h.to} variants={highlightItem(reduceMotion)}>
                  <motion.div
                    whileHover={reduceMotion ? undefined : { x: 6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                    whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  >
                  <Link
                    to={h.to}
                    className="group flex items-start justify-between gap-4 rounded-2xl border border-zinc-200/90 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:border-sky-300/70 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-sky-500/40"
                  >
                    <div>
                      <h3 className="font-ui text-lg font-semibold text-zinc-900 dark:text-white">
                        {h.title}
                      </h3>
                      <p className="font-editorial mt-1 text-base italic text-zinc-600 dark:text-zinc-400">
                        {h.body}
                      </p>
              </div>
                    <span className="font-code shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-500 transition group-hover:border-sky-300 group-hover:text-sky-600 dark:border-zinc-700 dark:text-zinc-400 dark:group-hover:border-sky-500 dark:group-hover:text-sky-300">
                      Open
                    </span>
                  </Link>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
        </div>
      </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-4 pb-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp(reduceMotion)}
            className="relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-zinc-900 via-violet-950 to-zinc-900 px-8 py-14 text-center text-white shadow-2xl dark:border-zinc-700"
          >
            {!reduceMotion && (
              <>
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-violet-400/25 blur-3xl"
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
                />
              </>
            )}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_280px_at_80%_0%,rgba(244,114,182,0.35),transparent)]" />
            <div className="relative">
              <p className="font-code text-[11px] font-medium uppercase tracking-[0.35em] text-violet-200/90">
                Next step
              </p>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
                Ship your next palette with confidence.
            </h2>
              <p className="font-body mx-auto mt-4 max-w-xl text-sm leading-relaxed text-violet-100/90 md:text-base">
                Start in the gradient lab or pull colors from a reference image—everything updates
                live.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <motion.div whileHover={reduceMotion ? undefined : { scale: 1.05 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
              <Link
                  to="/gradient"
                  className="font-ui inline-flex min-w-[180px] items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
              >
                  Create gradient
              </Link>
                </motion.div>
                <motion.div whileHover={reduceMotion ? undefined : { scale: 1.05 }} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
              <Link
                  to="/image-picker"
                  className="font-ui inline-flex min-w-[180px] items-center justify-center rounded-full border border-white/35 bg-transparent px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                  Extract colors
              </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
        </div>
    </div>
  );
};

export default Home;
