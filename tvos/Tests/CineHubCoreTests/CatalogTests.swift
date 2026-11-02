import XCTest
import Foundation
@testable import CineHubCore

final class CatalogTests: XCTestCase {
    func testMovyReadsPublishedDataAndDeduplicatesByType() throws {
        let html = #"<script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"movies":[{"id":1,"title":"Un film","poster":"/poster.webp","mediaType":"movie"},{"id":1,"title":"Un film","mediaType":"movie"},{"id":1,"title":"Une série","mediaType":"tv"}]}}}</script>"#
        let items = try CatalogParser.parse(html, platform: .movy)
        XCTAssertEqual(items.count, 2)
        XCTAssertEqual(items.first?.poster?.absoluteString, "https://www.movy.sx/poster.webp")
        XCTAssertEqual(items.first?.page.absoluteString, "https://www.movy.sx/fr/movie/1")
    }
    func testFlightDataPreservesEscapedQuotesAndBraces() throws {
        let value = #"x:[{"id":8,"title":"Un \"film\" {étrange}","mediaType":"movie","description":"Une histoire."}]"#
        let bytes = try JSONSerialization.data(withJSONObject: [1, value])
        let html = "<script>self.__next_f.push(\(String(decoding: bytes, as: UTF8.self)))</script>"
        let items = try CatalogParser.parse(html, platform: .sevenMovies)
        XCTAssertEqual(items.first?.title, "Un \"film\" {étrange}")
        XCTAssertEqual(items.first?.page.absoluteString, "https://7movies.ac/movie/8")
    }
    func testChangedMarkupFailsRatherThanShowingFakeTitles() {
        XCTAssertThrowsError(try CatalogParser.parse("<title>Unavailable</title>", platform: .movy))
        XCTAssertThrowsError(try CatalogParser.parse("<title>Unavailable</title>", platform: .sevenMovies))
    }
    func testCinejoyIsNotReportedAsCompatible() {
        XCTAssertThrowsError(try CatalogParser.parse("", platform: .cinejoy))
    }
    func testDirectMediaAcceptsSignedHTTPSManifests() throws {
        XCTAssertEqual(try DirectMedia.url(" https://example.com/master.m3u8?token=abc ").host, "example.com")
        XCTAssertNoThrow(try DirectMedia.url("https://example.com/video.MP4"))
    }
    func testWebPagesAndNonHTTPSMediaAreRejected() {
        for text in ["https://www.movy.sx/fr/movie/1", "http://example.com/a.mp4", "file:///a.mp4", "javascript:alert(1)"] {
            XCTAssertThrowsError(try DirectMedia.url(text))
        }
    }
}
