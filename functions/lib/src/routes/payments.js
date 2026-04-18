"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/initialize', async (req, res) => {
    res.json({ message: 'Payments route' });
});
exports.default = router;
//# sourceMappingURL=payments.js.map