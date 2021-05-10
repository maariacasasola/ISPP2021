import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AngularFireModule } from "@angular/fire";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterTestingModule } from "@angular/router/testing";
import { environment } from "apps/gotacar/src/environments/environment";
import { LogInPageComponent } from "./log-in-page.component"

describe('LogInPageComponent', () => {
  let component: LogInPageComponent;
  let fixture: ComponentFixture<LogInPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogInPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [AngularFireModule.initializeApp(environment.firebaseConfig),
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        MatDialogModule
      ],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})