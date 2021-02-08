import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { GameSession } from '../session/gameSession.entity';

describe('should validate user', () => {
  let authService: AuthService;
  const gameSession = new GameSession('session name', '1234');

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'GameSessionService',
          useValue: {
            getOneByName: jest
              .fn()
              .mockReturnValue(Promise.resolve(gameSession)),
          },
        },
      ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  it('should validate user correctly', async () => {
    const authResult = await authService.validateSession(
      'session name',
      '1234',
    );

    expect(authResult.name).toBe(gameSession.name);
  });

  it('should fail validation return null', async () => {
    const authResult = await authService.validateSession('session 1', '123');

    expect(authResult).toBeNull();
  });
});
