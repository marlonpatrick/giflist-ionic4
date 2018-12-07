import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListRedditPostsPage } from './ui/list-reddit-posts.page';
import { ManageSettingsPage } from 'src/app/settings/manage-settings/ui/manage-settings.page';

const routes: Routes = [
  {
    path: '',
    component: ListRedditPostsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListRedditPostsPage, ManageSettingsPage],
  entryComponents: [ManageSettingsPage]
})
export class ListRedditPostsPageModule {}
