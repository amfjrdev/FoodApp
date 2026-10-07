// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "FoodApp",
    platforms: [
        .iOS(.v16),
        .macOS(.v13)
    ],
    products: [
        .library(
            name: "FoodAppCore",
            targets: ["FoodAppCore"]
        ),
    ],
    targets: [
        .target(
            name: "FoodAppCore",
            path: "FoodApp",
            exclude: ["App/FoodApp.swift", "Resources/Info.plist"]
        ),
        .testTarget(
            name: "FoodAppTests",
            dependencies: ["FoodAppCore"],
            path: "Tests"
        ),
    ]
)
