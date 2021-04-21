import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
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
    fixture.detectChanges();
  

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should open snackbar',()=>{
    
    spyOn(component, 'openSnackBar');
    component.openSnackBar('');
    fixture.detectChanges();
    expect(component.openSnackBar).toHaveBeenCalled();

  });
});
