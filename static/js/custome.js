/* ──────────────────────────────────────────────────────────────
   DYNAMIC LOGO SWITCH based on scroll position
   ────────────────────────────────────────────────────────────── */
(function ($) {
    "use strict";
    function updateHeaderFixedClass() {
        var scroll = $(window).scrollTop();
        var $header = $("#site-header");
        if (scroll >= 80) { $header.addClass("nav-fixed"); }
        else { $header.removeClass("nav-fixed"); }
    }
    function getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }
    function updateLogo() {
        var $logoImg = $('.navbar-brand img');
        if (!$logoImg.length) return;
        var isFixed = $('#site-header').hasClass('nav-fixed');
        if (!isFixed) {
            var defaultSrc = $logoImg.attr('data-default-logo') || $logoImg.attr('src');
            if ($logoImg.attr('src') !== defaultSrc) { $logoImg.attr('src', defaultSrc); }
            return;
        }
        var theme = getCurrentTheme();
        var attrName = theme === 'dark' ? 'data-dark-scrolled-logo' : 'data-light-scrolled-logo';
        var targetSrc = $logoImg.attr(attrName) || $logoImg.attr('data-scrolled-logo');
        if (!targetSrc) { targetSrc = $logoImg.attr('data-default-logo') || $logoImg.attr('src'); }
        if (targetSrc && $logoImg.attr('src') !== targetSrc) { $logoImg.attr('src', targetSrc); }
    }
    window.updateLogo = updateLogo;
    function onScrollHandler() { updateHeaderFixedClass(); updateLogo(); }
    function initializeFixedAndLogo() { updateHeaderFixedClass(); updateLogo(); }
    $(window).on("scroll", onScrollHandler);
    $(window).on("resize", function () { setTimeout(updateLogo, 50); });
    $(document).ready(function () { initializeFixedAndLogo(); });
    $(window).on("load", function () { updateLogo(); });
})(jQuery);


/* ──────────────────────────────────────────────────────────────
   Typing Animation
   ────────────────────────────────────────────────────────────── */
(function () {
    "use strict";
    function initTypedText() {
        const typedTextSpan = document.querySelector(".typed-text");
        const cursorSpan = document.querySelector(".cursor");
        if (!typedTextSpan || !cursorSpan) return;
        const textArray = JSON.parse(typedTextSpan.getAttribute('data-words'));
        const typingDelay = 200, erasingDelay = 100, newTextDelay = 100;
        let textArrayIndex = 0, charIndex = 0;
        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }
        function erase() {
            if (charIndex > 0) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay);
            }
        }
        setTimeout(type, newTextDelay + 250);
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTypedText);
    } else { initTypedText(); }
})();


/* ──────────────────────────────────────────────────────────────
   Banner text slider
   ────────────────────────────────────────────────────────────── */
(function () {
    "use strict";
    function getAutoplayDelay() {
        const w = window.innerWidth;
        if (w < 576) return 2600;
        if (w < 768) return 2900;
        if (w < 992) return 3100;
        if (w < 1200) return 3300;
        return 3600;
    }
    function initMainSliderBanner() {
        const sliderRoot = document.querySelector(".main-slider-banner");
        if (!sliderRoot || typeof Swiper === "undefined") return;
        const sliderEl = sliderRoot.querySelector(".main-slider-banner__swiper");
        const paginationEl = sliderRoot.querySelector(".main-slider-banner__pagination");
        if (!sliderEl || !paginationEl) return;
        const slider = new Swiper(sliderEl, {
            slidesPerView: 1, spaceBetween: 0, loop: true, speed: 420, grabCursor: true,
            watchSlidesProgress: true, keyboard: { enabled: true },
            autoplay: { delay: getAutoplayDelay(), disableOnInteraction: false, pauseOnMouseEnter: true },
            pagination: { el: paginationEl, clickable: true },
            a11y: {
                prevSlideMessage: "Previous quote",
                nextSlideMessage: "Next quote",
                paginationBulletMessage: "Go to quote {{index}}",
            },
        });
        let resizeTimer;
        window.addEventListener("resize", function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                if (slider.autoplay) { slider.params.autoplay.delay = getAutoplayDelay(); }
            }, 180);
        });
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMainSliderBanner);
    } else { initMainSliderBanner(); }
})();


/* ──────────────────────────────────────────────────────────────
   Course slider
   ────────────────────────────────────────────────────────────── */
(function ($) {
    "use strict";
    var swiperEl = document.querySelector('.course-swiper');
    if (swiperEl) {
        var swiper = new Swiper(swiperEl, {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: false },
            speed: 600, slidesPerView: 1, spaceBetween: 30,
            navigation: {
                nextEl: '.course-swiper-wrapper .swiper-button-next',
                prevEl: '.course-swiper-wrapper .swiper-button-prev',
            },
            pagination: { el: '.course-swiper .course-pagination', clickable: true },
            breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 20 },
                600: { slidesPerView: 2, spaceBetween: 24 },
                1000: { slidesPerView: 3, spaceBetween: 30 }
            },
        });
        $(document).on('keydown', function (e) {
            if (e.key === 'ArrowLeft') { swiper.slidePrev(); e.preventDefault(); }
            else if (e.key === 'ArrowRight') { swiper.slideNext(); e.preventDefault(); }
        });
        var resizeTimer;
        $(window).on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () { swiper.update(); }, 180);
        });
    }
})(jQuery);


// protfolio slider
(function () {
    var cards = document.querySelectorAll('.npf-card');
    if (!cards.length) return;

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || !('IntersectionObserver' in window)) {
        cards.forEach(function (c) { c.classList.add('is-in'); });
        return;
    }

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    cards.forEach(function (c) { io.observe(c); });

    window.setTimeout(function () {
        document.querySelectorAll('.npf-card:not(.is-in)').forEach(function (c) {
            var r = c.getBoundingClientRect();
            if (r.top < window.innerHeight && r.bottom > 0) c.classList.add('is-in');
        });
    }, 2500);
})();

/* ──────────────────────────────────────────────────────────────
   Resume rain engine — UNCHANGED (works with position: absolute)
   ────────────────────────────────────────────────────────────── */
(function () {
    "use strict";
    const MAX = 7000, L = 19, STEP = 1 / 60, PUFFS = 32;
    const TAU = Math.PI * 2, AGE_BUCKETS = 6, SEGS_PER_BUCKET = 3;
    const DEFAULT_CALM = [8, 145, 178], DEFAULT_MID = [124, 58, 237],
        DEFAULT_HOT = [219, 39, 119], DEFAULT_CORE = [11, 18, 32];
    const BASE_ALPHA = [0.50, 0.65, 0.85], BASE_WIDTH = [0.7, 0.9, 1.2];
    const ALPHA_GAIN = 1.15, HEAD_WIDTH = 1.4;
    const K_RELAX = 1 - Math.exp(-STEP / 0.12);
    const K_Q = 1 - Math.exp(-STEP * 8);
    const K_CURSOR = 1 - Math.exp(-STEP * 18);
    const K_VEL = 1 - Math.exp(-STEP * 10);
    const K_IN = 1 - Math.exp(-STEP / 0.06);
    const K_OUT = 1 - Math.exp(-STEP / 0.2);
    const FIRE_P = 0.03 * STEP;
    const FIRE_DECAY = Math.exp(-STEP / 0.45);
    const PUFF_DECAY = Math.exp(-STEP / 1.1);
    const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v);
    function mulberry32(seed) {
        let a = seed >>> 0;
        return function () {
            a = (a + 0x6d2b79f5) >>> 0;
            let t = a;
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    function parseHex(input, fallback) {
        if (!input) return fallback;
        let s = String(input).trim().replace(/^#/, "");
        if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
        if (!/^[0-9a-fA-F]{6}$/.test(s)) return fallback;
        const n = parseInt(s, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }
    function makeWave(lambda, angle, omega, phase, amp) {
        const k = TAU / lambda;
        return {
            kx: k * Math.cos(angle), ky: k * Math.sin(angle),
            om: omega, ph: phase,
            au: amp * Math.sin(angle), av: -amp * Math.cos(angle)
        };
    }
    const WAVE_0 = makeWave(380, 0.35, 0.18, 0.7, 16);
    const WAVE_1 = makeWave(620, 1.9, 0.27, 2.1, 13);
    const WAVE_2 = makeWave(900, 3.4, 0.35, 4.2, 10);
    function readConfig(root) {
        const d = root.dataset;
        const num = (v, fb) => (v === undefined || v === "" || isNaN(+v) ? fb : +v);
        const bool = (v, fb) => (v === undefined ? fb : v === "true" || v === "1" || v === "");
        return {
            count: d.count !== undefined && d.count !== "" ? +d.count : undefined,
            flowSpeed: num(d.flowSpeed, 1),
            obstacleRadius: num(d.obstacleRadius, 64),
            autopilot: bool(d.autopilot, true),
            palette: { calm: d.calm, mid: d.mid, hot: d.hot }
        };
    }
    function startRain(root) {
        const main = root.querySelector(".resume-main");
        const bloom = root.querySelector(".resume-bloom");
        if (!main || !bloom) return;
        const ctx = main.getContext("2d");
        const bctx = bloom.getContext("2d");
        if (!ctx || !bctx) return;
        const cfg = readConfig(root);
        const flowSpeed = clamp(cfg.flowSpeed, 0.05, 5);
        const obsR = cfg.obstacleRadius;
        const autopilotOn = cfg.autopilot;
        const reduced = typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const rand = mulberry32(7);
        let initialised = false, live = false;
        let w = 0, h = 0, dpr = 1, bw = 1, bh = 1;
        const px = new Float32Array(MAX), py = new Float32Array(MAX);
        const vx = new Float32Array(MAX), vy = new Float32Array(MAX);
        const pz = new Float32Array(MAX), v0 = new Float32Array(MAX);
        const qv = new Float32Array(MAX), fire = new Float32Array(MAX);
        const len = new Uint8Array(MAX);
        const hx = new Float32Array(MAX * L), hy = new Float32Array(MAX * L);
        let head = 0;
        const groupList = [];
        for (let g = 0; g < 6; g++) groupList.push(new Int32Array(MAX));
        const groupCount = new Int32Array(6);
        const strokeStyles = new Array(6 * AGE_BUCKETS).fill("");
        const strokeWidths = new Float32Array(6 * AGE_BUCKETS);
        const headStyles = ["", ""];
        let haloGradient = null, compositeOp = "multiply";
        const pX = new Float32Array(PUFFS), pY = new Float32Array(PUFFS);
        const pGamma = new Float32Array(PUFFS), pAge = new Float32Array(PUFFS);
        const pAlive = new Uint8Array(PUFFS);
        const aX = new Float32Array(PUFFS), aY = new Float32Array(PUFFS);
        const aG = new Float32Array(PUFFS);
        const aC2 = new Float32Array(PUFFS), aR2 = new Float32Array(PUFFS);
        let aCount = 0, puffCursor = 0, shedSign = 1, shedAcc = 0;
        let simTime = 0, liveTime = 0, active = 0, targetCount = 0, quality = 1;
        let pointerActive = false, pointerX = 0, pointerY = 0;
        let idleSince = 0, idleDelay = 1.2;
        let prevSrc = 0, tgtX = 0, tgtY = 0, cx = 0, cy = 0, pcx = 0, pcy = 0, vcx = 0, vcy = 0;
        let influence = 0, curA = 64;
        let raf = 0, last = 0, acc = 0, frameEma = 16.7, workEma = 4;
        let slowFrames = 0, fastFrames = 0;
        function buildStyles() {
            const cs = getComputedStyle(root);
            const pal = cfg.palette;
            const calm = parseHex(pal.calm || cs.getPropertyValue("--resume-calm"), DEFAULT_CALM);
            const mid = parseHex(pal.mid || cs.getPropertyValue("--resume-mid"), DEFAULT_MID);
            const hot = parseHex(pal.hot || cs.getPropertyValue("--resume-hot"), DEFAULT_HOT);
            const core = parseHex(cs.getPropertyValue("--resume-core"), DEFAULT_CORE);
            const colours = [calm, mid, hot];
            const comp = (cs.getPropertyValue("--resume-composite") || "multiply").trim();
            compositeOp = comp === "screen" ? "screen" : "multiply";
            for (let g = 0; g < 6; g++) {
                const depth = g < 3 ? 0 : 1;
                const bucket = g % 3;
                const c = colours[bucket];
                for (let ab = 0; ab < AGE_BUCKETS; ab++) {
                    const falloff = Math.pow(1 - (ab + 0.5) / AGE_BUCKETS, 1.5);
                    const alpha = Math.min(0.95, BASE_ALPHA[bucket] * (depth === 0 ? 0.55 : 1) * falloff * ALPHA_GAIN);
                    strokeStyles[g * AGE_BUCKETS + ab] = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + alpha.toFixed(3) + ")";
                    const width = BASE_WIDTH[bucket] * (depth === 0 ? 0.75 : 1) * (1 - (0.45 * ab) / AGE_BUCKETS);
                    strokeWidths[g * AGE_BUCKETS + ab] = clamp(width, 0.6, 1.3);
                }
            }
            headStyles[0] = "rgba(" + core[0] + "," + core[1] + "," + core[2] + ",0.5)";
            headStyles[1] = "rgba(" + core[0] + "," + core[1] + "," + core[2] + ",0.85)";
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
            grad.addColorStop(0, "rgba(" + hot[0] + "," + hot[1] + "," + hot[2] + ",1)");
            grad.addColorStop(0.45, "rgba(" + hot[0] + "," + hot[1] + "," + hot[2] + ",0.32)");
            grad.addColorStop(1, "rgba(" + hot[0] + "," + hot[1] + "," + hot[2] + ",0)");
            haloGradient = grad;
        }
        function seedParticle(i, uniform) {
            let x, y;
            if (uniform) { x = rand() * w; y = rand() * h; }
            else { x = -40 + rand() * (w + 80); y = -40 - rand() * 80; }
            const z = 0.35 + 0.65 * rand();
            const nominal = 70 + 90 * z * z;
            pz[i] = z; v0[i] = nominal;
            len[i] = 9 + Math.floor(rand() * 11);
            px[i] = x; py[i] = y; vx[i] = 0; vy[i] = nominal * flowSpeed;
            qv[i] = 1; fire[i] = 0;
            const base = i * L;
            for (let k = 0; k < L; k++) { hx[base + k] = x; hy[base + k] = y; }
        }
        function setActive(n, uniform) {
            const next = clamp(Math.round(n), 1, MAX);
            for (let i = active; i < next; i++) seedParticle(i, uniform);
            active = next;
        }
        function applyCount(uniform) {
            const auto = clamp(Math.round((w * h) / 520), 1200, 5200);
            const requested = cfg.count;
            targetCount = clamp(Math.round(requested !== undefined ? requested : auto), 1, MAX);
            setActive(targetCount * quality, uniform);
        }
        function spawnPuff(a, speed) {
            const dxn = vcx / speed, dyn = vcy / speed;
            const sign = shedSign; shedSign = -shedSign;
            const j = puffCursor; puffCursor = (puffCursor + 1) % PUFFS;
            pX[j] = cx - dxn * 0.6 * a - dyn * sign * 0.7 * a;
            pY[j] = cy - dyn * 0.6 * a + dxn * sign * 0.7 * a;
            pGamma[j] = clamp(sign * Math.min(speed, 1200) * a * 1.5, -105000, 105000);
            pAge[j] = 0; pAlive[j] = 1;
        }
        function simulate() {
            head = (head + 1) % L;
            simTime += STEP;
            if (live) liveTime += STEP;
            const ghostOn = !reduced && autopilotOn && !pointerActive && live &&
                liveTime - idleSince >= idleDelay;
            const src = pointerActive ? 2 : ghostOn ? 1 : 0;
            if (src === 1) {
                tgtX = w * (0.5 + 0.32 * Math.sin(0.37 * liveTime));
                tgtY = h * (0.5 + 0.28 * Math.sin(0.53 * liveTime + 1.2));
            } else if (src === 2) { tgtX = pointerX; tgtY = pointerY; }
            const snap = src !== 0 && prevSrc === 0 && influence < 0.05;
            prevSrc = src;
            if (snap) {
                cx = tgtX; cy = tgtY; pcx = cx; pcy = cy; vcx = 0; vcy = 0;
            } else {
                pcx = cx; pcy = cy;
                cx += (tgtX - cx) * K_CURSOR;
                cy += (tgtY - cy) * K_CURSOR;
                vcx += ((cx - pcx) / STEP - vcx) * K_VEL;
                vcy += ((cy - pcy) / STEP - vcy) * K_VEL;
            }
            influence += ((src !== 0 ? 1 : 0) - influence) * (src !== 0 ? K_IN : K_OUT);
            const infl = influence;
            const vcMag = Math.sqrt(vcx * vcx + vcy * vcy);
            const a = obsR + Math.min(vcMag * 0.025, 36);
            curA = a;
            if (infl > 0.3 && vcMag > 60) {
                const dxm = cx - pcx, dym = cy - pcy;
                shedAcc += Math.sqrt(dxm * dxm + dym * dym);
                let guard = 0;
                while (shedAcc >= 28 && guard < 4) { shedAcc -= 28; guard++; spawnPuff(a, vcMag); }
                if (shedAcc >= 28) shedAcc = 0;
            } else { shedAcc = 0; }
            aCount = 0;
            const puffDrift = 0.5 * 115 * flowSpeed * STEP;
            for (let j = 0; j < PUFFS; j++) {
                if (pAlive[j] === 0) continue;
                const age = pAge[j] + STEP;
                if (age > 2.4) { pAlive[j] = 0; continue; }
                pAge[j] = age; pGamma[j] *= PUFF_DECAY; pY[j] += puffDrift;
                const c2 = 676 + 90 * age;
                aX[aCount] = pX[j]; aY[aCount] = pY[j];
                aG[aCount] = pGamma[j] / TAU;
                aC2[aCount] = c2; aR2[aCount] = 36 * c2;
                aCount++;
            }
            const ph0 = WAVE_0.om * simTime + WAVE_0.ph;
            const ph1 = WAVE_1.om * simTime + WAVE_1.ph;
            const ph2 = WAVE_2.om * simTime + WAVE_2.ph;
            const k0x = WAVE_0.kx, k0y = WAVE_0.ky;
            const k1x = WAVE_1.kx, k1y = WAVE_1.ky;
            const k2x = WAVE_2.kx, k2y = WAVE_2.ky;
            const a0u = WAVE_0.au, a0v = WAVE_0.av;
            const a1u = WAVE_1.au, a1v = WAVE_1.av;
            const a2u = WAVE_2.au, a2v = WAVE_2.av;
            const obsOn = infl > 0.002;
            const projectOn = infl > 0.05;
            const projScale = Math.min(1, infl * 1.5);
            const respawnBottom = h + 40, respawnRight = w + 120;
            for (let i = 0; i < active; i++) {
                const x0 = px[i], y0 = py[i], z = pz[i];
                const v0e = v0[i] * flowSpeed;
                const c0 = Math.cos(k0x * x0 + k0y * y0 + ph0);
                const c1 = Math.cos(k1x * x0 + k1y * y0 + ph1);
                const c2 = Math.cos(k2x * x0 + k2y * y0 + ph2);
                let tx = (a0u * c0 + a1u * c1 + a2u * c2) * z;
                let ty = v0e + (a0v * c0 + a1v * c1 + a2v * c2) * z;
                const zf = 0.55 + 0.45 * z;
                const aE = a * zf;
                const rx = x0 - cx, ry = y0 - cy;
                let pertX = 0, pertY = 0, deficit = 0;
                if (obsOn) {
                    const d2 = rx * rx + ry * ry;
                    let Ux = -vcx, Uy = v0e - vcy;
                    let U = Math.sqrt(Ux * Ux + Uy * Uy);
                    if (U > 1e-3) {
                        if (U > 900) { const sc = 900 / U; Ux *= sc; Uy *= sc; U = 900; }
                        const ex = Ux / U, ey = Uy / U;
                        const s = rx * ex + ry * ey;
                        const n = -rx * ey + ry * ex;
                        if (s > 0 && s < 12 * aE) {
                            const wd = 0.9 * aE + 0.2 * s;
                            const nn = n / wd;
                            deficit = 0.55 * Math.exp(-s / (3 * aE)) * Math.exp(-nn * nn);
                        }
                        const near = 9 * aE;
                        if (d2 < near * near) {
                            const rho2 = Math.max(s * s + n * n, aE * aE * 0.64);
                            const k = (aE * aE) / (rho2 * rho2);
                            const ds = -U * k * (s * s - n * n);
                            const dn = -U * k * 2 * s * n;
                            let win = 1;
                            const inner = 5 * aE;
                            if (d2 > inner * inner) {
                                const t = (Math.sqrt(d2) - inner) / (4 * aE);
                                win = 1 - t * t * (3 - 2 * t);
                            }
                            pertX = (ds * ex - dn * ey) * win;
                            pertY = (ds * ey + dn * ex) * win;
                        }
                    }
                }
                let vorX = 0, vorY = 0;
                for (let j = 0; j < aCount; j++) {
                    const dx = x0 - aX[j], dy = y0 - aY[j];
                    const d2p = dx * dx + dy * dy + 1e-3;
                    const r2 = aR2[j];
                    if (d2p < r2) {
                        const f = (aG[j] * (1 - Math.exp(-d2p / aC2[j]))) / d2p;
                        const wnd = 1 - d2p / r2;
                        const fw = f * wnd * wnd * zf;
                        vorX += -dy * fw; vorY += dx * fw;
                    }
                }
                const keep = 1 - deficit * infl;
                tx = tx * keep + pertX * infl + vorX;
                ty = ty * keep + pertY * infl + vorY;
                let ux = vx[i] + (tx - vx[i]) * K_RELAX;
                let uy = vy[i] + (ty - vy[i]) * K_RELAX;
                const sp2 = ux * ux + uy * uy;
                if (sp2 > 810000) { const sc = 900 / Math.sqrt(sp2); ux *= sc; uy *= sc; }
                let x = x0 + ux * STEP, y = y0 + uy * STEP;
                if (projectOn) {
                    const aP = aE * projScale;
                    const qx = x - cx, qy = y - cy;
                    const q2 = qx * qx + qy * qy;
                    const lim = 0.98 * aP;
                    if (q2 < lim * lim) {
                        const rr = Math.sqrt(q2);
                        const nx = rr < 1e-3 ? 0 : qx / rr;
                        const ny = rr < 1e-3 ? 1 : qy / rr;
                        x = cx + nx * aP; y = cy + ny * aP;
                        const vn = (ux - vcx) * nx + (uy - vcy) * ny;
                        if (vn < 0) { ux -= vn * nx; uy -= vn * ny; }
                    }
                }
                vx[i] = ux; vy[i] = uy;
                px[i] = x; py[i] = y;
                if (y > respawnBottom || x < -120 || x > respawnRight || y < -600) {
                    seedParticle(i, false); continue;
                }
                qv[i] += (Math.sqrt(ux * ux + uy * uy) / v0e - qv[i]) * K_Q;
                if (rand() < FIRE_P) fire[i] = 1;
                else { const f = fire[i] * FIRE_DECAY; fire[i] = f < 0.01 ? 0 : f; }
                const slot = i * L + head;
                hx[slot] = x; hy[slot] = y;
            }
        }
        function render() {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = compositeOp;
            ctx.lineCap = "round"; ctx.lineJoin = "round";
            if (influence > 0.02 && haloGradient) {
                const speed = Math.sqrt(vcx * vcx + vcy * vcy);
                const r = 1.5 * curA;
                ctx.globalAlpha = Math.min(1, (0.05 + Math.min(speed / 4000, 0.07)) * influence);
                ctx.setTransform(dpr * r, 0, 0, dpr * r, dpr * cx, dpr * cy);
                ctx.fillStyle = haloGradient;
                ctx.fillRect(-1, -1, 2, 2);
                ctx.globalAlpha = 1;
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }
            groupCount.fill(0);
            for (let i = 0; i < active; i++) {
                const qq = qv[i];
                let b = qq < 1.25 ? 0 : qq < 1.85 ? 1 : 2;
                if (fire[i] > 0.35 && b < 2) b++;
                const g = (pz[i] < 0.62 ? 0 : 3) + b;
                groupList[g][groupCount[g]++] = i;
            }
            for (let g = 0; g < 6; g++) {
                const cnt = groupCount[g];
                if (cnt === 0) continue;
                const list = groupList[g];
                for (let ab = 0; ab < AGE_BUCKETS; ab++) {
                    const k0 = ab * SEGS_PER_BUCKET;
                    const k1 = k0 + SEGS_PER_BUCKET;
                    ctx.strokeStyle = strokeStyles[g * AGE_BUCKETS + ab];
                    ctx.lineWidth = strokeWidths[g * AGE_BUCKETS + ab];
                    ctx.beginPath();
                    for (let j = 0; j < cnt; j++) {
                        const i = list[j];
                        const segs = len[i] - 1;
                        if (k0 >= segs) continue;
                        const base = i * L;
                        const kEnd = Math.min(k1, segs);
                        let idx = (head - k0 + L) % L;
                        ctx.moveTo(hx[base + idx], hy[base + idx]);
                        for (let k = k0; k < kEnd; k++) {
                            idx = idx === 0 ? L - 1 : idx - 1;
                            ctx.lineTo(hx[base + idx], hy[base + idx]);
                        }
                    }
                    ctx.stroke();
                }
            }
            const prevHead = head === 0 ? L - 1 : head - 1;
            ctx.lineWidth = HEAD_WIDTH;
            for (let depth = 0; depth < 2; depth++) {
                ctx.strokeStyle = headStyles[depth];
                ctx.beginPath();
                for (let b = 1; b < 3; b++) {
                    const g = depth * 3 + b;
                    const cnt = groupCount[g];
                    const list = groupList[g];
                    for (let j = 0; j < cnt; j++) {
                        const i = list[j];
                        if (b === 1 && fire[i] <= 0.5) continue;
                        const base = i * L;
                        ctx.moveTo(hx[base + head], hy[base + head]);
                        ctx.lineTo(hx[base + prevHead], hy[base + prevHead]);
                    }
                }
                ctx.stroke();
            }
            bctx.clearRect(0, 0, bw, bh);
            bctx.drawImage(main, 0, 0, bw, bh);
        }
        function presim(seconds) {
            const n = Math.round(seconds / STEP);
            for (let s = 0; s < n; s++) simulate();
        }
        function rebuildStatic() {
            active = 0; applyCount(true);
            pointerActive = true;
            pointerX = w * 0.4; pointerY = h * 0.45;
            tgtX = pointerX; tgtY = pointerY;
            cx = pcx = pointerX; cy = pcy = pointerY;
            vcx = 0; vcy = 0;
            influence = 1; prevSrc = 2;
            aCount = 0; pAlive.fill(0);
            presim(3); render();
        }
        function resize() {
            const rect = root.getBoundingClientRect();
            const nw = Math.max(1, rect.width || window.innerWidth);
            const nh = Math.max(1, rect.height || window.innerHeight);
            let d = Math.min(window.devicePixelRatio || 1, 2);
            if (nw * nh * d * d > 4.5e6) d = Math.sqrt(4.5e6 / (nw * nh));
            if (nw === w && nh === h && d === dpr) return;
            w = nw; h = nh; dpr = d;
            main.width = Math.max(1, Math.round(w * dpr));
            main.height = Math.max(1, Math.round(h * dpr));
            bw = Math.max(1, Math.ceil(w / 4)); bh = Math.max(1, Math.ceil(h / 4));
            bloom.width = bw; bloom.height = bh;
            bctx.imageSmoothingEnabled = true;
            bctx.imageSmoothingQuality = "medium";
            if (!initialised) return;
            if (reduced) { rebuildStatic(); return; }
            for (let i = 0; i < active; i++) {
                if (px[i] < -120 || px[i] > w + 120 || py[i] > h + 40) seedParticle(i, false);
            }
            applyCount(true); render();
        }
        function onMove(e) {
            const r = root.getBoundingClientRect();
            pointerX = e.clientX - r.left;
            pointerY = e.clientY - r.top;
            pointerActive = true;
        }
        function onLeave() {
            if (!pointerActive) return;
            pointerActive = false;
            idleSince = liveTime; idleDelay = 4;
        }
        function onUp(e) { if (e.pointerType !== "mouse") onLeave(); }
        function frame(now) {
            const dtRaw = Math.max(0, now - last);
            last = now;
            acc += Math.min(0.05, dtRaw / 1000);
            const t0 = performance.now();
            let n = 0;
            while (acc >= STEP && n < 3) { simulate(); acc -= STEP; n++; }
            if (n === 3) acc = 0;
            if (n > 0) render();
            const work = performance.now() - t0;
            if (dtRaw > 0 && dtRaw < 100) {
                frameEma += (dtRaw - frameEma) * 0.05;
                workEma += (work - workEma) * 0.05;
            }
            if (frameEma > 20) { slowFrames++; fastFrames = 0; }
            else if (frameEma < 18.5 && workEma < 12) { fastFrames++; slowFrames = 0; }
            else { slowFrames = 0; fastFrames = 0; }
            if (slowFrames >= 60 && quality > 0.4) {
                quality = Math.max(0.4, quality - 0.1); slowFrames = 0; applyCount(false);
            } else if (fastFrames >= 180 && quality < 1) {
                quality = Math.min(1, quality + 0.05); fastFrames = 0; applyCount(false);
            }
            raf = requestAnimationFrame(frame);
        }
        function start() {
            cancelAnimationFrame(raf);
            last = performance.now(); acc = 0;
            raf = requestAnimationFrame(frame);
        }
        function onVisibility() {
            if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
            else if (live) start();
        }
        function applyThemeChange() {
            if (!initialised) return;
            buildStyles(); render();
        }
        let themeQueued = false;
        function queueThemeChange() {
            if (themeQueued) return;
            themeQueued = true;
            requestAnimationFrame(() => { themeQueued = false; applyThemeChange(); });
        }
        function watchTheme() {
            const mo = new MutationObserver(queueThemeChange);
            mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
            mo.observe(document.body, { attributes: true, attributeFilter: ["data-theme"] });
        }
        resize(); buildStyles(); applyCount(true);
        cx = pcx = tgtX = w * 0.5;
        cy = pcy = tgtY = h * 0.5;
        const ro = new ResizeObserver(resize);
        ro.observe(root);
        if (reduced) {
            initialised = true; rebuildStatic();
        } else {
            presim(2.5); render();
            initialised = true; live = true;
            window.addEventListener("pointermove", onMove, { passive: true });
            window.addEventListener("pointerdown", onMove, { passive: true });
            window.addEventListener("pointerup", onUp, { passive: true });
            window.addEventListener("pointercancel", onLeave, { passive: true });
            window.addEventListener("blur", onLeave);
            document.documentElement.addEventListener("pointerleave", onLeave);
            document.addEventListener("visibilitychange", onVisibility);
            start();
        }
        watchTheme();
    }
    const root = document.querySelector(".resume-stage");
    if (root) startRain(root);
})();


/* ──────────────────────────────────────────────────────────────
   Resume tabs + counters
   ────────────────────────────────────────────────────────────── */
(function () {
    const tabs = document.querySelectorAll('.tab-btn');
    const panes = {
        academic: document.getElementById('academicPane'),
        skills: document.getElementById('skillsPane'),
        experience: document.getElementById('experiencePane'),
        status: document.getElementById('statusPane')
    };
    function activateTab(tabId) {
        Object.values(panes).forEach(pane => pane?.classList.remove('active'));
        if (panes[tabId]) panes[tabId].classList.add('active');
        tabs.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabId) btn.classList.add('active');
        });
        if (tabId === 'skills') animateSkillBars(true);
        if (tabId === 'status') startCounters();
    }
    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            if (tabId) activateTab(tabId);
        });
    });
    function animateSkillBars(resetAndAnimate = true) {
        const fills = document.querySelectorAll('#skillsPane .progress-fill');
        if (!fills.length) return;
        if (resetAndAnimate) {
            fills.forEach(fill => fill.style.width = '0%');
            void document.body.offsetHeight;
            setTimeout(() => {
                fills.forEach(fill => {
                    const target = fill.getAttribute('data-skill');
                    if (target && !isNaN(target)) fill.style.width = target + '%';
                });
            }, 30);
        }
    }
    if (document.getElementById('skillsPane')?.classList.contains('active')) animateSkillBars(true);
    let countingStarted = false;
    function startCounters() {
        if (countingStarted) return;
        const counters = document.querySelectorAll('#statusPane .stat-number');
        counters.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            if (!isNaN(target) && target > 0) animateCounter(el, target, 1400);
        });
        countingStarted = true;
    }
    function animateCounter(element, target, duration = 1300) {
        if (!element) return;
        let step = 0;
        const steps = Math.floor(duration / 16);
        const increment = target / steps;
        let current = 0;
        element.innerText = '0';
        function update() {
            step++; current += increment;
            if (step >= steps) { element.innerText = target; return; }
            element.innerText = Math.floor(current);
            requestAnimationFrame(() => setTimeout(update, 16));
        }
        requestAnimationFrame(update);
    }
    if (document.getElementById('statusPane')?.classList.contains('active')) setTimeout(startCounters, 150);
    document.querySelectorAll('.stat-number').forEach(el => {
        if (!el.innerText || el.innerText === '0') el.innerText = '0';
    });
})();


/* ──────────────────────────────────────────────────────────────
   Specialization ripple animation
   ────────────────────────────────────────────────────────────── */
(function () {
    'use strict';
    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function getResponsiveSizes() {
        var w = window.innerWidth;
        if (w <= 360) return {
            leftSizes: [50, 80, 120, 170, 230], leftOffsets: [10, 18, 28, 40, 55],
            rightSizes: [45, 70, 105, 150, 200], rightOffsets: [8, 15, 25, 38, 50]
        };
        if (w <= 480) return {
            leftSizes: [70, 110, 170, 240, 320], leftOffsets: [15, 25, 40, 58, 80],
            rightSizes: [60, 95, 140, 200, 270], rightOffsets: [12, 22, 35, 50, 70]
        };
        if (w <= 768) return {
            leftSizes: [90, 150, 230, 320, 420], leftOffsets: [20, 35, 55, 80, 110],
            rightSizes: [75, 125, 190, 270, 360], rightOffsets: [18, 30, 50, 72, 100]
        };
        return {
            leftSizes: [110, 180, 280, 400, 540], leftOffsets: [30, 50, 80, 120, 170],
            rightSizes: [95, 150, 240, 340, 460], rightOffsets: [25, 45, 70, 105, 150]
        };
    }
    function buildConfigs() {
        var s = getResponsiveSizes();
        return {
            leftConfigs: [
                { size: s.leftSizes[0], left: -s.leftOffsets[0], bottom: -s.leftOffsets[0], duration: 13, opacity: 0.32 },
                { size: s.leftSizes[1], left: -s.leftOffsets[1], bottom: -s.leftOffsets[1], duration: 15, opacity: 0.42 },
                { size: s.leftSizes[2], left: -s.leftOffsets[2], bottom: -s.leftOffsets[2], duration: 17, opacity: 0.52 },
                { size: s.leftSizes[3], left: -s.leftOffsets[3], bottom: -s.leftOffsets[3], duration: 19, opacity: 0.28 },
                { size: s.leftSizes[4], left: -s.leftOffsets[4], bottom: -s.leftOffsets[4], duration: 21, opacity: 0.18 }
            ],
            rightConfigs: [
                { size: s.rightSizes[0], right: -s.rightOffsets[0], top: -s.rightOffsets[0], duration: 12, opacity: 0.28 },
                { size: s.rightSizes[1], right: -s.rightOffsets[1], top: -s.rightOffsets[1], duration: 16, opacity: 0.38 },
                { size: s.rightSizes[2], right: -s.rightOffsets[2], top: -s.rightOffsets[2], duration: 18, opacity: 0.48 },
                { size: s.rightSizes[3], right: -s.rightOffsets[3], top: -s.rightOffsets[3], duration: 20, opacity: 0.24 },
                { size: s.rightSizes[4], right: -s.rightOffsets[4], top: -s.rightOffsets[4], duration: 22, opacity: 0.15 }
            ]
        };
    }
    function renderRipples() {
        var layers = document.querySelectorAll('.specialization .sp-ripples');
        if (!layers.length) return;
        var cfgs = buildConfigs();
        Array.prototype.forEach.call(layers, function (layer, sectionIdx) {
            var old = layer.querySelectorAll('.ripple');
            for (var k = 0; k < old.length; k++) old[k].remove();
            var frag = document.createDocumentFragment();
            cfgs.leftConfigs.forEach(function (cfg, idx) {
                var c = document.createElement('span');
                c.className = 'ripple left-group';
                c.style.setProperty('--size', cfg.size + 'px');
                c.style.setProperty('--duration', cfg.duration + 's');
                c.style.setProperty('--opacity', cfg.opacity);
                c.style.setProperty('--delay', (idx * 0.15 + sectionIdx * 0.1) + 's');
                c.style.setProperty('--left', cfg.left + 'px');
                c.style.setProperty('--bottom', cfg.bottom + 'px');
                frag.appendChild(c);
            });
            cfgs.rightConfigs.forEach(function (cfg, idx) {
                var c = document.createElement('span');
                c.className = 'ripple right-group';
                c.style.setProperty('--size', cfg.size + 'px');
                c.style.setProperty('--duration', cfg.duration + 's');
                c.style.setProperty('--opacity', cfg.opacity);
                c.style.setProperty('--delay', (idx * 0.15 + sectionIdx * 0.1 + 0.4) + 's');
                c.style.setProperty('--right', cfg.right + 'px');
                c.style.setProperty('--top', cfg.top + 'px');
                frag.appendChild(c);
            });
            layer.appendChild(frag);
        });
    }
    function initReveal() {
        if (reduceMotion || !('IntersectionObserver' in window)) return;
        var section = document.querySelector('.specialization');
        if (!section) return;
        var cards = section.querySelectorAll('.sp-card');
        if (!cards.length) return;
        section.classList.add('sp-anim');
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var card = entry.target;
                card.classList.add('is-visible');
                card.addEventListener('animationend', function () {
                    card.classList.add('sp-done');
                }, { once: true });
                observer.unobserve(card);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        Array.prototype.forEach.call(cards, function (card) { observer.observe(card); });
    }
    function boot() { renderRipples(); initReveal(); }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else { boot(); }
    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(renderRipples, 250);
    });
    window.addEventListener('orientationchange', function () {
        setTimeout(renderRipples, 300);
    });
})();


/* ──────────────────────────────────────────────────────────────
   Pricing slider
   ────────────────────────────────────────────────────────────── */
(function ($) {
    "use strict";
    var pricingSwiperEl = document.querySelector('.pricing-swiper');
    if (pricingSwiperEl) {
        var pricingSwiper = new Swiper(pricingSwiperEl, {
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
            speed: 700, slidesPerView: 1, spaceBetween: 30,
            navigation: {
                nextEl: '.pricing-swiper-wrapper .swiper-btn-next',
                prevEl: '.pricing-swiper-wrapper .swiper-btn-prev',
            },
            pagination: {
                el: '.pricing-swiper .pricing-pagination',
                clickable: true, dynamicBullets: false,
            },
            breakpoints: {
                0: { slidesPerView: 1, spaceBetween: 16 },
                600: { slidesPerView: 2, spaceBetween: 20 },
                1000: { slidesPerView: 3, spaceBetween: 28 },
                1400: { slidesPerView: 3, spaceBetween: 32 }
            },
            watchSlidesProgress: true,
            watchSlidesVisibility: true,
        });
        $(document).on('keydown', function (e) {
            if (e.key === 'ArrowLeft') { pricingSwiper.slidePrev(); e.preventDefault(); }
            else if (e.key === 'ArrowRight') { pricingSwiper.slideNext(); e.preventDefault(); }
        });
        var resizeTimer;
        $(window).on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () { pricingSwiper.update(); }, 200);
        });
        $('.pricing-swiper .swiper-slide').on('mouseenter', function () {
            pricingSwiper.autoplay.stop();
        }).on('mouseleave', function () {
            pricingSwiper.autoplay.start();
        });
    }
})(jQuery);


/* ──────────────────────────────────────────────────────────────
   Flow animation (academic + career)
   ────────────────────────────────────────────────────────────── */
(function () {
    'use strict';
    function initFlowAnimation(wrapperId, svgContainerId, cardClass) {
        const wrapper = document.getElementById(wrapperId);
        const svgContainer = document.getElementById(svgContainerId);
        if (!wrapper || !svgContainer) return;
        let animationFrame = null;
        let activePackets = [];
        const markerId = 'profArrow_' + wrapperId;
        function getRelativeRect(el, container) {
            const cRect = container.getBoundingClientRect();
            const eRect = el.getBoundingClientRect();
            return {
                left: eRect.left - cRect.left, top: eRect.top - cRect.top,
                right: eRect.right - cRect.left, bottom: eRect.bottom - cRect.top,
                width: eRect.width, height: eRect.height,
                centerX: (eRect.left + eRect.right) / 2 - cRect.left,
                centerY: (eRect.top + eRect.bottom) / 2 - cRect.top
            };
        }
        function getEdgePointToward(rect, tx, ty) {
            const dx = tx - rect.centerX, dy = ty - rect.centerY;
            if (Math.abs(dx) > Math.abs(dy)) {
                return dx > 0 ? { x: rect.right, y: rect.centerY } : { x: rect.left, y: rect.centerY };
            } else {
                return dy > 0 ? { x: rect.centerX, y: rect.bottom } : { x: rect.centerX, y: rect.top };
            }
        }
        function getFlowPoints(fromRect, toRect) {
            return {
                start: getEdgePointToward(fromRect, toRect.centerX, toRect.centerY),
                end: getEdgePointToward(toRect, fromRect.centerX, fromRect.centerY)
            };
        }
        function getStrokeWidth() {
            if (window.innerWidth < 576) return 2.0;
            if (window.innerWidth < 992) return 2.3;
            return 2.6;
        }
        function drawReverseArrows() {
            if (!wrapper || !svgContainer) return;
            const cards = Array.from(wrapper.querySelectorAll(cardClass));
            if (cards.length < 2) return;
            const wrapperRect = wrapper.getBoundingClientRect();
            if (wrapperRect.width === 0) return;
            const cardRects = cards.map(c => getRelativeRect(c, wrapper));
            svgContainer.innerHTML = '';
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            svg.style.overflow = 'visible';
            const defs = document.createElementNS(svgNS, "defs");
            const marker = document.createElementNS(svgNS, "marker");
            marker.setAttribute("id", markerId);
            marker.setAttribute("markerWidth", "10");
            marker.setAttribute("markerHeight", "10");
            marker.setAttribute("refX", "8");
            marker.setAttribute("refY", "4");
            marker.setAttribute("orient", "auto");
            marker.setAttribute("markerUnits", "userSpaceOnUse");
            const poly = document.createElementNS(svgNS, "polygon");
            poly.setAttribute("points", "0 0, 10 4, 0 8");
            poly.setAttribute("fill", "#ff6700");
            marker.appendChild(poly);
            defs.appendChild(marker);
            svg.appendChild(defs);
            const strokeW = getStrokeWidth();
            const pathsData = [];
            for (let i = cards.length - 1; i > 0; i--) {
                const fromRect = cardRects[i];
                const toRect = cardRects[i - 1];
                if (!fromRect || !toRect) continue;
                const { start, end } = getFlowPoints(fromRect, toRect);
                let d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
                const dx = end.x - start.x, dy = end.y - start.y;
                const dist = Math.hypot(dx, dy);
                if (Math.abs(dy) > 35 && dist > 90) {
                    const cp1x = start.x + dx * 0.4;
                    const cp1y = start.y + dy * 0.2;
                    const cp2x = end.x - dx * 0.4;
                    const cp2y = end.y - dy * 0.2;
                    d = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
                }
                const path = document.createElementNS(svgNS, "path");
                path.setAttribute("d", d);
                path.setAttribute("class", "flow-line");
                path.setAttribute("stroke", "#ff6700");
                path.setAttribute("stroke-width", strokeW);
                path.setAttribute("stroke-linecap", "butt");
                path.setAttribute("fill", "none");
                path.setAttribute("marker-end", "url(#" + markerId + ")");
                svg.appendChild(path);
                pathsData.push({ path, length: null });
            }
            svgContainer.appendChild(svg);
            setTimeout(() => {
                pathsData.forEach(item => {
                    try { item.length = item.path.getTotalLength() || 0; }
                    catch (e) { item.length = 0; }
                });
                initPacketAnimation(pathsData);
            }, 20);
        }
        function initPacketAnimation(pathsData) {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            if (activePackets.length) {
                activePackets.forEach(p => p.element && p.element.remove());
                activePackets = [];
            }
            const svg = svgContainer.querySelector('svg');
            if (!svg) return;
            const packetColor = "#ff6700";
            const radius = 3.8;
            pathsData.forEach(item => {
                if (!item.path || !item.length || item.length < 15) return;
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("r", radius);
                circle.setAttribute("fill", packetColor);
                circle.setAttribute("fill-opacity", "0.9");
                circle.setAttribute("stroke", "#fff");
                circle.setAttribute("stroke-width", "1.2");
                circle.classList.add("flow-packet");
                svg.appendChild(circle);
                activePackets.push({
                    element: circle, pathLength: item.length, path: item.path,
                    progress: Math.random(),
                    speed: 0.0055 + Math.random() * 0.003
                });
            });
            function animate() {
                for (let p of activePackets) {
                    if (!p.path || !p.element) continue;
                    p.progress += p.speed;
                    if (p.progress >= 1) p.progress = 0;
                    try {
                        const pt = p.path.getPointAtLength(p.progress * p.pathLength);
                        p.element.setAttribute("cx", pt.x);
                        p.element.setAttribute("cy", pt.y);
                    } catch (e) { }
                }
                animationFrame = requestAnimationFrame(animate);
            }
            if (activePackets.length) animationFrame = requestAnimationFrame(animate);
        }
        function stop() {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            if (activePackets.length) {
                activePackets.forEach(p => p.element && p.element.remove());
                activePackets = [];
            }
        }
        function refresh() { stop(); drawReverseArrows(); }
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(refresh, 100);
        });
        if (window.ResizeObserver) {
            const obs = new ResizeObserver(() => refresh());
            wrapper.querySelectorAll(cardClass).forEach(c => obs.observe(c));
            obs.observe(wrapper);
        }
        refresh();
        window.addEventListener('orientationchange', () => setTimeout(refresh, 80));
        window.addEventListener('beforeunload', () => { cancelAnimationFrame(animationFrame); stop(); });
    }
    function init() {
        if (document.getElementById('academicFlowWrapper')) {
            initFlowAnimation('academicFlowWrapper', 'academicFlowSvgContainer', '.academic-card');
        }
        if (document.getElementById('careerFlowWrapper')) {
            initFlowAnimation('careerFlowWrapper', 'flowSvgContainer', '.exp-card');
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else { init(); }
})();

// client-side JS for scroll-to-top button
(function () {
    'use strict';

    var clientEl = document.querySelector('#client-carousel');
    if (!clientEl || typeof Swiper === 'undefined') return;

    /* ---------- Swiper ---------- */
    var clientSwiper = new Swiper('#client-carousel', {
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 2.3,
        loop: true,
        spaceBetween: 30,
        speed: 900,
        effect: 'coverflow',
        coverflowEffect: { rotate: 0, depth: 800, slideShadows: true },
        autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: {
            el: '.client-pagination',
            clickable: true,
            bulletClass: 'swiper-pagination-bullet client-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active client-bullet-active'
        },
        navigation: { prevEl: '.client-prev', nextEl: '.client-next' },
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: { enabled: true }
    });

    /* ---------- progress bar ---------- */
    var clientProgressBar = document.querySelector('.client-progress-bar');

    clientSwiper.on('autoplayTimeLeft', function (swiper, timeLeft, percentage) {
        if (clientProgressBar) clientProgressBar.style.width = (percentage * 100) + '%';
    });

    /* ---------- play / pause ---------- */
    var clientPlayBtn = document.querySelector('.client-play');
    var clientIsPlaying = true;

    if (clientPlayBtn) {
        clientPlayBtn.addEventListener('click', function () {
            if (clientIsPlaying) {
                clientSwiper.autoplay.stop();
                clientPlayBtn.classList.add('is-paused');
                clientPlayBtn.setAttribute('aria-label', 'Play autoplay');
                clientPlayBtn.setAttribute('aria-pressed', 'false');
                if (clientProgressBar) clientProgressBar.style.width = '0%';
            } else {
                clientSwiper.autoplay.start();
                clientPlayBtn.classList.remove('is-paused');
                clientPlayBtn.setAttribute('aria-label', 'Pause autoplay');
                clientPlayBtn.setAttribute('aria-pressed', 'true');
            }
            clientIsPlaying = !clientIsPlaying;
        });
    }

    clientSwiper.on('slideChange', function () {
        if (!clientIsPlaying && clientProgressBar) clientProgressBar.style.width = '0%';
    });


    function clientResizer() {
        var w = window.innerWidth;
        var slides;
        if (w < 576) slides = 1;
        else if (w < 768) slides = 2;
        else slides = 2.3;

        if (clientSwiper.params.slidesPerView !== slides) {
            clientSwiper.params.slidesPerView = slides;
            clientSwiper.update();
        }
    }

    window.addEventListener('resize', clientResizer);
    clientResizer();


    window.RSC_Carousel = clientSwiper;

})();

// contact
(function () {
    'use strict';

    /* ---------- Select Elements ---------- */
    var btnCustomer = document.querySelector('#contact-btn-customer');
    var btnTechnical = document.querySelector('#contact-btn-technical');
    var gradientIndicator = document.querySelector('#contact-gradient-indicator');

    // Guard clause: Ensure elements exist before running logic
    if (!btnCustomer || !btnTechnical || !gradientIndicator) return;

    /* ---------- Event Listeners ---------- */
    btnCustomer.addEventListener('click', function () {
        btnCustomer.classList.add('contact-active');
        btnTechnical.classList.remove('contact-active');
        gradientIndicator.style.transform = 'translateX(0%)';
    });

    btnTechnical.addEventListener('click', function () {
        btnTechnical.classList.add('contact-active');
        btnCustomer.classList.remove('contact-active');
        gradientIndicator.style.transform = 'translateX(100%)';
    });

})();


/* ──────────────────────────────────────────────────────────────
   Scroll-to-top
   ────────────────────────────────────────────────────────────── */
window.onscroll = function () { scrollFunction(); };
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("movetop").style.display = "block";
    } else {
        document.getElementById("movetop").style.display = "none";
    }
}
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}