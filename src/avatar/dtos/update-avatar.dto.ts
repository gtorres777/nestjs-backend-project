import { PartialType } from "@nestjs/mapped-types";
import { BuyAvatarSetDto, CreateAvatarDto } from "./avatar.dto";

export class UpdateAvatarDto extends PartialType(CreateAvatarDto) {}
export class UpdateBuyAvatarDto extends PartialType(BuyAvatarSetDto) {}
