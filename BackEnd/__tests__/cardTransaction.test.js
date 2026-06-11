/**
 * Card Transaction Controller Tests
 */
import { jest } from "@jest/globals";

const mockCard = {
  findOne: jest.fn(),
};
const mockUser = {
  findById: jest.fn(),
};
const mockTransaction = {
  create: jest.fn(),
};
const mockNotification = {
  create: jest.fn(),
};

jest.unstable_mockModule("../models/cardModel.js", () => ({
  default: mockCard,
}));
jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: mockUser,
}));
jest.unstable_mockModule("../models/transactionModel.js", () => ({
  default: mockTransaction,
}));
jest.unstable_mockModule("../models/notificationModel.js", () => ({
  default: mockNotification,
}));

const {
  depositToCard,
  withdrawFromCard,
  getCardBalance,
  transferToCard,
  transferToAccount,
} = await import("../controllers/cardTransactionController.js");

function mockReqRes(body = {}, user = { _id: "user123" }) {
  return {
    req: { body, user },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    },
  };
}

beforeEach(() => jest.clearAllMocks());

describe("depositToCard", () => {
  test("should deposit to card successfully", async () => {
    const { req, res } = mockReqRes({ amount: 200 });
    const card = { _id: "c1", balance: 100, cardNumber: "4000111122223333", save: jest.fn() };
    mockCard.findOne.mockResolvedValue(card);
    mockTransaction.create.mockResolvedValue({});
    mockNotification.create.mockResolvedValue({});

    await depositToCard(req, res);

    expect(card.balance).toBe(300);
    expect(card.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true })
    );
  });

  test("should return 400 for invalid amount", async () => {
    const { req, res } = mockReqRes({ amount: 0 });
    await depositToCard(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 for NaN amount", async () => {
    const { req, res } = mockReqRes({ amount: "abc" });
    await depositToCard(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 404 if card not found", async () => {
    const { req, res } = mockReqRes({ amount: 100 });
    mockCard.findOne.mockResolvedValue(null);
    await depositToCard(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("withdrawFromCard", () => {
  test("should withdraw successfully", async () => {
    const { req, res } = mockReqRes({ amount: 50 });
    const card = { _id: "c1", balance: 200, cardNumber: "4000111122223333", save: jest.fn() };
    mockCard.findOne.mockResolvedValue(card);
    mockTransaction.create.mockResolvedValue({});
    mockNotification.create.mockResolvedValue({});

    await withdrawFromCard(req, res);

    expect(card.balance).toBe(150);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 400 for invalid amount", async () => {
    const { req, res } = mockReqRes({ amount: -10 });
    await withdrawFromCard(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 for NaN amount", async () => {
    const { req, res } = mockReqRes({ amount: "xyz" });
    await withdrawFromCard(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 for insufficient balance", async () => {
    const { req, res } = mockReqRes({ amount: 500 });
    const card = { _id: "c1", balance: 100, save: jest.fn() };
    mockCard.findOne.mockResolvedValue(card);
    await withdrawFromCard(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 404 if card not found", async () => {
    const { req, res } = mockReqRes({ amount: 50 });
    mockCard.findOne.mockResolvedValue(null);
    await withdrawFromCard(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("getCardBalance", () => {
  test("should return balance and card number", async () => {
    const { req, res } = mockReqRes();
    mockCard.findOne.mockResolvedValue({ balance: 500, cardNumber: "4000111122223333" });
    await getCardBalance(req, res);
    expect(res.json).toHaveBeenCalledWith({ balance: 500, cardNumber: "4000111122223333" });
  });

  test("should return 404 if card not found", async () => {
    const { req, res } = mockReqRes();
    mockCard.findOne.mockResolvedValue(null);
    await getCardBalance(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("transferToCard", () => {
  test("should transfer from account to card successfully", async () => {
    const { req, res } = mockReqRes({ amount: 100 });
    const user = { _id: "user123", balance: 500, save: jest.fn() };
    const card = { _id: "c1", balance: 200, cardNumber: "4000111122223333", save: jest.fn() };
    mockUser.findById.mockResolvedValue(user);
    mockCard.findOne.mockResolvedValue(card);
    mockTransaction.create.mockResolvedValue({});
    mockNotification.create.mockResolvedValue({});

    await transferToCard(req, res);

    expect(user.balance).toBe(400);
    expect(card.balance).toBe(300);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 400 for insufficient balance", async () => {
    const { req, res } = mockReqRes({ amount: 1000 });
    const user = { _id: "user123", balance: 100, save: jest.fn() };
    const card = { _id: "c1", balance: 200, save: jest.fn() };
    mockUser.findById.mockResolvedValue(user);
    mockCard.findOne.mockResolvedValue(card);
    await transferToCard(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 for invalid amount", async () => {
    const { req, res } = mockReqRes({ amount: 0 });
    await transferToCard(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("transferToAccount", () => {
  test("should transfer from card to account successfully", async () => {
    const { req, res } = mockReqRes({ amount: 150 });
    const user = { _id: "user123", email: "u@test.com", balance: 300, save: jest.fn() };
    const card = { _id: "c1", balance: 500, save: jest.fn() };
    mockUser.findById.mockResolvedValue(user);
    mockCard.findOne.mockResolvedValue(card);
    mockTransaction.create.mockResolvedValue({});
    mockNotification.create.mockResolvedValue({});

    await transferToAccount(req, res);

    expect(card.balance).toBe(350);
    expect(user.balance).toBe(450);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 400 for insufficient card balance", async () => {
    const { req, res } = mockReqRes({ amount: 1000 });
    const user = { _id: "user123", balance: 300, save: jest.fn() };
    const card = { _id: "c1", balance: 100, save: jest.fn() };
    mockUser.findById.mockResolvedValue(user);
    mockCard.findOne.mockResolvedValue(card);
    await transferToAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 404 if user not found", async () => {
    const { req, res } = mockReqRes({ amount: 100 });
    mockUser.findById.mockResolvedValue(null);
    await transferToAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should return 404 if card not found", async () => {
    const { req, res } = mockReqRes({ amount: 100 });
    mockUser.findById.mockResolvedValue({ _id: "user123", balance: 500 });
    mockCard.findOne.mockResolvedValue(null);
    await transferToAccount(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
