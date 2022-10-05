import { Container } from "inversify";
import { UserRepository } from "./implementation/UserRepository";
import { IUserRepository } from "./IUserRepository";
import { types as repositoryTypes } from "./types";

export async function configureRepositories(
  container: Container
): Promise<Container> {
  container
    .bind<IUserRepository>(repositoryTypes.IUserRepository)
    .to(UserRepository);
  return container;
}
