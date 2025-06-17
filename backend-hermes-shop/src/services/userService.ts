import { StatusCodes } from '~/configs/statusCodes';
import NextError from '~/helpers/nextError';
import pickUser from '~/helpers/pickUser';
import { UserModelRepository } from '~/repositories/implements/UserModelRepository';

export class UserService {
  private userRepository: UserModelRepository;

  constructor() {
    this.userRepository = new UserModelRepository();
  }

  public async getInfo(email: string) {
    const existUser = await this.userRepository.findOneByEmail(email);
    if (!existUser) throw new NextError(StatusCodes.NOT_FOUND, 'User not found!');
    return pickUser(existUser);
  }
}

export const userService = new UserService();
