import Foundation

enum Platform: String, CaseIterable, Identifiable, Hashable {
    case movy, cinejoy, sevenMovies
    var id: String { rawValue }
    var name: String {
        switch self { case .movy: return "Movy"; case .cinejoy: return "Cinejoy"; case .sevenMovies: return "7movies" }
    }
    var home: URL {
        switch self {
        case .movy: return URL(string: "https://www.movy.sx/fr")!
        case .cinejoy: return URL(string: "https://cinejoy.pk/")!
        case .sevenMovies: return URL(string: "https://7movies.ac/")!
        }
    }
}

struct CatalogItem: Identifiable, Hashable {
    let platform: Platform
    let mediaID: Int
    let mediaType: String
    let title: String
    let overview: String
    let poster: URL?
    let page: URL
    var id: String { "\(platform.rawValue):\(mediaType):\(mediaID)" }
}

enum CineHubError: LocalizedError {
    case webOnly, changedCatalog, http(Int), responseTooLarge, invalidMedia
    var errorDescription: String? {
        switch self {
        case .webOnly: return "Cette plateforme nécessite actuellement son lecteur web. Elle n’est pas encore compatible avec cette version Apple TV."
        case .changedCatalog: return "Le catalogue n’a pas pu être lu. Réessaie plus tard ou choisis une autre plateforme."
        case .http(let code): return "Le site ne répond pas normalement (HTTP \(code))."
        case .responseTooLarge: return "La réponse du site est trop volumineuse."
        case .invalidMedia: return "Entre une adresse HTTPS directe vers une vidéo MP4 ou une playlist HLS (.m3u8). Une page web ne peut pas être lue ici."
        }
    }
}

enum CatalogParser {
    static func parse(_ html: String, platform: Platform) throws -> [CatalogItem] {
        if platform == .cinejoy { throw CineHubError.webOnly }
        var objects: [Any] = []
        if platform == .movy {
            let pattern = #"<script\b[^>]*\bid="__NEXT_DATA__"[^>]*>([\s\S]*?)</script>"#
            if let text = captures(pattern, html).first,
               let data = text.data(using: .utf8), let value = try? JSONSerialization.jsonObject(with: data) {
                objects.append(value)
            }
        } else {
            // Read Next.js server-rendered data as JSON; never execute JavaScript.
            let pattern = #"self\.__next_f\.push\((\[1,"(?:[^"\\]|\\.)*"\])\)"#
            for text in captures(pattern, html) {
                guard let data = text.data(using: .utf8),
                      let pair = try? JSONSerialization.jsonObject(with: data) as? [Any],
                      pair.count == 2, let payload = pair[1] as? String else { continue }
                objects += jsonObjects(in: payload)
            }
        }
        var result: [CatalogItem] = [], seen = Set<String>()
        func walk(_ value: Any, depth: Int = 0) {
            guard depth < 60, result.count < 300 else { return }
            if let list = value as? [Any] { list.forEach { walk($0, depth: depth + 1) }; return }
            guard let object = value as? [String: Any] else { return }
            if let id = (object["id"] as? NSNumber)?.intValue, id > 0,
               let title = object["title"] as? String, !title.isEmpty,
               let type = object["mediaType"] as? String, ["movie", "tv"].contains(type) {
                let poster = (object["poster"] as? String).flatMap { URL(string: $0, relativeTo: platform.home)?.absoluteURL }
                let page = platform.home.appendingPathComponent(type).appendingPathComponent(String(id))
                let item = CatalogItem(platform: platform, mediaID: id, mediaType: type, title: title,
                    overview: object["description"] as? String ?? "", poster: poster, page: page)
                if seen.insert(item.id).inserted { result.append(item) }
            }
            for key in object.keys.sorted() { if let child = object[key] { walk(child, depth: depth + 1) } }
        }
        objects.forEach { walk($0) }
        guard !result.isEmpty else { throw CineHubError.changedCatalog }
        return result
    }

    private static func captures(_ pattern: String, _ text: String) -> [String] {
        guard let regex = try? NSRegularExpression(pattern: pattern) else { return [] }
        let ns = text as NSString
        return regex.matches(in: text, range: NSRange(location: 0, length: ns.length)).map { ns.substring(with: $0.range(at: 1)) }
    }

    private static func jsonObjects(in text: String) -> [Any] {
        let bytes = Array(text.utf8)
        var stack: [Int] = [], quoted = false, escaped = false, result: [Any] = []
        for (index, byte) in bytes.enumerated() {
            if quoted {
                if escaped { escaped = false } else if byte == 92 { escaped = true } else if byte == 34 { quoted = false }
            } else if byte == 34 { quoted = true }
            else if byte == 123 { stack.append(index) }
            else if byte == 125, let start = stack.popLast(), index - start < 2_000_000,
                    let object = try? JSONSerialization.jsonObject(with: Data(bytes[start...index])) { result.append(object) }
        }
        return result
    }
}

struct CatalogService {
    func load(_ platform: Platform) async throws -> [CatalogItem] {
        if platform == .cinejoy { throw CineHubError.webOnly }
        var request = URLRequest(url: platform.home)
        request.timeoutInterval = 20
        request.setValue("text/html", forHTTPHeaderField: "Accept")
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse else { throw CineHubError.changedCatalog }
        guard (200..<300).contains(http.statusCode) else { throw CineHubError.http(http.statusCode) }
        guard data.count <= 8_000_000 else { throw CineHubError.responseTooLarge }
        guard let html = String(data: data, encoding: .utf8) else { throw CineHubError.changedCatalog }
        return try CatalogParser.parse(html, platform: platform)
    }
}

enum DirectMedia {
    static func url(_ text: String) throws -> URL {
        guard let url = URL(string: text.trimmingCharacters(in: .whitespacesAndNewlines)),
              url.scheme?.lowercased() == "https", let host = url.host, !host.isEmpty,
              ["m3u8", "mp4"].contains(url.pathExtension.lowercased()) else { throw CineHubError.invalidMedia }
        return url
    }
}
