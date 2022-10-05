import { Container } from "inversify";
import { UploadService } from "./implementation/UploadService";
import { IUploadService } from "./IUploadService";
import { types as appServiceTypes } from "./types";

export async function configureServices(
  container: Container
): Promise<Container> {
  container
    .bind<IUploadService>(appServiceTypes.IUploadService)
    .to(UploadService);

  return container;
}
