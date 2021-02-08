import { Test, TestingModule } from '@nestjs/testing';
import { GameSession } from '../session/gameSession.entity';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('should validate user', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;
  const gameSession = new GameSession('session name', '1234');

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: 'AuthService',
          useValue: {
            validateSession: jest
              .fn()
              .mockReturnValue(Promise.resolve(gameSession)),
          },
        },
      ],
    }).compile();

    localStrategy = app.get<LocalStrategy>(LocalStrategy);
    authService = app.get<AuthService>(AuthService);
  });

  test('should validate user correctly', async () => {
    const authResult = await localStrategy.validate('session name', '1234');

    expect(authResult.name).toBe(gameSession.name);
  });

  test('should fail validation return null', async () => {
    jest
      .spyOn(authService, 'validateSession')
      .mockImplementation(() => Promise.resolve(null));

    await expect(localStrategy.validate('session 1', '123')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
