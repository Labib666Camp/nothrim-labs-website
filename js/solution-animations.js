document.addEventListener('DOMContentLoaded', () => {
    const sensingCanvas = document.getElementById('sensing-animation');
    const aiCoreCanvas = document.getElementById('ai-core-animation');
    const circularCanvas = document.getElementById('circular-animation');

    if (sensingCanvas) initSensingAnimation(sensingCanvas);
    if (aiCoreCanvas) initAiCoreAnimation(aiCoreCanvas);
    if (circularCanvas) initCircularAnimation(circularCanvas);
});

// --- Sensing Animation (Satellite Dish Waves) ---
function initSensingAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let angle = 0;
    let animationFrameId;

    function resize() {
        const container = canvas.parentElement;
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = '#1a4d55'; // Deep Teal
        ctx.lineWidth = 1.5;

        const centerX = width / 2;
        const centerY = height * 0.8; // Base of the "dish"
        const dishRadius = width * 0.15;

        // Draw dish base
        ctx.beginPath();
        ctx.arc(centerX, centerY, dishRadius, Math.PI, 0); // Semi-circle
        ctx.stroke();

        // Draw waves emanating
        const waves = 3;
        for (let i = 1; i <= waves; i++) {
            ctx.beginPath();
            const radius = dishRadius + i * 15 + Math.sin(angle + i * 0.5) * 5;
            const opacity = 1 - (i / (waves + 1));
            ctx.strokeStyle = `rgba(26, 77, 85, ${opacity})`; // Deep Teal with opacity
            ctx.arc(centerX, centerY, radius, Math.PI * 1.2, -Math.PI * 0.2); // Wider arc
            ctx.stroke();
        }

        angle += 0.05;
        animationFrameId = requestAnimationFrame(draw);
    }

    function start() {
        resize();
        draw();
    }
    function stop() {
        if(animationFrameId) cancelAnimationFrame(animationFrameId);
    }

    observeCanvas(canvas, start, stop);
    window.addEventListener('resize', resize);
}

// --- AI Core Animation (Neural Network Style) ---
function initAiCoreAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    let connections = [];
    let time = 0;
    let animationFrameId;

    const nodeLayers = [3, 4, 3]; // Input, hidden, output layers
    const layerSpacing = 0.3; // Percentage of width
    const nodeRadius = 5;

    function setupNodes() {
        nodes = [];
        connections = [];
        const totalLayers = nodeLayers.length;
        const xSpacing = width * (1 - layerSpacing * 2) / (totalLayers - 1);

        nodeLayers.forEach((count, layerIndex) => {
            const layerX = width * layerSpacing + layerIndex * xSpacing;
            const ySpacing = height / (count + 1);
            for (let i = 0; i < count; i++) {
                const nodeY = ySpacing * (i + 1);
                nodes.push({ x: layerX, y: nodeY, layer: layerIndex, activation: 0 });
            }
        });

        // Create connections
        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].layer < totalLayers - 1) {
                nodes.forEach(targetNode => {
                    if (targetNode.layer === nodes[i].layer + 1) {
                        connections.push({ from: nodes[i], to: targetNode });
                    }
                });
            }
        }
    }


    function resize() {
        const container = canvas.parentElement;
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
        setupNodes(); // Recalculate node positions on resize
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        time += 0.02;

        // Draw connections
        ctx.strokeStyle = 'rgba(106, 176, 131, 0.3)'; // Primary Green, low opacity
        ctx.lineWidth = 1;
        connections.forEach(conn => {
            ctx.beginPath();
            ctx.moveTo(conn.from.x, conn.from.y);
            ctx.lineTo(conn.to.x, conn.to.y);
            ctx.stroke();
        });

         // Draw nodes and activation pulse
        nodes.forEach((node, index) => {
            // Activation pulse
            const pulse = Math.max(0, Math.sin(time * 2 + node.layer * 1.5 + index * 0.5)); // Offset pulse per node/layer
            node.activation = pulse;

            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius + node.activation * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(26, 77, 85, ${0.5 + node.activation * 0.5})`; // Deep Teal, brighter when active
            ctx.fill();
        });


        animationFrameId = requestAnimationFrame(draw);
    }

     function start() {
        resize();
        draw();
    }
    function stop() {
        if(animationFrameId) cancelAnimationFrame(animationFrameId);
    }

    observeCanvas(canvas, start, stop);
    window.addEventListener('resize', resize);
}


// --- Circular Animation (Looping Arrows/Particles) ---
function initCircularAnimation(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const numParticles = 15;
    const radius = 30;
    let angleOffset = 0;
    let animationFrameId;

    function setupParticles() {
         particles = [];
         for (let i = 0; i < numParticles; i++) {
            particles.push({
                angle: (Math.PI * 2 / numParticles) * i,
                speed: 0.01 + Math.random() * 0.01 // Vary speed slightly
            });
        }
    }

    function resize() {
        const container = canvas.parentElement;
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
        setupParticles(); // Re-initialize if needed, though not strictly necessary here
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const centerX = width / 2;
        const centerY = height / 2;

        angleOffset += 0.005; // Overall rotation

        particles.forEach(p => {
            p.angle += p.speed;
            const currentAngle = p.angle + angleOffset;
            const x = centerX + Math.cos(currentAngle) * radius;
            const y = centerY + Math.sin(currentAngle) * radius;

            // Draw arrow-like particle
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(currentAngle + Math.PI / 2); // Point tangent to circle

            ctx.beginPath();
            ctx.moveTo(0, -4); // Tip
            ctx.lineTo(3, 2);
            ctx.lineTo(-3, 2);
            ctx.closePath();

            const opacity = 0.6 + Math.sin(currentAngle * 3) * 0.4; // Vary opacity
            ctx.fillStyle = `rgba(106, 176, 131, ${opacity})`; // Primary Green
            ctx.fill();
            ctx.restore();
        });

        animationFrameId = requestAnimationFrame(draw);
    }

     function start() {
        resize();
        draw();
    }
    function stop() {
         if(animationFrameId) cancelAnimationFrame(animationFrameId);
    }

    observeCanvas(canvas, start, stop);
    window.addEventListener('resize', resize);
}


// --- Helper: Observer to start/stop canvas animations ---
function observeCanvas(canvas, startCallback, stopCallback) {
     const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCallback();
            } else {
                stopCallback();
            }
        });
    }, { threshold: 0.1 }); // Start when visible

    observer.observe(canvas);
}