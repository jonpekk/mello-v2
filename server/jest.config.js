/* eslint-disable */
import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    ...tsJestTransformCfg,
  },
};