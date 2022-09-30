import { excelResponseDto } from "./dto/excelResponseDto";

export interface IUploadService {
    uploadExcel(filePath : string): Promise<excelResponseDto>,
}