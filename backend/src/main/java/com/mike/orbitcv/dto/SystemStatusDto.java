package com.mike.orbitcv.dto;

public class SystemStatusDto {
    private String service;
    private String runtime;
    private String orm;
    private String database;
    private String status;
    private long projectCount;
    private long skillCount;
    private long timelineEvents;
    private long videoCount;
    private String startedAt;
    private String frontendOrigin;
    private String version;

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }
    public String getRuntime() { return runtime; }
    public void setRuntime(String runtime) { this.runtime = runtime; }
    public String getOrm() { return orm; }
    public void setOrm(String orm) { this.orm = orm; }
    public String getDatabase() { return database; }
    public void setDatabase(String database) { this.database = database; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public long getProjectCount() { return projectCount; }
    public void setProjectCount(long projectCount) { this.projectCount = projectCount; }
    public long getSkillCount() { return skillCount; }
    public void setSkillCount(long skillCount) { this.skillCount = skillCount; }
    public long getTimelineEvents() { return timelineEvents; }
    public void setTimelineEvents(long timelineEvents) { this.timelineEvents = timelineEvents; }
    public long getVideoCount() { return videoCount; }
    public void setVideoCount(long videoCount) { this.videoCount = videoCount; }
    public String getStartedAt() { return startedAt; }
    public void setStartedAt(String startedAt) { this.startedAt = startedAt; }
    public String getFrontendOrigin() { return frontendOrigin; }
    public void setFrontendOrigin(String frontendOrigin) { this.frontendOrigin = frontendOrigin; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
}
