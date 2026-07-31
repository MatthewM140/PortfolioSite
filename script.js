const projects = [
  {
    title: "Custom Digital Dashboard",
    trackId: "formula_sae_daq",
    category: "electrical",
    label: "Electrical / Programming",
    images: ["assets/dashboard.png"],
    summary:
      "Formula SAE digital dash with a TFT display, RGB status LEDs, CAN data, and a configurable driver interface.",
    description:
      "Formula SAE digital dashboard with a 5-inch TFT display, 32 RGB LEDs for status indication and RPM display, and a configurable interface driven by live CAN data. The goal is to create a driver-facing system that can surface the important vehicle states quickly while remaining flexible enough to change as the car evolves.",
    tags: ["CAN", "TFT display", "RGB indicators", "Formula SAE"],
  },
  {
    title: "Outboard Wheel Sensor Board",
    trackId: "outboard_wheel_sensor_board",
    category: "electrical",
    label: "Electrical",
    images: [
      "assets/wheel-board.png",
      "assets/dashboard-screen.png",
      "assets/wheel-board-render.png",
      "assets/wheel-board-top.png",
    ],
    summary:
      "Wheel-mounted Formula SAE sensor board for brake temperature, tire heat mapping, and wheel speed.",
    description:
      "Wheel-mounted sensor board for a Formula SAE car, capturing per-corner brake temperature, tire thermal distribution, and wheel speed. It combines a standard temperature sensor with an infrared thermal camera for detailed heat mapping, while wheel speed is measured with a reluctor. Data is sent over CAN to the vehicle's central logger, with both vehicle and auxiliary CAN networks using software-configurable termination. The board is designed around an ESP32-S3.",
    tags: ["PCB design", "ESP32-S3", "Dual CAN", "Sensors"],
  },
  {
    title: "BSPD Safety Circuit",
    trackId: "bspd_safety_circuit",
    category: "electrical",
    label: "Electrical",
    images: ["assets/bspd.png"],
    summary:
      "Hardware safety circuit for independent brake and throttle plausibility monitoring.",
    description:
      "Formula SAE-compliant Brake System Plausibility Device designed to independently monitor throttle and brake signals. The design uses hardware-based logic for rapid fault detection and safe system shutdown, making it independent from normal software control paths.",
    tags: ["Safety circuit", "Analog logic", "FSAE", "PCB layout"],
  },
  {
    title: "Radio Telemetry",
    trackId: "radio_telemetry",
    category: "electrical",
    label: "Electrical",
    images: ["assets/telemetry.png"],
    summary:
      "Quad-channel LoRa telemetry system for long-range real-time vehicle and sensor data.",
    description:
      "Quad-channel LoRa-based telemetry system for long-range, real-time transmission of vehicle and sensor data in demanding motorsports environments. The project focuses on robust data movement from the car to the team, where reliability and range matter more than flashy interface work.",
    tags: ["LoRa", "Telemetry", "Vehicle data", "RF"],
  },
  {
    title: "Datasheet Desk",
    trackId: "datasheet_desk",
    category: "programming",
    label: "Programming / Electrical",
    images: ["assets/datasheet-desk-icon.png", "assets/datasheet-desk-app.png"],
    summary:
      "A focused desktop PDF workspace for reading component datasheets and capturing engineering context.",
    description:
      "Datasheet Desk is a desktop engineering tool built around the way component research actually happens: searching electrical characteristics, jumping between pinouts and application circuits, comparing parts, and saving design notes exactly where they matter. It includes tabbed PDF reading, page-linked bookmarks and notes, local datasheet discovery, part-source lookup shortcuts, custom themes, and precise selectable highlighting in a clean power-user interface.",
    tags: ["Python", "PySide6", "Qt PDF", "Desktop UI", "Engineering tools"],
    downloadable: true,
  },
  {
    title: "IMU Sensor Board",
    trackId: "imu_sensor_board",
    category: "electrical",
    label: "Electrical",
    images: ["assets/imu.png"],
    summary:
      "Inertial measurement board for vehicle motion and orientation tracking.",
    description:
      "High-precision inertial measurement unit board for motion and orientation tracking. It integrates accelerometer and gyroscope sensors with onboard filtering for accurate real-time data acquisition and gives the vehicle a cleaner picture of dynamic motion.",
    tags: ["IMU", "Sensor fusion", "Filtering", "Data acquisition"],
  },
  {
    title: "SDM25 Visualization",
    trackId: "sdm25_visualization",
    category: "visualization",
    label: "3D Visualization",
    images: ["assets/sdm25-render.png"],
    summary:
      "Photorealistic render work for Sun Devil Motorsports' 2025 Formula SAE car.",
    description:
      "Photorealistic 3D visualization of Sun Devil Motorsports' 2025 Formula SAE ICE car. This work is about making engineering design legible: surfacing proportion, materials, reflections, and details in a way that helps the vehicle feel tangible before it is in front of you.",
    tags: ["Blender", "Rendering", "Motorsports", "Visualization"],
  },
  {
    title: "Texture Development",
    trackId: "texture_development",
    category: "visualization",
    label: "3D Visualization",
    images: ["assets/texturing.png", "assets/oz-tire-render.png", "assets/shock-render.png"],
    summary:
      "Material, tire, suspension, and surface-detail work for realistic engineering renders.",
    description:
      "Custom material and texture work using UV workflows and Substance Painter to produce believable detail for engineering renders. This includes tire sidewall lettering, rubber roughness, brushed and worn metal, anodized suspension parts, decals, scratches, and surface variation. The focus is on making engineering objects read correctly under light, with enough wear, finish, and roughness variation to avoid the flat look of untouched CAD.",
    tags: ["Substance Painter", "UVs", "Tire texturing", "Materials", "Rendering"],
  },
];

const grid = document.querySelector("[data-project-grid]");
const filters = document.querySelectorAll("[data-filter]");
const dialog = document.querySelector("[data-dialog]");
const dialogImage = document.querySelector("[data-dialog-image]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const dialogCategory = document.querySelector("[data-dialog-category]");
const dialogDescription = document.querySelector("[data-dialog-description]");
const dialogTags = document.querySelector("[data-dialog-tags]");
const dialogActions = document.querySelector("[data-dialog-actions]");
const downloadButton = document.querySelector("[data-download-open]");
const downloadDialog = document.querySelector("[data-download-dialog]");
const downloadClose = document.querySelector("[data-download-close]");
const galleryCount = document.querySelector("[data-gallery-count]");
const galleryPrevious = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
const closeButton = document.querySelector("[data-close]");
const header = document.querySelector("[data-header]");
const lightField = document.querySelector("[data-light-field]");
let activeProject = null;
let activeImageIndex = 0;

function tagMarkup(tags) {
  return tags.map((tag) => `<span>${tag}</span>`).join("");
}

function renderProjects(filter = "all") {
  const visibleProjects =
    filter === "all" ? projects : projects.filter((project) => project.category === filter);

  grid.innerHTML = visibleProjects
    .map(
      (project, index) => `
        <button class="project-card" type="button" data-project-index="${projects.indexOf(project)}" data-track-card="${project.trackId}">
          <img src="${project.images[0]}" alt="${project.title}" loading="${index < 3 ? "eager" : "lazy"}" />
          <span class="project-card-content">
            <span class="project-meta">${project.label}</span>
            <h3>${project.title}</h3>
            <p>${project.summary}</p>
            ${
              project.downloadable
                ? '<span class="card-download button primary" data-card-download data-track-button="datasheet_desk_download_options">Download Now</span>'
                : `<span class="tag-list">${tagMarkup(project.tags)}</span>`
            }
          </span>
        </button>
      `
    )
    .join("");
}

function openProject(project) {
  activeProject = project;
  activeImageIndex = 0;
  dialogTitle.textContent = project.title;
  dialogCategory.textContent = project.label;
  dialogDescription.textContent = project.description;
  dialogTags.innerHTML = tagMarkup(project.tags);
  dialogActions.hidden = !project.downloadable;
  updateGallery();
  dialog.showModal();
}

function updateGallery() {
  const images = activeProject.images;
  dialogImage.src = images[activeImageIndex];
  dialogImage.alt = `${activeProject.title} image ${activeImageIndex + 1}`;
  galleryCount.textContent = `${activeImageIndex + 1} / ${images.length}`;
  const hasGallery = images.length > 1;
  galleryPrevious.hidden = !hasGallery;
  galleryNext.hidden = !hasGallery;
  galleryCount.hidden = !hasGallery;
}

function moveGallery(direction) {
  const images = activeProject.images;
  activeImageIndex = (activeImageIndex + direction + images.length) % images.length;
  updateGallery();
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderProjects(button.dataset.filter);
  });
});

grid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-project-index]");
  if (!card) return;
  const project = projects[Number(card.dataset.projectIndex)];
  if (event.target.closest("[data-card-download]")) {
    activeProject = project;
    downloadDialog.showModal();
    return;
  }
  openProject(project);
});

closeButton.addEventListener("click", () => {
  downloadDialog.close();
  dialog.close();
});
galleryPrevious.addEventListener("click", () => moveGallery(-1));
galleryNext.addEventListener("click", () => moveGallery(1));
downloadButton.addEventListener("click", () => downloadDialog.showModal());
downloadClose.addEventListener("click", () => downloadDialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

downloadDialog.addEventListener("click", (event) => {
  if (event.target === downloadDialog) downloadDialog.close();
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
});

function initLightField() {
  if (!lightField || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const context = lightField.getContext("2d");
  const colors = [
    [40, 244, 255],
    [255, 53, 207],
    [255, 228, 92],
    [72, 255, 164],
  ];
  const pools = colors.map((color, index) => ({
    color,
    x: 0,
    y: 0,
    radius: 0,
    vx: (index % 2 === 0 ? 1 : -1) * (0.16 + index * 0.025),
    vy: (index % 2 === 0 ? -1 : 1) * (0.12 + index * 0.02),
    phase: index * 1.7,
  }));

  function resize() {
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    lightField.width = Math.floor(window.innerWidth * scale);
    lightField.height = Math.floor(window.innerHeight * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);

    const width = window.innerWidth;
    const height = window.innerHeight;
    pools.forEach((pool, index) => {
      pool.radius = Math.max(width, height) * (0.24 + index * 0.035);
      pool.x = width * (0.18 + index * 0.2);
      pool.y = height * (0.2 + (index % 3) * 0.22);
    });
  }

  function collidePools() {
    for (let i = 0; i < pools.length; i += 1) {
      for (let j = i + 1; j < pools.length; j += 1) {
        const a = pools[i];
        const b = pools[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        const overlapDistance = (a.radius + b.radius) * 0.28;
        if (distance > 0 && distance < overlapDistance) {
          const push = (overlapDistance - distance) / overlapDistance;
          const nx = dx / distance;
          const ny = dy / distance;
          a.vx -= nx * push * 0.012;
          a.vy -= ny * push * 0.012;
          b.vx += nx * push * 0.012;
          b.vy += ny * push * 0.012;
        }
      }
    }
  }

  function drawPool(pool, time) {
    const pulse = Math.sin(time * 0.00045 + pool.phase) * 0.08 + 1;
    const radius = pool.radius * pulse;
    const gradient = context.createRadialGradient(pool.x, pool.y, 0, pool.x, pool.y, radius);
    const [red, green, blue] = pool.color;
    gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, 0.22)`);
    gradient.addColorStop(0.38, `rgba(${red}, ${green}, ${blue}, 0.12)`);
    gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, 0)`);
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(pool.x, pool.y, radius, 0, Math.PI * 2);
    context.fill();
  }

  function render(time) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    pools.forEach((pool) => {
      pool.x += pool.vx;
      pool.y += pool.vy;

      if (pool.x < -pool.radius * 0.15 || pool.x > width + pool.radius * 0.15) pool.vx *= -1;
      if (pool.y < -pool.radius * 0.15 || pool.y > height + pool.radius * 0.15) pool.vy *= -1;

      drawPool(pool, time);
    });

    collidePools();
    context.globalCompositeOperation = "source-over";
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(render);
}

renderProjects();
initLightField();
