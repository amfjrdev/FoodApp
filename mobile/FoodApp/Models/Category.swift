import Foundation

public struct Category: Identifiable, Codable, Hashable, Sendable {
    public let id: String
    public let name: String
    public let image: String
    public let sortOrder: Int?
    public let isActive: Bool?

    public init(
        id: String,
        name: String,
        image: String,
        sortOrder: Int? = 0,
        isActive: Bool? = true
    ) {
        self.id = id
        self.name = name
        self.image = image
        self.sortOrder = sortOrder
        self.isActive = isActive
    }

    enum CodingKeys: String, CodingKey {
        case id = "_id"
        case fallbackId = "id"
        case name
        case image
        case sortOrder
        case isActive
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
        self.image = try container.decode(String.self, forKey: .image)
        self.sortOrder = try? container.decode(Int.self, forKey: .sortOrder)
        self.isActive = try? container.decode(Bool.self, forKey: .isActive)
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .fallbackId)
        try container.encode(name, forKey: .name)
        try container.encode(image, forKey: .image)
        try container.encodeIfPresent(sortOrder, forKey: .sortOrder)
        try container.encodeIfPresent(isActive, forKey: .isActive)
    }
}
