/**
 * Admin Transaction Controller Tests
 */
import { jest } from "@jest/globals";

const mockTransaction = {
  find: jest.fn(),
};

jest.unstable_mockModule("../models/transactionModel.js", () => ({
  default: mockTransaction,
}));
jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: {},
}));

const { getAllTransaction } = await import(
  "../controllers/adminTransactionController.js"
);

function mockReqRes() {
  return {
    req: {},
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    },
  };
}

beforeEach(() => jest.clearAllMocks());

describe("getAllTransaction", () => {
  test("should return all transactions with populated user", async () => {
    const { req, res } = mockReqRes();
    const transactions = [
      { _id: "t1", type: "deposit", amount: 100, user: { name: "Alice", email: "a@test.com" } },
      { _id: "t2", type: "transfer", amount: 50, user: { name: "Bob", email: "b@test.com" } },
    ];
    mockTransaction.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(transactions),
      }),
    });

    await getAllTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: transactions,
    });
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes();
    mockTransaction.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("DB error")),
      }),
    });

    await getAllTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  test("should return empty array when no transactions", async () => {
    const { req, res } = mockReqRes();
    mockTransaction.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      }),
    });

    await getAllTransaction(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [],
    });
  });
});
