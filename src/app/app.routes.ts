import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { RenderMode } from '@angular/ssr';

export const routes: Routes = [
  {
    path: '',
    component: GameComponent,
  },
  { path: 'create', component: CreateGameComponent },
  {
    path: 'play/:id',
    component: GameComponent,
    data: {
      RenderMode: 'client',
    },
  },
];
