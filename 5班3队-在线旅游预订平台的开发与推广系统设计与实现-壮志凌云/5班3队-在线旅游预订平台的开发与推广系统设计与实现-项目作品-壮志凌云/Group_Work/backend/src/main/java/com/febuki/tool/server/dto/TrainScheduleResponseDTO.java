package com.febuki.tool.server.dto;

import com.alibaba.fastjson.annotation.JSONField;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Schema(description = "车次信息")
public class TrainScheduleResponseDTO {
    @Schema(description = "返回结果状态码")
    @JSONField(name = "error_code")
    private int errorCode;

    @Schema(description = "返回结果描述")
    @JSONField(name = "reason")
    private String reason;

    @Schema(description = "返回结果集")
    @JSONField(name = "result")
    private List<TrainInfoDTO> result;

    public TrainScheduleResponseDTO() {
    }

    public TrainScheduleResponseDTO(int errorCode, String reason, List<TrainInfoDTO> result) {
        this.errorCode = errorCode;
        this.reason = reason;
        this.result = result;
    }
}
