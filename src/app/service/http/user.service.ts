import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {newUser, UserEntity} from "../../interface/UserEntity";
import {catchError, of} from "rxjs";

const BASE_URL = "progetto152";
const USER = BASE_URL + "/user";
const GET_USER_BY_ID = USER + "/id";


@Injectable({
  providedIn: 'root',
})

export class UserService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getUsers() {
    return this.http.get<UserEntity[]>(USER);
  }


  getUser(username: string) {
    return this.http.get<UserEntity>(USER + "/" + username).pipe(
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        } else {
          throw error;
        }
      })
    );
  }



  getUserById(id: number) {
    return this.http.get<UserEntity>(GET_USER_BY_ID + "/" + id);
  }

  createUser(user: newUser) {
    console.log("create " + user);
    return this.http.post<UserEntity>(USER, user);

  }

  updateUser(user: UserEntity, id: number) {
    return this.http.put<UserEntity>(USER + "/"+id, user);
  }

  deleteUser(id: number) {
    return this.http.delete<UserEntity>(USER+"/" + id);
  }
}
