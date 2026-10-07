import SwiftUI

public struct AsyncFoodImage: View {
    public let urlString: String
    public let height: CGFloat?
    public let cornerRadius: CGFloat

    public init(urlString: String, height: CGFloat? = nil, cornerRadius: CGFloat = AppTheme.radiusMedium) {
        self.urlString = urlString
        self.height = height
        self.cornerRadius = cornerRadius
    }

    public var body: some View {
        Group {
            if let url = URL(string: urlString), !urlString.isEmpty {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .empty:
                        ZStack {
                            Color(red: 0.94, green: 0.95, blue: 0.97)
                            ProgressView()
                        }
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    case .failure:
                        fallbackPlaceholder
                    @unknown default:
                        fallbackPlaceholder
                    }
                }
            } else {
                fallbackPlaceholder
            }
        }
        .frame(height: height)
        .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
    }

    private var fallbackPlaceholder: some View {
        ZStack {
            Color(red: 0.94, green: 0.95, blue: 0.97)
            Image(systemName: "fork.knife")
                .font(.system(size: 24))
                .foregroundColor(AppTheme.textMuted)
        }
    }
}
