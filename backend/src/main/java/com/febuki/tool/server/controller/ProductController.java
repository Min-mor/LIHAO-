package com.febuki.tool.server.controller;

import com.febuki.tool.server.dto.ProductDTO;
import com.febuki.tool.server.entity.Merchant;
import com.febuki.tool.server.entity.Product;
import com.febuki.tool.server.mapper.MerchantMapper;
import com.febuki.tool.server.service.ProductServer;
import com.febuki.tool.server.utils.MapUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product")
@Tag(name = "商品接口", description = "商品接口")
public class ProductController {

    private final ProductServer productServer;

    private String convertErrorMessage(String errorCode) {
        if (errorCode == null) return "未知错误";
        switch (errorCode) {
            case "PRODUCT_ID_EXIST":
                return "添加失败：该商品ID已存在，请勿重复添加";
            case "USER_ID_NULL":
                return "发布者ID不能为空";
            case "MERCHANT_NOT_FOUND":
                return "添加失败：该用户尚未入驻成为商户";
            case "PRODUCT_ID_NULL":
                return "商品ID不能为空";
            case "PRODUCT_NOT_FOUND":
                return "更新失败：商品不存在或已删除";
            case "NO_PERMISSION":
                return "操作失败：无权修改该商品信息，仅限商家本人或管理员操作";
            default:
                return "操作失败: " + errorCode;
        }
    }

    public ProductController(ProductServer productServer, MerchantMapper merchantMapper) {
        this.productServer = productServer;
    }

    @GetMapping("/list")
    @Operation(summary = "商品列表", description = "分页获取商品列表，支持关键词搜索")
    public ResponseEntity<?> list(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", productServer.listProducts(page, limit, keyword))
                )
        );
    }

    @GetMapping("/detail/{id}")
    @Operation(summary = "商品详情", description = "根据ID获取商品详情")
    public ResponseEntity<?> getDetail(@PathVariable Long id) {
        Product product = productServer.getProductById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.NOT_FOUND.value()),
                            MapUtils.Pair.of("message", "商品不存在")
                    )
            );
        }
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "获取成功"),
                        MapUtils.Pair.of("data", productServer.getProductById(id))
                )
        );
    }

    @PostMapping("/add")
    @Operation(summary = "添加商品", description = "添加新商品")
    public ResponseEntity<?> add(@RequestBody ProductDTO productDTO) {
        try {
            productServer.saveProduct(productDTO);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "添加成功"),
                            MapUtils.Pair.of("data", productDTO)
                    )
            );
        } catch (RuntimeException e) {
            String errorMsg = convertErrorMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                            MapUtils.Pair.of("message", errorMsg)
                    )
            );
        }
    }

    @PutMapping("/update")
    @Operation(summary = "更新商品", description = "更新商品信息")
    public ResponseEntity<?> update(@RequestBody ProductDTO productDTO) {
        try {
            productServer.updateProduct(productDTO);
            return ResponseEntity.status(HttpStatus.OK).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.OK.value()),
                            MapUtils.Pair.of("message", "更新成功"),
                            MapUtils.Pair.of("data", productDTO)
                    )
            );
        } catch (RuntimeException e) {
            String errorMsg = convertErrorMessage(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.BAD_REQUEST.value()),
                            MapUtils.Pair.of("message", errorMsg)
                    )
            );
        }
    }

    @DeleteMapping("/delete/{id}")
    @Operation(summary = "下架商品", description = "根据ID下架商品")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Product product = productServer.getProductById(id);

        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.NOT_FOUND.value()),
                            MapUtils.Pair.of("message", "商品不存在")
                    )
            );
        }

        if (!product.isStatus()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    MapUtils.of(
                            MapUtils.Pair.of("code", HttpStatus.NOT_FOUND.value()),
                            MapUtils.Pair.of("message", "商品已下架或不存在")
                    )
            );
        }
        productServer.deleteProduct(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                MapUtils.of(
                        MapUtils.Pair.of("code", HttpStatus.OK.value()),
                        MapUtils.Pair.of("message", "下架成功")
                )
        );
    }
}
