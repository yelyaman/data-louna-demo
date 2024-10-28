import { Type } from "class-transformer"
import { IsNumber, IsNotEmpty, IsUUID, IsString, IsDefined, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator"

class PaymentInfo {
    @IsNotEmpty()
    @IsString()
    method: string
}

export class BuySkinDto {
    @IsNotEmpty()
    @IsUUID()
    skinId: string

    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @IsDefined()
    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => PaymentInfo)
    payment_info: PaymentInfo
}