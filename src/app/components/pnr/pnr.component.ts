import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTable, MatTableDataSource} from '@angular/material';
import {LocalStorageService} from '../../services/local-storage.service';
import {Pnr} from '../../models/pnr.model';
import { GlobalMethodsService } from '../../services/global-methods.service';

@Component({
  selector: 'app-pnr',
  templateUrl: './pnr.component.html',
  styleUrls: ['./pnr.component.css']
})
export class PnrComponent implements OnInit {
  @Input() payment: any;
  @Input() phone: number;
  @Output() getPNRs = new EventEmitter<Array<Pnr>>();
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  public displayedColumns: string[] = ['phone', 'pnr', 'creationDate', 'actions'];
  public dataSource: MatTableDataSource<any>;
  public lengthListTable = 0;
  public form: FormGroup;
  public isAvaya: boolean;
  public userInfo: any;

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    private datePipe: DatePipe,
    public globalMethodsService: GlobalMethodsService
  ) {
    this.isAvaya = localStorageService.getOrigen() === 'avaya';
    this.userInfo = localStorageService.getuserData();
    this.form = fb.group({
      phone: [{value: this.isAvaya && this.phone !== undefined ? this.phone : null, disabled: this.isAvaya}, [Validators.required, Validators.pattern('[0-9]*')]],
      pnr: [{value: null, disabled: false}, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      paymentType: [{value: '', disabled: false}, Validators.required],
      creationDate: [{value: null, disabled: false}, Validators.required],
    });
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = [];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void { }

  add(): void {
    this.dataSource.data.push({
      idPnr: null,
      idDisposition: null,
      telephone: this.form.get('phone').value,
      pnr: this.form.get('pnr').value,
      paymentType: parseInt(this.form.get('paymentType').value, 10),
      userCreated: this.userInfo.windowsId,
      dateCreated: this.datePipe.transform(this.form.get('creationDate').value, 'yyyy-MM-dd HH:mm'),
    });
    this.lengthListTable = this.dataSource.data.length;
    this.dataSource.paginator = this.paginator;
    this.table.renderRows();
    this.form.reset();
    if (this.isAvaya) {
      this.form.patchValue({phone: this.phone, paymentType: ''});
    } else {
      this.form.patchValue({paymentType: ''});
    }
    this.getPNRs.emit(this.dataSource.data);
  }

  questionDelete(id: number): void {
    const self = this;
    ($ as any).confirm({
      theme: 'modern',
      title: '<span style="color:#777;"><span class="mdi mdi-delete"></span> Eliminar</span>',
      type: 'dark',
      animationBounce: 2.5,
      animation: 'rotateYR',
      content: '¿Esta seguro de eliminar el PNR seleccionado?',
      buttons: {
        Si: {
          text: `<span class="mdi mdi-checkbox-multiple-marked-circle-outline"></span> Si!`,
          btnClass: 'btn-success btn-yes',
          action: function () {
            self.delete(id);
          }
        },
        No: {
          text: `<span style="color:#777;"><span class="mdi mdi-close-circle-outline"></span> No!</span>`,
          btnClass: 'btn-default',
        }
      }
    });
  }

  delete(index: number): void {
    this.dataSource.data.splice(index, 1);
    this.lengthListTable = this.dataSource.data.length;
    this.dataSource.paginator = this.paginator;
    this.table.renderRows();
    this.getPNRs.emit(this.dataSource.data);
  }

  clearPNR(){
    this.dataSource.data = [];
  }

}
