package com.febuki.tool.server.controller;

import com.febuki.tool.server.dto.TravelerDTO;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/traveler")
@Tag(name = "游客管理", description = "游客管理接口")
public class TravelerController {

    @PostMapping("/add")
    @Operation(summary = "添加游客", description = "添加游客")
    public ResponseEntity<?> addTraveler(@RequestBody TravelerDTO travelerDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "添加成功"),
                        MapUtils.Pair.of("data", travelerDTO)
                )
        );
    }
}
