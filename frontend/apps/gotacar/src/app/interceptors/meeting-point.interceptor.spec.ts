import { TestBed } from '@angular/core/testing';

import { MeetingPointInterceptor } from './meeting-point.interceptor';

describe('MeetingPointInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MeetingPointInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: MeetingPointInterceptor = TestBed.inject(MeetingPointInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
