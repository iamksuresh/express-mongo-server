import { MessageEnum } from "../../src/enum/MessageEnum";

export const NoFileUploadedError = {
  reason: MessageEnum.NO_FILE,
  payload: {},
};

export const InvalidFileType = {
  reason: MessageEnum.UPLOAD_VALID_FILE,
  payload: {},
};

export const InvalidKeyName = { payload: {}, reason: "Server encountered error" };

export const InvalidItems = {
  reason: "invalid / missing values",
  payload: [
    {
      username: "SSN",
      university: "National University of Singapore",
    },
    {
      username: "SRM",
      email: "c@b.com",
    },
  ],
};

export const ValidItems = {
  reason: "items uploaded successfully",
  payload: [],
};
