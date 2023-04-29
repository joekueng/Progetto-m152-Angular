import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {UserEntity} from "../../interface/UserEntity";

const BASE_URL = "localhost:8080/progetto152/";
const USER = BASE_URL + "user/";
const GET_USER_BY_ID = USER + "id/";


@Injectable({
  providedIn: 'root',
})

export class LocationService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getUsers() {
    return this.http.get<UserEntity[]>(USER);
  }

  getUser(username: string) {
    return this.http.get<UserEntity>(USER + username);
  }

  getUserById(id: number) {
    return this.http.get<UserEntity>(GET_USER_BY_ID + id);
  }

  createUser(user: UserEntity) {
    return this.http.post<UserEntity>(USER, user);
  }

  updateUser(user: UserEntity, id: number) {
    return this.http.put<UserEntity>(USER + id, user);
  }

  deleteUser(id: number) {
    return this.http.delete<UserEntity>(USER + id);
  }
}
