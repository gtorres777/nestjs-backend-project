import {Stadistics} from "src/userProfile/interface/stadistics.interface";
import {VideoReference} from "src/userProfile/interface/user-profile.interface";

export interface BaseResponse {
  status: number,
  message: string,
  data?: VideoReference[]
  stadistics?: Stadistics
}
