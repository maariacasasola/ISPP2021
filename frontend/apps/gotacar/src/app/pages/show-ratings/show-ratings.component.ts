import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'frontend-show-ratings',
  templateUrl: './show-ratings.component.html',
  styleUrls: ['./show-ratings.component.scss'],
})
export class ShowRatingsComponent {
  ratingsComments;
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UsersService,
    private _snackBar: MatSnackBar,
  ) {
    this.load_comments();
  }

  private get_user_id(): string {
    return this._route.snapshot.params['user_id'];
  }

  async load_comments() {
    try {
      const userId = this.get_user_id();
      const response = await this._userService.get_ratings_by_userid(userId);
      this.ratingsComments = response;
    } catch (error) {
      this.openSnackBar("Ha ocurrido un error al intentar obtener las valoraciones de este usuario");
    }
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 3000,
    });
  }
}
