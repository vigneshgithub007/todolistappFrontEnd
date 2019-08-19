import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error500',
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.css']
})
export class Error500Component implements OnInit {

  constructor(public router: Router, public _route: ActivatedRoute) { }

  ngOnInit() {
    
    setTimeout(() => {
      this.router.navigate(['/sign-in'])
    }, 4000);

  }

}
