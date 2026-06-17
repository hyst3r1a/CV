package com.mike.orbitcv.service;

import com.mike.orbitcv.entity.VideoEntity;
import com.mike.orbitcv.repository.VideoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VideoService {

    private final VideoRepository repo;

    public VideoService(VideoRepository repo) {
        this.repo = repo;
    }

    public List<VideoEntity> findAll() {
        return repo.findAll();
    }
}
