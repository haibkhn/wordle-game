import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { CreateGameComponent } from './components/create-game/create-game.component';

export const routes: Routes = [
  {
    path: '',
    component: GameComponent,
  },
  {
    path: 'create',
    component: CreateGameComponent,
  },
  {
    path: 'play/:id',
    component: GameComponent,
  },
];
