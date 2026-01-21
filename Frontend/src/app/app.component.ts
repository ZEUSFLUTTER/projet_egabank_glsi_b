import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KaiadminLoaderService } from './services/kaiadmin-loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'EGABANK - Administration';

  constructor(private kaiadminLoader: KaiadminLoaderService) {}

  ngOnInit(): void {
    // Initialisation au démarrage
  }

  ngAfterViewInit(): void {
    // Charger les scripts Kaiadmin après que la vue soit initialisée
    setTimeout(() => {
      this.kaiadminLoader.loadKaiadminScripts().then(() => {
        console.log('Kaiadmin initialisé avec succès');
      });
    }, 500);
  }
}
