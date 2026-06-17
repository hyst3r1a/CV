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
            skill("NVIDIA Omniverse / USD", "Omniverse / 3D", 92, "#76b900"),
            skill("Remote Rendering / WebRTC", "Omniverse / 3D", 86, "#22c55e"),
            skill("Unity XR / Real-Time 3D", "Omniverse / 3D", 95, "#7c3aed"),
            skill("Unreal Engine / Audio2Face R&D", "Omniverse / 3D", 70, "#a855f7"),
            skill("Large Model / BIM Visualization", "Omniverse / 3D", 88, "#38bdf8"),
            skill("Rendering Optimization", "Omniverse / 3D", 90, "#60a5fa"),
            skill("HDRP / URP", "Omniverse / 3D", 88, "#3b82f6"),
            skill("Apple Vision Pro / visionOS", "XR Platforms", 86, "#f8fafc"),
            skill("Meta Quest 2/3/Pro", "XR Platforms", 92, "#06b6d4"),
            skill("OpenXR / Meta XR SDK", "XR Platforms", 88, "#14b8a6"),
            skill("AR Foundation / iOS / Android AR", "XR Platforms", 84, "#f97316"),
            skill("WebXR / WebGL", "XR Platforms", 82, "#6366f1"),
            skill("React", "Frontend", 88, "#61dafb"),
            skill("TypeScript / JavaScript", "Frontend", 86, "#3178c6"),
            skill("Three.js / Babylon.js", "Frontend", 82, "#60a5fa"),
            skill("React Three Fiber", "Frontend", 82, "#38bdf8"),
            skill("Frontend Product UI", "Frontend", 84, "#06b6d4"),
            skill("Spring Boot", "Backend", 74, "#6db33f"),
            skill("Hibernate / JPA", "Backend", 72, "#59666c"),
            skill("REST API Design", "Backend", 86, "#f59e0b"),
            skill("Node.js Services", "Backend", 80, "#339933"),
            skill(".NET / C# Backend", "Backend", 82, "#512bd4"),
            skill("Python Services", "Backend", 80, "#3572A5"),
            skill("SQLite / SQL", "Backend", 76, "#336791"),
            skill("Docker", "DevOps / Systems", 78, "#2496ed"),
            skill("AWS Pipelines", "DevOps / Systems", 78, "#ff9900"),
            skill("CI/CD / GitHub Actions", "DevOps / Systems", 82, "#24292f"),
            skill("Unity Editor Tooling", "DevOps / Systems", 90, "#111827"),
            skill("Asset Preprocessing Pipelines", "DevOps / Systems", 86, "#f43f5e"),
            skill("IoT / Device Integration", "DevOps / Systems", 76, "#e11d48"),
            skill("Kotlin / Mobile SDK Integration", "DevOps / Systems", 70, "#a855f7"),
            skill("Git / Jira / Enterprise Delivery", "DevOps / Systems", 86, "#64748b")
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
            project(
                "Orbital CV Console",
                "This website: a scroll-driven React Three Fiber CV backed by a separate Spring Boot microservice. It proves the interview stack directly: deployed frontend, deployed REST API, Hibernate entities, SQLite-backed seed data, live diagnostics, particles, video cards, and recruiter-mode fallback.",
                "React,Vite,TypeScript,React Three Fiber,Three.js,Spring Boot,Hibernate,JPA,SQLite,REST,Render",
                null,
                null,
                "https://github.com/mikle-higaran/orbital-cv",
                true,
                1
            ),
            project(
                "Procore BIM Viewer",
                "Enterprise BIM viewer work for construction model visualization. Contributed frontend functionality, model interaction workflows, mobile-facing features, rendering improvements, optimization, and practical field-oriented viewer behavior for complex building data.",
                "React,TypeScript,BIM Visualization,Large Model Rendering,Mobile Web,Rendering Optimization,Git,Jira",
                null,
                null,
                null,
                true,
                2
            ),
            project(
                "Procore R&D BIM / VisionOS / On-Site Safety",
                "R&D prototypes combining BIM visualization, Apple Vision Pro, iOS/Android devices, QR-based access, and interactive on-site safety workflows. Helped deliver a portable Groundbreak proof of concept around certification checks, surveillance, and trauma-prevention scenarios.",
                "Unity,visionOS,Apple Vision Pro,iOS,Android,HDRP,OpenXR,Meta XR SDK,Jobs,Burst",
                null,
                null,
                null,
                true,
                3
            ),
            project(
                "Shop Ads Efficiency Simulation Digital Twin",
                "Solo/core implementation of a retail digital twin for simulating advertisement efficiency and customer engagement. Included interactive shelf/ad placement, agent simulation, metrics, dashboard UI, multi-fidelity visuals, and PC/XR/VisionOS/VR presentation flows.",
                "Unity,NVIDIA Omniverse,VisionOS,Apple Vision Pro,Meta Quest,WebGL,Babylon.js,React,OpenXR,Zenject,C#",
                null,
                null,
                null,
                true,
                4
            ),
            project(
                "Automotive Configurator / Personalizer",
                "High-quality automotive configurator using NVIDIA Omniverse remote rendering streamed over WebRTC to Apple Vision Pro and web clients. Built frontend controls, custom interaction events, bidirectional web-to-viewport messaging, XR companion functionality, and backend/system fixes.",
                "NVIDIA Omniverse,WebRTC,Apple Vision Pro,visionOS,Swift,Python,React,JavaScript,Remote Rendering",
                null,
                null,
                null,
                true,
                5
            ),
            project(
                "Volumetric Sports Playback CES Showcase",
                "High-profile CES showcase for real-time playback of volumetric sports captures on Meta Quest 3 mixed reality, synchronized with PC and iOS clients. Delivered scalable playback with Unity Jobs/Burst, MR room mapping, anchors, and an asset pipeline that reduced content turnaround from days to hours.",
                "Unity 2022,Unity 6,Meta Quest 3,Mixed Reality,Jobs,Burst,Houdini,AWS,Docker,Ansible,Xcode,CI/CD",
                null,
                null,
                null,
                true,
                6
            ),
            project(
                "Interactive Mining Site Digital Twin",
                "Industrial mining-site digital twin focused on real-time visualization, XR interaction, robotics concepts, and enterprise stakeholder presentation. Combined Unity, NVIDIA Omniverse-oriented workflows, Quest 3 interaction, and ROS robotics visualization ideas.",
                "Unity,NVIDIA Omniverse,Meta Quest 3,OpenXR,ROS Robotics,C#,Industrial Digital Twin",
                null,
                null,
                null,
                true,
                7
            ),
            project(
                "Sub-Sea Industrial Drone Digital Twin for GDC",
                "Industrial digital twin prototype for a sub-sea drone scenario prepared for GDC. Built XR interaction pieces, connected Unity-based interaction with Omniverse-oriented visualization, and optimized the presentation flow for Meta Quest 2/3 demos.",
                "NVIDIA Omniverse,Unity,Meta Quest 2,Meta Quest 3,OpenXR,C#,GDC Demo",
                null,
                null,
                null,
                true,
                8
            ),
            project(
                "Internal Animated Avatar R&D",
                "Internal R&D around real-time avatar technology using NVIDIA Omniverse, Unreal Engine, Unity, and NVIDIA Audio2Face. Explored cross-engine avatar workflows, animation feasibility, and interactive presentation scenarios.",
                "NVIDIA Omniverse,NVIDIA Audio2Face,Unreal Engine,Unity,C#,Python,R&D",
                null,
                null,
                null,
                false,
                9
            ),
            project(
                "VR Games Platform / Pico and Meta Quest Integration",
                "Native VR platform work for multiplayer lobbies, game launching, in-headset shopping, and porting between Pico and Meta Quest ecosystems. Led Oculus-to-Pico porting, integrated Meta Quest backend APIs and authentication, analytics, editor tooling, and hardware-specific debugging.",
                "Unity,Meta XR SDK,Pico SDK,Kotlin,Firebase,Quest APIs,Authentication,Analytics,Git,Jira",
                null,
                null,
                null,
                true,
                10
            ),
            project(
                "Mobile Fashion Game Client / Server Integration",
                "Competitive mobile fashion game work with client-server architecture. Implemented core mechanics, editor tooling, analytics, ads mediation, plugin integrations, common data structures with the server team, and platform-specific stability fixes.",
                "Unity,C#,Zenject,Addressables,DOTween,Cinemachine,Firebase,IronSource,TeamCity,REST,Android,iOS",
                null,
                null,
                null,
                false,
                11
            ),
            project(
                "Education App with Authoring Tools",
                "Interactive children education app with thousands of levels and a tool for educators to create new learning experiences. Worked on architecture, features, tooling, support, shading, lighting, post-processing, and production-ready content workflows.",
                "Unity,C#,JavaScript,HDRP,Custom Editor Tools,Git,Jira,Agile",
                null,
                null,
                null,
                false,
                12
            ),
            project(
                "AR Medical Sales Showcase",
                "Augmented-reality medical tool showcase for sales teams. Built architecture, AR solution integration, plugin integration, UI layout, feature implementation, testing, and demo stabilization.",
                "Unity,C#,AR Foundation,Zenject,iOS,Android,Git,Scrum",
                null,
                null,
                null,
                false,
                13
            ),
            project(
                "VR Guest House Showcase",
                "High-fidelity VR showcase for a US client. Implemented core VR features, multiplayer, backend communication logic, UI integration, and release fixes for a presentation-oriented virtual tour.",
                "Unity,C#,REST API,Photon PUN,DOTween,VR,Git,Jira",
                null,
                null,
                null,
                false,
                14
            ),
            project(
                "IoT / Arduino / Bluetooth Control Apps",
                "Early IoT prototyping around startup opportunities: LED spectroanalyzer/equalizer wall, gift-ready LED frame, and both Unity and WPF Bluetooth remote control applications.",
                "Arduino,IoT,Unity,WPF,C#,Bluetooth,Embedded Prototyping",
                null,
                null,
                null,
                false,
                15
            )
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
            event(2016, "Started Software Engineering BSc", "Taras Shevchenko National University of Kyiv", "Built the foundation in software engineering, OOP, Java/C#, SQL, web basics, and systems thinking.", "EDUCATION", 1),
            event(2017, "IoT / Arduino Prototyping", "Kyiv National University Startup / IoT Team", "Worked on IoT startup prototypes and Bluetooth control apps, combining embedded devices, Unity/WPF clients, and hardware-oriented debugging.", "JOB", 2),
            event(2018, "Application Development Internship", "Kodisoft", "Built UWP and desktop tooling for special hardware, including custom controls, a graphical weather app using C# with DirectX/C++ coupling, and a PowerPoint parser.", "JOB", 3),
            event(2018, "2nd Prize — Zhytomyr GeekHack", "Vision Clan Hackathon Team", "Built Fit Helper, an interactive web app with a selectable human-body model, exercise recommendations, and Telegram bot support.", "ACHIEVEMENT", 4),
            event(2019, "DevOps Course Internship", "EPAM", "Completed DevOps training and developed an online transport-management app with a full CI line.", "JOB", 5),
            event(2020, "BSc Software Engineering", "Taras Shevchenko National University of Kyiv", "Completed Bachelor's degree in Software Engineering.", "EDUCATION", 6),
            event(2020, "Unity Developer — Mobile Games", "Shaman Games", "Worked on mobile casual games and released Hiddenverse: Witch's Tales for Android and iOS.", "JOB", 7),
            event(2020, "Unity Developer — Education Platform", "Pickatale", "Built Unity gameplay, editor tooling, HDRP lighting/shading/post-processing workflows, production-ready levels, and CI/CD for five target platforms.", "JOB", 8),
            event(2021, "Unity Developer — Fashion Game", "Genesis / SuitsMe", "Implemented game mechanics, SDK integrations, ads/analytics/user matching, Android 12 fixes, custom in-app messaging/install-referrer packages, and reduced mobile crashes substantially.", "JOB", 9),
            event(2022, "XR Platform Developer", "Entertainment Hardware / VR Platform", "Worked on VR game launching, in-headset shopping, multiplayer lobby workflows, Meta Quest backend APIs, authentication, Pico SDK porting, analytics, and hardware-specific debugging.", "JOB", 10),
            event(2023, "XR / Digital Twin Developer", "SoftServe", "Delivered Omniverse, Unity, VisionOS, Meta Quest, WebGL/Babylon/React, industrial digital twin, and XR demonstration projects across retail, mining, automotive, avatar, and GDC scenarios.", "JOB", 11),
            event(2024, "CES Volumetric Sports MR Showcase", "International Media Technology Client", "Built scalable volumetric sports playback on Meta Quest 3 MR synchronized with PC and iOS; contributed Jobs/Burst playback, room mapping, anchors, tooling, AWS pipeline, Docker/Ansible, and event-grade stability.", "ACHIEVEMENT", 12),
            event(2024, "Procore BIM Viewer / VisionOS R&D", "Procore", "Worked on BIM viewer frontend/rendering/mobile features and R&D prototypes for Apple Vision Pro, iOS/Android, QR-based safety workflows, object detection concepts, and Procore Groundbreak demos.", "JOB", 13),
            event(2025, "Master's Degree in Software Engineering", "National University “Zhytomyr Polytechnic”", "Completed/continued Master's-level Software Engineering work, strengthening fundamentals behind architecture, databases, algorithms, and real-time engine research.", "EDUCATION", 14),
            event(2026, "Full-Stack Omniverse Interview Showcase", "Orbital CV Console", "Built this two-service Render deployment to demonstrate role fit: 3D frontend, live Spring Boot REST microservice, Hibernate/JPA entities, SQLite-backed data, and video/project presentation.", "ACHIEVEMENT", 15)
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
            video("Orbital CV Console Walkthrough", "Short walkthrough of the interactive CV: scroll-driven camera navigation, particles, Spring Boot diagnostics, Hibernate-backed project data, and recruiter mode.", null, null, 1L),
            video("Procore / BIM / VisionOS Demo Reel", "Placeholder slot for BIM viewer, VisionOS, on-site safety, or Groundbreak-style demo footage.", null, null, 3L),
            video("Shop Ads Digital Twin Demo", "Placeholder slot for retail simulation footage: shelf placement, customer/agent behavior, metrics dashboard, and XR presentation mode.", null, null, 4L),
            video("Omniverse Car Configurator Stream", "Placeholder slot for Omniverse remote rendering / WebRTC / Apple Vision Pro / web control footage.", null, null, 5L),
            video("CES Volumetric Sports Playback", "Placeholder slot for Meta Quest 3 mixed-reality volumetric playback footage synchronized with PC/iOS.", null, null, 6L),
            video("Industrial Digital Twin / GDC Reel", "Placeholder slot for mining-site or sub-sea industrial drone digital twin footage.", null, null, 7L)
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