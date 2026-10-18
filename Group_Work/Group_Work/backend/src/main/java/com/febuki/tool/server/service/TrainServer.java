package com.febuki.tool.server.service;

import com.febuki.tool.server.dto.TrainScheduleRequestDTO;
import com.febuki.tool.server.dto.TrainScheduleResponseDTO;

import java.io.IOException;
import java.net.MalformedURLException;

public interface TrainServer {

    /**
     * 获取车次信息
     *
     * @param trainScheduleRequestDTO
     * @return TrainScheduleResponseDTO
     * @throws IOException
     */
    TrainScheduleResponseDTO getTrainSchedule(TrainScheduleRequestDTO trainScheduleRequestDTO) throws IOException;
}
