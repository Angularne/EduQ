import {Directive, OnInit, Input, ElementRef} from 'angular2/core';

@Directive({selector: '[bscol]'})
export class BSColDirective implements OnInit {
  @Input() bscol : number;

  @Input() colXs: number;
  @Input() colSm: number;
  @Input() colMd: number;
  @Input() colLg: number;

  constructor(private el: ElementRef) { }

  ngOnInit() {

    this.el.nativeElement.className += ' col-xs-' + (this.colXs | this.bscol);
    this.el.nativeElement.className += ' col-sm-' + (this.colSm | this.bscol);
    this.el.nativeElement.className += ' col-md-' + (this.colMd | this.bscol);
    this.el.nativeElement.className += ' col-lg-' + (this.colLg | this.bscol);
  }
}
