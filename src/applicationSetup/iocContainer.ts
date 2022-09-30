import { Container } from "inversify";

export const iocContainer = new Container({
  defaultScope: "Singleton",
});
