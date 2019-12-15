import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TxComponent } from './txs/tx/tx.component';


const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "tx/:hash", component: TxComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
