import { userDto } from "./userDto";

export class excelResponseDto {
    reason? : string;
    payload : userDto[];
}