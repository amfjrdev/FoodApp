import SwiftUI

public struct OnboardingSlide: Identifiable {
    public let id: Int
    public let titlePrefix: String
    public let titleHighlight: String
    public let subtitle: String
    public let image: String
    public let tag: String
    public let rating: String
    public let deliveryTime: String
    public let accentColor: Color
    public let floatingPill: String
}

public struct OnboardingView: View {
    public let onStart: () -> Void

    @State private var currentSlide = 0
    @State private var isAnimating = false
    @State private var pulseButton = false
    @State private var orbRotation: Double = 0
    @State private var floatOffset1: CGFloat = 0
    @State private var floatOffset2: CGFloat = 0
    @State private var floatOffset3: CGFloat = 0

    private let slides: [OnboardingSlide] = [
        OnboardingSlide(
            id: 0,
            titlePrefix: "Craving Something",
            titleHighlight: "Extraordinary?",
            subtitle: "Artisanal chef-crafted burgers, prime steaks, and gourmet delights delivered sizzling hot.",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
            tag: "CHEF'S SIGNATURE",
            rating: "4.9 (3.8k+)",
            deliveryTime: "20-30 min",
            accentColor: Color(red: 1.0, green: 0.45, blue: 0.12),
            floatingPill: "🍔 100% Black Angus"
        ),
        OnboardingSlide(
            id: 1,
            titlePrefix: "Mastercrafted",
            titleHighlight: "Fresh Sushi & Bowls",
            subtitle: "Sashimi-grade Norwegian salmon, bluefin tuna rolls, and nutrient-packed poke bowls.",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=80",
            tag: "RAW & ORGANIC",
            rating: "4.95 (2.9k+)",
            deliveryTime: "25-35 min",
            accentColor: Color(red: 0.1, green: 0.75, blue: 0.6),
            floatingPill: "🍣 Sashimi Grade"
        ),
        OnboardingSlide(
            id: 2,
            titlePrefix: "Woodfired",
            titleHighlight: "Artisan Pizza & Pasta",
            subtitle: "Hand-stretched Neapolitan dough, San Marzano tomatoes, and creamy 24-month aged parmesan.",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80",
            tag: "AUTHENTIC ITALIAN",
            rating: "4.88 (4.2k+)",
            deliveryTime: "20-30 min",
            accentColor: Color(red: 0.95, green: 0.3, blue: 0.25),
            floatingPill: "🍕 Woodfired Oven"
        )
    ]

    public init(onStart: @escaping () -> Void) {
        self.onStart = onStart
    }

    public var body: some View {
        ZStack {
            // Ultra-deep luxury background
            Color(red: 0.04, green: 0.06, blue: 0.10)
                .ignoresSafeArea()

            // Dynamic Rotating Gradient Ambient Orbs
            ZStack {
                Circle()
                    .fill(slides[currentSlide].accentColor.opacity(0.22))
                    .frame(width: 340, height: 340)
                    .blur(radius: 90)
                    .offset(x: isAnimating ? -90 : 90, y: isAnimating ? -160 : -80)

                Circle()
                    .fill(Color(red: 0.98, green: 0.55, blue: 0.15).opacity(0.18))
                    .frame(width: 300, height: 300)
                    .blur(radius: 80)
                    .offset(x: isAnimating ? 80 : -80, y: isAnimating ? 140 : 80)
            }
            .animation(.easeInOut(duration: 5).repeatForever(autoreverses: true), value: isAnimating)

            VStack(spacing: 0) {
                // Top Header Bar (Brand + Skip Button)
                HStack {
                    HStack(spacing: 8) {
                        ZStack {
                            Circle()
                                .fill(
                                    LinearGradient(
                                        colors: [AppTheme.primary, Color(red: 1.0, green: 0.6, blue: 0.2)],
                                        startPoint: .topLeading,
                                        endPoint: .bottomTrailing
                                    )
                                )
                                .frame(width: 36, height: 36)

                            Image(systemName: "fork.knife")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                        }

                        VStack(alignment: .leading, spacing: 0) {
                            HStack(spacing: 2) {
                                Text("GOURMET")
                                    .font(.system(size: 16, weight: .black, design: .rounded))
                                    .foregroundColor(.white)
                                    .tracking(2)
                                Text("BITE")
                                    .font(.system(size: 16, weight: .bold, design: .rounded))
                                    .foregroundColor(AppTheme.primary)
                                    .tracking(2)
                            }
                            Text("Artisanal Express Dining")
                                .font(.system(size: 9, weight: .semibold))
                                .foregroundColor(Color.white.opacity(0.5))
                        }
                    }

                    Spacer()

                    // Skip Button
                    Button(action: {
                        triggerHaptic()
                        onStart()
                    }) {
                        Text("Skip")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color.white.opacity(0.7))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 7)
                            .background(.ultraThinMaterial)
                            .background(Color.white.opacity(0.08))
                            .clipShape(Capsule())
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 16)

                Spacer(minLength: 10)

                // Swipeable Food Showcase Carousel
                TabView(selection: $currentSlide) {
                    ForEach(slides) { slide in
                        slideHeroView(slide: slide)
                            .tag(slide.id)
                    }
                }
                #if os(iOS)
                .tabViewStyle(.page(indexDisplayMode: .never))
                #endif
                .frame(height: 330)

                // Slide Progress Pill Indicators
                HStack(spacing: 8) {
                    ForEach(0..<slides.count, id: \.self) { idx in
                        Capsule()
                            .fill(currentSlide == idx ? slides[currentSlide].accentColor : Color.white.opacity(0.2))
                            .frame(width: currentSlide == idx ? 28 : 8, height: 8)
                            .animation(.spring(response: 0.4, dampingFraction: 0.7), value: currentSlide)
                    }
                }
                .padding(.vertical, 12)

                Spacer(minLength: 10)

                // Animated Headlines
                VStack(spacing: 8) {
                    // Tag Badge
                    Text(slides[currentSlide].tag)
                        .font(.system(size: 10, weight: .heavy))
                        .foregroundColor(slides[currentSlide].accentColor)
                        .tracking(1.5)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(slides[currentSlide].accentColor.opacity(0.15))
                        .clipShape(Capsule())

                    Text(slides[currentSlide].titlePrefix)
                        .font(.system(size: 26, weight: .bold, design: .rounded))
                        .foregroundColor(.white)

                    Text(slides[currentSlide].titleHighlight)
                        .font(.system(size: 32, weight: .black, design: .rounded))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color.white, slides[currentSlide].accentColor, Color(red: 1.0, green: 0.7, blue: 0.3)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)

                    Text(slides[currentSlide].subtitle)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color.white.opacity(0.7))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)
                        .lineSpacing(3)
                        .frame(height: 48, alignment: .top)
                }
                .animation(.easeInOut(duration: 0.3), value: currentSlide)

                Spacer(minLength: 20)

                // Bottom Action CTA Button
                VStack(spacing: 12) {
                    Button(action: {
                        triggerHaptic()
                        if currentSlide < slides.count - 1 {
                            withAnimation(.spring(response: 0.5, dampingFraction: 0.8)) {
                                currentSlide += 1
                            }
                        } else {
                            onStart()
                        }
                    }) {
                        HStack(spacing: 12) {
                            Text(currentSlide == slides.count - 1 ? "Start Exploring Menu" : "Next Delicious Dish")
                                .font(.system(size: 17, weight: .bold, design: .rounded))
                                .foregroundColor(.white)

                            Image(systemName: "arrow.right")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                                .offset(x: pulseButton ? 4 : 0)
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 56)
                        .background(
                            LinearGradient(
                                colors: [
                                    slides[currentSlide].accentColor,
                                    Color(red: 0.95, green: 0.35, blue: 0.08)
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLarge, style: .continuous))
                        .shadow(color: slides[currentSlide].accentColor.opacity(0.45), radius: 20, x: 0, y: 8)
                        .overlay(
                            RoundedRectangle(cornerRadius: AppTheme.radiusLarge, style: .continuous)
                                .stroke(Color.white.opacity(0.3), lineWidth: 1)
                        )
                    }
                    .padding(.horizontal, 24)

                    // Footer Assurance
                    HStack(spacing: 16) {
                        HStack(spacing: 5) {
                            Image(systemName: "bolt.badge.clock.fill")
                                .font(.system(size: 11))
                            Text("Fast Delivery")
                                .font(.system(size: 11, weight: .semibold))
                        }

                        Circle().fill(Color.white.opacity(0.2)).frame(width: 4, height: 4)

                        HStack(spacing: 5) {
                            Image(systemName: "lock.shield.fill")
                                .font(.system(size: 11))
                            Text("100% Anonymous")
                                .font(.system(size: 11, weight: .semibold))
                        }

                        Circle().fill(Color.white.opacity(0.2)).frame(width: 4, height: 4)

                        HStack(spacing: 5) {
                            Image(systemName: "gift.fill")
                                .font(.system(size: 11))
                            Text("Free > $50")
                                .font(.system(size: 11, weight: .semibold))
                        }
                    }
                    .foregroundColor(Color.white.opacity(0.55))
                    .padding(.bottom, 12)
                }
            }
        }
        .onAppear {
            isAnimating = true
            withAnimation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true)) {
                pulseButton = true
            }
            withAnimation(.easeInOut(duration: 2.5).repeatForever(autoreverses: true)) {
                floatOffset1 = -7
            }
            withAnimation(.easeInOut(duration: 3.0).repeatForever(autoreverses: true)) {
                floatOffset2 = 7
            }
            withAnimation(.easeInOut(duration: 2.2).repeatForever(autoreverses: true)) {
                floatOffset3 = -5
            }
        }
    }

    // Single Slide Showcase Hero
    @ViewBuilder
    private func slideHeroView(slide: OnboardingSlide) -> some View {
        ZStack {
            // Rotating Outer Accent Ring
            Circle()
                .stroke(
                    AngularGradient(
                        colors: [slide.accentColor, Color.clear, slide.accentColor.opacity(0.6), Color.clear, slide.accentColor],
                        center: .center
                    ),
                    lineWidth: 2.5
                )
                .frame(width: 275, height: 275)
                .rotationEffect(.degrees(isAnimating ? 360 : 0))
                .animation(.linear(duration: 18).repeatForever(autoreverses: false), value: isAnimating)

            // Outer Glow Circle
            Circle()
                .fill(slide.accentColor.opacity(0.12))
                .frame(width: 260, height: 260)

            // Gourmet Food Image
            AsyncFoodImage(
                urlString: slide.image,
                height: 235,
                cornerRadius: 117.5
            )
            .frame(width: 235, height: 235)
            .clipShape(Circle())
            .shadow(color: slide.accentColor.opacity(0.35), radius: 24, x: 0, y: 12)
            .overlay(
                Circle()
                    .stroke(Color.white.opacity(0.2), lineWidth: 2)
            )

            // Floating Badge 1: Rating (Top Left)
            HStack(spacing: 5) {
                Image(systemName: "star.fill")
                    .font(.system(size: 12))
                    .foregroundColor(.yellow)
                Text(slide.rating)
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 7)
            .background(.ultraThinMaterial)
            .background(Color.black.opacity(0.45))
            .clipShape(Capsule())
            .overlay(Capsule().stroke(Color.white.opacity(0.2), lineWidth: 1))
            .shadow(color: Color.black.opacity(0.3), radius: 8, x: 0, y: 4)
            .offset(x: -95, y: -100 + floatOffset1)

            // Floating Badge 2: Delivery Speed (Bottom Right)
            HStack(spacing: 5) {
                Image(systemName: "bolt.fill")
                    .font(.system(size: 12))
                    .foregroundColor(slide.accentColor)
                Text(slide.deliveryTime)
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 7)
            .background(.ultraThinMaterial)
            .background(Color.black.opacity(0.45))
            .clipShape(Capsule())
            .overlay(Capsule().stroke(Color.white.opacity(0.2), lineWidth: 1))
            .shadow(color: Color.black.opacity(0.3), radius: 8, x: 0, y: 4)
            .offset(x: 88, y: 90 + floatOffset2)

            // Floating Badge 3: Highlight Pill (Bottom Left)
            Text(slide.floatingPill)
                .font(.system(size: 11, weight: .bold))
                .foregroundColor(.white)
                .padding(.horizontal, 11)
                .padding(.vertical, 7)
                .background(.ultraThinMaterial)
                .background(Color.black.opacity(0.45))
                .clipShape(Capsule())
                .overlay(Capsule().stroke(Color.white.opacity(0.2), lineWidth: 1))
                .shadow(color: Color.black.opacity(0.3), radius: 8, x: 0, y: 4)
                .offset(x: -80, y: 98 + floatOffset3)
        }
        .frame(height: 310)
    }

    private func triggerHaptic() {
        #if os(iOS)
        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()
        #endif
    }
}
