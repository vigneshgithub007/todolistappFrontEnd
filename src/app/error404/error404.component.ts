import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css']
})
export class Error404Component implements OnInit {

  constructor( public router: Router, public _route: ActivatedRoute) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(["/sign-in"])
    }, 6000);
  }

}
