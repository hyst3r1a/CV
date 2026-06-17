package com.mike.orbitcv.dto;

public class SkillDto {
    private Long id;
    private String name;
    private String category;
    private int proficiency;
    private String color;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getProficiency() { return proficiency; }
    public void setProficiency(int proficiency) { this.proficiency = proficiency; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
