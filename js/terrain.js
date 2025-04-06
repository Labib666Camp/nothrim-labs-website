// js/terrain.js

function initTerrain() {
    const container = document.getElementById('terrain-container');
    if (!container) {
        console.error('Terrain container not found!');
        return;
    }

    // Scope variables
    let scene, camera, renderer, terrain, clock, ambientLight, directionalLight;
    let animationFrameId = null; // To control the animation loop

    function setup() {
        console.log("Terrain: Setting up scene...");
        scene = new THREE.Scene();
        // Use a color from the theme for the fog, matching the gradient perhaps
        scene.fog = new THREE.Fog(0xd6f3ff, 90, 220); // Sky blue fade

        const aspect = container.clientWidth / container.clientHeight;
        camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        container.appendChild(renderer.domElement);

        const geometry = new THREE.PlaneGeometry(150, 150, 60, 60);
        const material = new THREE.MeshPhongMaterial({
            // --- Use Darker Theme Colors ---
            color: 0x2b6770,       // Darker Teal/Green
            specular: 0x4a766e,     // Muted Teal/Grey Specular
            shininess: 8,          // Adjusted shininess
            wireframe: true,
            flatShading: false
        });
        terrain = new THREE.Mesh(geometry, material);

        // Rotate and position like the improved version for better view
        terrain.rotation.x = -Math.PI / 2.8;
        terrain.position.y = -10; // Lower it a bit more
        scene.add(terrain);

        // Lighting (Keep the improved lighting)
        ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
        scene.add(ambientLight);
        directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 15, 10); // Adjust light position slightly
        scene.add(directionalLight);

        // Camera Position (Keep the improved position)
        camera.position.set(0, 60, 100); // Adjusted Y and Z for angle
        camera.lookAt(scene.position);   // Look towards the center

        clock = new THREE.Clock(); // Use clock for time delta
        console.log("Terrain: Setup complete.");
    }

    function animate() {
        // Re-request the next frame
        animationFrameId = requestAnimationFrame(animate);

        // --- Use Original Animation Logic ---
        const elapsedTime = clock.getElapsedTime(); // Get time from clock
        const positions = terrain.geometry.attributes.position; // Get position attribute

        // Loop through all vertices
        for (let i = 0; i < positions.count; i++) {
            // Get x and y of the vertex
            const x = positions.getX(i);
            const y = positions.getY(i);

            // Calculate z based on the original formula structure, using elapsedTime
            // Adjust time multipliers slightly if needed to match original speed perception
            const timeFactor = elapsedTime * 1.0; // Base time progression (adjust multiplier if needed)

            const z = Math.sin(x / 8 + timeFactor) * 3 +                 // Wave 1
                      Math.cos(y / 6 + timeFactor * 0.8) * 2 +           // Wave 2
                      Math.sin(x / 4 + y / 5 + timeFactor * 1.2) * 1.5;  // Wave 3

            // Set the z coordinate of the vertex
            positions.setZ(i, z);
        }

        // Tell Three.js that the positions have changed
        positions.needsUpdate = true;

        // --- Add Normal Calculation (Important for lighting!) ---
        terrain.geometry.computeVertexNormals();

        // Render the scene
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        if (!camera || !renderer || !container) return;
        console.log("Terrain: Resizing...");
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    function start() {
        // Prevent multiple loops
        if (animationFrameId) return;

        // Only setup if needed (e.g., if previously stopped)
        if (!scene) {
            setup();
        }
        console.log("Terrain: Starting animation loop.");
        animate(); // Start the animation loop
        window.addEventListener('resize', onWindowResize);
    }

    function stop() {
        if (animationFrameId) {
            console.log("Terrain: Stopping animation loop.");
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            window.removeEventListener('resize', onWindowResize);

            // Optional: Aggressive cleanup if memory is a concern,
            // but usually not needed if start()/stop() are used correctly.
            // renderer?.dispose();
            // scene?.traverse(object => {
            //     if (object.geometry) object.geometry.dispose();
            //     if (object.material) object.material.dispose();
            // });
            // while (container.firstChild) { container.removeChild(container.firstChild); }
            // scene = null; camera = null; renderer = null; // etc.
        }
    }

    // --- Use Intersection Observer ---
    console.log("Terrain: Setting up Intersection Observer.");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log("Terrain: Container intersecting, calling start().");
                start();
            } else {
                console.log("Terrain: Container not intersecting, calling stop().");
                stop();
            }
        });
    }, { threshold: 0.1 }); // Start when 10% visible

    if (container) {
        observer.observe(container);
    } else {
        console.error("Terrain: Container not found for observer.");
    }
}

// --- Initialize ---
// Ensure Three.js is loaded before running
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerrain);
} else {
    initTerrain(); // Already loaded
}