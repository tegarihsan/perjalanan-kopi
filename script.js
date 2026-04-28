document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navLinkItems = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('bi-list');
        menuToggle.querySelector('i').classList.toggle('bi-x');
    };

    menuToggle.addEventListener('click', toggleMenu);
    sidebarOverlay.addEventListener('click', toggleMenu);

    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- Active Link & Dynamic Title ---
    const sections = document.querySelectorAll('section');
    const options = {
        threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                
                navLinkItems.forEach(link => link.classList.remove('active'));
                if (activeLink) {
                    activeLink.classList.add('active');
                    const sectionName = activeLink.getAttribute('data-section');
                    document.title = `Perjalanan Kopi | ${sectionName}`;
                }
            }
        });
    }, options);

    sections.forEach(section => observer.observe(section));

    // --- Menu Slider Auto-Scroll ---
    const sliderContainer = document.querySelector('.menu-slider-container');
    const slider = document.getElementById('menu-slider');
    let isPaused = false;
    let scrollLeft = 0;
    const scrollSpeed = 0.8; // Speed of auto-scroll

    // Clone items for seamless loop
    const cards = Array.from(slider.children);
    cards.forEach(card => {
        const clone = card.cloneNode(true);
        slider.appendChild(clone);
    });

    const moveSlider = () => {
        if (!isPaused) {
            scrollLeft += scrollSpeed;
            if (scrollLeft >= slider.scrollWidth / 2) {
                scrollLeft = 0;
            }
            sliderContainer.scrollLeft = scrollLeft;
        }
        requestAnimationFrame(moveSlider);
    };

    // Sync scrollLeft on manual scroll
    sliderContainer.addEventListener('scroll', () => {
        if (isPaused) {
            scrollLeft = sliderContainer.scrollLeft;
            // Loop check even on manual scroll
            if (scrollLeft >= slider.scrollWidth / 2) {
                sliderContainer.scrollLeft = 0;
                scrollLeft = 0;
            } else if (scrollLeft <= 0) {
                // If scrolled far left, jump to the end of the first half
                // This is optional for manual scroll
            }
        }
    });

    requestAnimationFrame(moveSlider);

    // Interaction handling
    const pauseScroll = () => { isPaused = true; };
    const resumeScroll = () => { 
        isPaused = false; 
        scrollLeft = sliderContainer.scrollLeft; // Ensure it starts from where user left off
    };

    sliderContainer.addEventListener('mouseenter', pauseScroll);
    sliderContainer.addEventListener('mouseleave', resumeScroll);
    sliderContainer.addEventListener('touchstart', pauseScroll, { passive: true });
    sliderContainer.addEventListener('touchend', resumeScroll);
    sliderContainer.addEventListener('mousedown', pauseScroll);
    sliderContainer.addEventListener('mouseup', resumeScroll);

    // --- Leaflet Map ---
    // Coordinates for: 2937+8QC, Jl. Srikaton Tgh, Purwoyoso, Kec. Ngaliyan, Kota Semarang
    // Approximated from the Plus Code and address: -7.0016, 110.3475
    const lat = -7.0016;
    const lng = 110.3475;

    const map = L.map('map', {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
        dragging: !L.Browser.mobile,
        touchZoom: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const coffeeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#d2b48c; width:30px; height:30px; border-radius:50%; border:3px solid #ffffff; box-shadow: 0 0 10px rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:center; color:#ffffff;'><i class='bi bi-geo-alt-fill'></i></div>",
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });

    L.marker([lat, lng], { icon: coffeeIcon }).addTo(map)
        .bindPopup('<b>Perjalanan Kopi</b><br>Jl. Srikaton Tgh, Semarang')
        .openPopup();

    // Map Click Link
    map.on('click', () => {
        window.open('https://maps.app.goo.gl/H1Bbeb9qdSi9t1E19', '_blank');
    });
});
