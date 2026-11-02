import SwiftUI

@main
struct CineHubApp: App {
    var body: some Scene { WindowGroup { HomeView().preferredColorScheme(.dark) } }
}

struct HomeView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 40) {
                    Text("CINÉHUB").font(.largeTitle.bold()).foregroundStyle(.mint)
                    Text("Choisis ta plateforme.").font(.title)
                    Text("Aperçu Apple TV · Les catalogues et la lecture sont indiqués séparément.").foregroundStyle(.secondary)
                    HStack(spacing: 32) {
                        ForEach(Platform.allCases) { platform in
                            NavigationLink { CatalogView(platform: platform) } label: {
                                VStack(alignment: .leading, spacing: 20) {
                                    Image(systemName: "play.rectangle.fill").font(.system(size: 46))
                                    Text(platform.name).font(.title2.bold())
                                    Text(platform == .cinejoy ? "Pas encore compatible" : "Catalogue disponible · lecture à intégrer").font(.caption)
                                }.frame(maxWidth: .infinity, minHeight: 200, alignment: .leading).padding(24)
                            }.buttonStyle(.card)
                        }
                    }
                    NavigationLink("Tester le lecteur Apple TV") { PlayerLabView() }.padding(.top, 20)
                }.padding(70)
            }
        }.tint(.mint)
    }
}

struct CatalogView: View {
    let platform: Platform
    @State private var items: [CatalogItem] = []
    @State private var loading = true
    @State private var error: String?
    private let columns = Array(repeating: GridItem(.flexible(), spacing: 36), count: 5)
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 32) {
                Text(platform.name).font(.largeTitle.bold())
                if loading { ProgressView("Chargement du catalogue…") }
                if let error {
                    Text(error).font(.title3)
                    if platform != .cinejoy { Button("Réessayer") { Task { await load() } } }
                }
                LazyVGrid(columns: columns, spacing: 48) {
                    ForEach(items) { item in
                        NavigationLink { DetailView(item: item) } label: {
                            VStack(alignment: .leading, spacing: 14) {
                                AsyncImage(url: item.poster) { image in image.resizable().scaledToFit() } placeholder: {
                                    Rectangle().fill(.gray.opacity(0.2)).overlay { Image(systemName: "film") }
                                }.frame(height: 270).clipped()
                                Text(item.title).font(.caption).lineLimit(2).frame(height: 64, alignment: .topLeading)
                            }.padding(12)
                        }.buttonStyle(.card)
                    }
                }
            }.padding(70)
        }.task { await load() }
    }
    @MainActor private func load() async {
        loading = true; error = nil
        do { items = try await CatalogService().load(platform) }
        catch { self.error = error.localizedDescription }
        loading = false
    }
}

struct DetailView: View {
    let item: CatalogItem
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 30) {
                Text(item.title).font(.largeTitle.bold())
                if !item.overview.isEmpty { Text(item.overview).font(.title3) }
                Label("Lecture du site non disponible dans cet aperçu", systemImage: "info.circle").foregroundStyle(.mint)
                Text("Ce titre utilise actuellement le lecteur web de \(item.platform.name). Le catalogue fonctionne ; son lecteur Apple TV reste à intégrer.")
                Text("Page du titre sur un autre appareil :").foregroundStyle(.secondary)
                Text(item.page.absoluteString).font(.caption)
                NavigationLink("Tester le lecteur Apple TV") { PlayerLabView() }
            }.padding(80)
        }
    }
}
