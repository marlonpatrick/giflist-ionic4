import { Component } from '@angular/core';
import { RedditService } from 'src/app/reddit/shared/domain/reddit.service';
import { ModalController } from '@ionic/angular';
import { SettingsDataService } from '../../shared/domain/settings-data.service';

@Component({
  selector: 'app-manage-settings',
  templateUrl: './manage-settings.page.html',
  styleUrls: ['./manage-settings.page.scss'],
})
export class ManageSettingsPage {

  constructor(public redditService: RedditService, private dataService: SettingsDataService, private modalCtrl: ModalController) {

  }

  save(): void {

    this.dataService.save({
      perPage: this.redditService.settings.perPage,
      sort: this.redditService.settings.sort,
      subreddit: this.redditService.settings.subreddit
    });

    this.close();

  }

  close(): void {
    console.log('ManageSettingsPage.close');
    this.modalCtrl.dismiss();
  }

}
