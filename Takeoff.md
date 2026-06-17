Render Static Site: React + Vite + TypeScript + React Three Fiber + Drei.
Render Web Service: Spring Boot + Hibernate/JPA + SQLite/SQLiteAI-backed persistence.
One repo, two Render services: /frontend and /backend.

Render supports static sites with CDN/TLS/auto-deploys, and web services from a Git repo or Docker image, so this fits the “two apps on Render” plan cleanly. SQLiteAI presents SQLite-native cloud/sync/extension infrastructure, but I would still keep a fallback local SQLite file profile in case JDBC/remote setup takes longer than expected.

The goal should be:

A static frontend that looks like a 3D XR product demo, backed by a live Spring Boot microservice with Hibernate entities and database-backed CV content.

The key interview message becomes:

“This is not a static portfolio. The 3D frontend is deployed separately from a Spring Boot service. The frontend consumes live REST endpoints. The backend uses Hibernate entities and a SQLite-backed database. The CV content, skills, project cards, videos, and system status are served by the microservice.”

That removes the “frontend-only gimmick” risk.

Build concept: Orbital CV Console

The page does not vertically scroll in the normal way. The scroll position drives a 3D camera through stations in a scene.

Sections:

Docking Bay / Hero
Camera starts far away, flies into a glowing orbital console. Text: “XR / Omniverse / Full Stack Systems Engineer.” Particles everywhere. One button: “Check Live Backend.”
Skill Constellation
Floating nodes: Omniverse, XR, React, Spring Boot, REST APIs, Hibernate, IoT, Drivers, CI/CD, CES/GDC, VR Porting. Nodes are simple spheres/rings/planes, no models needed. Clicking a node opens an HTML card.
Project Hangar
Horizontal floating project cards. Each card can include an embedded video thumbnail/player. The data comes from /api/projects.

Microservice Core
A visible “backend reactor” panel showing live API calls:
GET /api/health
GET /api/system
GET /api/projects
GET /api/skills
GET /api/timeline

Show:
“Spring Boot service: online”
“Hibernate entities: loaded”
“SQLite database: connected”
“Records served: 24”
“Frontend origin: Render Static Site”
“Backend origin: Render Web Service”

Timeline Elevator
Camera moves upward through career milestones. Each milestone is fetched from /api/timeline.
Interview Mode / Recruiter Mode
A toggle that disables camera theatrics and shows a clean 2D CV. This is important. It proves taste and restraint.

For visuals without models, use only primitives:

Floating glass panels.
Instanced particles.
Rings / torus geometry.
Lines between skill nodes.
Plane cards with video thumbnails.
Glow/bloom.
Animated shader-like gradients via CSS or simple materials.
Stars using Drei <Stars /> or custom points.
HTML overlays using Drei <Html />.

This is enough for wow. No Blender, no GLTF, no asset hunt.

Use this visual stack:

@react-three/fiber
@react-three/drei
@react-three/postprocessing
framer-motion
tailwindcss
lucide-react

For camera-scroll, use a normalized scroll value:

const stations = [
  { position: [0, 0, 12], lookAt: [0, 0, 0] },
  { position: [0, -8, 10], lookAt: [0, -8, 0] },
  { position: [8, -16, 10], lookAt: [0, -16, 0] },
  { position: [-8, -24, 10], lookAt: [0, -24, 0] },
  { position: [0, -32, 12], lookAt: [0, -32, 0] }
];

The actual page can be a tall invisible scroll container, but visually the content is fixed/canvas-based. Scroll changes camera position instead of moving a normal document. That is the killer feature.

For the backend, keep it clean and obvious.

Entities:

ProjectEntity
SkillEntity
TimelineEventEntity
VideoEntity
SystemMetricEntity or calculated DTO

Endpoints:

GET /api/health
GET /api/system
GET /api/projects
GET /api/skills
GET /api/timeline
GET /api/videos
POST /api/contact-intent

The “microservice proof” endpoint should be intentionally visual:

{
  "service": "orbital-cv-backend",
  "runtime": "Spring Boot",
  "orm": "Hibernate",
  "database": "SQLite / SQLiteAI",
  "status": "online",
  "projectCount": 8,
  "skillCount": 32,
  "timelineEvents": 10,
  "startedAt": "2026-06-17T..."
}

Put this JSON into the frontend as a live animated “reactor diagnostics” panel. That will make the backend impossible to miss.

Database seed data should load on startup with CommandLineRunner. That gives you Hibernate-backed content without needing an admin UI.

Backend package shape:

backend/src/main/java/com/mike/orbitcv/
  OrbitCvApplication.java
  controller/
    ProjectController.java
    SkillController.java
    TimelineController.java
    SystemController.java
    ContactController.java
  dto/
  entity/
  repository/
  service/
  config/
    DataSeeder.java
    CorsConfig.java

Frontend package shape:

frontend/src/
  api/
    client.ts
    hooks.ts
  components/
    Hud.tsx
    RecruiterMode.tsx
    BackendStatusPanel.tsx
    VideoProjectCard.tsx
  scene/
    OrbitalScene.tsx
    CameraRig.tsx
    Particles.tsx
    SkillConstellation.tsx
    ProjectHangar.tsx
    TimelineElevator.tsx
  data/
  App.tsx

Render setup:

Frontend Render Static Site:

Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
Environment:
  VITE_API_BASE_URL=https://your-backend.onrender.com

Backend Render Web Service:

Root Directory: backend
Build Command: ./mvnw clean package -DskipTests
Start Command: java -jar target/*.jar
Environment:
  FRONTEND_ORIGIN=https://your-frontend.onrender.com
  SPRING_PROFILES_ACTIVE=prod

For SQLite on Render, be careful: free/ephemeral filesystems can reset. For this demo, that is acceptable if seed data repopulates on boot. If SQLiteAI remote connection is ready, use it. If not, use local SQLite with seeding and say: “SQLite-backed demo database, seeded through Hibernate on service startup.” That is still enough for the interview.

The best 5-hour priority order:

Hour 1: create repo, frontend shell, backend shell, hardcoded API endpoints.
Hour 2: build R3F scene with scroll-driven camera, particles, sections.
Hour 3: Spring Boot entities, repositories, seed data, REST endpoints, CORS.
Hour 4: connect frontend to backend, video embeds, backend diagnostics panel.
Hour 5: Render deploy, README, polish, recruiter mode, mobile fallback.

The absolute must-have demo flow:

Open site.
Scroll. Camera moves through 3D stations.
Particles and glowing cards create wow.
Click “Backend Diagnostics.”
It fetches live Spring Boot status.
Open project cards. They come from /api/projects.
Open videos.
Toggle Recruiter Mode.
Show GitHub README with architecture diagram.