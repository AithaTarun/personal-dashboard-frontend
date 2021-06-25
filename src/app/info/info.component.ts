import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component
(
    {
      selector: 'app-info',
      templateUrl: './info.component.html',
      styleUrls: ['./info.component.scss']
    }
)
export class InfoComponent implements OnInit
{
  @Input() headerText;
  @Input() content;
  @Input() type;

  classText;

  constructor(public activeModal: NgbActiveModal)
  {

  }

  ngOnInit()
  {
      this.classText = 'modal-header text-center ';

      if (this.type === 'message')
      {
           this.classText = this.classText + 'gradient-cyan-light-green';
      }
      else if (this.type === 'error')
      {
          this.classText = this.classText + 'gradient-bloody-mary';
      }

  }

}
