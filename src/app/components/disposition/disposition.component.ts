import { Component, OnInit, ViewChild } from '@angular/core';
import { DispositionModel } from '../../models/disposition-model';
import { ApiListService } from '../../services/api-list.service';
import { GlobalMethodsService } from '../../services/global-methods.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { DispositionService } from '../../services/disposition.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from '../../services/token.service';
import { Pnr } from '../../models/pnr.model';

import { SafeRequestService } from '../../services/safe-request.service';
import { environment } from '../../../environments/environment';
import { CustomeAlertsService } from '../../services/custome-alerts.service';
import { combineLatest } from 'rxjs';
import { PnrComponent } from '../pnr/pnr.component';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-disposition',
  templateUrl: './disposition.component.html',
  styleUrls: ['./disposition.component.css']
})
export class DispositionComponent implements OnInit {

  public disposition: DispositionModel = new DispositionModel();
  public franchise: any[];
  public payment: any[];
  public city: any[] = [];
  public country: any[];
  public languages: any[];
  public carriers: any[];
  public campaign: any[];
  public stations: any[] = [];
  public stationsFilter: any[] = [];
  public originRoute: any[] = [];
  public destinationRoute: any[] = [];
  public detailCampaign: any[] = [];
  public detailCampaignFilter: any[] = [];
  public cityFilter: any[] = [];
  public originRouteFilter: any[] = [];
  public destinationRouteFilter: any[] = [];
  public destinationCampaign: any[] = [];
  private helper = new JwtHelperService();
  public isZeus: boolean = true;
  public origen: string;
  public dispositionFilter: any[] = [];
  public destinationCampaignFind: any;


  public labelNivel = ["Disposition", "Tipificación: *", ""];
  public nivelActual: any;
  public loadingHttp: boolean = false;
  public countNiveles = 0;
  public niveles = [];
  public opcionesNivel: any = [[]];
  public opcionesParent: any = [];

  @ViewChild('pnrComponent') pnrComponent : PnrComponent;


  constructor(public apiListService: ApiListService,
    public globalMethodsService: GlobalMethodsService,
    private localStorageService: LocalStorageService,
    private dispositionService: DispositionService,
    private tokenService: TokenService,
    private safeRequest: SafeRequestService,
    private customAlert: CustomeAlertsService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    if (!localStorage.getItem('requestT')) {
      this.tokenService.getToken().then(() => {
        console.log('no existe token');
        this.getList();
      });
    } else {
      let token = localStorage.getItem('requestT');
      let isExpired = this.helper.isTokenExpired(token);
      if (isExpired) {
        console.log('expiro token');
        this.tokenService.getToken().then(() => {
          console.log('token nuevo');
          this.getList();
        });
      } else {
        console.log('token ok');
        this.getList();
      }
    }
    this.loadAgentSettings();
  }

  loadAgentSettings() {
    let skill = this.localStorageService.getSkill();
    this.localStorageService.setCuenta(skill.cuentaId);
    this.customAlert.mouseMonitor();
  }

  changeCountry(event: any) {
    this.cityFilter = this.city.filter(c => c.country === event.target.value);
    this.stationsFilter = this.stations.filter(c => c.country === event.target.value);

    if (this.cityFilter.length > 0) {
      this.cityFilter.unshift({
        code: '',
        name: 'Seleccione...'
      });
    } else {
      this.cityFilter = [];
    }

    if (this.stationsFilter.length > 0) {
      this.stationsFilter.unshift({
        code: '',
        name: 'Seleccione...'
      });
    } else {
      this.stationsFilter = [];
    }
  }

  changeCampaign(event: any) {
    this.detailCampaignFilter = this.detailCampaign.filter(c => c.campaign === event.target.value);

    if (this.detailCampaignFilter.length > 0) {
      this.detailCampaignFilter.unshift({
        code: '',
        name: 'Seleccione...'
      });
    } else {
      this.detailCampaignFilter = [];
    }
  }

  changeCampaignCall(event: any) {
    this.destinationCampaignFind = this.destinationCampaign.find(c => c.idDestinationCampaign === Number(event.target.value));
    this.getArbolHTTP(this.destinationCampaignFind.campaign);
  }

  save() {
    let nivelSelec: any;
    if (this.countNiveles > 0) {
      nivelSelec = this.opcionesNivel[this.countNiveles];
    } else {
      nivelSelec = this.opcionesParent;
    }

    let valueSelec = jQuery("#nivel" + this.countNiveles).val();
    let opcionSelec = nivelSelec.find(function (element) {
      return element.idDispositionTree == valueSelec;
    });

    this.disposition.dispositionTree = opcionSelec.idDispositionTree;

    const params = { "disposition": JSON.stringify(this.disposition) };

    this.dispositionService.postSave(params).subscribe((res) => {
      this.customAlert.success("Tipificación guardada con exito!. Id de tipificación: " + res.idDisposition);
      this.clearForm();
    });
  }

  clearForm(){
    let destinationCampaign: any = document.getElementById('destinationCampaign');
    let language: any = document.getElementById('language');
    let country: any = document.getElementById('country');
    let payment: any = document.getElementById('payment');
    let campaign: any = document.getElementById('campaign');
    let pnr: any = document.getElementById('pnr');
    let franchise: any = document.getElementById('franchise');
    let carriers: any = document.getElementById('carriers');
    let nivel0: any = document.getElementById('nivel0');

    this.cityFilter = [];
    this.stationsFilter = [];
    this.detailCampaignFilter = [];
    this.disposition.campaignCall = '';
    this.disposition.name = '';
    this.disposition.lastName = '';
    this.disposition.motherLastName = '';
    this.disposition.telephone = 0;
    this.disposition.additionalPhone = 0;
    this.disposition.amount = 0;
    this.disposition.cases = '';
    this.disposition.interactionId = '';
    this.disposition.commentary = '';

    destinationCampaign.selectedIndex = 0;
    language.selectedIndex = 0;
    country.selectedIndex = 0;
    payment.selectedIndex = 0;
    campaign.selectedIndex = 0;
    pnr.selectedIndex = 0;
    franchise.selectedIndex = 0;
    carriers.selectedIndex = 0;
    nivel0.selectedIndex = 0;

    this.pnrComponent.clearPNR();
  }

  getList() {
    this.loadingHttp = true;

    this.disposition.campaignCall = '';
    this.disposition.paymentMethod = '';
    this.disposition.franchise = '';
    this.disposition.country = '';
    this.disposition.city = '';
    this.disposition.language = '';
    this.disposition.originRoute = '';
    this.disposition.destinationRoute = '';
    this.disposition.hasPnr = '';
    this.disposition.campaign = '';
    this.disposition.detailCampaign = '';
    this.disposition.carrier = '';
    this.disposition.userCreated = this.localStorageService.getuserData().correo;
    this.disposition.dateCreated = '';

    const paramsDetail = {
      'campaign': ''
    };
    const paramsCity = {
      'countryCode': ''
    };
    const paramsStations = {
      'countryCode': ''
    };
    combineLatest([
      this.apiListService.getListDestinationCampaign(),
      this.apiListService.getListLanguages(),
      this.apiListService.getListCountry(),
      this.apiListService.getListCity(paramsCity),
      this.apiListService.getListStations(paramsStations),
      this.apiListService.getListPayment(),
      this.apiListService.getListCampaign(),
      this.apiListService.getListDetailCampaign(paramsDetail),
      this.apiListService.getListFranchise(),
      this.apiListService.getListCarriers(),
    ]).subscribe(([destinationCampaign, languages, country, city, stations, payment, campaign, detailCampaign, franchise, carriers ]) => {
      this.loadingHttp = false;
      this.destinationCampaign = destinationCampaign;

      this.languages = languages;
      this.languages.unshift({
        code: '',
        name: 'Seleccione...'
      });

      this.country = country;
      this.country.unshift({
        code: '',
        name: 'Seleccione...'
      });

      this.payment = payment;
      this.payment.unshift({
        idWayToPay: '',
        name: 'Seleccione...'
      });

      this.franchise = franchise;
      this.franchise.unshift({
        idFranchise: '',
        description: 'Seleccione...'
      });

      this.carriers = carriers;
      this.carriers.unshift({
        idCarrier: '',
        name: 'Seleccione...'
      });

      this.campaign = campaign;
      this.campaign.unshift({
        code: '',
        name: 'Seleccione...'
      });

      this.detailCampaign = detailCampaign;
      this.city = city;
      this.stations = stations;

      const origen = this.activatedRoute.snapshot.queryParamMap.get('origen');

      if (origen === "avaya") {
        this.isZeus = false;

        const did = this.activatedRoute.snapshot.queryParamMap.get("campaign");
        this.disposition.telephone = Number(this.activatedRoute.snapshot.queryParamMap.get("telephone"));
        this.disposition.interactionId = this.activatedRoute.snapshot.queryParamMap.get("interaction");

        const destinationCall = this.destinationCampaign.filter(x => x.did === did);
        this.destinationCampaign = destinationCall;
      }
    });
  }

  getData(pnrs: Array<Pnr>): void {
    this.disposition.pnrs = pnrs;
  }

  showChild(parent, nivel) {
    this.nivelActual = nivel;
    this.loadingHttp = true;
    if (parent.value != "" && parent.value != null) {
      let cuenta = this.localStorageService.getCuenta();
      this.safeRequest.generateRequest(true, environment.API_ZEUS_URL, "DispositionTree/" + parent.value + "/GetByAccountAndFather?idAccount=" + cuenta, "get", {}).then(resChild => {
        if (resChild["status"] == "ok") {
          if (nivel < this.countNiveles) {
            this.BorrarNivel(nivel);
          }
          if (resChild.data.length > 0) {
            const activeLevels = resChild.data.filter(element => element.status == 1);
            if (activeLevels.length > 0) {
              this.countNiveles++;
              this.niveles.push(this.countNiveles);
              this.opcionesNivel[this.countNiveles] = activeLevels;
            }
          }
        }
        this.loadingHttp = false;
      });
    } else {
      this.loadingHttp = false;
      this.BorrarNivel(nivel);
    }
  }

  BorrarNivel(nivel: any): void {
    nivel = nivel + 1;
    var limit = this.countNiveles;
    for (let index = nivel; index <= limit; index++) {
      let i = this.niveles.indexOf(index);
      this.niveles.splice(i, 1);
      this.countNiveles--;
    }
  }

  getArbolHTTP(campania: string) {
    console.log(campania);

    this.opcionesParent = [];
    this.loadingHttp = true;
    this.nivelActual = 0;
    let cuenta = this.localStorageService.getCuenta();

    this.safeRequest.generateRequest(true, environment.API_ZEUS_URL, this.safeRequest.getArbol, "get", { "idAccount": cuenta, "nameCampaign": campania }).then(result => {
      this.loadingHttp = false;

      if (result !== []) {

        this.opcionesParent.push(result.data);

        setTimeout(() => {
          $("#nivel0").val(this.opcionesParent[0].idDispositionTree);
          $("#nivel0").change();
          var selec = $("#nivel0")[0];
          this.showChild(selec, 0);
        }, 400);
      } else {
        this.BorrarNivel(0);
      }
    }, () => {
      this.loadingHttp = false;
      console.log("Error en la peticion http");
    });
  }
}
