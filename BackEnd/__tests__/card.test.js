/**
 * Card Controller Tests
 */
import { jest } from "@jest/globals";

const mockCard = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockUser = {
  findById: jest.fn(),
};

jest.unstable_mockModule("../models/cardModel.js", () => ({
  default: mockCard,
}));
jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: mockUser,
}));

const { createCard, getMyCard } = await import(
  "../controllers/cardController.js"
);

function mockReqRes(body = {}, user = { _id: "user123" }) {
  return {
    req: { body, user },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    },
  };
}

beforeEach(() => jest.clearAllMocks());

describe("createCard", () => {
  test("should create a card successfully", async () => {
    const { req, res } = mockReqRes();
    mockCard.findOne.mockResolvedValue(null);
    mockCard.create.mockResolvedValue({
      _id: "card123",
      user: "user123",
      cardNumber: "4000123456789012",
      cvv: "123",
      expiryDate: "06/29",
      balance: 0,
    });

    await createCard(req, res);

    expect(mockCard.create).toHaveBeenCalledWith(
      expect.objectContaining({
        user: "user123",
        cardNumber: expect.any(String),
        cvv: expect.any(String),
        expiryDate: expect.any(String),
      })
    );
    expect(res.json).toHaveBeenCalled();
  });

  test("should return 400 if card already exists", async () => {
    const { req, res } = mockReqRes();
    mockCard.findOne.mockResolvedValue({ _id: "existing-card" });

    await createCard(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Card already exists for this user",
    });
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes();
    mockCard.findOne.mockRejectedValue(new Error("DB error"));

    await createCard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("getMyCard", () => {
  test("should return the user card", async () => {
    const { req, res } = mockReqRes();
    const cardData = {
      _id: "card123",
      cardNumber: "4000123456789012",
      cvv: "123",
      expiryDate: "06/29",
      balance: 100,
    };
    mockCard.findOne.mockResolvedValue(cardData);

    await getMyCard(req, res);

    expect(res.json).toHaveBeenCalledWith(cardData);
  });

  test("should return 404 if card not found", async () => {
    const { req, res } = mockReqRes();
    mockCard.findOne.mockResolvedValue(null);

    await getMyCard(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Card not found" });
  });

  test("should handle unexpected errors with 500", async () => {
    const { req, res } = mockReqRes();
    mockCard.findOne.mockRejectedValue(new Error("DB error"));

    await getMyCard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
