package com.febuki.tool.server.service;

import com.febuki.tool.server.dto.ScenicRequestDTO;
import com.febuki.tool.server.dto.ScenicResponseDTO;

import java.io.IOException;

public interface ScenicServer {
    /**
     * 获取景点信息
     * @param scenicRequestDTO
     * @return ScenicResponseDTO
     */
    ScenicResponseDTO getScenicInfo(ScenicRequestDTO scenicRequestDTO) throws IOException;
}
