import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule, MatBadgeModule, MatPaginatorModule, MatTooltipModule, MatExpansionModule, MatSelectModule, MatCheckboxModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, MatProgressBarModule, MatSlideToggleModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';


import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { SigninComponent } from "./user/signin/signin.component";
import { HomeComponent } from './home/home.component';
import { SharedModule } from "./shared/shared.module";
import { SocketService } from './socket.service';
import { AppService } from './app.service';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { ProfileComponent } from './profile/profile.component';
import { ShowusersComponent } from './showusers/showusers.component';
import { FriendstaskComponent } from './friendstask/friendstask.component';
import { IndividualtasksComponent } from './individualtasks/individualtasks.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    Error404Component,
    Error500Component,
    ProfileComponent,
    ShowusersComponent,
    FriendstaskComponent,
    IndividualtasksComponent
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    MatButtonModule,
    ReactiveFormsModule,
    UserModule,
    Ng2OrderModule,
    NgxPaginationModule,
    MatIconModule,
    MatChipsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatCardModule,
    MatProgressBarModule,
    RouterModule.forRoot([
      { path: 'sign-in', component: SigninComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'showusers', component: ShowusersComponent },
      { path: 'friendstask/:userId', component: FriendstaskComponent },
      { path: 'individualtasks/:userId', component: IndividualtasksComponent },
      { path: 'profile/:userId', component: ProfileComponent },
      { path: '500', component: Error500Component },
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      { path: '**', component: Error404Component }
     
    ]),
    SharedModule
  ],
  providers: [AppService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
