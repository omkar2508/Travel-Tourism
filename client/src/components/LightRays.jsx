// D:/client/src/components/LightRays.jsx
import { useRef, useEffect, useState } from "react";
import { Renderer, Program, Triangle, Mesh } from "ogl";
import "./LightRays.css"; // Import the component-specific CSS

const DEFAULT_COLOR = "#ffffff";

// Helper function to convert hex color to RGB array (0-1 scale)
const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m
    ? [
      parseInt(m[1], 16) / 255,
      parseInt(m[2], 16) / 255,
      parseInt(m[3], 16) / 255,
    ]
    : [1, 1, 1];
};

// Helper function to determine anchor point and direction based on origin prop
const getAnchorAndDir = (origin, w, h) => {
  const outside = 0.2; // How much outside the canvas the origin can be
  switch (origin) {
    case "top-left":
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case "top-right":
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case "left":
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case "right":
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case "bottom-left":
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case "bottom-center":
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case "bottom-right":
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default: // "top-center"
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

const LightRays = ({
  raysOrigin = "top-center",
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = "",
}) => {
  const containerRef = useRef(null); // Ref for the div that will hold the WebGL canvas
  const uniformsRef = useRef(null); // Ref to store GLSL uniform values
  const rendererRef = useRef(null); // Ref to store the OGL renderer instance
  const mouseRef = useRef({ x: 0.5, y: 0.5 }); // Current raw mouse position
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 }); // Smoothed mouse position
  const animationIdRef = useRef(null); // Stores requestAnimationFrame ID for cleanup
  const meshRef = useRef(null); // Ref to store the OGL mesh
  const cleanupFunctionRef = useRef(null); // Stores the cleanup function

  // State to track if the component is visible in the viewport (for performance)
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  // Intersection Observer to detect visibility
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting); // Set visibility state
      },
      { threshold: 0.1 } // Trigger when 10% of the component is visible
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect(); // Disconnect observer on unmount
        observerRef.current = null;
      }
    };
  }, []);

  // Main WebGL initialization and animation loop
  useEffect(() => {
    // Only initialize if visible and container is ready
    if (!isVisible || !containerRef.current) return;

    // Cleanup any previous WebGL instances if component re-renders while visible
    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    }

    const initializeWebGL = async () => {
      if (!containerRef.current) return; // Double check ref after potential delay

      // Small delay to ensure container dimensions are stable
      await new Promise((resolve) => setTimeout(resolve, 10));
      if (!containerRef.current) return; // Check again after delay

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2), // Device pixel ratio for sharp rendering
        alpha: true, // Enable transparency
      });
      rendererRef.current = renderer;
      const gl = renderer.gl; // Get the WebGL context

      // Style the canvas to fill its parent container
      gl.canvas.style.width = "100%";
      gl.canvas.style.height = "100%";
      gl.canvas.style.position = "absolute"; // Position absolutely within container
      gl.canvas.style.top = "0";
      gl.canvas.style.left = "0";

      // Clear any existing children (e.g., old canvas)
      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(gl.canvas); // Append canvas to the ref container

      // Vertex Shader: simple pass-through for a full-screen triangle
      const vert = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = position * 0.5 + 0.5; // Convert position from [-1,1] to [0,1]
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Fragment Shader: Renders the light rays effect
      const frag = `
        precision highp float;

        uniform float iTime;
        uniform vec2  iResolution; // Canvas resolution
        uniform vec2  rayPos;      // Origin of the rays
        uniform vec2  rayDir;      // Direction of the main ray
        uniform vec3  raysColor;   // Color of the rays
        uniform float raysSpeed;
        uniform float lightSpread; // How wide the rays spread
        uniform float rayLength;   // How long the rays extend
        uniform float pulsating;   // 0 or 1 for pulsating effect
        uniform float fadeDistance; // Distance over which rays fade out
        uniform float saturation;  // Color saturation
        uniform vec2  mousePos;    // Normalized mouse position (0-1)
        uniform float mouseInfluence; // How much mouse affects ray direction
        uniform float noiseAmount; // Amount of noise
        uniform float distortion;  // Distortion amount

        varying vec2 vUv; // UV coordinates from vertex shader

        // Perlin-like noise function
        float noise(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        // Calculates the strength of a ray at a given coordinate
        float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                          float seedA, float seedB, float speed) {
          vec2 sourceToCoord = coord - raySource;
          vec2 dirNorm = normalize(sourceToCoord); // Direction from source to current pixel
          float cosAngle = dot(dirNorm, rayRefDirection); // Cosine of angle between ray and pixel direction

          // Apply distortion based on time and distance
          float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;

          // Spread factor based on angle
          float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

          // Falloff based on distance from source
          float distance = length(sourceToCoord);
          float maxDistance = iResolution.x * rayLength;
          float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

          // Additional fade based on fadeDistance
          float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);

          // Pulsating effect
          float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

          // Base strength with sine waves for ray patterns
          float baseStrength = clamp(
            (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
            (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
            0.0, 1.0
          );

          return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
        }

        // Main image function (like shadertoy)
        void mainImage(out vec4 fragColor, in vec2 fragCoord) {
          // Convert fragCoord to origin bottom-left
          vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);

          vec2 finalRayDir = rayDir;
          // Apply mouse influence if enabled
          if (mouseInfluence > 0.0) {
            vec2 mouseScreenPos = mousePos * iResolution.xy;
            vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
            finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
          }

          // Combine multiple ray patterns for richer effect
          vec4 rays1 = vec4(1.0) *
                       rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                                   1.5 * raysSpeed);
          vec4 rays2 = vec4(1.0) *
                       rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                                   1.1 * raysSpeed);
          fragColor = rays1 * 0.5 + rays2 * 0.4; // Blend rays

          // Add noise if enabled
          if (noiseAmount > 0.0) {
            float n = noise(coord * 0.01 + iTime * 0.1);
            fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
          }

          // Apply a subtle vertical gradient for depth (adjust as needed)
          float brightness = 1.0 - (coord.y / iResolution.y);
          fragColor.x *= 0.1 + brightness * 0.8;
          fragColor.y *= 0.3 + brightness * 0.6;
          fragColor.z *= 0.5 + brightness * 0.5;

          // Apply saturation
          if (saturation != 1.0) {
            float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
            fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
          }

          // Apply final ray color
          fragColor.rgb *= raysColor;
        }

        void main() {
          vec4 color;
          mainImage(color, gl_FragCoord.xy); // Call mainImage with current pixel
          gl_FragColor  = color;
        }
      `;

      // Define uniforms (variables passed from JS to shader)
      const uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },
        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },
        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: raysSpeed },
        lightSpread: { value: lightSpread },
        rayLength: { value: rayLength },
        pulsating: { value: pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: mouseInfluence },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion },
      };
      uniformsRef.current = uniforms;

      // Create a full-screen triangle geometry
      const geometry = new Triangle(gl);
      // Create a program (shader pair)
      const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms,
      });
      // Create a mesh (geometry + program)
      const mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;

      // Function to update canvas size and ray origin/direction on resize
      const updatePlacement = () => {
        if (!containerRef.current || !renderer) return;
        renderer.dpr = Math.min(window.devicePixelRatio, 2);
        const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
        renderer.setSize(wCSS, hCSS); // Set renderer size based on container
        const dpr = renderer.dpr;
        const w = wCSS * dpr;
        const h = hCSS * dpr;
        uniforms.iResolution.value = [w, h]; // Update resolution uniform
        const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h); // Get ray origin/direction
        uniforms.rayPos.value = anchor;
        uniforms.rayDir.value = dir;
      };

      // Animation loop
      const loop = (t) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
          return;
        }
        uniforms.iTime.value = t * 0.001; // Update time uniform

        // Mouse follow logic
        if (followMouse && mouseInfluence > 0.0) {
          const smoothing = 0.92; // Smoothing factor for mouse movement
          smoothMouseRef.current.x =
            smoothMouseRef.current.x * smoothing +
            mouseRef.current.x * (1 - smoothing);
          smoothMouseRef.current.y =
            smoothMouseRef.current.y * smoothing +
            mouseRef.current.y * (1 - smoothing);
          uniforms.mousePos.value = [
            smoothMouseRef.current.x,
            smoothMouseRef.current.y,
          ];
        }

        try {
          renderer.render({ scene: mesh }); // Render the scene
          animationIdRef.current = requestAnimationFrame(loop); // Request next frame
        } catch (error) {
          console.warn("WebGL rendering error:", error);
          // If a WebGL error occurs, stop the loop to prevent continuous errors
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
          }
          return;
        }
      };

      // Event listeners and initial setup
      window.addEventListener("resize", updatePlacement);
      updatePlacement(); // Initial placement calculation
      animationIdRef.current = requestAnimationFrame(loop); // Start the animation loop

      // Cleanup function for this useEffect
      cleanupFunctionRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }
        window.removeEventListener("resize", updatePlacement);
        if (renderer) {
          try {
            const canvas = renderer.gl.canvas;
            // Attempt to lose WebGL context to free resources
            const loseContextExt =
              renderer.gl.getExtension("WEBGL_lose_context");
            if (loseContextExt) {
              loseContextExt.loseContext();
            }
            // Remove canvas from DOM
            if (canvas && canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
          } catch (error) {
            console.warn("Error during WebGL cleanup:", error);
          }
        }
        // Clear refs
        rendererRef.current = null;
        uniformsRef.current = null;
        meshRef.current = null;
      };
    };

    initializeWebGL();

    // Return cleanup function for useEffect
    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current = null;
      }
    };
  }, [
    isVisible, // Re-initialize if component visibility changes
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
  ]);

  // Update uniforms when props change (without re-initializing WebGL)
  useEffect(() => {
    if (!uniformsRef.current || !containerRef.current || !rendererRef.current)
      return;
    const u = uniformsRef.current;
    const renderer = rendererRef.current; // Get current renderer for dpr

    u.raysColor.value = hexToRgb(raysColor);
    u.raysSpeed.value = raysSpeed;
    u.lightSpread.value = lightSpread;
    u.rayLength.value = rayLength;
    u.pulsating.value = pulsating ? 1.0 : 0.0;
    u.fadeDistance.value = fadeDistance;
    u.saturation.value = saturation;
    u.mouseInfluence.value = mouseInfluence;
    u.noiseAmount.value = noiseAmount;
    u.distortion.value = distortion;

    // Recalculate anchor and direction if origin changes
    const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
    const dpr = renderer.dpr;
    const { anchor, dir } = getAnchorAndDir(raysOrigin, wCSS * dpr, hCSS * dpr);
    u.rayPos.value = anchor;
    u.rayDir.value = dir;
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    raysOrigin,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    mouseInfluence,
    noiseAmount,
    distortion,
  ]);

  // Mouse move event listener
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current || !rendererRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate normalized mouse position relative to the container
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    if (followMouse) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [followMouse]);

  return (
    <div
      ref={containerRef}
      className={`light-rays-container ${className}`.trim()}
    />
  );
};

export default LightRays;
