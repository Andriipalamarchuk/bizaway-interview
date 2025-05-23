import { BizawayService } from './bizaway.service';
import { of, throwError } from 'rxjs';
import { InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { AxiosResponse } from 'axios';

describe('BizawayService', () => {
  let service: BizawayService;
  let httpService: any;
  let configService: any;

  const url = 'URL';
  const apiKey = 'API_KEY';
  const origin = 'SYD';
  const destination = 'GRU';

  beforeEach(async () => {
    httpService = {};
    configService = {};
    service = new BizawayService(httpService, configService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should throw if BIZAWAY_GET_TRIPS_URL is not set', async () => {
    configService.get = jest.fn(() => undefined);

    await expect(service.getTrips('SYD', 'GRU')).rejects.toThrow(
      new InternalServerErrorException('Error on config of application. Check url config'),
    );
    expect(configService.get).toHaveBeenCalledWith('BIZAWAY_GET_TRIPS_URL');
  });

  test('should throw if BIZAWAY_API_KEY is not set', async () => {
    let returnValue = true;
    configService.get = jest.fn(() => {
      if (returnValue) {
        returnValue = false;
        return url;
      }

      return undefined;
    });

    await expect(service.getTrips('SYD', 'GRU')).rejects.toThrow(
      new InternalServerErrorException('Error on config of application. Check api key'),
    );
    expect(configService.get).toHaveBeenCalledWith('BIZAWAY_GET_TRIPS_URL');
    expect(configService.get).toHaveBeenCalledWith('BIZAWAY_API_KEY');
  });

  test('should return mapped trips on successful API call', async () => {
    let firstCall = true;
    configService.get = jest.fn(() => {
      if (firstCall) {
        firstCall = false;
        return url;
      }

      return apiKey;
    });
    const mockResponse: Partial<AxiosResponse> = {
      data: [
        {
          origin: 'SYD',
          destination: 'GRU',
          cost: 100,
          duration: 10,
          type: 'flight',
          display_name: 'from SYD to GRU',
        },
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
    };

    httpService.get = jest.fn(() => of(mockResponse));

    const result = await service.getTrips('SYD', 'GRU');

    expect(result).toEqual([
      {
        origin,
        destination,
        cost: 100,
        duration: 10,
        type: 'flight',
        display_name: undefined,
        displayName: 'from SYD to GRU',
      },
    ]);

    expect(httpService.get).toHaveBeenCalledWith(url, {
      headers: {
        'x-api-key': apiKey,
      },
      params: {
        origin,
        destination,
      },
    });
  });

  test('should throw if API returns invalid data', async () => {
    let firstCall = true;
    configService.get = jest.fn(() => {
      if (firstCall) {
        firstCall = false;
        return url;
      }

      return apiKey;
    });

    const badResponse: Partial<AxiosResponse> = {
      data: { invalid: 'data' },
      status: 200,
      statusText: 'OK',
      headers: {},
    };

    httpService.get = jest.fn(() => of(badResponse));

    await expect(service.getTrips('SYD', 'GRU')).rejects.toThrow(
      new ServiceUnavailableException('Error on Bizaway API response'),
    );
  });

  test('should throw if API call fails', async () => {
    let firstCall = true;
    configService.get = jest.fn(() => {
      if (firstCall) {
        firstCall = false;
        return url;
      }

      return apiKey;
    });

    httpService.get = jest.fn(() => throwError(new Error('Error on Bizaway API.')));

    await expect(service.getTrips('SYD', 'GRU')).rejects.toThrow(
      new ServiceUnavailableException('Error on Bizaway API.'),
    );
  });
});
