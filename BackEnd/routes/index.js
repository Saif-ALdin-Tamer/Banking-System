

import express from "express";
import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import cardRoute from "./cardRoute.js";
import depositRoute from "./depositeRoute.js";
import transferRoute from "./transferRoute.js";
import transactionRoute from "./transactionRoute.js";
import notificationRoute from "./notificationRoute.js";
import cardTransactionRoute from "./cardTransactionRoute.js";
import adminUserRoute from "./adminUserRoute.js";
import adminTransactionRoute from "./adminTransactionRoute.js";
import adminCardRoute from "./adminCardRoute.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/cards", cardRoute);
router.use("/deposit", depositRoute);
router.use("/transfer", transferRoute);
router.use("/transactions", transactionRoute);
router.use("/notifications", notificationRoute);
router.use("/card-transactions", cardTransactionRoute);

router.use("/admin/users", adminUserRoute);
router.use("/admin/transactions", adminTransactionRoute);
router.use("/admin/card-transactions", adminCardRoute);

export default router;