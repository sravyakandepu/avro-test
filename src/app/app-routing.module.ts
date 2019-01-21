import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CheckinComponent} from './checkin/checkin.component';


// @ts-ignore
const routes: Routes = [
    {path: '', redirectTo: '/checkin', pathMatch: 'full'},
    {path: 'checkin', component: CheckinComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
