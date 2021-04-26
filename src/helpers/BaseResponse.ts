import { User } from "src/user/interface/user.interface";
import {Stadistics} from "src/userProfile/interface/stadistics.interface";
import {VideoReference} from "src/userProfile/interface/user-profile.interface";

export interface BaseResponse {
  status?: number,
  message?: string,
  data?: VideoReference[]
  stadistics?: Stadistics
  user_data?: {}
  video_obtained?: VideoReference
}
