import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from "./../app.service";
import { SocketService } from './../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from '@angular/common';

@Component({
  selector: 'app-showusers',
  templateUrl: './showusers.component.html',
  styleUrls: ['./showusers.component.css'],
  providers: [SocketService]
})
export class ShowusersComponent implements OnInit, OnDestroy {

  //initializing p to one
  p: number = 1;
  public filter: any;
  public peopleSearch: any;

  //sorting
  key: string = 'createdOn';
  reverse: boolean = false;
  sort(key) {
      this.key = key;
      this.reverse = !this.reverse;
  }

  // invitaition mail variables
  public invitation: string;
  public mail: string;

  // user related variables
  public users: any;
  public userId: string;
  public userInfo: any;

  // pagination variable
  public currentPage: any;
  public pageSize: any = 10;
  public length: any;

  // socketservice varialbes
  public authToken: string;
  public userList: any = [];
  public disconnectedSocket: boolean;

  // task variables
  public private: boolean = false;
  public title: any;
  public spinner: boolean = false;
  public taskCreationUpdate: boolean = false;
  public tasks: any;
  public editMode: boolean = false;
  public taskId: string;
  public undoData: any;
  public taskDetailsToEdit: any;
  public step = 0;
  public empty: string;

  // Modal for create and update tasklist variables
  public count: number = 1;
  public taskNumberIds: number[] = [1];
  public taskDetailsObj: any;
  public taskList: string[];
  public subtask1: any;
  public subtask2: any;
  public subtask3: any;
  public subtask4: any;
  public subtask5: any;
  public subtask6: any;
  public subtask7: any;
  public subtask8: any;
  public subtask9: any;
  public subtask10: any;

  //notification related variables
  public notifications = [];
  public notificationCount: number = null;
  public audio: any;



  constructor(private location: Location,public SocketService: SocketService, public snackBar: MatSnackBar, public router: Router, public _route: ActivatedRoute, public appService: AppService) { }


  //checking for keypress to undo
  @HostListener('window:keyup', ['$event'])

  handleKeyboardEvent(event: KeyboardEvent) {
      if (event.getModifierState && event.getModifierState('Control') && event.keyCode === 90) {

          this.undo();

      }
  }//end of host listener


  ngOnInit() {

      this.checkStatus();

      this.authToken = Cookie.get('authtoken');

      this.userId = this.appService.getUserInfoFromLocalstorage().userId;

      this.verifyUserConfirmation();

      this.getOnlineUserList();

      this.createVariable();

      this.getNotify();

      this.getTaskChanges();

      this.getUserDetails(this.userId);

      this.invitation = `http://localhost:4200/sign-up?userId=${this.userId}`;
      // this.invitation = `http://todo-angular.akshaypatil.online/sign-up?userId=${this.userId}`;


      //on purpose Delay to ensure perfromance at OnInit

      setTimeout(() => {
          this.getAllTasks();
      }, 1000);

      setTimeout(() => {
          this.checkForInvitation();
      }, 6000);

      setTimeout(() => {
          this.getALLUsers();
      }, 4000);

      setTimeout(() => {
          this.getNotification(this.userId);
      }, 8000);

  }


  ngOnDestroy() {

      this.SocketService.exitSocket()

  }


  //undo button
  undo() {

      this.appService.undo().subscribe(
          (data) => {

              this.undoData = data

              if (this.undoData.status == 200) {

                  this.snackBar.open(`${this.undoData.message}`, "Dismiss", {
                      duration: 2000,
                  });

                  // sending notification
                  let notifyObject = {
                      type: "public",
                      senderName: this.userInfo.firstName,
                      senderId: this.userId,
                      receiverName: '',
                      receiverId: '',
                      message: `${this.userInfo.firstName} has Undo a tasklist.`,
                      createdOn: Date.now()
                  }

                  this.SocketService.taskNotify(notifyObject);

                  this.getAllTasks();

              } else if (this.undoData.status == 404) {

                  this.snackBar.open(`${this.undoData.message}`, "Dismiss", {
                      duration: 2000,
                  });

              } else {

                  this.snackBar.open(`Some Error occured`, "Dismiss", {
                      duration: 2000,
                  });

                  setTimeout(() => {
                      this.router.navigate(['/500'])
                  }, 500);
              }
          }, (err) => {

              this.snackBar.open(`some error occured`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          });

  }//end of get all users.


  // create variable for task details (subtasks variables)
  createVariable() {

      for (var i = 0; i <= 9; i++) {

          for (var j = 1; j <= 5; j++) {

              this[`detail${i}${j}`]

          }
      }
  }


  // check to for validity
  public checkStatus: any = () => {

      if (Cookie.get('authtoken') === undefined || Cookie.get('authtoken') === '' || Cookie.get('authtoken') === null) {

          this.router.navigate(['/sign-in']);

          return false;

      } else {

          return true;

      }

  } // end checkStatus


  // socket event to verifyUser
  public verifyUserConfirmation: any = () => {

      this.SocketService.verifyUser()
          .subscribe((data) => {

              this.disconnectedSocket = false;

              this.SocketService.setUser(this.authToken);

          });
  }


  // socket event to get online user list
  public getOnlineUserList: any = () => {

      this.SocketService.onlineUserList()
          .subscribe((userList) => {

              this.userList = [];

              for (let x in userList) {

                  let temp = { 'userId': userList[x].userId, 'name': userList[x].fullName };

                  this.userList.push(temp);

              }

              console.log('UserList =>', this.userList);

          }); // end online-user-list
  }



  // Get all users
  getALLUsers() {

      this.appService.getAllUsers().subscribe(
          data => {

              this.users = data['data'];

          }, (err) => {

              this.snackBar.open(`some error occured`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          });

  }//end of get all users.


  // get detail of current user
  getUserDetails(id) {

      this.appService.getUserInfo(id).subscribe(
          data => {

              this.userInfo = data['data'];

              setTimeout(() => {

                  this.appService.setUserInfoInLocalStorage(this.userInfo);

              }, 2000);

          }, (err) => {

              this.snackBar.open(`some error occured`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          });

  }


  // adding user to requested array of the friend .
  //adding friend to request array of the user.
  addAsFriend(id, name) {

      // send friends request
      this.appService.request(this.userId, id).subscribe((apiResponse) => {

          if (apiResponse.status === 200) {

              this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                  duration: 5000,
              });

              // sending notification
              let notifyObject = {
                  senderName: this.userInfo.firstName,
                  senderId: this.userId,
                  receiverName: name,
                  receiverId: id,
                  message: `${this.userInfo.firstName} has sent you friend's request`,
                  createdOn: new Date()
              }

              this.SocketService.sendNotify(notifyObject);

          } else {

              this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          }

      }, (err) => {

          this.snackBar.open(`some error occured`, "Dismiss", {
              duration: 5000,
          });

          setTimeout(() => {
              this.router.navigate(['/500'])
          }, 500);

      });


      // add user to pending or requested array
      this.appService.requested(this.userId, id).subscribe((apiResponse) => {

          if (apiResponse.status === 200) {

              this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                  duration: 5000,
              });


          } else {

              this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                  duration: 5000,
              });

          }

      }, (err) => {

          this.snackBar.open(`some error occured`, "Dismiss", {
              duration: 5000,
          });

          setTimeout(() => {
              this.router.navigate(['/500'])
          }, 500);
      });

      // refreshing
      setTimeout(() => {
          this.ngOnInit();
      }, 1000);
  }



  // Add request user to friends array
  addToFriend(id, name) {

      // add friend to friends array
      this.appService.addAsFriend(id, this.userId).subscribe((apiResponse) => {

          if (apiResponse.status === 200) {

              this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                  duration: 5000,
              });
              // sending notification
              let notifyObject = {
                  senderName: this.userInfo.firstName,
                  senderId: this.userId,
                  receiverName: name,
                  receiverId: id,
                  message: `${this.userInfo.firstName} has accepted your friend's request`,
                  createdOn: new Date()
              }

              this.SocketService.sendNotify(notifyObject)

          } else {

              this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);
          }

      }, (err) => {

          this.snackBar.open(`some error occured`, "Dismiss", {
              duration: 5000,
          });

          setTimeout(() => {
              this.router.navigate(['/500'])
          }, 500);

      });


      // refreshing
      setTimeout(() => {
          this.ngOnInit();
      }, 1000);
  }

  /////////////////////////////////////////Noyification related code//////////////////////////////////

  // get notifications of the user
  public getNotify: any = () => {

      this.SocketService.notify(this.userId)
          .subscribe((data) => {

              let message = data;

              this.snackBar.open(`${message.message}`, "Dismiss", {
                  duration: 5000,
              });
              console.log(`Inside get notify`)
              // pushing data to notification array
              this.notifications.push(message.message);

              this.notificationCount++;
              this.getUserDetails(this.userId);
              this.getALLUsers();

          }, (err) => {

              this.snackBar.open(`some error occured`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          });//end subscribe

  }// end get message from a user 


  // get notifications related task changes done by friends
  public getTaskChanges: any = () => {

      this.SocketService.taskChanges().subscribe((data) => {

          if (data.receiverId.includes(this.userId)) {

              let message = data;

              this.snackBar.open(`${message.message}`, "Dismiss", {
                  duration: 5000,
              });

              // pushing data to notification array
              this.notifications.push(message.message);

              //playing notification sound.
              this.audio = new Audio();
              this.audio.src = "../../../assets/light.mp3";
              this.audio.load();
              this.audio.play();


              this.notificationCount++;

          }
          this.getAllTasks();
      }, (err) => {

          this.snackBar.open(`some error occured`, "Dismiss", {
              duration: 5000,
          });

          setTimeout(() => {
              this.router.navigate(['/500'])
          }, 500);

      });//end subscribe

  }// end get message from a user 


  ///////////////////////////////////////Task related code///////////////////////////////////

  // get all tasks
  public getAllTasks: any = () => {

      this.appService.getAllTasks().subscribe(

          data => {

              if (data['status'] === 200) {

                  this.tasks = data['data'];

              } else if (data['status'] === 404) {

                  this.empty = data['message']

              } else {

                  this.snackBar.open(`some error occured`, "Dismiss", {
                      duration: 5000,
                  });

                  setTimeout(() => {
                      this.router.navigate(['/500'])
                  }, 500);

              }


          }, (err) => {

              this.snackBar.open(`some error occured`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          });

  }//end of get all task


  //create task function or edit task and make api request
  public addTask: any = () => {

      this.taskList = [];

      if (this.title) {
          this.spinner = true;


          let taskObj = {
              taskId: '',
              title: this.title,
              type: '',
              tasks: [],
              createdByUserId: this.userId,
              createdBy: this.userInfo.firstName,
              modifiedBy: this.userInfo.firstName,
              modifiedOn: Date.now(),
          }

          // handling private or public task
          if (this.private == true) {
              taskObj.type = 'private'
          } else {
              taskObj.type = 'public'
          }


          // Mapping all the NgModels to TaskObj to send them to backend
          for (let i = 1; i <= 10; i++) {

              if (this[`subtask${i}`]) {

                  let taskDetailsObj = {
                      task: this[`subtask${i}`],
                      status: `pending`,
                      subtask: []
                  }

                  for (let j = 1; j <= 5; j++) {

                      if (this[`detail${i - 1}${j}`]) {

                          taskDetailsObj.subtask.push(this[`detail${i - 1}${j}`]);

                      }
                  }

                  taskObj.tasks.push(taskDetailsObj)
              }
          }



          if (this.editMode === false) {

              //If edit mode is false the create task
              this.appService.createTask(taskObj).subscribe(
                  apiResponse => {

                      if (apiResponse.status === 200) {

                          this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                              duration: 2000,
                          });

                          this.spinner = false;
                          this.taskCreationUpdate = true;


                          // sending notification
                          let notifyObject = {
                              type: taskObj.type,
                              senderName: this.userInfo.firstName,
                              senderId: this.userId,
                              receiverName: taskObj.createdBy,
                              receiverId: taskObj.createdByUserId,
                              message: `${this.userInfo.firstName} has created ${this.title} tasklist.`,
                              createdOn: Date.now()
                          }

                          this.SocketService.taskNotify(notifyObject);

                          this.getAllTasks();

                      } else {

                          this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                              duration: 5000,
                          });

                          setTimeout(() => {
                              this.router.navigate(['/500'])
                          }, 500);
                      }

                  }, (err) => {

                      this.snackBar.open(`some error occured`, "Dismiss", {
                          duration: 5000,
                      });

                      setTimeout(() => {
                          this.router.navigate(['/500'])
                      }, 500);
                  });//end of create task


          } else {

              taskObj.taskId = this.taskId;
              taskObj.modifiedBy = this.userInfo.firstName;

              //If edit mode is true then edit task
              this.appService.editTask(taskObj).subscribe((apiResponse) => {
                  if (apiResponse.status === 200) {

                      this.snackBar.open(`Task Edited!`, "Dismiss", {
                          duration: 5000,
                      });

                      this.spinner = false;
                      this.taskCreationUpdate = true;


                      // sending notification
                      let notifyObject = {
                          type: taskObj.type,
                          senderName: this.userInfo.firstName,
                          senderId: this.userId,
                          receiverName: taskObj.createdBy,
                          receiverId: taskObj.createdByUserId,
                          message: `${this.userInfo.firstName} has Edited ${taskObj.title} tasklist. `,
                          createdOn: Date.now()
                      }

                      this.SocketService.taskNotify(notifyObject);


                      this.getAllTasks();

                  } else {

                      this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                          duration: 5000,
                      });

                      setTimeout(() => {
                          this.router.navigate(['/500'])
                      }, 500);

                  }

              }, (err) => {

                  this.snackBar.open(`some error occured`, "Dismiss", {
                      duration: 5000,
                  });

                  setTimeout(() => {
                      this.router.navigate(['/500'])
                  }, 500);

              });


          }//end of edit task

      } else {
          this.snackBar.open(`Please enter title`, "Dismiss", {
              duration: 2000,

          });

      }

  }


  // nested form
  remove(i: number) {
      this.count--
  }

  add() {
      this.taskNumberIds.push(++this.count);
  }


  // Main taask check function
  taskChecked(task, i) {

      let taskObj = task;
      let removedTask = task.tasks[i].task
      taskObj.modifiedBy = this.userInfo.firstName;
      taskObj.modifiedOn = Date.now();
      setTimeout(() => {

          task.tasks.splice(i, 1)

          this.appService.editTask(taskObj).subscribe((apiResponse) => {
              if (apiResponse.status === 200) {

                  this.snackBar.open(`Task Completed!`, "Dismiss", {
                      duration: 5000,
                  });


                  // sending notification
                  let notifyObject = {
                      type: taskObj.type,
                      senderName: this.userInfo.firstName,
                      senderId: this.userId,
                      receiverName: taskObj.createdBy,
                      receiverId: taskObj.createdByUserId,
                      message: `${this.userInfo.firstName} has Checked " ${removedTask} " task from" ${taskObj.title} " tasklist. `,
                      createdOn: Date.now()
                  }

                  this.SocketService.taskNotify(notifyObject);

                  // refreshing
                  this.getAllTasks();

              } else {

                  this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                      duration: 5000,
                  });

                  setTimeout(() => {
                      this.router.navigate(['/500'])
                  }, 500);

              }

          }, (err) => {

              this.snackBar.open(`some error occured`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          });


      }, 500);

  }

  // Subtask check function
  subtaskChecked(task, i, j) {

      let taskObj = task;
      let removedSubtask = task.tasks[i].subtask[j]
      taskObj.modifiedBy = this.userInfo.firstName;
      taskObj.modifiedOn = Date.now();
      task.tasks[i].subtask.splice(j, 1)

      this.appService.editTask(taskObj).subscribe((apiResponse) => {
          if (apiResponse.status === 200) {

              this.snackBar.open(`SubTask Completed!`, "Dismiss", {
                  duration: 5000,
              });


              // sending notification
              let notifyObject = {
                  type: taskObj.type,
                  senderName: this.userInfo.firstName,
                  senderId: this.userId,
                  receiverName: taskObj.createdBy,
                  receiverId: taskObj.createdByUserId,
                  message: `${this.userInfo.firstName} has Checked " ${removedSubtask} " from " ${taskObj.title} " tasklist.`,
                  createdOn: Date.now()
              }

              this.SocketService.taskNotify(notifyObject);

              // refreshing
              this.getAllTasks();

          } else {

              this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          }

      }, (err) => {

          this.snackBar.open(`some error occured`, "Dismiss", {
              duration: 5000,
          });


          setTimeout(() => {
              this.router.navigate(['/500'])
          }, 500);

      });

  }//end of subtask check.


  //function for pre render value to form for editing values
  editValue(task) {

      // setting this variable for passing to delete task function
      this.taskDetailsToEdit = task;

      this.editMode = true;

      this.clear();

      // this.count = this.taskDetailsToEdit.tasks.length;

      this.title = task.title;
      this.taskId = task.taskId
      if (task.type == 'private') {
          this.private = true
      } else {
          this.private = false;
      }

      let i = 1
      task.tasks.map(x => {

          this[`subtask${i}`] = x.task

          x.subtask.filter(y => {
              for (let j = 1; j <= 5; j++) {

                  this[`detail${i - 1}${j}`] = x.subtask[j - 1]

              }

          });

          i++

      });

  }

  // delete task function
  deleteTask() {

      let taskObj = this.taskDetailsToEdit;
      taskObj.modifiedBy = this.userInfo.firstName;
      taskObj.modifiedOn = Date.now();

      this.appService.deleteTask(taskObj).subscribe((apiResponse) => {

          if (apiResponse.status === 200) {

              this.snackBar.open(`Task Deleted!`, "Dismiss", {
                  duration: 5000,
              });


              // sending notification
              let notifyObject = {
                  type: taskObj.type,
                  senderName: this.userInfo.firstName,
                  senderId: this.userId,
                  receiverName: taskObj.createdBy,
                  receiverId: taskObj.createdByUserId,
                  message: `${this.userInfo.firstName} has Deleted ${taskObj.title} tasklist.`,
                  createdOn: Date.now()
              }

              this.SocketService.taskNotify(notifyObject);

              // refreshing
              this.getAllTasks()

          } else {

              this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          }

      }, (err) => {

          this.snackBar.open(`some error occured`, "Dismiss", {
              duration: 5000,
          });

          setTimeout(() => {
              this.router.navigate(['/500'])
          }, 500);

      });

  }//end of delete task.


  //code to get last 10 notification
  getNotification(id) {

      this.appService.getUserNotification(id).subscribe(
          data => {
              let response = data['data']

              this.notifications = []
              if (response != null) {
                  response.map(x => {
                      this.notifications.unshift(x.message);
                  });
              }

          }, (err) => {

              this.snackBar.open(`some error occured`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          });


  }


  ////////////////////////////////add details/////////////////////////////////


  editModeOff() {
      this.editMode = false;
  }


  clear() {

      this.private = false;
      this.title = '';
      this.count = 1;
      this.taskNumberIds = [1];

      for (var i = 1; i <= 10; i++) {
          this[`subtask${i}`] = '';
      }

      for (var i = 0; i <= 9; i++) {
          for (var j = 1; j <= 5; j++) {

              this[`detail${i}${j}`] = '';

          }
      }

  }

  // clearing notification count
  clearCount() {
      this.notificationCount = null;
  }

  //code for mat-expansion panel in the modal for subtasks
  setStep(index: number) {
      this.step = index;
  }

  nextStep() {
      this.step++;
  }

  prevStep() {
      this.step--;
  }



  // send invitation mail
  sendInvitationMail() {
      this.appService.sendInvite(this.userId, this.mail).subscribe(
          data => {

              let response = data

              if (response['status'] === 200) {
                  this.snackBar.open(`Invitation mail sent successfully`, "Dismiss", {
                      duration: 5000,
                  });
              } else {
                  this.snackBar.open(`Some error occured`, "Dismiss", {
                      duration: 5000,
                  });
              }
          }
      )
  }


  //copy to clipboard
  copyMessage(val: string) {
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);

      this.snackBar.open(`Invitation link copied successfully`, "Dismiss", {
          duration: 5000,
      });

  }

  //check for invitation
  checkForInvitation() {

      if (Cookie.get('inviteId')) {

          let inviteId = Cookie.get('inviteId');

          this.appService.addInviteFriend(this.userId, inviteId).subscribe(
              data => {
                  if (data['status'] === 200) {

                      this.snackBar.open(`Friend added to friend's list`, "Dismiss", {
                          duration: 5000,
                      });

                      Cookie.delete('inviteId');

                      // sending notification
                      let notifyObject = {
                          senderName: this.userInfo.firstName,
                          senderId: this.userId,
                          receiverName: '',
                          receiverId: inviteId,
                          message: `You are now friend with ${this.userInfo.firstName}`,
                          createdOn: new Date()
                      }

                      this.SocketService.sendNotify(notifyObject);

                      this.getUserDetails(this.userId);

                  } else {

                      this.snackBar.open(`Some error occured in adding invited friend to friend's list`, "Dismiss", {
                          duration: 5000,
                      });

                  }
              }
          )
      }

  }

  // logout Function
  public logout: any = () => {

      let userId = this.appService.getUserInfoFromLocalstorage().userId

      this.appService.logout(userId)
          .subscribe((apiResponse) => {

              if (apiResponse.status === 200) {

                  Cookie.delete('authtoken');

                  this.SocketService.exitSocket();

                  this.router.navigate(['/sign-in']);

              } else {
                  this.snackBar.open(`${apiResponse.message}`, "Dismiss", {
                      duration: 5000,
                  });

              } // end condition

          }, (err) => {
              this.snackBar.open(`some error occured`, "Dismiss", {
                  duration: 5000,
              });

              setTimeout(() => {
                  this.router.navigate(['/500'])
              }, 500);

          });

  } // end logout


  goBack() {
    this.location.back();
}


}// end of export class