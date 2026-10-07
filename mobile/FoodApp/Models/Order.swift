import Foundation

public struct OrderItem: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let foodId: String?
    public let foodNameSnapshot: String
    public let unitPriceSnapshot: Double
    public let quantity: Int
    public let subtotal: Double

    public init(
        id: String = UUID().uuidString,
        foodId: String? = nil,
        foodNameSnapshot: String,
        unitPriceSnapshot: Double,
        quantity: Int,
        subtotal: Double
    ) {
        self.id = id
        self.foodId = foodId
        self.foodNameSnapshot = foodNameSnapshot
        self.unitPriceSnapshot = unitPriceSnapshot
        self.quantity = quantity
        self.subtotal = subtotal
    }

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case fallbackId = "id"
        case foodId
        case foodNameSnapshot
        case unitPriceSnapshot
        case quantity
        case subtotal
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        if let idVal = try? container.decode(String.self, forKey: .id) {
            self.id = idVal
        } else if let fallbackVal = try? container.decode(String.self, forKey: .fallbackId) {
            self.id = fallbackVal
        } else {
            self.id = UUID().uuidString
        }

        self.foodId = try? container.decode(String.self, forKey: .foodId)
        self.foodNameSnapshot = try container.decode(String.self, forKey: .foodNameSnapshot)
        self.unitPriceSnapshot = try container.decode(Double.self, forKey: .unitPriceSnapshot)
        self.quantity = try container.decode(Int.self, forKey: .quantity)
        self.subtotal = try container.decode(Double.self, forKey: .subtotal)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encodeIfPresent(foodId, forKey: .foodId)
        try container.encode(foodNameSnapshot, forKey: .foodNameSnapshot)
        try container.encode(unitPriceSnapshot, forKey: .unitPriceSnapshot)
        try container.encode(quantity, forKey: .quantity)
        try container.encode(subtotal, forKey: .subtotal)
    }
}

public struct Order: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let orderNumber: String
    public let customerName: String
    public let customerPhone: String
    public let deliveryAddress: String
    public let notes: String?
    public let subtotal: Double
    public let deliveryFee: Double
    public let total: Double
    public let status: OrderStatus
    public let items: [OrderItem]
    public let createdAt: String?

    public init(
        id: String,
        orderNumber: String,
        customerName: String,
        customerPhone: String,
        deliveryAddress: String,
        notes: String? = nil,
        subtotal: Double,
        deliveryFee: Double,
        total: Double,
        status: OrderStatus = .pending,
        items: [OrderItem] = [],
        createdAt: String? = nil
    ) {
        self.id = id
        self.orderNumber = orderNumber
        self.customerName = customerName
        self.customerPhone = customerPhone
        self.deliveryAddress = deliveryAddress
        self.notes = notes
        self.subtotal = subtotal
        self.deliveryFee = deliveryFee
        self.total = total
        self.status = status
        self.items = items
        self.createdAt = createdAt
    }

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case fallbackId = "id"
        case orderNumber
        case customerName
        case customerPhone
        case deliveryAddress
        case notes
        case subtotal
        case deliveryFee
        case total
        case status
        case items
        case createdAt
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        if let idVal = try? container.decode(String.self, forKey: .id) {
            self.id = idVal
        } else if let fallbackVal = try? container.decode(String.self, forKey: .fallbackId) {
            self.id = fallbackVal
        } else {
            self.id = UUID().uuidString
        }

        self.orderNumber = try container.decode(String.self, forKey: .orderNumber)
        self.customerName = try container.decode(String.self, forKey: .customerName)
        self.customerPhone = try container.decode(String.self, forKey: .customerPhone)
        self.deliveryAddress = try container.decode(String.self, forKey: .deliveryAddress)
        self.notes = try? container.decode(String.self, forKey: .notes)
        self.subtotal = try container.decode(Double.self, forKey: .subtotal)
        self.deliveryFee = try container.decode(Double.self, forKey: .deliveryFee)
        self.total = try container.decode(Double.self, forKey: .total)
        self.status = (try? container.decode(OrderStatus.self, forKey: .status)) ?? .pending
        self.items = (try? container.decode([OrderItem].self, forKey: .items)) ?? []
        self.createdAt = try? container.decode(String.self, forKey: .createdAt)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(orderNumber, forKey: .orderNumber)
        try container.encode(customerName, forKey: .customerName)
        try container.encode(customerPhone, forKey: .customerPhone)
        try container.encode(deliveryAddress, forKey: .deliveryAddress)
        try container.encodeIfPresent(notes, forKey: .notes)
        try container.encode(subtotal, forKey: .subtotal)
        try container.encode(deliveryFee, forKey: .deliveryFee)
        try container.encode(total, forKey: .total)
        try container.encode(status, forKey: .status)
        try container.encode(items, forKey: .items)
        try container.encodeIfPresent(createdAt, forKey: .createdAt)
    }
}
