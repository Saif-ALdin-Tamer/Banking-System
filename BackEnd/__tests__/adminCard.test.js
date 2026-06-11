/**
 * Admin Card Controller Tests
 */
import { jest } from "@jest/globals";

const mockCard = {
  find: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

jest.unstable_mockModule("../models/cardModel.js", () => ({
  default: mockCard,
}));
jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: {},
}));

const { getAllCards, deleteCard } = await import(
  "../controllers/adminCardControllers.js"
);

function mockReqRes(params = {}) {
  return {
    req: { params },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    },
  };
}

beforeEach(() => jest.clearAllMocks());

describe("getAllCards", () => {
  test("should return all cards with populated user", async () => {
    const { req, res } = mockReqRes();
    const cards = [
      { _id: "c1", cardNumber: "4000111122223333", user: { name: "Alice", email: "a@test.com" } },
    ];
    mockCard.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(cards),
    });

    await getAllCards(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(cards);
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes();
    mockCard.find.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await getAllCards(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("deleteCard", () => {
  test("should delete card successfully", async () => {
    const { req, res } = mockReqRes({ id: "card123" });
    mockCard.findByIdAndDelete.mockResolvedValue({ _id: "card123" });

    await deleteCard(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Card deleted successfully" });
  });

  test("should return 404 if card not found", async () => {
    const { req, res } = mockReqRes({ id: "nonexistent" });
    mockCard.findByIdAndDelete.mockResolvedValue(null);

    await deleteCard(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes({ id: "card123" });
    mockCard.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

    await deleteCard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
