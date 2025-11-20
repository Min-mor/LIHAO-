package com.febuki.tool.server.controller;

import com.febuki.tool.server.dto.TrainScheduleRequestDTO;
import com.febuki.tool.server.dto.TrainScheduleResponseDTO;
import com.febuki.tool.server.service.TrainServer;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/train")
@Tag(name = "火车服务", description = "火车服务")
public class TrainController {

    private final TrainServer trainServer;

    public TrainController(@Autowired TrainServer trainServer) {
        this.trainServer = trainServer;
    }

    @GetMapping("/query")
    @Operation(summary = "获取列车站到站时刻表", description = "列车站到站时刻表")
    public ResponseEntity<?> query(
            @Parameter(
                    name = "参数", required = true
            )
            TrainScheduleRequestDTO trainScheduleRequestDTO
    ) throws IOException {
        TrainScheduleResponseDTO response = trainServer.getTrainSchedule(trainScheduleRequestDTO);

        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "查询成功"),
                        MapUtils.Pair.of("data", response)
                )
        );
    }
}
