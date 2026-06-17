package com.mike.orbitcv.config;

import com.mike.orbitcv.entity.*;
import com.mike.orbitcv.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final ProjectRepository projectRepo;
    private final SkillRepository skillRepo;
    private final TimelineEventRepository timelineRepo;
    private final VideoRepository videoRepo;

    public DataSeeder(ProjectRepository p, SkillRepository s,
                      TimelineEventRepository t, VideoRepository v) {
        this.projectRepo = p;
        this.skillRepo = s;
        this.timelineRepo = t;
        this.videoRepo = v;
    }

    @Override
    public void run(String... args) {
        log.info("DataSeeder starting");
        seedSkills();
        seedProjects();
        seedTimeline();
        seedVideos();
        log.info("DataSeeder complete");
    }

    private void seedSkills() {
        long existing = skillRepo.count();
        if (existing > 0) {
            log.info("Skipping skill seed: {} rows already exist", existing);
            return;
        }
        List<SkillEntity> skills = List.of(
            skill("NVIDIA Omniverse / USD", "3D / XR", 92, "#76b900"),
            skill("XR Development", "3D / XR", 90, "#7c3aed"),
            skill("WebXR / WebGL", "3D / XR", 82, "#6366f1"),
            skill("React Three Fiber", "3D / XR", 85, "#38bdf8"),
            skill("Three.js", "3D / XR", 80, "#60a5fa"),
            skill("React", "Frontend", 88, "#61dafb"),
            skill("TypeScript", "Frontend", 85, "#3178c6"),
            skill("Tailwind CSS", "Frontend", 82, "#06b6d4"),
            skill("Framer Motion", "Frontend", 75, "#ff4d4d"),
            skill("Spring Boot", "Backend", 83, "#6db33f"),
            skill("Hibernate / JPA", "Backend", 78, "#59666c"),
            skill("REST API Design", "Backend", 88, "#f59e0b"),
            skill("Java", "Backend", 85, "#f89820"),
            skill("Python", "Backend", 72, "#3572A5"),
            skill("SQLite / PostgreSQL", "Backend", 76, "#336791"),
            skill("IoT / Embedded Systems", "Systems", 74, "#e11d48"),
            skill("GPU / CUDA", "Systems", 65, "#76b900"),
            skill("C++", "Systems", 68, "#00599c"),
            skill("Docker", "DevOps", 76, "#2496ed"),
            skill("CI/CD (GitHub Actions)", "DevOps", 78, "#24292f"),
            skill("Linux", "DevOps", 80, "#fcc624"),
            skill("VR Porting", "3D / XR", 78, "#a855f7")
        );
        skillRepo.saveAll(skills);
        log.info("Seeded {} skills", skills.size());
    }

    private void seedProjects() {
        long existing = projectRepo.count();
        if (existing > 0) {
            log.info("Skipping project seed: {} rows already exist", existing);
            return;
        }
        List<ProjectEntity> projects = List.of(
            project("Orbital CV Console", "This interactive 3D CV — a scroll-driven R3F scene backed by a live Spring Boot microservice. Demonstrates full-stack architecture, Hibernate persistence, REST APIs, and WebGL visuals deployed on Render.",
                    "React,Three.js,Spring Boot,Hibernate,SQLite,Tailwind,Render", null, null, "https://github.com/mikle-higaran/orbital-cv", true, 1),
            project("XR Product Configurator", "Real-time 3D product configurator built with WebXR and Three.js. Users configure materials, colours, and variants; changes are streamed via WebSocket and persisted in Spring Boot backend.",
                    "WebXR,Three.js,Spring Boot,WebSocket,Java,React", "https://www.youtube.com/embed/dQw4w9WgXcQ", null, null, false, 2),
            project("Omniverse Simulation Pipeline", "USD-based simulation pipeline in NVIDIA Omniverse. Python-driven stage composition, physics validation, and automated render farm submission via REST.",
                    "NVIDIA Omniverse,USD,Python,REST,Linux,CUDA", "https://www.youtube.com/embed/dQw4w9WgXcQ", null, null, true, 3),
            project("IoT Fleet Dashboard", "React + Spring Boot dashboard for a fleet of 300+ IoT devices. Real-time telemetry via MQTT, stored in time-series SQLite, visualised with recharts.",
                    "React,Spring Boot,MQTT,SQLite,Java,TypeScript", null, null, null, false, 4),
            project("VR Training Platform", "Multi-user VR training simulation for industrial safety. Built on WebXR, networked with WebRTC, and deployed to Meta Quest via PWA.",
                    "WebXR,WebRTC,Three.js,React,Node.js", "https://www.youtube.com/embed/dQw4w9WgXcQ", null, null, true, 5),
            project("OpenUSD Asset Manager", "Web UI for managing USD asset libraries. Hierarchical scene graph browser, variant switching, and Hydra render preview embedded via iframe.",
                    "React,FastAPI,Python,USD,Docker", null, null, "https://github.com/mikle-higaran/usd-manager", false, 6)
        );
        projectRepo.saveAll(projects);
        log.info("Seeded {} projects", projects.size());
    }

    private void seedTimeline() {
        long existing = timelineRepo.count();
        if (existing > 0) {
            log.info("Skipping timeline seed: {} rows already exist", existing);
            return;
        }
        List<TimelineEventEntity> events = List.of(
            event(2019, "BSc Computer Science", "University", "Graduated with first-class honours. Thesis: GPU-accelerated physics simulation for real-time XR.", "ACHIEVEMENT", 1),
            event(2020, "Embedded Systems Intern", "Bosch", "Driver development for CAN-bus IoT sensors on Linux. Wrote kernel modules and cross-compiled toolchains.", "JOB", 2),
            event(2021, "Full-Stack Developer", "StartupXYZ", "Built React + Spring Boot SaaS from zero to 2 k daily users. Led REST API design and Hibernate migration.", "JOB", 3),
            event(2022, "XR Engineer", "Immersive Labs", "Shipped WebXR training platform used across 15 enterprise clients. Ported three Unity VR titles to WebXR.", "JOB", 4),
            event(2023, "Presented at CES Las Vegas", "CES 2023", "Demonstrated real-time AR product configurator to 500+ attendees. Covered by two tech publications.", "ACHIEVEMENT", 5),
            event(2023, "Omniverse Engineer", "NVIDIA Partner Studio", "Built USD simulation pipeline in NVIDIA Omniverse reducing render prep time by 60%.", "JOB", 6),
            event(2024, "Senior XR / Full-Stack Engineer", "TechCorp", "Led team of 4. Delivered multi-user VR platform (Quest + WebXR). Architecture: Spring Boot microservices + React frontend.", "JOB", 7),
            event(2025, "Contract — XR & Systems", "Independent", "Consulting for XR studios and enterprise IoT clients. Delivered 3 production systems.", "JOB", 8),
            event(2026, "Open to Opportunities", "", "Seeking a senior role in XR, Omniverse, or full-stack engineering where both 3D and backend depth matter.", "ACHIEVEMENT", 9)
        );
        timelineRepo.saveAll(events);
        log.info("Seeded {} timeline events", events.size());
    }

    private void seedVideos() {
        long existing = videoRepo.count();
        if (existing > 0) {
            log.info("Skipping video seed: {} rows already exist", existing);
            return;
        }
        List<VideoEntity> videos = List.of(
            video("XR Product Configurator Demo", "Live demo: WebXR real-time material configurator with Spring Boot persistence.", "https://www.youtube.com/embed/dQw4w9WgXcQ", null, 2L),
            video("Omniverse Pipeline Walkthrough", "Python-driven USD stage composition and automated render farm submission.", "https://www.youtube.com/embed/dQw4w9WgXcQ", null, 3L),
            video("VR Training Platform", "Multi-user WebXR safety training — Meta Quest + browser.", "https://www.youtube.com/embed/dQw4w9WgXcQ", null, 5L)
        );
        videoRepo.saveAll(videos);
        log.info("Seeded {} videos", videos.size());
    }

    private SkillEntity skill(String name, String cat, int prof, String color) {
        SkillEntity s = new SkillEntity();
        s.setName(name);
        s.setCategory(cat);
        s.setProficiency(prof);
        s.setColor(color);
        return s;
    }

    private ProjectEntity project(String title, String desc, String tech,
                                  String videoUrl, String thumb, String github,
                                  boolean featured, int order) {
        ProjectEntity p = new ProjectEntity();
        p.setTitle(title);
        p.setDescription(desc);
        p.setTechStack(tech);
        p.setVideoUrl(videoUrl);
        p.setThumbnailUrl(thumb);
        p.setGithubUrl(github);
        p.setFeatured(featured);
        p.setDisplayOrder(order);
        return p;
    }

    private TimelineEventEntity event(int year, String title, String company,
                                      String desc, String type, int order) {
        TimelineEventEntity e = new TimelineEventEntity();
        e.setYear(year);
        e.setTitle(title);
        e.setCompany(company);
        e.setDescription(desc);
        e.setType(type);
        e.setDisplayOrder(order);
        return e;
    }

    private VideoEntity video(String title, String desc, String embed,
                              String thumb, Long projectId) {
        VideoEntity v = new VideoEntity();
        v.setTitle(title);
        v.setDescription(desc);
        v.setEmbedUrl(embed);
        v.setThumbnailUrl(thumb);
        v.setProjectId(projectId);
        return v;
    }
}
