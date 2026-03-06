document.addEventListener("DOMContentLoaded", () => {

    // Initialize MapLibre map
    const gfMap = new maplibregl.Map({
        container: "gfMapContainer",
        style: "https://api.maptiler.com/maps/01987212-0da2-730a-aed1-bc06f406fd8c/style.json?key=rbSDU8LYKdiVmKI4MGVJ",
        center: [-98.5795, 39.8283], // USA center
        zoom: 4
    });

    gfMap.addControl(new maplibregl.NavigationControl());

    let gfMarkers = [];

    function gfClearMarkers() {
        gfMarkers.forEach(marker => marker.remove());
        gfMarkers = [];
    }

    async function gfFindCourses() {
        if (!navigator.geolocation) {
            alert("Geolocation not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(async pos => {
            const userLat = pos.coords.latitude;
            const userLon = pos.coords.longitude;

            gfMap.setCenter([userLon, userLat]);
            gfMap.setZoom(11);

            gfClearMarkers();

            // User location marker
            const userMarker = new maplibregl.Marker({ color: "green" })
                .setLngLat([userLon, userLat])
                .setPopup(new maplibregl.Popup().setText("You are here"))
                .addTo(gfMap);

            gfMarkers.push(userMarker);

            const courseListEl = document.getElementById("gfCourseList");
            courseListEl.innerHTML = "<p>Searching for nearby golf courses...</p>";

            const overpassQuery = `
                [out:json];
                (
                    node["leisure"="golf_course"](around:30000,${userLat},${userLon});
                    way["leisure"="golf_course"](around:30000,${userLat},${userLon});
                    relation["leisure"="golf_course"](around:30000,${userLat},${userLon});
                );
                out center;
            `;

            const overpassUrl = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(overpassQuery);

            try {
                const response = await fetch(overpassUrl);
                if (!response.ok) throw new Error(`Network error: ${response.statusText}`);
                const data = await response.json();

                if (!data.elements || data.elements.length === 0) {
                    courseListEl.innerHTML = "<p>No golf courses found within 30 km.</p>";
                    return;
                }

                courseListEl.innerHTML = "";

                data.elements.forEach(el => {
                    const courseLat = el.lat || el.center?.lat;
                    const courseLon = el.lon || el.center?.lon;
                    if (!courseLat || !courseLon) return;

                    const courseName = el.tags?.name || "Unnamed Golf Course";

                    // Marker for course
                    const marker = new maplibregl.Marker()
                        .setLngLat([courseLon, courseLat])
                        .setPopup(new maplibregl.Popup().setText(courseName))
                        .addTo(gfMap);

                    gfMarkers.push(marker);

                    // Add to course list
                    courseListEl.insertAdjacentHTML(
                        "beforeend",
                        `📍 <strong>${courseName}</strong> (${courseLat.toFixed(3)}, ${courseLon.toFixed(3)})<br>`
                    );
                });

            } catch (err) {
                console.error("Overpass fetch error:", err);
                courseListEl.innerHTML = "<p>Error fetching golf courses.</p>";
            }

        }, () => alert("Location access denied."));
    }

    document.getElementById("gfSearchBtn").addEventListener("click", gfFindCourses);

});
