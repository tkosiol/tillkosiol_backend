"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './src/db/schema/index.ts',
    out: './src/db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'postgresql://tillo:password@localhost:5432/tillkosiol',
    },
    verbose: true,
    strict: true,
});
//# sourceMappingURL=drizzle.config.js.map