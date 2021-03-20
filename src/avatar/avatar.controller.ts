import { Controller } from '@nestjs/common';
import { AvatarService } from './avatar.service';

@Controller('avatar')
export class AvatarController {

    constructor(private service: AvatarService) {}


}
