import Foundation

public struct FoodCategoryInfo: Codable, Hashable, Sendable {
    public let id: String?
    public let name: String?
    public let image: String?

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case fallbackId = "id"
        case name
        case image
    }

    public init(id: String? = nil, name: String? = nil, image: String? = nil) {
        self.id = id
        self.name = name
        self.image = image
    }

    public init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = (try? container.decode(String.self, forKey: .id)) ?? (try? container.decode(String.self, forKey: .fallbackId))
        self.name = try? container.decode(String.self, forKey: .name)
        self.image = try? container.decode(String.self, forKey: .image)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encodeIfPresent(id, forKey: .id)
        try container.encodeIfPresent(name, forKey: .name)
        try container.encodeIfPresent(image, forKey: .image)
    }
}

public struct Food: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let categoryId: String?
    public let categoryName: String?
    public let name: String
    public let description: String
    public let price: Double
    public let image: String
    public let isAvailable: Bool

    public init(
        id: String,
        categoryId: String? = nil,
        categoryName: String? = nil,
        name: String,
        description: String,
        price: Double,
        image: String,
        isAvailable: Bool = true
    ) {
        self.id = id
        self.categoryId = categoryId
        self.categoryName = categoryName
        self.name = name
        self.description = description
        self.price = price
        self.image = image
        self.isAvailable = isAvailable
    }

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case fallbackId = "id"
        case categoryId
        case name
        case description
        case price
        case image
        case isAvailable
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

        self.name = try container.decode(String.self, forKey: .name)
        self.description = try container.decode(String.self, forKey: .description)
        self.price = try container.decode(Double.self, forKey: .price)
        self.image = try container.decode(String.self, forKey: .image)
        self.isAvailable = (try? container.decode(Bool.self, forKey: .isAvailable)) ?? true

        // Category may be decoded either as string ID or as populated Object
        if let catObj = try? container.decode(FoodCategoryInfo.self, forKey: .categoryId) {
            self.categoryId = catObj.id
            self.categoryName = catObj.name
        } else if let catStr = try? container.decode(String.self, forKey: .categoryId) {
            self.categoryId = catStr
            self.categoryName = nil
        } else {
            self.categoryId = nil
            self.categoryName = nil
        }
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encode(description, forKey: .description)
        try container.encode(price, forKey: .price)
        try container.encode(image, forKey: .image)
        try container.encode(isAvailable, forKey: .isAvailable)
        try container.encodeIfPresent(categoryId, forKey: .categoryId)
    }
}
