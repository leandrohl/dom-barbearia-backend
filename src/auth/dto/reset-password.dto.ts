import { IsString, Matches, MinLength } from 'class-validator';
import { MessagesHelper } from '../../helpers/messages.helper';
import { RegExHelper } from '../../helpers/regex.helper';

export class ResetPasswordDto {
  @IsString()
  resetToken: string;

  @IsString()
  @MinLength(6)
  @Matches(RegExHelper.password, {
    message: MessagesHelper.PASSWORD_VALID,
  })
  newPassword: string;
}
