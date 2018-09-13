import { NgModule } from '@angular/core';
import { NgForObjectPipe } from './ng-for-object/ng-for-object';
import { EquipFilterPipe } from './equip-filter/equip-filter';
@NgModule({
	declarations: [NgForObjectPipe,
    EquipFilterPipe],
	imports: [],
	exports: [NgForObjectPipe,
    EquipFilterPipe]
})
export class PipesModule {}
