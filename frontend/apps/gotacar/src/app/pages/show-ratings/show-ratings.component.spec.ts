import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { UsersService } from '../../services/users.service';

import { ShowRatingsComponent } from './show-ratings.component';
class mockUserService{
  get_ratings_by_userid(){
    return [];
  }
}
const mockUserService1 ={
  get_ratings_by_userid(id:string): any[]{
    return [];
  }
}
let message=""

describe('ShowRatingsComponent', () => {
  let component: ShowRatingsComponent;
  let fixture: ComponentFixture<ShowRatingsComponent>;
  let user_service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowRatingsComponent ],
      imports:[RouterTestingModule,MatSnackBarModule,BrowserAnimationsModule ],
      providers: [
        {provide: UsersService, useClass: mockUserService}
      ]
    })
    .compileComponents();
    message = 'a';
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRatingsComponent);
    component = fixture.componentInstance;
    user_service = TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open snackbar', () => {
    const spy = spyOn(component._snackBar, 'open');
    fixture.detectChanges();
    component.openSnackBar('hola');
    expect(spy).toHaveBeenCalledWith('hola', null, {
      duration: 3000,
    });
  });

  it('should show error while loading comments', () => {
    const spy = spyOn(component, 'openSnackBar');
    spyOn(user_service, 'get_ratings_by_userid').and.throwError(
      'error'
    );
    fixture.detectChanges();
    component.load_comments();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith(
        'Ha ocurrido un error al intentar obtener las valoraciones de este usuario'
      );
    });
  });
});
