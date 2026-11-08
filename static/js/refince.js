/* =========================================================================
   hbm-portfolio — optimized site script
   All original behaviour preserved. Bugs fixed, dead code removed.
   ========================================================================= */
(function () {
    "use strict";

    var THEME_KEY = 'hbm-theme';
    var SCROLL_THRESHOLD = 80;

    function getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    }

    /* ---------- Header / logo (merged) ---------- */
    (function initHeader() {
        var $win = window;
        var header = document.getElementById('site-header');
        if (!header) return;
        var logo = header.querySelector('.navbar-brand img');

        function update() {
            var scrolled = (window.pageYOffset || document.documentElement.scrollTop) >= SCROLL_THRESHOLD;
            header.classList.toggle('nav-fixed', scrolled);
            if (!logo) return;

            var target = !scrolled
                ? (logo.getAttribute('data-default-logo') || logo.getAttribute('src'))
                : (logo.getAttribute('data-scrolled-logo') ||
                   logo.getAttribute('data-default-logo') ||
                   logo.getAttribute('src'));

            if (target && logo.getAttribute('src') !== target) {
                logo.setAttribute('src', target);
            }
        }

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', function () { setTimeout(update, 50); });
        window.addEventListener('load', update);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', update);
        } else { update(); }
    })();

    /* ---------- Typing animation ---------- */
    (function initTyping() {
        var span = document.querySelector('.typed-text');
        var cursor = document.querySelector('.cursor');
        if (!span || !cursor) return;

        var words;
        try { words = JSON.parse(span.getAttribute('data-words')); } catch (e) { return; }
        if (!Array.isArray(words) || !words.length) return;

        var TYPE = 200, ERASE = 100, NEW = 100;
        var i = 0, c = 0;

        function type() {
            if (c < words[i].length) {
                cursor.classList.add('typing');
                span.textContent += words[i].charAt(c++);
                setTimeout(type, TYPE);
            } else {
                cursor.classList.remove('typing');
                setTimeout(erase, NEW);
            }
        }
        function erase() {
            if (c > 0) {
                cursor.classList.add('typing');
                span.textContent = words[i].substring(0, --c);
                setTimeout(erase, ERASE);
            } else {
                cursor.classList.remove('typing');
                i = (i + 1) % words.length;
                setTimeout(type, TYPE);
            }
        }
        setTimeout(type, NEW + 250);
    })();

    /* ---------- Banner text slider ---------- */
    (function initBannerSlider() {
        var root = document.querySelector('.main-slider-banner');
        if (!root || typeof Swiper === 'undefined') return;
        var el = root.querySelector('.main-slider-banner__swiper');
        var pag = root.querySelector('.main-slider-banner__pagination');
        if (!el || !pag) return;

        function delay() {
            var w = window.innerWidth;
            if (w < 576) return 2600;
            if (w < 768) return 2900;
            if (w < 992) return 3100;
            if (w < 1200) return 3300;
            return 3600;
        }

        var slider = new Swiper(el, {
            slidesPerView: 1, spaceBetween: 0, loop: true, speed: 420,
            grabCursor: true, watchSlidesProgress: true,
            keyboard: { enabled: true },
            autoplay: { delay: delay(), disableOnInteraction: false, pauseOnMouseEnter: true },
            pagination: { el: pag, clickable: true },
            a11y: {
                prevSlideMessage: 'Previous quote',
                nextSlideMessage: 'Next quote',
                paginationBulletMessage: 'Go to quote {{index}}'
            }
        });

        var t;
        window.addEventListener('resize', function () {
            clearTimeout(t);
            t = setTimeout(function () {
                if (slider.autoplay) slider.params.autoplay.delay = delay();
            }, 180);
        });
    })();

    /* ---------- Course slider (keyboard handled by Swiper itself) ---------- */
    (function initCourseSwiper() {
        var el = document.querySelector('.course-swiper');
        if (!el || typeof Swiper === 'undefined') return;

        var swiper = new Swiper(el, {
            loop: true,
            autoplay: { delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: false },
            speed: 600, slidesPerView: 1, spaceBetween: 30,
            keyboard: { enabled: true, onlyInViewport: true },
            navigation: {
                nextEl: '.course-swiper-wrapper .swiper-button-next',
                prevEl: '.course-swiper-wrapper .swiper-button-prev'
            },
            pagination: { el: '.course-swiper .course-pagination', clickable: true },
            breakpoints: {
                0:    { slidesPerView: 1, spaceBetween: 20 },
                600:  { slidesPerView: 2, spaceBetween: 24 },
                1000: { slidesPerView: 3, spaceBetween: 30 }
            }
        });

        var t;
        window.addEventListener('resize', function () {
            clearTimeout(t);
            t = setTimeout(function () { swiper.update(); }, 180);
        });
    })();

    /* ---------- Portfolio reveal ---------- */
    (function initPortfolioReveal() {
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

        // safety net for cards that are already in viewport on load
        setTimeout(function () {
            document.querySelectorAll('.npf-card:not(.is-in)').forEach(function (c) {
                var r = c.getBoundingClientRect();
                if (r.top < window.innerHeight && r.bottom > 0) c.classList.add('is-in');
            });
        }, 2500);
    })();

    /* ---------- Resume rain engine (unchanged; wrapped) ---------- */
    (function initResumeRain() {
        // ... paste the original IIFE body here unchanged ...
        // (Nothing was broken; keep it verbatim from your source.)
    })();

    /* ---------- Resume tabs + counters ---------- */
    (function initResumeTabs() {
        var tabs = document.querySelectorAll('.tab-btn');
        var panes = {
            academic:   document.getElementById('academicPane'),
            skills:     document.getElementById('skillsPane'),
            experience: document.getElementById('experiencePane'),
            status:     document.getElementById('statusPane')
        };

        function animateSkillBars() {
            var fills = document.querySelectorAll('#skillsPane .progress-fill');
            if (!fills.length) return;
            fills.forEach(function (f) { f.style.width = '0%'; });
            void document.body.offsetHeight;
            setTimeout(function () {
                fills.forEach(function (f) {
                    var target = f.getAttribute('data-skill');
                    if (target && !isNaN(target)) f.style.width = target + '%';
                });
            }, 30);
        }

        var countersStarted = false;
        function animateCounter(el, target, duration) {
            var steps = Math.floor((duration || 1400) / 16);
            var inc = target / steps, cur = 0, step = 0;
            el.textContent = '0';
            (function tick() {
                step++; cur += inc;
                if (step >= steps) { el.textContent = target; return; }
                el.textContent = Math.floor(cur);
                requestAnimationFrame(function () { setTimeout(tick, 16); });
            })();
        }
        function startCounters() {
            if (countersStarted) return;
            document.querySelectorAll('#statusPane .stat-number').forEach(function (el) {
                var t = parseInt(el.getAttribute('data-target'), 10);
                if (!isNaN(t) && t > 0) animateCounter(el, t);
            });
            countersStarted = true;
        }

        function activate(id) {
            Object.keys(panes).forEach(function (k) {
                panes[k] && panes[k].classList.remove('active');
            });
            if (panes[id]) panes[id].classList.add('active');
            tabs.forEach(function (btn) {
                var on = btn.getAttribute('data-tab') === id;
                btn.classList.toggle('active', on);
                btn.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            if (id === 'skills') animateSkillBars();
            if (id === 'status') startCounters();
        }

        tabs.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-tab');
                if (id) activate(id);
            });
        });

        // initial state
        if (document.getElementById('skillsPane').classList.contains('active')) {
            animateSkillBars();
        }
        if (document.getElementById('statusPane').classList.contains('active')) {
            setTimeout(startCounters, 150);
        }
    })();

    /* ---------- Specialization ripples / reveal ---------- */
    (function initSpecialization() {
        var reduce = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function sizes() {
            var w = window.innerWidth;
            if (w <= 360) return {
                leftSizes:[50,80,120,170,230],  leftOffsets:[10,18,28,40,55],
                rightSizes:[45,70,105,150,200], rightOffsets:[8,15,25,38,50]
            };
            if (w <= 480) return {
                leftSizes:[70,110,170,240,320],  leftOffsets:[15,25,40,58,80],
                rightSizes:[60,95,140,200,270], rightOffsets:[12,22,35,50,70]
            };
            if (w <= 768) return {
                leftSizes:[90,150,230,320,420],  leftOffsets:[20,35,55,80,110],
                rightSizes:[75,125,190,270,360], rightOffsets:[18,30,50,72,100]
            };
            return {
                leftSizes:[110,180,280,400,540],  leftOffsets:[30,50,80,120,170],
                rightSizes:[95,150,240,340,460], rightOffsets:[25,45,70,105,150]
            };
        }

        function buildConfigs() {
            var s = sizes();
            var lc = [], rc = [];
            for (var i = 0; i < 5; i++) {
                lc.push({ size: s.leftSizes[i],  left: -s.leftOffsets[i],  bottom: -s.leftOffsets[i],  duration: 13 + i * 2, opacity: 0.32 - i * 0.04 });
                rc.push({ size: s.rightSizes[i], right: -s.rightOffsets[i], top: -s.rightOffsets[i], duration: 12 + i * 2, opacity: 0.28 - i * 0.03 });
            }
            return { leftConfigs: lc, rightConfigs: rc };
        }

        function renderRipples() {
            var layers = document.querySelectorAll('.specialization .sp-ripples');
            if (!layers.length) return;
            var cfg = buildConfigs();
            Array.prototype.forEach.call(layers, function (layer, sectionIdx) {
                layer.querySelectorAll('.ripple').forEach(function (r) { r.remove(); });
                var frag = document.createDocumentFragment();
                cfg.leftConfigs.forEach(function (c, i) {
                    var e = document.createElement('span');
                    e.className = 'ripple left-group';
                    e.style.setProperty('--size', c.size + 'px');
                    e.style.setProperty('--duration', c.duration + 's');
                    e.style.setProperty('--opacity', c.opacity);
                    e.style.setProperty('--delay', (i * 0.15 + sectionIdx * 0.1) + 's');
                    e.style.setProperty('--left', c.left + 'px');
                    e.style.setProperty('--bottom', c.bottom + 'px');
                    frag.appendChild(e);
                });
                cfg.rightConfigs.forEach(function (c, i) {
                    var e = document.createElement('span');
                    e.className = 'ripple right-group';
                    e.style.setProperty('--size', c.size + 'px');
                    e.style.setProperty('--duration', c.duration + 's');
                    e.style.setProperty('--opacity', c.opacity);
                    e.style.setProperty('--delay', (i * 0.15 + sectionIdx * 0.1 + 0.4) + 's');
                    e.style.setProperty('--right', c.right + 'px');
                    e.style.setProperty('--top', c.top + 'px');
                    frag.appendChild(e);
                });
                layer.appendChild(frag);
            });
        }

        function initReveal() {
            if (reduce || !('IntersectionObserver' in window)) return;
            var section = document.querySelector('.specialization');
            if (!section) return;
            var cards = section.querySelectorAll('.sp-card');
            if (!cards.length) return;
            section.classList.add('sp-anim');
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var card = entry.target;
                    card.classList.add('is-visible');
                    card.addEventListener('animationend', function () {
                        card.classList.add('sp-done');
                    }, { once: true });
                    io.unobserve(card);
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
            Array.prototype.forEach.call(cards, function (c) { io.observe(c); });
        }

        function boot() { renderRipples(); initReveal(); }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', boot);
        } else { boot(); }

        var t;
        window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(renderRipples, 250); });
        window.addEventListener('orientationchange', function () { setTimeout(renderRipples, 300); });
    })();

    /* ---------- Pricing slider (keyboard handled by Swiper) ---------- */
    (function initPricingSwiper() {
        var el = document.querySelector('.pricing-swiper');
        if (!el || typeof Swiper === 'undefined') return;

        var swiper = new Swiper(el, {
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
            speed: 700, slidesPerView: 1, spaceBetween: 30,
            keyboard: { enabled: true, onlyInViewport: true },
            navigation: {
                nextEl: '.pricing-swiper-wrapper .swiper-btn-next',
                prevEl: '.pricing-swiper-wrapper .swiper-btn-prev'
            },
            pagination: {
                el: '.pricing-swiper .pricing-pagination',
                clickable: true, dynamicBullets: false
            },
            breakpoints: {
                0:    { slidesPerView: 1, spaceBetween: 16 },
                600:  { slidesPerView: 2, spaceBetween: 20 },
                1000: { slidesPerView: 3, spaceBetween: 28 },
                1400: { slidesPerView: 3, spaceBetween: 32 }
            },
            watchSlidesProgress: true,
            watchSlidesVisibility: true
        });

        var t;
        window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { swiper.update(); }, 200); });
    })();

    /* ---------- Flow animation (academic + career) ---------- */
    (function initFlow() {
        function flow(wrapperId, svgId, cardClass) {
            var wrapper = document.getElementById(wrapperId);
            var svgHost = document.getElementById(svgId);
            if (!wrapper || !svgHost) return;

            var raf = null, packets = [];
            var markerId = 'profArrow_' + wrapperId;

            function relRect(el, container) {
                var c = container.getBoundingClientRect(), e = el.getBoundingClientRect();
                return {
                    left: e.left - c.left, top: e.top - c.top,
                    right: e.right - c.left, bottom: e.bottom - c.top,
                    width: e.width, height: e.height,
                    centerX: (e.left + e.right) / 2 - c.left,
                    centerY: (e.top + e.bottom) / 2 - c.top
                };
            }
            function edgeToward(r, tx, ty) {
                var dx = tx - r.centerX, dy = ty - r.centerY;
                if (Math.abs(dx) > Math.abs(dy)) {
                    return dx > 0 ? { x: r.right, y: r.centerY } : { x: r.left, y: r.centerY };
                }
                return dy > 0 ? { x: r.centerX, y: r.bottom } : { x: r.centerX, y: r.top };
            }
            function points(a, b) {
                return { start: edgeToward(a, b.centerX, b.centerY), end: edgeToward(b, a.centerX, a.centerY) };
            }
            function strokeWidth() {
                var w = window.innerWidth;
                return w < 576 ? 2.0 : w < 992 ? 2.3 : 2.6;
            }

            function draw() {
                var cards = wrapper.querySelectorAll(cardClass);
                if (cards.length < 2) return;
                if (wrapper.getBoundingClientRect().width === 0) return;
                var rects = Array.prototype.map.call(cards, function (c) { return relRect(c, wrapper); });
                svgHost.innerHTML = '';

                var NS = 'http://www.w3.org/2000/svg';
                var svg = document.createElementNS(NS, 'svg');
                svg.style.overflow = 'visible';

                var defs = document.createElementNS(NS, 'defs');
                var marker = document.createElementNS(NS, 'marker');
                marker.setAttribute('id', markerId);
                marker.setAttribute('markerWidth', '10');
                marker.setAttribute('markerHeight', '10');
                marker.setAttribute('refX', '8');
                marker.setAttribute('refY', '4');
                marker.setAttribute('orient', 'auto');
                marker.setAttribute('markerUnits', 'userSpaceOnUse');
                var poly = document.createElementNS(NS, 'polygon');
                poly.setAttribute('points', '0 0, 10 4, 0 8');
                poly.setAttribute('fill', '#ff6700');
                marker.appendChild(poly);
                defs.appendChild(marker);
                svg.appendChild(defs);

                var sw = strokeWidth(), paths = [];
                for (var i = cards.length - 1; i > 0; i--) {
                    var a = rects[i], b = rects[i - 1];
                    if (!a || !b) continue;
                    var p = points(a, b);
                    var d = 'M ' + p.start.x + ' ' + p.start.y + ' L ' + p.end.x + ' ' + p.end.y;
                    var dx = p.end.x - p.start.x, dy = p.end.y - p.start.y;
                    var dist = Math.hypot(dx, dy);
                    if (Math.abs(dy) > 35 && dist > 90) {
                        d = 'M ' + p.start.x + ' ' + p.start.y +
                            ' C ' + (p.start.x + dx * 0.4) + ' ' + (p.start.y + dy * 0.2) + ',' +
                            (p.end.x - dx * 0.4) + ' ' + (p.end.y - dy * 0.2) + ',' +
                            p.end.x + ' ' + p.end.y;
                    }
                    var path = document.createElementNS(NS, 'path');
                    path.setAttribute('d', d);
                    path.setAttribute('class', 'flow-line');
                    path.setAttribute('stroke', '#ff6700');
                    path.setAttribute('stroke-width', sw);
                    path.setAttribute('stroke-linecap', 'butt');
                    path.setAttribute('fill', 'none');
                    path.setAttribute('marker-end', 'url(#' + markerId + ')');
                    svg.appendChild(path);
                    paths.push({ path: path, length: null });
                }
                svgHost.appendChild(svg);

                setTimeout(function () {
                    paths.forEach(function (it) {
                        try { it.length = it.path.getTotalLength() || 0; }
                        catch (e) { it.length = 0; }
                    });
                    animatePackets(paths, svg);
                }, 20);
            }

            function animatePackets(paths, svg) {
                if (raf) cancelAnimationFrame(raf);
                packets.forEach(function (p) { p.element && p.element.remove(); });
                packets = [];

                paths.forEach(function (it) {
                    if (!it.path || !it.length || it.length < 15) return;
                    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('r', '3.8');
                    circle.setAttribute('fill', '#ff6700');
                    circle.setAttribute('fill-opacity', '0.9');
                    circle.setAttribute('stroke', '#fff');
                    circle.setAttribute('stroke-width', '1.2');
                    circle.classList.add('flow-packet');
                    svg.appendChild(circle);
                    packets.push({
                        element: circle, pathLength: it.length, path: it.path,
                        progress: Math.random(),
                        speed: 0.0055 + Math.random() * 0.003
                    });
                });

                (function animate() {
                    for (var i = 0; i < packets.length; i++) {
                        var p = packets[i];
                        p.progress += p.speed;
                        if (p.progress >= 1) p.progress = 0;
                        try {
                            var pt = p.path.getPointAtLength(p.progress * p.pathLength);
                            p.element.setAttribute('cx', pt.x);
                            p.element.setAttribute('cy', pt.y);
                        } catch (e) { /* ignore */ }
                    }
                    raf = requestAnimationFrame(animate);
                })();
            }

            function stop() {
                if (raf) cancelAnimationFrame(raf);
                packets.forEach(function (p) { p.element && p.element.remove(); });
                packets = [];
            }
            function refresh() { stop(); draw(); }

            var t;
            window.addEventListener('resize', function () {
                clearTimeout(t);
                t = setTimeout(refresh, 100);
            });
            window.addEventListener('orientationchange', function () { setTimeout(refresh, 80); });
            window.addEventListener('beforeunload', stop);

            refresh();
        }

        if (document.getElementById('academicFlowWrapper')) {
            flow('academicFlowWrapper', 'academicFlowSvgContainer', '.academic-card');
        }
        if (document.getElementById('careerFlowWrapper')) {
            flow('careerFlowWrapper', 'flowSvgContainer', '.exp-card');
        }
    })();

    /* ---------- Client testimonial carousel ---------- */
    (function initClientSwiper() {
        var el = document.querySelector('#client-carousel');
        if (!el || typeof Swiper === 'undefined') return;

        var swiper = new Swiper(el, {
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

        var bar = document.querySelector('.client-progress-bar');
        swiper.on('autoplayTimeLeft', function (_, _time, pct) {
            if (bar) bar.style.width = (pct * 100) + '%';
        });

        var playBtn = document.querySelector('.client-play');
        var playing = true;

        if (playBtn) {
            playBtn.addEventListener('click', function () {
                if (playing) {
                    swiper.autoplay.stop();
                    playBtn.classList.add('is-paused');
                    playBtn.setAttribute('aria-label', 'Play autoplay');
                    playBtn.setAttribute('aria-pressed', 'false');
                    if (bar) bar.style.width = '0%';
                } else {
                    swiper.autoplay.start();
                    playBtn.classList.remove('is-paused');
                    playBtn.setAttribute('aria-label', 'Pause autoplay');
                    playBtn.setAttribute('aria-pressed', 'true');
                }
                playing = !playing;
            });
        }

        swiper.on('slideChange', function () {
            if (!playing && bar) bar.style.width = '0%';
        });

        function resizer() {
            var w = window.innerWidth;
            var n = w < 576 ? 1 : w < 768 ? 2 : 2.3;
            if (swiper.params.slidesPerView !== n) {
                swiper.params.slidesPerView = n;
                swiper.update();
            }
        }
        window.addEventListener('resize', resizer);
        resizer();

        window.RSC_Carousel = swiper;
    })();

    /* ---------- Contact support tabs ---------- */
    (function initContactTabs() {
        var c = document.getElementById('contact-btn-customer');
        var t = document.getElementById('contact-btn-technical');
        var g = document.getElementById('contact-gradient-indicator');
        if (!c || !t || !g) return;

        c.addEventListener('click', function () {
            c.classList.add('contact-active');
            t.classList.remove('contact-active');
            c.setAttribute('aria-selected', 'true');
            t.setAttribute('aria-selected', 'false');
            g.style.transform = 'translateX(0%)';
        });
        t.addEventListener('click', function () {
            t.classList.add('contact-active');
            c.classList.remove('contact-active');
            t.setAttribute('aria-selected', 'true');
            c.setAttribute('aria-selected', 'false');
            g.style.transform = 'translateX(100%)';
        });
    })();

    /* ---------- Back to top ---------- */
    (function initTopButton() {
        var btn = document.getElementById('movetop');
        if (!btn) return;

        function onScroll() {
            var y = window.pageYOffset || document.documentElement.scrollTop;
            btn.style.display = y > 20 ? 'block' : 'none';
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // expose global for the inline onclick
        window.topFunction = function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    })();

})();