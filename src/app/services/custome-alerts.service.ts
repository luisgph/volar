import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CustomeAlertsService {
  $mouseX = 0; 
  $mouseY = 0;

  constructor(private toastr: ToastrService) { }

  mouseMonitor(){
    var self = this;
    jQuery(document).mousemove(function(e){
      self.$mouseX = e.pageX;
      self.$mouseY = e.pageY; 
    });
  }
  
  warning(message:any,title:any=""){
    this.toastr.warning(message,title, { positionClass: 'toast-bottom-right'});
    this.setPosition();
  }

  success(message:any,title:any=""){
    this.toastr.success(message,'', { positionClass: 'toast-top-right'}); 
    this.setPosition();
  }

  error(message:any,title:any=""){
    this.toastr.error(message,'', { positionClass: 'toast-top-right'});  
    this.setPosition();
  }

  info(message:any,title:any=""){
    this.toastr.info(message,'', { positionClass: 'toast-top-right'});  
    this.setPosition();
  }

  setPosition(){
    jQuery(".toast-container").offset({top: 12}); 
    var self = this;
    setTimeout(function(){
      var positioY= (self.$mouseY-30<0)?12:self.$mouseY-30;
      var positionToastr = jQuery(".toast-container").offset();
      //jQuery(".toast-container").offset({top: positioY});     
      jQuery(".toast-container").animate({top: positioY},"slow");   
    }, 400);
  }
}
