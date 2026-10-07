import SwiftUI

public struct OrderHistoryListView: View {
    @EnvironmentObject private var historyStore: OrderHistoryStore
    @State private var manualOrderNumber: String = ""
    @State private var selectedOrderNumber: String? = nil
    @State private var showingTracking = false
    @State private var showingOnboardingSheet = false

    public var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                ScrollView(.vertical, showsIndicators: false) {
                    VStack(spacing: 20) {
                        // Manual Lookup Box
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Track by Order Number")
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(AppTheme.textPrimary)

                            HStack {
                                Image(systemName: "magnifyingglass")
                                    .foregroundColor(AppTheme.textMuted)

                                TextField("e.g. FD-849201", text: $manualOrderNumber)
                                    .font(.system(size: 14, design: .monospaced))
                                    .autocorrectionDisabled()
                                    #if os(iOS)
                                    .textInputAutocapitalization(.characters)
                                    #endif

                                if !manualOrderNumber.isEmpty {
                                    Button(action: {
                                        let clean = manualOrderNumber.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
                                        selectedOrderNumber = clean
                                        showingTracking = true
                                    }) {
                                        Text("Track")
                                            .font(.system(size: 13, weight: .bold))
                                            .foregroundColor(.white)
                                            .padding(.horizontal, 14)
                                            .padding(.vertical, 7)
                                            .background(AppTheme.primary)
                                            .clipShape(Capsule())
                                    }
                                }
                            }
                            .padding(12)
                            .background(Color.white)
                            .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusSmall))
                            .overlay(
                                RoundedRectangle(cornerRadius: AppTheme.radiusSmall)
                                    .stroke(AppTheme.border, lineWidth: 1)
                            )
                        }
                        .padding(16)
                        .appCardStyle()

                        // Saved Orders Section
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Recent Device Orders")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(AppTheme.textPrimary)

                            if historyStore.savedOrderNumbers.isEmpty {
                                EmptyStateView(
                                    icon: "clock.arrow.circlepath",
                                    title: "No Orders Yet",
                                    message: "Orders placed on this device will automatically appear here for convenient tracking."
                                )
                                .frame(minHeight: 200)
                            } else {
                                ForEach(historyStore.savedOrderNumbers, id: \.self) { orderNum in
                                    Button(action: {
                                        selectedOrderNumber = orderNum
                                        showingTracking = true
                                    }) {
                                        HStack {
                                            ZStack {
                                                Circle()
                                                    .fill(AppTheme.primaryLight)
                                                    .frame(width: 44, height: 44)

                                                Image(systemName: "takeoutbag.and.cup.and.straw.fill")
                                                    .font(.system(size: 18))
                                                    .foregroundColor(AppTheme.primary)
                                            }

                                            VStack(alignment: .leading, spacing: 2) {
                                                Text(orderNum)
                                                    .font(.system(size: 16, weight: .heavy, design: .monospaced))
                                                    .foregroundColor(AppTheme.textPrimary)

                                                Text("Tap to view live timeline")
                                                    .font(.system(size: 12))
                                                    .foregroundColor(AppTheme.textSecondary)
                                            }

                                            Spacer()

                                            Image(systemName: "chevron.right")
                                                .font(.system(size: 14, weight: .bold))
                                                .foregroundColor(AppTheme.textMuted)
                                        }
                                        .padding(14)
                                        .appCardStyle()
                                    }
                                    .buttonStyle(.plain)
                                }
                            }
                        }

                        Spacer().frame(height: 30)
                    }
                    .padding(.horizontal)
                    .padding(.top, 16)
                }
            }
            .navigationTitle("My Orders")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button(action: {
                        showingOnboardingSheet = true
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: "sparkles")
                            Text("Intro Tour")
                        }
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(AppTheme.primary)
                    }
                }
            }
            .sheet(isPresented: $showingOnboardingSheet) {
                OnboardingView {
                    showingOnboardingSheet = false
                }
            }
            .navigationDestination(isPresented: $showingTracking) {
                if let num = selectedOrderNumber {
                    OrderTrackingView(orderNumber: num)
                }
            }
        }
    }
}
