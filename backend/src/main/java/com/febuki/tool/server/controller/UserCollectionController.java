package com.febuki.tool.server.controller;

import com.febuki.tool.server.dto.UserCollectionDTO;
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
@RequestMapping("/api/user/collection")
@Tag(name = "用户收藏", description = "用户收藏接口")
public class UserCollectionController {

    @PostMapping("/add")
    @Operation(summary = "添加收藏", description = "添加用户收藏")
    public ResponseEntity<?> addUserCollection(@RequestBody UserCollectionDTO userCollectionDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "添加成功"),
                        MapUtils.Pair.of("data", userCollectionDTO)
                )
        );
    }
}
