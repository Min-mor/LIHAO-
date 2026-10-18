package com.febuki.tool.server.error;

import com.febuki.tool.server.utils.MapUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;
import java.net.MalformedURLException;

@Slf4j
@RestControllerAdvice(annotations = RestController.class, basePackages = "com.febuki.tool.server")
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleException(final RuntimeException e) {
        log.error("RuntimeException =========> ");
        log.error(e.getMessage());
        log.error("<=========");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                        MapUtils.Pair.of("message", e.getMessage()),
                        MapUtils.Pair.of("error", e)
                ));
    }

    @ExceptionHandler(MalformedURLException.class)
    public ResponseEntity<?> handleException(final MalformedURLException e) {
        log.error("MalformedURLException =========> ");
        log.error(e.getMessage());
        log.error("<=========");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                        MapUtils.Pair.of("message", e.getMessage()),
                        MapUtils.Pair.of("error", e)
                ));
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<?> handleException(final IOException e) {
        log.error("IOException =========> ");
        log.error(e.getMessage());
        log.error("<=========");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                        MapUtils.Pair.of("message", e.getMessage()),
                        MapUtils.Pair.of("error", e)
                ));
    }
}
