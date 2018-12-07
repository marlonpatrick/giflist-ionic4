import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'list-reddit-posts', pathMatch: 'full' },
  { path: 'list-reddit-posts', loadChildren: './reddit/list-reddit-posts/list-reddit-posts.module#ListRedditPostsPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
