import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AppService } from "./../app.service";
import { SocketService } from './../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from '@angular/common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    public userId: string;
    public userInfo: any;
    public friends: any;
    public country: any;
    public id: string;
    public name: string;

    constructor(private location: Location, public SocketService: SocketService, public snackBar: MatSnackBar, public router: Router, public _route: ActivatedRoute, public appService: AppService) { }

    ngOnInit() {

        this.id = this.appService.getUserInfoFromLocalstorage().userId
        this.name = this.appService.getUserInfoFromLocalstorage().firstName

        this.checkStatus();

        this.getUserDetails();

        setTimeout(() => {
            this.getUsersFriends();
        }, 2000);

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


    // get detail of current user
    getUserDetails() {

        let id = this._route.snapshot.params.userId;

        this.appService.getUserInfo(id).subscribe(
            data => {

                this.userInfo = data['data'];

                let countryCode = this.userInfo.mobileNumber.split(" ");

                // getting country of user
                this.getCountry(countryCode[1]);

                // getting phone no
                this.userInfo.mobileNumber = countryCode[2];

            }, (err) => {

                this.snackBar.open(`some error occured`, "Dismiss", {
                    duration: 5000,
                });

                setTimeout(() => {
                    this.router.navigate(['/500'])
                }, 500);

            });

    }

    //get users friends 
    getUsersFriends() {

        this.appService.getUserFriends(this.userInfo.friends).subscribe(
            data => {

                let response = data;

                if (response.status === 200) {

                    this.friends = response.data;

                } else if (response.status === 404) {

                    this.snackBar.open(`${response.message}`, "Dismiss", {
                        duration: 5000,
                    });

                } else {

                    this.snackBar.open(`${response.message}`, "Dismiss", {
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
    }


    //get country of user
    getCountry(code) {

        this.appService.getCountry(code).subscribe(
            data => {
                this.country = data[0].name;
            }
        )
    }


    //remove user from friends array
    unFriend() {

        this.appService.unFriend(this.userInfo.userId, this.id).subscribe(
            data => {

                if (data['status'] === 200) {

                    this.snackBar.open(`Friend has been removed from your friend's list`, "Dismiss", {
                        duration: 5000,
                    });

                    // sending notification
                    let notifyObject = {
                        senderName: this.name,
                        senderId: this.id,
                        receiverName: '',
                        receiverId: this.userInfo.userId,
                        message: `${this.name} has unfriend you.`,
                        createdOn: new Date()
                    }

                    this.SocketService.sendNotify(notifyObject);

                    setTimeout(() => {
                        this.router.navigate(['/home']);
                    }, 2000);

                } else {

                    this.snackBar.open(`Some error occured in removing friend from friend's list`, "Dismiss", {
                        duration: 5000,
                    });

                }
            }
        )


    }

    goBack() {
        this.location.back();
    }

}
