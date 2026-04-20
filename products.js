// ══════════════════════════════
      // PRODUCT CAROUSEL
      // ══════════════════════════════
      (function () {
        const track = document.getElementById('carouselTrack');
        const outer = document.getElementById('carouselOuter');
        const prevBtn = document.getElementById('carouselPrev');
        const nextBtn = document.getElementById('carouselNext');
        const dots = document.querySelectorAll('.carousel-dot');
        const cards = document.querySelectorAll('.product-card');

        if (!track) return;

        let current = 0;
        let autoTimer;

        function getVisible() {
          if (window.innerWidth <= 600) return 1;
          if (window.innerWidth <= 1000) return 2;
          return 3;
        }

        function maxIndex() {
          return Math.max(0, cards.length - getVisible());
        }

        function goTo(index) {
          current = Math.max(0, Math.min(index, maxIndex()));
          const cardWidth = cards[0].offsetWidth + 24; // card + gap
          track.style.transform = `translateX(-${current * cardWidth}px)`;

          // update dots
          dots.forEach((d, i) => d.classList.toggle('active', i === current));

          // update buttons
          prevBtn.disabled = current === 0;
          nextBtn.disabled = current >= maxIndex();
        }

        prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
        nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

        dots.forEach(dot => {
          dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.index));
            resetAuto();
          });
        });

        // Auto-play every 4 seconds
        function startAuto() {
          autoTimer = setInterval(() => {
            goTo(current >= maxIndex() ? 0 : current + 1);
          }, 4000);
        }

        function resetAuto() {
          clearInterval(autoTimer);
          startAuto();
        }

        // Touch/drag support
        let startX = 0;
        let isDragging = false;

        outer.addEventListener('mousedown', e => { startX = e.clientX; isDragging = true; });
        outer.addEventListener('mousemove', e => { if (isDragging) e.preventDefault(); });
        outer.addEventListener('mouseup', e => {
          if (!isDragging) return;
          isDragging = false;
          const diff = e.clientX - startX;
          if (diff < -50) goTo(current + 1);
          else if (diff > 50) goTo(current - 1);
          resetAuto();
        });
        outer.addEventListener('mouseleave', () => { isDragging = false; });

        outer.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        outer.addEventListener('touchend', e => {
          const diff = e.changedTouches[0].clientX - startX;
          if (diff < -50) goTo(current + 1);
          else if (diff > 50) goTo(current - 1);
          resetAuto();
        });

        // Recalculate on resize
        window.addEventListener('resize', () => goTo(Math.min(current, maxIndex())));

        // Init
        goTo(0);
        startAuto();
      })();