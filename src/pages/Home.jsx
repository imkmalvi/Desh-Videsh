import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import DestinationCard from "../components/DestinationCard";
import Loader from "../components/Loader";
import { useState, useEffect, useRef, useCallback } from "react";
import { searchCities } from "../services/api";

// ─── Hardcoded popular cities (mix strategy) ───────────────────────────────
const POPULAR_CITIES = [
  { id: "p1",  city: "Paris",     country: "France",      region: "Île-de-France",   population: 2161000,  latitude: 48.8566,  longitude: 2.3522  },
  { id: "p2",  city: "Tokyo",     country: "Japan",       region: "Kanto",           population: 13960000, latitude: 35.6762,  longitude: 139.6503 },
  { id: "p3",  city: "New York",  country: "USA",         region: "New York",        population: 8336817,  latitude: 40.7128,  longitude: -74.006  },
  { id: "p4",  city: "Dubai",     country: "UAE",         region: "Dubai",           population: 3331420,  latitude: 25.2048,  longitude: 55.2708  },
  { id: "p5",  city: "London",    country: "UK",          region: "England",         population: 8982000,  latitude: 51.5074,  longitude: -0.1278  },
  { id: "p6",  city: "Barcelona", country: "Spain",       region: "Catalonia",       population: 1620343,  latitude: 41.3851,  longitude: 2.1734   },
  { id: "p7",  city: "Sydney",    country: "Australia",   region: "New South Wales", population: 5312000,  latitude: -33.8688, longitude: 151.2093 },
  { id: "p8",  city: "Istanbul",  country: "Turkey",      region: "Marmara",         population: 15462452, latitude: 41.0082,  longitude: 28.9784  },
  { id: "p9",  city: "Singapore", country: "Singapore",   region: "Central Region",  population: 5850342,  latitude: 1.3521,   longitude: 103.8198 },
  { id: "p10", city: "Rome",      country: "Italy",       region: "Lazio",           population: 2873000,  latitude: 41.9028,  longitude: 12.4964  },
  { id: "p11", city: "Amsterdam", country: "Netherlands", region: "North Holland",   population: 921402,   latitude: 52.3676,  longitude: 4.9041   },
  { id: "p12", city: "Bangkok",   country: "Thailand",    region: "Central Thailand",population: 10539000, latitude: 13.7563,  longitude: 100.5018 },
  { id: "p13", city: "Mumbai",    country: "India",       region: "Maharashtra",     population: 20667656, latitude: 19.0760,  longitude: 72.8777  },
  { id: "p14", city: "Cape Town", country: "South Africa",region: "Western Cape",    population: 4618000,  latitude: -33.9249, longitude: 18.4241  },
  { id: "p15", city: "Bali",      country: "Indonesia",   region: "Bali",            population: 4225000,  latitude: -8.3405,  longitude: 115.0920 },
];

// Shuffle helper
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const ITEMS_PER_PAGE = 10;

export default function Home() {
  // ── Search state ──────────────────────────────────────────────────────────
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [searchedTerm, setSearchedTerm]   = useState("");
  const [page, setPage]                   = useState(1);
  const [isSearchMode, setIsSearchMode]   = useState(false);

  // ── Default cities (mix: popular + user past searches) ───────────────────
  const [defaultCities, setDefaultCities] = useState([]);
  const [defaultPage, setDefaultPage]     = useState(1);

  // ── Scroll / parallax state ───────────────────────────────────────────────
  const [scrollY, setScrollY]             = useState(0);
  const heroRef                           = useRef(null);
  const destinationsRef                   = useRef(null);
  const [heroHeight, setHeroHeight]       = useState(0);

  // ── Init: pick random 10-15 from popular list ────────────────────────────
  useEffect(() => {
    const shuffled = shuffle(POPULAR_CITIES).slice(0, 15);
    setDefaultCities(shuffled);
  }, []);

  // ── Scroll listener for parallax ─────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (heroRef.current) setHeroHeight(heroRef.current.offsetHeight);
  }, []);

  // ── Scroll helpers ────────────────────────────────────────────────────────
  const scrollToDestinations = () => {
    destinationsRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Parallax: hero bg moves slower than scroll
  const heroBgY = scrollY * 0.45;
  // Hero content fades + rises as user scrolls
  const heroContentOpacity = Math.max(0, 1 - scrollY / (heroHeight * 0.65));
  const heroContentY       = scrollY * 0.25;

  // Destinations section slides up as user scrolls down
  const destProgress = heroHeight > 0
    ? Math.min(1, Math.max(0, (scrollY - heroHeight * 0.35) / (heroHeight * 0.45)))
    : 1;
  const destTranslateY = (1 - destProgress) * 60;
  const destOpacity    = destProgress;

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = async (city) => {
    setLoading(true);
    setIsSearchMode(true);
    setSearchedTerm(city);
    setPage(1);
    const result = await searchCities(city);

    // Mix: prepend any popular city that matches, deduplicate
    const matchingPopular = POPULAR_CITIES.filter((p) =>
      p.city.toLowerCase().includes(city.toLowerCase())
    );
    const apiIds = new Set(result.map((r) => r.city));
    const extras = matchingPopular.filter((p) => !apiIds.has(p.city));
    setSearchResults([...extras, ...result]);
    setLoading(false);

    // Scroll to results
    setTimeout(() => destinationsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const clearSearch = () => {
    setIsSearchMode(false);
    setSearchResults([]);
    setSearchedTerm("");
    setPage(1);
    scrollToHero();
  };

  // ── Pagination logic ──────────────────────────────────────────────────────
  const activeList   = isSearchMode ? searchResults : defaultCities;
  const activePage   = isSearchMode ? page : defaultPage;
  const setActivePage = isSearchMode ? setPage : setDefaultPage;
  const totalPages   = Math.ceil(activeList.length / ITEMS_PER_PAGE);
  const pagedCities  = activeList.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setActivePage(newPage);
    destinationsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
          HERO — Full screen, sticky background parallax
      ═══════════════════════════════════════════════════════ */}
      <div
        ref={heroRef}
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Parallax background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${heroBgY}px)`,
            willChange: "transform",
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(160deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 60%, rgba(180,80,20,0.18) 100%)",
          }}
        />

        {/* Hero content — fades out on scroll */}
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            textAlign: "center",
            padding: "0 24px",
            opacity: heroContentOpacity,
            transform: `translateY(${heroContentY}px)`,
            willChange: "transform, opacity",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "rgba(200,96,46,0.88)",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "5px 16px",
              borderRadius: 20,
            }}
          >
            Explore the World
          </span>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(38px, 6vw, 72px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.08,
              letterSpacing: "-1px",
              maxWidth: 700,
            }}
          >
            Travel Far,<br />Find Yourself
          </h1>

          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", fontWeight: 300, maxWidth: 420 }}>
            Discover cities, live weather &amp; stunning destinations across the globe
          </p>

          <SearchBar onSearch={handleSearch} />

          {/* Scroll-down nudge */}
          <button
            onClick={scrollToDestinations}
            style={{
              position: "absolute",
              bottom: 36,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 40,
              padding: "10px 22px",
              color: "#fff",
              fontSize: 13,
              fontFamily: "inherit",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              backdropFilter: "blur(8px)",
              animation: "bobDown 2s ease-in-out infinite",
            }}
          >
            <span>Explore Destinations</span>
            <span style={{ fontSize: 16 }}>↓</span>
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DESTINATIONS SECTION — slides up on scroll
      ═══════════════════════════════════════════════════════ */}
      <div
        ref={destinationsRef}
        style={{
          background: "var(--bg)",
          minHeight: "100vh",
          padding: "64px 40px 80px",
          maxWidth: 1240,
          margin: "0 auto",
          opacity: destOpacity,
          transform: `translateY(${destTranslateY}px)`,
          transition: "opacity 0.1s, transform 0.1s",
          willChange: "transform, opacity",
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 36,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(24px, 3vw, 34px)",
                color: "var(--text)",
                marginBottom: 4,
              }}
            >
              {isSearchMode ? `Results for "${searchedTerm}"` : "Popular Destinations"}
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              {isSearchMode
                ? `${searchResults.length} destination${searchResults.length !== 1 ? "s" : ""} found`
                : `${defaultCities.length} curated destinations worldwide`}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {isSearchMode && (
              <button onClick={clearSearch} style={chipStyle}>
                ✕ Clear search
              </button>
            )}
            <button onClick={scrollToHero} style={chipStyle}>
              ↑ Back to top
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <Loader />
        ) : pagedCities.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🌐</div>
            <p style={{ fontSize: 17 }}>No cities found for "{searchedTerm}"</p>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
                gap: 24,
              }}
            >
              {pagedCities.map((item, i) => (
                <div
                  key={item.id || item._id || item.city}
                  style={{
                    animation: `cardFadeIn 0.4s ease both`,
                    animationDelay: `${i * 45}ms`,
                  }}
                >
                  <DestinationCard place={item} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 52,
                }}
              >
                <button
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                  style={paginationBtn(activePage === 1)}
                >
                  ← Prev
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 10,
                      border: p === activePage ? "none" : "1px solid var(--border)",
                      background: p === activePage ? "var(--accent)" : "var(--surface)",
                      color: p === activePage ? "#fff" : "var(--text)",
                      fontFamily: "inherit",
                      fontSize: 14,
                      fontWeight: p === activePage ? 700 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === totalPages}
                  style={paginationBtn(activePage === totalPages)}
                >
                  Next →
                </button>
              </div>
            )}

            {/* Pagination info */}
            <p
              style={{
                textAlign: "center",
                fontSize: 12,
                color: "var(--text-muted)",
                marginTop: 16,
              }}
            >
              Page {activePage} of {totalPages} &nbsp;·&nbsp;
              Showing {(activePage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(activePage * ITEMS_PER_PAGE, activeList.length)} of {activeList.length}
            </p>
          </>
        )}
      </div>

      {/* ── Keyframe animations (injected once) ── */}
      <style>{`
        @keyframes bobDown {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%       { transform: translateX(-50%) translateY(7px); }
        }
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ── Inline style helpers ─────────────────────────────────────────────── */
const chipStyle = {
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  padding: "8px 16px",
  fontSize: 13,
  color: "var(--text-muted)",
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "all 0.2s",
};

const paginationBtn = (disabled) => ({
  padding: "9px 20px",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: disabled ? "var(--surface-2)" : "var(--surface)",
  color: disabled ? "var(--text-muted)" : "var(--text)",
  fontFamily: "inherit",
  fontSize: 13,
  fontWeight: 500,
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.5 : 1,
  transition: "all 0.2s",
});