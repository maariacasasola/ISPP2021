import { TestBed } from '@angular/core/testing';

import { MeetingPointService } from './meeting-point.service';

describe('MeetingPointService', () => {
  let service: MeetingPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
