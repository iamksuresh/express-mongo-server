import "reflect-metadata";
import request from "supertest";
import mongoose from "mongoose";
import path from "path";

import { iocContainer } from "../../src/applicationSetup/iocContainer";
import { startTestService } from "../__setup__/testServer";
import { InvalidFileType, InvalidItems, InvalidKeyName, NoFileUploadedError, ValidItems } from "../__fixtures__/excelUpload.fixtures";

describe(" Test Upload Excel API", () => {
  let app: any;
  beforeAll(async () => {
    console.log("test  ", process.env.MONGO_DB_URI);
    /* Connecting to the database and server before each test. */
    app = await startTestService(iocContainer);
  });

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_DB_URI || "");
  });

  afterEach(async () => {
    /* Closing database connection after each test. */
    jest.resetAllMocks();
    await mongoose.connection.close();
  });

  describe("happy path", () => {
    // all_rows_valid.xlsx
    it("Should process excel file and return exceptions (invalid rows) ", async () => {
      const response = await request(app).post("/upload/excel").attach("file", path.resolve(__dirname, "../__fixtures__/static/file.xls"));

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(InvalidItems);
    });

    it("Should process excel file and success message ", async () => {
      const response = await request(app).post("/upload/excel").attach("file", path.resolve(__dirname, "../__fixtures__/static/all_rows_valid.xlsx"));

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(ValidItems);
    });
  });

  describe("negative path", () => {
    it("Should test upload api with No params attached ", async () => {
      const response = await request(app).post("/upload/excel");

      expect(response.status).toEqual(500);
      expect(response.body).toEqual(NoFileUploadedError);
    });

    it("Should throw error when excel file is not uploaded ", async () => {
      const response = await request(app).post("/upload/excel").attach("file", path.resolve(__dirname, "../__fixtures__/static/non_supported_file.txt"));

      expect(response.status).toEqual(400);
      expect(response.body).toEqual(InvalidFileType);
    });

    it("Should throw error when form-data key is not `file` ", async () => {
      const response = await request(app).post("/upload/excel").attach("testfile", path.resolve(__dirname, "../__fixtures__/static/file.xls"));

      expect(response.status).toEqual(500);
      expect(response.body).toEqual(InvalidKeyName);
    });
  });
});
