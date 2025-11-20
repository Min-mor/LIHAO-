package com.febuki.tool.server.utils;

import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class MapUtils {
    public static Map<String, Object> of(
            Pair... pairs
    ) {
        final Map<String, Object> map = new LinkedHashMap<>();
        for (final Pair pair : pairs) {
            map.put(pair.getKey(), pair.getValue());
        }
        return Collections.unmodifiableMap(map);
    }

    @Getter
    public static class Pair {
        private final String key;
        private final Object value;

        private Pair(String key, Object value) {
            this.key = key;
            this.value = value;
        }

        public static Pair of(String key, Object value) {
            return new Pair(key, value);
        }

    }
}
