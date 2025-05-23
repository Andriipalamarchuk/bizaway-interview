import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { IBizawayTrip } from '../interfaces/bizaway-trip.interface';
import { catchError, lastValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Trip } from '../types/trip.type';

@Injectable()
export class BizawayService {
  constructor(
    private readonly _httpService: HttpService,
    private readonly _configService: ConfigService,
  ) {}

  public async getTrips(origin: string, destination: string): Promise<Trip[]> {
    const bizawayUrl = this._configService.get<string>('BIZAWAY_GET_TRIPS_URL');
    if (!bizawayUrl) {
      throw new InternalServerErrorException('Error on config of application. Check url config');
    }
    const bizawayApiKey = this._configService.get<string>('BIZAWAY_API_KEY');
    if (!bizawayApiKey) {
      throw new InternalServerErrorException('Error on config of application. Check api key');
    }

    return await lastValueFrom(
      this._httpService
        .get(bizawayUrl, {
          headers: {
            'x-api-key': bizawayApiKey,
          },
          params: {
            origin,
            destination,
          },
        })
        .pipe(
          map((response) => {
            if (!response.data || !Array.isArray(response.data)) {
              throw new ServiceUnavailableException('Error on Bizaway API response');
            }
            return (response.data as IBizawayTrip[]).map((trip: IBizawayTrip) => {
              return {
                ...trip,
                display_name: undefined,
                displayName: trip.display_name,
              } as Trip;
            });
          }),
          catchError((error: Error) => {
            throw new ServiceUnavailableException(error.message);
          }),
        ),
    );
  }
}
