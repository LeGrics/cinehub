import SwiftUI
import AVKit

struct Playback: Identifiable {
    let id = UUID()
    let url: URL
}

struct PlayerLabView: View {
    @State private var address = ""
    @State private var playback: Playback?
    @State private var error: String?
    // Public test stream linked from Apple's Streaming Examples, never a site stream.
    private let sample = "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"
    var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            Text("Lecteur Apple TV").font(.largeTitle.bold())
            Text("Vérifie la lecture et les commandes de la Siri Remote avec l’exemple Apple, ou une adresse vidéo directe.")
            Button("Lire la vidéo de test Apple") { play(sample) }
            TextField("Adresse HTTPS .m3u8 ou .mp4", text: $address)
            Button("Lire cette adresse") { play(address) }
            if let error { Text(error).foregroundStyle(.orange) }
        }.padding(80)
        .fullScreenCover(item: $playback) { selection in
            NativePlayer(url: selection.url).ignoresSafeArea().onExitCommand { playback = nil }
        }
    }
    private func play(_ text: String) {
        do { playback = Playback(url: try DirectMedia.url(text)); error = nil }
        catch { self.error = error.localizedDescription }
    }
}

struct NativePlayer: UIViewControllerRepresentable {
    let url: URL
    func makeUIViewController(context: Context) -> AVPlayerViewController {
        let controller = AVPlayerViewController()
        controller.player = AVPlayer(url: url)
        controller.player?.play()
        return controller
    }
    func updateUIViewController(_ controller: AVPlayerViewController, context: Context) {}
    static func dismantleUIViewController(_ controller: AVPlayerViewController, coordinator: ()) {
        controller.player?.pause()
        controller.player = nil
    }
}
