import SwiftUI

public struct OnboardingView: View {
    public let onStart: () -> Void

    @State private var isAnimating = false
    @State private var pulseButton = false
    @State private var floatOffset1: CGFloat = 0
    @State private var floatOffset2: CGFloat = 0
    @State private var floatOffset3: CGFloat = 0

    public init(onStart: @escaping () -> Void) {
        self.onStart = onStart
    }

    public var body: some View {
        ZStack {
            // Dark luxury background
            Color(red: 0.05, green: 0.07, blue: 0.12)
                .ignoresSafeArea()

            // Ambient background glow orbs
            ZStack {
                Circle()
                    .fill(AppTheme.primary.opacity(0.25))
                    .frame(width: 320, height: 320)
                    .blur(radius: 80)
                    .offset(x: isAnimating ? -80 : 80, y: isAnimating ? -180 : -120)

                Circle()
                    .fill(Color(red: 0.95, green: 0.3, blue: 0.2).opacity(0.2))
                    .frame(width: 280, height: 280)
                    .blur(radius: 70)
                    .offset(x: isAnimating ? 90 : -90, y: isAnimating ? 120 : 60)
            }
            .animation(.easeInOut(duration: 6).repeatForever(autoreverses: true), value: isAnimating)

            VStack(spacing: 0) {
                // Top Brand Header
                HStack(spacing: 8) {
                    Image(systemName: "fork.knife.circle.fill")
                        .font(.system(size: 28))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [AppTheme.primary, Color(red: 1.0, green: 0.65, blue: 0.2)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )

                    Text("GOURMET")
                        .font(.system(size: 20, weight: .black, design: .rounded))
                        .foregroundColor(.white)
                        .tracking(3)

                    Text("BITE")
                        .font(.system(size: 20, weight: .light, design: .rounded))
                        .foregroundColor(AppTheme.primary)
                        .tracking(3)
                }
                .padding(.top, 24)
                .opacity(isAnimating ? 1 : 0)
                .offset(y: isAnimating ? 0 : -20)
                .animation(.easeOut(duration: 0.8), value: isAnimating)

                Spacer(minLength: 10)

                // Hero Image Showcase with Floating Badges
                ZStack {
                    // Glowing outer ring
                    Circle()
                        .stroke(
                            LinearGradient(
                                colors: [AppTheme.primary.opacity(0.6), Color.clear, AppTheme.primary.opacity(0.3)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            ),
                            lineWidth: 2
                        )
                        .frame(width: 280, height: 280)
                        .scaleEffect(isAnimating ? 1.05 : 0.95)
                        .animation(.easeInOut(duration: 3).repeatForever(autoreverses: true), value: isAnimating)

                    // Hero Food Image
                    AsyncFoodImage(
                        urlString: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
                        height: 250,
                        cornerRadius: 125
                    )
                    .frame(width: 250, height: 250)
                    .clipShape(Circle())
                    .shadow(color: AppTheme.primary.opacity(0.35), radius: 25, x: 0, y: 12)
                    .scaleEffect(isAnimating ? 1 : 0.8)
                    .opacity(isAnimating ? 1 : 0)
                    .animation(.spring(response: 0.9, dampingFraction: 0.7), value: isAnimating)

                    // Floating Badge 1: Rating (Top Left)
                    HStack(spacing: 6) {
                        Image(systemName: "star.fill")
                            .font(.system(size: 13))
                            .foregroundColor(.yellow)
                        Text("4.9 (3.5k+)")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(.ultraThinMaterial)
                    .background(Color.black.opacity(0.4))
                    .clipShape(Capsule())
                    .overlay(
                        Capsule().stroke(Color.white.opacity(0.15), lineWidth: 1)
                    )
                    .shadow(color: Color.black.opacity(0.3), radius: 10, x: 0, y: 5)
                    .offset(x: -95, y: -110 + floatOffset1)

                    // Floating Badge 2: Fast Delivery (Bottom Right)
                    HStack(spacing: 6) {
                        Image(systemName: "bolt.fill")
                            .font(.system(size: 13))
                            .foregroundColor(AppTheme.primary)
                        Text("25-35 min")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(.ultraThinMaterial)
                    .background(Color.black.opacity(0.4))
                    .clipShape(Capsule())
                    .overlay(
                        Capsule().stroke(Color.white.opacity(0.15), lineWidth: 1)
                    )
                    .shadow(color: Color.black.opacity(0.3), radius: 10, x: 0, y: 5)
                    .offset(x: 90, y: 95 + floatOffset2)

                    // Floating Badge 3: Free Delivery (Bottom Left)
                    HStack(spacing: 6) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 13))
                            .foregroundColor(.green)
                        Text("Free > $50")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .background(.ultraThinMaterial)
                    .background(Color.black.opacity(0.4))
                    .clipShape(Capsule())
                    .overlay(
                        Capsule().stroke(Color.white.opacity(0.15), lineWidth: 1)
                    )
                    .shadow(color: Color.black.opacity(0.3), radius: 10, x: 0, y: 5)
                    .offset(x: -85, y: 105 + floatOffset3)
                }
                .frame(height: 300)

                Spacer(minLength: 15)

                // Headline & Subtitle
                VStack(spacing: 12) {
                    Text("Craving Something")
                        .font(.system(size: 28, weight: .bold, design: .rounded))
                        .foregroundColor(.white)

                    Text("Extraordinary?")
                        .font(.system(size: 34, weight: .black, design: .rounded))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [Color(red: 1.0, green: 0.65, blue: 0.2), AppTheme.primary, Color(red: 1.0, green: 0.35, blue: 0.15)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )

                    Text("Artisanal chef-crafted meals delivered directly to your door with zero-friction anonymous checkout.")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color.white.opacity(0.7))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)
                        .lineSpacing(4)
                }
                .opacity(isAnimating ? 1 : 0)
                .offset(y: isAnimating ? 0 : 30)
                .animation(.easeOut(duration: 0.8).delay(0.2), value: isAnimating)

                Spacer(minLength: 25)

                // Bottom Action CTA Button
                VStack(spacing: 14) {
                    Button(action: {
                        #if os(iOS)
                        let generator = UIImpactFeedbackGenerator(style: .medium)
                        generator.impactOccurred()
                        #endif
                        onStart()
                    }) {
                        HStack(spacing: 12) {
                            Text("Get Started")
                                .font(.system(size: 18, weight: .bold, design: .rounded))
                                .foregroundColor(.white)

                            Image(systemName: "arrow.right")
                                .font(.system(size: 17, weight: .bold))
                                .foregroundColor(.white)
                                .offset(x: pulseButton ? 4 : 0)
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 58)
                        .background(
                            LinearGradient(
                                colors: [
                                    Color(red: 1.0, green: 0.48, blue: 0.12),
                                    Color(red: 0.95, green: 0.32, blue: 0.05),
                                    Color(red: 0.85, green: 0.22, blue: 0.05)
                                ],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLarge, style: .continuous))
                        .shadow(color: AppTheme.primary.opacity(0.45), radius: 18, x: 0, y: 8)
                        .overlay(
                            RoundedRectangle(cornerRadius: AppTheme.radiusLarge, style: .continuous)
                                .stroke(Color.white.opacity(0.25), lineWidth: 1)
                        )
                    }
                    .padding(.horizontal, 28)
                    .scaleEffect(isAnimating ? 1 : 0.9)
                    .opacity(isAnimating ? 1 : 0)
                    .animation(.spring(response: 0.8, dampingFraction: 0.7).delay(0.35), value: isAnimating)

                    // Anonymous & Fast Note
                    HStack(spacing: 6) {
                        Image(systemName: "lock.shield.fill")
                            .font(.system(size: 11))
                        Text("100% Anonymous • No Account Required")
                            .font(.system(size: 11, weight: .semibold))
                    }
                    .foregroundColor(Color.white.opacity(0.5))
                    .padding(.bottom, 16)
                }
            }
        }
        .onAppear {
            isAnimating = true
            withAnimation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true)) {
                pulseButton = true
            }
            withAnimation(.easeInOut(duration: 2.5).repeatForever(autoreverses: true)) {
                floatOffset1 = -8
            }
            withAnimation(.easeInOut(duration: 3.0).repeatForever(autoreverses: true)) {
                floatOffset2 = 8
            }
            withAnimation(.easeInOut(duration: 2.2).repeatForever(autoreverses: true)) {
                floatOffset3 = -6
            }
        }
    }
}
