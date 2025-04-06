function initAgricultureGlobe() {
  const container = document.getElementById('globe-container');
  if (!container) {
      console.error('Globe container not found!');
      return;
  }

  let scene, camera, renderer, globe, dataPoints, clock;
  let animationFrameId = null;

  function setup() {
      scene = new THREE.Scene();
      const aspect = container.clientWidth / container.clientHeight;
      camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000); // Slightly adjusted FOV
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x000000, 0); // Transparent background
      container.appendChild(renderer.domElement);

      // Globe Geometry and Material
      const globe_rad = 8; // Slightly smaller globe
      const globeGeometry = new THREE.SphereGeometry(globe_rad, 48, 48); // Increased segments
      const globeMaterial = new THREE.MeshPhongMaterial({
          color: 0x6ab083,       // Use primary green
          specular: 0xa8dadc,     // Light teal specular
          shininess: 8,
          transparent: true,
          opacity: 0.7,
          wireframe: false        // Solid globe for better texture mapping
      });

      // Simple procedural texture (dots)
      const canvasSize = 128;
      const textureCanvas = document.createElement('canvas');
      textureCanvas.width = canvasSize;
      textureCanvas.height = canvasSize;
      const context = textureCanvas.getContext('2d');
      context.fillStyle = '#1a4d55'; // Base color dark teal
      context.fillRect(0, 0, canvasSize, canvasSize);
      context.fillStyle = 'rgba(168, 218, 220, 0.3)'; // Light teal dots
      for (let i = 0; i < 200; i++) {
          context.beginPath();
          context.arc(Math.random() * canvasSize, Math.random() * canvasSize, Math.random() * 1.5, 0, Math.PI * 2);
          context.fill();
      }
      const texture = new THREE.CanvasTexture(textureCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 2); // Repeat texture for finer pattern
      globeMaterial.map = texture;
      globeMaterial.needsUpdate = true;


      globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);

      // Data Points
      dataPoints = new THREE.Group();
      const pointGeometry = new THREE.SphereGeometry(0.08, 8, 8); // Smaller points
      const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xf3e9d2 }); // Accent sand color
      for (let i = 0; i < 300; i++) { // Fewer points for clarity
          const point = new THREE.Mesh(pointGeometry, pointMaterial);

          // Distribute points more evenly using spherical coordinates
          const phi = Math.acos(-1 + (2 * i) / 300);
          const theta = Math.sqrt(300 * Math.PI) * phi;

          point.position.setFromSphericalCoords(globe_rad + 0.2 + Math.random() * 0.3, phi, theta); // Slightly outside globe

          // Store initial scale for pulsing
          point.userData.initialScale = 0.8 + Math.random() * 0.4;
          point.scale.setScalar(point.userData.initialScale);
          dataPoints.add(point);
      }
      scene.add(dataPoints);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 10, 8);
      scene.add(dirLight);

      camera.position.z = 18; // Move camera back slightly

      clock = new THREE.Clock();
  }


  function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      globe.rotation.y += 0.0015; // Slower rotation
      dataPoints.rotation.y += 0.002;

      // Pulse data points
      dataPoints.children.forEach((point, index) => {
           const pulse = Math.sin(elapsedTime * 2 + index * 0.5) * 0.2 + 1.0; // Simple sine wave pulse
           const scale = point.userData.initialScale * pulse;
           point.scale.setScalar(Math.max(0.5, scale)); // Ensure minimum size
      });


      renderer.render(scene, camera);
  }

   function onWindowResize() {
      if (!camera || !renderer || !container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function start() {
      if (!container || !THREE) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
       while (container.firstChild) {
          container.removeChild(container.firstChild);
      }
      setup();
      animate();
      window.addEventListener('resize', onWindowResize);
  }

  function stop() {
      if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
      }
      window.removeEventListener('resize', onWindowResize);
      renderer?.dispose();
       while (container.firstChild) {
          container.removeChild(container.firstChild);
      }
  }

  // Use Intersection Observer
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              start();
          } else {
              stop();
          }
      });
  }, { threshold: 0.1 });

  if (container) {
      observer.observe(container);
  } else {
      console.error("Globe container not found for observer.");
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAgricultureGlobe);
} else {
  initAgricultureGlobe();
}