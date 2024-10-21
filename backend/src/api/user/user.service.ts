import { Injectable, Inject } from '@nestjs/common';
import { CreateUserDTO } from './interfaces/create-user.dto';
import { UserSignIn } from './interfaces/userSigin.dto';
import { SupabaseProvider } from 'src/supabase/supabase.service';
import { AuthTokenResponsePassword } from '@supabase/supabase-js';

@Injectable()
export class UserService {
  constructor(
    @Inject(SupabaseProvider)
    private supa: SupabaseProvider,
  ) {}

  getHello(): any {
    return { msg: 'Hi Everyone!!!' };
  }

  async createUser(user: CreateUserDTO): Promise<string | any> {
    try {
      const { data, error } = await this.supa.getClient().auth.signUp({
        email: user.Email,
        password: user.Password,
      });

      if (error) {
        return {
          data: null,
          error: error,
        };
      } else {
        return {
          data: {
            id: data.user.id,
            email: data.user.email,
          },
          error: null,
        };
      }
    } catch (e) {
      console.log(e.message);
      throw e;
    }
  }

  async authenticateUser(user: UserSignIn): Promise<any> {
    try {
      const token: AuthTokenResponsePassword = await this.supa
        .getClient()
        .auth.signInWithPassword({
          email: user.email,
          password: user.password,
        });

      console.log(token);

      if (!token.error) {
        return {
          data: {
            userId: token.data.user.id,
            email: token.data.user.email,
            accessToken: token.data.session.access_token,
          },
          error: null,
        };
      } else {
        return {
          data: {
            id: null,
            email: null,
            access_token: null,
          },
          error: token.error,
        };
      }
    } catch (e) {
      return false;
    }
  }
}
