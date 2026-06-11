/**
 * Deposit Controller Tests (Stripe integration)
 */
import { jest } from "@jest/globals";

const mockUser = {
  findById: jest.fn(),
};
const mockTransaction = {
  create: jest.fn(),
  findOne: jest.fn(),
};
const mockNotification = {
  create: jest.fn(),
};

const mockStripeInstance = {
  checkout: {
    sessions: {
      create: jest.fn(),
    },
  },
};

jest.unstable_mockModule("stripe", () => ({
  default: jest.fn(() => mockStripeInstance),
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

const { createDepositSession, verifyDeposit } = await import(
  "../controllers/depositController.js"
);

function mockReqRes(body = {}, user = { _id: "user123", id: "user123" }) {
  return {
    req: { body, user },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    },
  };
}

beforeEach(() => jest.clearAllMocks());

describe("createDepositSession", () => {
  test("should create a Stripe checkout session", async () => {
    const { req, res } = mockReqRes({ amount: 100 });
    mockStripeInstance.checkout.sessions.create.mockResolvedValue({
      url: "https://checkout.stripe.com/session123",
    });

    await createDepositSession(req, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      session_url: "https://checkout.stripe.com/session123",
    });
  });

  test("should handle Stripe errors with 500", async () => {
    const { req, res } = mockReqRes({ amount: 100 });
    mockStripeInstance.checkout.sessions.create.mockRejectedValue(
      new Error("Stripe error")
    );

    await createDepositSession(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("verifyDeposit", () => {
  test("should verify deposit and update balance", async () => {
    const { req, res } = mockReqRes({ success: "true", amount: "200" });
    mockTransaction.findOne.mockResolvedValue(null); // no duplicate
    const userDoc = { _id: "user123", balance: 100, save: jest.fn() };
    mockUser.findById.mockResolvedValue(userDoc);
    mockTransaction.create.mockResolvedValue({});

    await verifyDeposit(req, res);

    expect(userDoc.balance).toBe(300);
    expect(userDoc.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Deposit successful ",
      })
    );
  });

  test("should skip if transaction already recorded", async () => {
    const { req, res } = mockReqRes({ success: "true", amount: "200" });
    mockTransaction.findOne.mockResolvedValue({ _id: "existing" });

    await verifyDeposit(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Transaction already recorded ",
      })
    );
  });

  test("should return 400 for failed payment", async () => {
    const { req, res } = mockReqRes({ success: "false", amount: "200" });

    await verifyDeposit(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Payment failed or cancelled",
      })
    );
  });

  test("should return 404 if user not found", async () => {
    const { req, res } = mockReqRes({ success: "true", amount: "200" });
    mockTransaction.findOne.mockResolvedValue(null);
    mockUser.findById.mockResolvedValue(null);

    await verifyDeposit(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes({ success: "true", amount: "200" });
    mockTransaction.findOne.mockRejectedValue(new Error("DB error"));

    await verifyDeposit(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
