import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";


@Injectable()
export class AppService {

   public url = 'http://localhost:3000';
  //private url ='http://todo-node.akshaypatil.online';


  constructor(public http: HttpClient) { }


  // get all countries
  public getAllCountry() {

    let response = this.http.get(`https://restcountries.eu/rest/v2/all`);

    return response;

  }

  // get country form code
  public getCountry(code) {

    let response = this.http.get(`https://restcountries.eu/rest/v2/callingcode/${code}`);

    return response;

  }


  //get userinfo from localstoreage
  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage

  //set userInfo in local storage
  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data))

  }


  //get all users
  public getAllUsers() {

    let response = this.http.get(`${this.url}/api/v1/users/view/all?authToken=${Cookie.get('authtoken')}`);

    return response;

  }

  //get users details
  public getUserInfo(id) {

    let response = this.http.get(`${this.url}/api/v1/users/${id}/details?authToken=${Cookie.get('authtoken')}`);

    return response;

  }

  //get info about users friends
  public getUserFriends(friendsArray): Observable<any> {

    const params = new HttpParams()
      .set('friends', friendsArray)
      .set('authToken', Cookie.get('authtoken'))

    return this.http.post(`${this.url}/api/v1/users/findFriend`, params);

  }

  //signup 
  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)

    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.


  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);

  } // end of signinFunction function.


  public forgotPasswordFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)

    return this.http.post(`${this.url}/api/v1/users/forgot-password`, params);

  } // end of forgotPasswordFunction function.


  // send invitation mail
  public sendInvite(userId, email) {

    let response = this.http.post(`${this.url}/api/v1/users/invitation?userId=${userId}&email=${email}`, email);

    return response;

  }


  // Add invited friend to friends array
  public addInviteFriend(userId, inviteId) {

    let response = this.http.post(`${this.url}/api/v1/users/addInvitedFriend?userId=${userId}&inviteId=${inviteId}`, inviteId);

    return response;

  }


  // remove friend to friends array
  public unFriend(userId, friendId) {

    let response = this.http.post(`${this.url}/api/v1/users/unFriend?userId=${userId}&friendId=${friendId}`, friendId);

    return response;

  }

  // change password
  public changePasswordFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userId', data.userId)
      .set('password', data.password);

    return this.http.put(`${this.url}/api/v1/users/change-password`, params);

  } // end of signinFunction function.


  public logout(data): Observable<any> {

    const params = new HttpParams()

      .set('authToken', Cookie.get('authtoken'))
      .set('userId', data)

    return this.http.post(`${this.url}/api/v1/users/logout`, params);

  } // end logout function


  //Friends request
  public request(freindId, userId): Observable<any> {

    const params = new HttpParams()
      .set('request', freindId)
      .set('authToken', Cookie.get('authtoken'))

    return this.http.put(`${this.url}/api/v1/users/${userId}/request`, params);

  }

  //Friends request
  public requested(freindId, userId): Observable<any> {

    const params = new HttpParams()
      .set('request', freindId)
      .set('authToken', Cookie.get('authtoken'))

    return this.http.put(`${this.url}/api/v1/users/${userId}/requested`, params);

  }


  //add as friend
  public addAsFriend(freindId, userId): Observable<any> {

    const params = new HttpParams()
      .set('request', freindId)
      .set('authToken', Cookie.get('authtoken'))

    return this.http.put(`${this.url}/api/v1/users/${userId}/addAsFriend`, params);

  }


  //get all tasks
  public getAllTasks() {

    let response = this.http.get(`${this.url}/api/v1/task/all?authToken=${Cookie.get('authtoken')}`);

    return response;

  }

  //creating a task
  public createTask(taskObj): Observable<any> {

    const params = new HttpParams()
      .set('title', taskObj.title)
      .set('tasks', JSON.stringify(taskObj.tasks))
      .set('createdBy', taskObj.createdBy)
      .set('createdByUserId', taskObj.createdByUserId)
      .set('modifiedBy', taskObj.modifiedBy)
      .set('type', taskObj.type)
      .set('authToken', Cookie.get('authtoken'))

    return this.http.post(`${this.url}/api/v1/task/create`, params);

  }

  //edit task
  public editTask(taskObj): Observable<any> {

    // friendsList to store in history for undo purpose
    let friendList = this.getUserInfoFromLocalstorage().friends
    friendList.push(this.getUserInfoFromLocalstorage().userId)

    friendList = taskObj.type === "public" ? friendList : this.getUserInfoFromLocalstorage().userId;


    const params = new HttpParams()
      .set('title', taskObj.title)
      .set('tasks', JSON.stringify(taskObj.tasks))
      .set('type', taskObj.type)
      .set('modifiedBy', taskObj.modifiedBy)
      .set('modifiedOn', taskObj.modifiedOn)
      .set('friends', friendList)
      .set('authToken', Cookie.get('authtoken'))


    return this.http.put(`${this.url}/api/v1/task/${taskObj.taskId}/edit`, params);

  } // end of edit function.


  //delete task
  public deleteTask(taskObj): Observable<any> {

    // friendsList to store in history for undo purpose
    let friendList = this.getUserInfoFromLocalstorage().friends
    friendList.push(this.getUserInfoFromLocalstorage().userId)

    friendList = taskObj.type === "public" ? friendList : this.getUserInfoFromLocalstorage().userId;


    const params = new HttpParams()
      .set('title', taskObj.title)
      .set('tasks', JSON.stringify(taskObj.tasks))
      .set('type', taskObj.type)
      .set('modifiedBy', taskObj.modifiedBy)
      .set('modifiedOn', taskObj.modifiedOn)
      .set('friends', friendList)
      .set('authToken', Cookie.get('authtoken'))


    return this.http.post(`${this.url}/api/v1/task/${taskObj.taskId}/delete`, params);

  } // end of delete task function
  

  //Undo tasks
  public undo() {

    let response = this.http.get(`${this.url}/api/v1/task/${this.getUserInfoFromLocalstorage().userId}/undo?authToken=${Cookie.get('authtoken')}`);

    return response;

  }
  

  //get notification for user
  public getUserNotification(id) {

    let response = this.http.get(`${this.url}/api/v1/task/${id}/notification?authToken=${Cookie.get('authtoken')}`);

    return response;

  }



  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
