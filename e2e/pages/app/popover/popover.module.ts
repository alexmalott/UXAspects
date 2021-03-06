import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PopoverModule, AccessibilityModule } from '@ux-aspects/ux-aspects';
import { PopoverFallbackTestPageComponent } from './fallback/popover-fallback.testpage.component';
import { PopoverTestPageComponent } from './standard/popover.testpage.component';

@NgModule({
    imports: [
        CommonModule,
        PopoverModule,
        AccessibilityModule,
        RouterModule.forChild([
            {
                path: '',
                component: PopoverTestPageComponent
            },
            {
                path: 'fallback',
                component: PopoverFallbackTestPageComponent
            }
        ])
    ],
    declarations: [
        PopoverTestPageComponent,
        PopoverFallbackTestPageComponent
    ],
})
export class PopoverTestPageModule {

}
