import { getParties } from './order.parties';
import { OrderType } from './order.type';
import { PlayerType } from '../player/player.type';
import { NotAcceptableException } from '@nestjs/common';

describe('parties from order type', () => {
  test('should get ratailer order parties', () => {
    const parties = getParties(OrderType.RetailerOrder);
    expect(parties.receiver).toBe(PlayerType.Retailer);
    expect(parties.sender).toBe(PlayerType.Retailer);
  });

  test('should get wholesaler order parties', () => {
    const parties = getParties(OrderType.WholesalerOrder);
    expect(parties.receiver).toBe(PlayerType.Retailer);
    expect(parties.sender).toBe(PlayerType.Wholesaler);
  });

  test('should get distributor order parties', () => {
    const parties = getParties(OrderType.DistributorOrder);
    expect(parties.receiver).toBe(PlayerType.Wholesaler);
    expect(parties.sender).toBe(PlayerType.Distributor);
  });

  test('should get factory order parties', () => {
    const parties = getParties(OrderType.FactoryOrder);
    expect(parties.receiver).toBe(PlayerType.Distributor);
    expect(parties.sender).toBe(PlayerType.Factory);
  });

  test('should fail if wrong type', () => {
    try {
      getParties('SomeType');
    } catch (e) {
      expect(e).toBeInstanceOf(NotAcceptableException);
    }
  });
});
