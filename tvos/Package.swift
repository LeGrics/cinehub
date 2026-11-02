// swift-tools-version: 5.9
import PackageDescription
let package = Package(
    name: "CineHubCore",
    platforms: [.macOS(.v13), .tvOS(.v16)],
    products: [.library(name: "CineHubCore", targets: ["CineHubCore"])],
    targets: [.target(name: "CineHubCore"), .testTarget(name: "CineHubCoreTests", dependencies: ["CineHubCore"])]
)
