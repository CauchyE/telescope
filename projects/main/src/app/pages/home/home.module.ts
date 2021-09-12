import { BankModule } from '../../views/home/bank/bank.module';
import { BlocksModule } from '../../views/home/blocks/blocks.module';
import { DistributionModule } from '../../views/home/distribution/distribution.module';
import { HomeModule } from '../../views/home/home.module';
import { MintModule } from '../../views/home/mint/mint.module';
import { TxsModule } from '../../views/home/txs/txs.module';
import { BankComponent } from './bank/bank.component';
import { BlocksComponent } from './blocks/blocks.component';
import { DistributionComponent } from './distribution/distribution.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MintComponent } from './mint/mint.component';
import { TxsComponent } from './txs/txs.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    HomeComponent,
    BankComponent,
    BlocksComponent,
    DistributionComponent,
    MintComponent,
    TxsComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    HomeModule,
    BankModule,
    BlocksModule,
    DistributionModule,
    MintModule,
    TxsModule,
  ],
})
export class AppHomeModule {}
