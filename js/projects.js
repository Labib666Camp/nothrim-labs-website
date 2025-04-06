// js/projects.js

console.log("projects.js: Script loaded (Simplified Version)");

document.addEventListener('DOMContentLoaded', () => {
    console.log("projects.js: DOMContentLoaded event fired.");

    // --- Visuals Initialization ---
    try {
        console.log("projects.js: Attempting to initialize project visuals...");
        initProjectVisuals(); // Initialize Canvas animations directly
        console.log("projects.js: Project visuals initialization called.");
    } catch (error) {
        console.error("projects.js: Error during initProjectVisuals call:", error);
    }

}); // End of DOMContentLoaded


// No Scroll Animations function needed anymore
// function initScrollAnimations() { ... }


function initProjectVisuals() {
    console.log("projects.js: initProjectVisuals() called.");
    const bioVisualContainer = document.getElementById('bioacoustics-visual');
    const heatVisualContainer = document.getElementById('urbanheat-visual');

    console.log("projects.js: Bioacoustics container:", bioVisualContainer);
    console.log("projects.js: Urban Heat container:", heatVisualContainer);

    if (bioVisualContainer) {
        try {
            console.log("projects.js: Creating Bioacoustics visual...");
            createBioacousticsVisual(bioVisualContainer);
        } catch (error) {
             console.error("projects.js: Error creating Bioacoustics visual:", error);
        }
    } else {
         console.warn("projects.js: Container element with ID 'bioacoustics-visual' not found.");
    }

    if (heatVisualContainer) {
         try {
            console.log("projects.js: Creating Urban Heat visual...");
            createUrbanHeatVisual(heatVisualContainer);
        } catch (error) {
             console.error("projects.js: Error creating Urban Heat visual:", error);
        }
    } else {
         console.warn("projects.js: Container element with ID 'urbanheat-visual' not found.");
    }
}


// ==============================================================
// BIOACOUSTICS VISUALIZATION (Runs Continuously)
// ==============================================================
function createBioacousticsVisual(container) {
    console.log("projects.js: createBioacousticsVisual() started for container:", container);
    if (!container) { /* ... error check ... */ return; }
    const canvas = document.createElement('canvas');
    if (!canvas) { /* ... error check ... */ return; }
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) { /* ... error check ... */ return; }
    console.log("Bioacoustics: Canvas and context obtained successfully.");

    let width, height;
    const bufferLength = 128;
    let frequencyData = new Array(bufferLength).fill(0);
    let timeData = new Array(bufferLength).fill(0);
    let history = [];
    const historyLength = 100;
    let animationFrameId = null;

    function resize() {
        try {
            width = canvas.width = container.clientWidth;
            height = canvas.height = container.clientHeight;
            history = [];
            console.log("Bioacoustics: Resized");
        } catch (error) {
             console.error("Bioacoustics resize error:", error);
             stopAnimation(); // Stop animation if resize fails
        }
    }

    function updateData() { /* ... same logic as before ... */
        for (let i = 0; i < bufferLength; i++) {
            const base = Math.pow(Math.sin(i * 0.1 + Date.now() * 0.001), 4) * 0.5;
            const peak = Math.random() < 0.05 ? Math.random() * 0.8 + 0.2 : 0;
            frequencyData[i] = Math.min(1, (frequencyData[i] * 0.8) + (base + peak) * 0.2);
            timeData[i] = (Math.sin(i * 0.2 + Date.now() * 0.005) * 0.4 + Math.random() * 0.1) * frequencyData[i];
        }
        history.push([...frequencyData]);
        if (history.length > historyLength) { history.shift(); }
    }
    function drawSpectrogram() { /* ... same logic as before ... */
        const sliceWidth = width / historyLength;
        history.forEach((dataSlice, i) => {
            const x = i * sliceWidth; const barWidth = sliceWidth;
            dataSlice.forEach((value, j) => {
                const barHeight = height / bufferLength; const y = height - (j + 1) * barHeight;
                const hue = 180 + value * 60; const saturation = 80 + value * 20;
                const lightness = 30 + value * 40; const alpha = value * 0.8 + 0.1;
                ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
                ctx.fillRect(x, y, barWidth, barHeight);
            });
        });
    }
     function drawWaveform() { /* ... same logic as before ... */
        ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(243, 233, 210, 0.7)';
        ctx.beginPath(); const sliceWidth = width / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
            const v = timeData[i]; const x = i * sliceWidth; const y = height / 2 + v * height * 0.4;
            if (i === 0) { ctx.moveTo(x, y); } else { ctx.lineTo(x, y); }
        }
        ctx.lineTo(width, height / 2); ctx.stroke();
    }

    function animate() {
        try {
            updateData();
            ctx.fillStyle = 'rgba(26, 77, 85, 0.9)';
            ctx.fillRect(0, 0, width, height);
            drawSpectrogram();
            drawWaveform();
            animationFrameId = requestAnimationFrame(animate);
        } catch (error) {
            console.error("Bioacoustics animation loop error:", error);
            stopAnimation(); // Stop animation on error
        }
    }

     function startAnimation() {
        if (animationFrameId) return; // Already running
        console.log("Bioacoustics: Starting animation.");
        try {
            resize(); // Initial size calculation
            animate(); // Start the loop
            window.addEventListener('resize', resize); // Listen for resize
        } catch(error) {
             console.error("Bioacoustics: Error during startAnimation():", error);
             stopAnimation();
        }
    }
    function stopAnimation() { // Renamed for clarity
        if (animationFrameId) {
             console.log("Bioacoustics: Stopping animation.");
             cancelAnimationFrame(animationFrameId);
             animationFrameId = null;
             window.removeEventListener('resize', resize); // Clean up listener
        }
    }

    // --- Start the animation immediately ---
    startAnimation();

    // No Observer needed anymore
    // observeCanvasVisual(canvas, start, stop);
}


// ==============================================================
// URBAN HEAT VISUALIZATION (Runs Continuously)
// ==============================================================
function createUrbanHeatVisual(container) {
     console.log("projects.js: createUrbanHeatVisual() started for container:", container);
     if (!container) { /* ... error check ... */ return; }
     const canvas = document.createElement('canvas');
     if (!canvas) { /* ... error check ... */ return; }
     container.appendChild(canvas);
     const ctx = canvas.getContext('2d');
     if (!ctx) { /* ... error check ... */ return; }
     console.log("UrbanHeat: Canvas and context obtained successfully.");

    let width, height;
    const gridSize = 20;
    let cells = [];
    let trees = [];
    let lastTreeTime = 0;
    const treeCooldown = 1500;
    const maxTrees = 10;
    let animationFrameId = null;
    let lastTimestamp = 0;

    function initGrid() { /* ... same logic as before ... */
        cells = []; const cellWidth = width / gridSize; const cellHeight = height / gridSize;
        for (let x = 0; x < gridSize; x++) {
            cells[x] = [];
            for (let y = 0; y < gridSize; y++) {
                const baseTemp = 0.6 + Math.random() * 0.3;
                const edgeFactor = Math.sin(x / gridSize * Math.PI) * Math.sin(y / gridSize * Math.PI);
                cells[x][y] = { x: x * cellWidth, y: y * cellHeight, w: cellWidth, h: cellHeight, temp: baseTemp * (0.5 + edgeFactor * 0.5), targetTemp: baseTemp * (0.5 + edgeFactor * 0.5) };
            }
        }
        trees = []; lastTreeTime = 0;
    }

    function resize() {
       try {
            width = canvas.width = container.clientWidth;
            height = canvas.height = container.clientHeight;
            initGrid(); // Re-initialize grid on resize
            console.log("UrbanHeat: Resized");
       } catch (error) {
           console.error("UrbanHeat resize error:", error);
           stopAnimation();
       }
    }

    function updateTemperatures(deltaTime) { /* ... same logic as before ... */
        const diffusionRate = 0.05 * deltaTime; const coolingRate = 0.01 * deltaTime;
        const heatingRate = 0.02 * deltaTime; const treeCoolingFactor = 0.8 * deltaTime;
        // Apply tree cooling effect
        trees.forEach(tree => {
            const treeCellX = Math.floor(tree.x / (width / gridSize)); const treeCellY = Math.floor(tree.y / (height / gridSize));
            const coolRadius = 3;
            for (let dx = -coolRadius; dx <= coolRadius; dx++) {
                for (let dy = -coolRadius; dy <= coolRadius; dy++) {
                    const nx = treeCellX + dx; const ny = treeCellY + dy;
                    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                        const distSq = dx*dx + dy*dy;
                        if (distSq <= coolRadius * coolRadius) {
                           const falloff = 1 - Math.sqrt(distSq) / coolRadius;
                           cells[nx][ny].temp -= treeCoolingFactor * falloff * falloff;
                           cells[nx][ny].temp = Math.max(0.1, cells[nx][ny].temp);
                        } } } }
        });
        // Diffusion and random fluctuations
        let tempChanges = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0));
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                let neighborSum = 0; let neighborCount = 0;
                const neighbors = [[-1,0], [1,0], [0,-1], [0,1]];
                neighbors.forEach(([dx, dy]) => {
                    const nx = x + dx, ny = y + dy; // Fixed: Defined nx, ny here
                    if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
                        neighborSum += cells[nx][ny].temp; neighborCount++;
                    } });
                if (neighborCount > 0) { tempChanges[x][y] += (neighborSum / neighborCount - cells[x][y].temp) * diffusionRate; }
                tempChanges[x][y] += (Math.random() - 0.48) * heatingRate;
                tempChanges[x][y] += (cells[x][y].targetTemp - cells[x][y].temp) * coolingRate;
            } }
        // Apply calculated changes
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                cells[x][y].temp += tempChanges[x][y];
                cells[x][y].temp = Math.max(0.1, Math.min(1.0, cells[x][y].temp));
            } }
    }
    function draw() { /* ... same logic as before ... */
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                const cell = cells[x][y]; const temp = cell.temp; let r, g, b;
                if (temp < 0.5) { r = Math.floor(255 * (temp * 2)); g = Math.floor(255 * (temp * 2)); b = Math.floor(255 * (1 - temp * 2)); }
                else { r = 255; g = Math.floor(255 * (1 - (temp - 0.5) * 2)); b = 0; }
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(cell.x, cell.y, cell.w + 1, cell.h + 1);
            } }
        // Draw trees
        trees.forEach(tree => {
            ctx.beginPath(); ctx.arc(tree.x, tree.y, tree.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#208040'; ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 1; ctx.stroke();
        });
    }

    function animate(timestamp) {
        try {
            // Initialize timestamp on first call
             if (lastTimestamp === 0) {
                lastTimestamp = timestamp;
            }
            const deltaTime = (timestamp - lastTimestamp) / 1000;
            lastTimestamp = timestamp;

            // Add trees periodically
             if (timestamp - lastTreeTime > treeCooldown && trees.length < maxTrees) {
                 trees.push({ x: Math.random() * width * 0.8 + width * 0.1, y: Math.random() * height * 0.8 + height * 0.1, radius: 8 + Math.random() * 4 });
                 lastTreeTime = timestamp;
             }

            updateTemperatures(Math.min(deltaTime, 0.05)); // Cap delta time
            draw();
            animationFrameId = requestAnimationFrame(animate);
        } catch (error) {
            console.error("UrbanHeat animation loop error:", error);
            stopAnimation();
        }
    }

     function startAnimation() {
        if (animationFrameId) return; // Already running
        console.log("UrbanHeat: Starting animation.");
        try {
            lastTimestamp = performance.now(); // Use performance.now for higher precision if available
            resize(); // Initial size and grid setup
            animate(lastTimestamp); // Start loop
            window.addEventListener('resize', resize); // Listen for resize
        } catch(error) {
             console.error("UrbanHeat: Error during startAnimation():", error);
             stopAnimation();
        }
    }
    function stopAnimation() { // Renamed for clarity
        if (animationFrameId) {
            console.log("UrbanHeat: Stopping animation.");
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            window.removeEventListener('resize', resize); // Clean up listener
        }
    }

    // --- Start the animation immediately ---
    startAnimation();

    // No Observer needed anymore
    // observeCanvasVisual(canvas, start, stop);
}


// No Observer helper function needed anymore
// function observeCanvasVisual(canvas, startCallback, stopCallback) { ... }