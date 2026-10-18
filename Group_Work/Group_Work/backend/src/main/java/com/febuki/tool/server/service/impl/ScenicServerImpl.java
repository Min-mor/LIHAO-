package com.febuki.tool.server.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.febuki.tool.server.config.JuheConfig;
import com.febuki.tool.server.dto.ScenicRequestDTO;
import com.febuki.tool.server.dto.ScenicResponseDTO;
import com.febuki.tool.server.service.ScenicServer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service("scenicServer")
public class ScenicServerImpl implements ScenicServer {

    private final JuheConfig juheConfig;

    public ScenicServerImpl(@Autowired JuheConfig juheConfig) {
        this.juheConfig = juheConfig;
    }

    /**
     * 获取景点信息
     *
     * @param scenicRequestDTO
     * @return ScenicResponseDTO
     */
    @Override
    public ScenicResponseDTO getScenicInfo(ScenicRequestDTO scenicRequestDTO) throws IOException {
        URL url = new URL(String.format("%s?%s", juheConfig.getUrl() + "fapigx/scenic/query", params(getStringHashMap(scenicRequestDTO))));
        BufferedReader in = new BufferedReader(new InputStreamReader((url.openConnection()).getInputStream()));
        String inputLine;
        StringBuffer response = new StringBuffer();
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();
        System.out.println(response);

        // 解析JSON
        ScenicResponseDTO scenicResponseDTO = parseToDto(response.toString());
        System.out.println(toFormattedJson(scenicResponseDTO));

        return scenicResponseDTO;
    }

    private HashMap<String, String> getStringHashMap(ScenicRequestDTO scenicRequestDTO) {
        HashMap<String, String> map = new HashMap<>();
        map.put("key", juheConfig.getScenicApikey());
        map.put("word", scenicRequestDTO.getWord());
        map.put("num", scenicRequestDTO.getNum());
        map.put("page", scenicRequestDTO.getPage());
        map.put("province", scenicRequestDTO.getProvince());
        map.put("city", scenicRequestDTO.getCity());
        return map;
    }

    private String params(Map<String, String> map) {
        return map.entrySet().stream()
                .map(entry -> {
                    try {
                        return entry.getKey() + "=" + URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString());
                    } catch (Exception e) {
                        log.error("编码错误: {}={}", entry.getKey(), entry.getValue(), e);
                        return entry.getKey() + "=" + entry.getValue();
                    }
                })
                .collect(Collectors.joining("&"));
    }

    private ScenicResponseDTO parseToDto(String jsonString) {
        try {
            return JSON.parseObject(jsonString, ScenicResponseDTO.class);
        } catch (Exception e) {
            System.err.println("JSON解析失败: " + e.getMessage());
            return null;
        }
    }

    private String toFormattedJson(ScenicResponseDTO dto) {
        return JSON.toJSONString(dto,
                SerializerFeature.PrettyFormat,
                SerializerFeature.WriteMapNullValue,
                SerializerFeature.WriteDateUseDateFormat);
    }

    private String cleanHtmlContent(String htmlContent) {
        if (htmlContent == null) return "";
        return htmlContent.replaceAll("<br>", "\n")
                .replaceAll("<[^>]+>", "")
                .trim();
    }
}
