/**
 * Transaction Controller Tests
 * Tests for deposit, withdraw, and getTransaction
 */
import { jest } from "@jest/globals";

const mockUser = {
  findById: jest.fn(),
};

const mockTransaction = {
  create: jest.fn(),
  find: jest.fn(),
};

jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: mockUser,
}));

jest.unstable_mockModule("../models/transactionModel.js", () => ({
  default: mockTransaction,
}));

const { deposite, withdraw, getTransaction } = await import(
  "../controllers/transactionController.js"
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

beforeEach(() => {
  jest.clearAllMocks();
});

describe("deposite", () => {
  test("should deposit successfully with valid amount", async () => {
    const { req, res } = mockReqRes({ amount: 100 });
    const mockUserDoc = { _id: "user123", balance: 500, save: jest.fn() };
    mockUser.findById.mockResolvedValue(mockUserDoc);
    mockTransaction.create.mockResolvedValue({});

    await deposite(req, res);

    expect(mockUserDoc.balance).toBe(600);
    expect(mockUserDoc.save).toHaveBeenCalled();
    expect(mockTransaction.create).toHaveBeenCalledWith({
      user: "user123",
      type: "deposit",
      amount: 100,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Deposit successful",
    });
  });

  test("should return 400 for invalid amount (zero)", async () => {
    const { req, res } = mockReqRes({ amount: 0 });
    await deposite(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 for negative amount", async () => {
    const { req, res } = mockReqRes({ amount: -50 });
    await deposite(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 for NaN amount", async () => {
    const { req, res } = mockReqRes({ amount: "abc" });
    await deposite(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 for missing amount", async () => {
    const { req, res } = mockReqRes({});
    await deposite(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 404 if user not found", async () => {
    const { req, res } = mockReqRes({ amount: 100 });
    mockUser.findById.mockResolvedValue(null);
    await deposite(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("withdraw", () => {
  test("should withdraw successfully with valid amount", async () => {
    const { req, res } = mockReqRes({ amount: 100 });
    const mockUserDoc = { _id: "user123", balance: 500, save: jest.fn() };
    mockUser.findById.mockResolvedValue(mockUserDoc);
    mockTransaction.create.mockResolvedValue({});

    await withdraw(req, res);

    expect(mockUserDoc.balance).toBe(400);
    expect(mockUserDoc.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 400 for insufficient balance", async () => {
    const { req, res } = mockReqRes({ amount: 1000 });
    const mockUserDoc = { _id: "user123", balance: 500, save: jest.fn() };
    mockUser.findById.mockResolvedValue(mockUserDoc);

    await withdraw(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Your balance is not enough",
      })
    );
  });

  test("should return 400 for invalid amount", async () => {
    const { req, res } = mockReqRes({ amount: -50 });
    await withdraw(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 404 if user not found", async () => {
    const { req, res } = mockReqRes({ amount: 100 });
    mockUser.findById.mockResolvedValue(null);
    await withdraw(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe("getTransaction", () => {
  test("should return transactions sorted by date", async () => {
    const { req, res } = mockReqRes();
    const mockTransactions = [
      { _id: "t1", type: "deposit", amount: 100 },
      { _id: "t2", type: "withdraw", amount: 50 },
    ];

    mockTransaction.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockTransactions),
    });

    await getTransaction(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockTransactions,
    });
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes();
    mockTransaction.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await getTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
