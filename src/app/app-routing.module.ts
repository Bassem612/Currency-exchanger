import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DetailsComponent } from './components/details/details.component';
import { PageNotFoundComponent } from './components/shared/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', component : HomeComponent, pathMatch: 'full'},
  {path: 'details', component: DetailsComponent},
  {path: 'details/:selectedCurrencies', component: DetailsComponent},
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
