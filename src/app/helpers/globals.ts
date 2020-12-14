import {Injectable} from '@angular/core';
// import { FlightInformation } from '../models/flight-information';
import {SafeRequestService} from '../services/safe-request.service';

@Injectable({
  providedIn: 'root'
})

export class Globals {
  constructor(
    private safeRequest: SafeRequestService
  ) {
  }

  // async getFlightInformation(destinationNumber: string, callerAni: string, user : string): Promise<FlightInformation[] | null> {
  //   const res = await this.safeRequest.generateRequest(true, environment.API_FRONTIER_URL, this.safeRequest.getFlightInformation, 'get', {destinationNumber : destinationNumber, callerAni : callerAni, user : user});
  //   return res.status === 'ok' ? res.data : null;
  // }
}
