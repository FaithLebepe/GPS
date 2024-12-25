import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild  } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { GoogleMap, MapType } from '@capacitor/google-maps';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage {

  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  newMap!: GoogleMap;
  center: any = {
    lat: -26.686746,
    lng: 27.093026,
  }
  markerId: string = '';
  
  ngAfterViewInit(){
    this.createMap();
  }

  constructor() {}

  async createMap() {
    try {
      this.newMap = await GoogleMap.create({
        id: 'capacitor-google-maps',
        element: this.mapRef.nativeElement,
        apiKey: environment.google_maps_api_key,
        config: {
          center: this.center,
          zoom: 13,
        },
      });

      // move the app programmacally
      await this.newMap.setCamera({
        coordinate: {
          lat: this.center.lat,
          lng: this.center.lng,
        },
        animate: true
      })

      // enable Clustering
      // await this.newMap.enableClustering();

      // Enable traffic layer
      await this.newMap.enableTrafficLayer(true);

      await this.newMap.enableCurrentLocation(true);

      // await this.newMap.setPadding({
      //   top: 5,
      //   left: 5,
      //   right: 5,
      //   bottom: 5,
      // });
      
    //await this.newMap.setMapType(MapType.Hybrid);

     this.addMarkers(this.center.lat, this.center.lng);
     this.addListeners()
    } catch(e){
      console.log(e);
    }
  }

  async addMarkers(lat: any, lng: any) {
    // add a marker to the map
    if (this.markerId) this.removeMarker();
    await this.newMap.addMarkers([
      {
        coordinate: {
          lat: lat,
          lng: lng,
        },
        //title,
        draggable: true
      },

      {
        coordinate: {
          lat: -26.68674,
          lng: 27.09302,
        },
        //title,
        draggable: true
      },
    ]);
  }

  async addMarker(lat: any, lng: any) {
    // add a marker to the map
    if (this.markerId) this.removeMarker();
    this.markerId = await this.newMap.addMarker({
      coordinate: {
        lat: lat,
        lng: lng,
      },
      //title,
      draggable: true
    });
  }

  async removeMarker(id?: any) {
    await this.newMap.removeMarker(id ? id: this.markerId);
  }

  async addListeners() {
    // handle marker click
    await this.newMap.setOnMapClickListener((event) => {
      console.log('setOnMapClickListener', event);
    });

    // await this.newMap.setOnCameraMoveStartedListener((event) => {
    //   console.log(event);
    // });

    await this.newMap.setOnMapClickListener((event) => {
      console.log('setOnMapClickListener', event);
      this.addMarker(event.latitude, event.longitude);
    });

    await this.newMap.setOnMyLocationButtonClickListener((event) => {
      console.log('setOnMyLocationButtonClickListener', event);
      //this.addMarker(event.latitude, event.longitude);
    });
  
    await this.newMap.setOnMyLocationClickListener((event) => {
      console.log('setOnMyLocationClickListener', event);
      this.addMarker(event.latitude, event.longitude);
    });
  }

}
