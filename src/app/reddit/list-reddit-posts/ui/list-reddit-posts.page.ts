import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SettingsDataService } from 'src/app/settings/shared/domain/settings-data.service';
import { RedditService } from '../../shared/domain/reddit.service';
import { ManageSettingsPage } from 'src/app/settings/manage-settings/ui/manage-settings.page';


const { Browser, Keyboard } = Plugins;

@Component({
  selector: 'app-list-reddit-posts',
  templateUrl: './list-reddit-posts.page.html',
  styleUrls: ['./list-reddit-posts.page.scss'],
})
export class ListRedditPostsPage implements OnInit {

  public subredditForm: FormGroup;

  constructor(private dataService: SettingsDataService, public redditService: RedditService, private modalCtrl: ModalController) {

  }

  ngOnInit() {

    this.subredditForm = new FormGroup({
      subredditControl: new FormControl('')
    });

    this.redditService.load();

    this.subredditForm.get('subredditControl').valueChanges.pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe((subreddit) => {

        if (subreddit.length > 0) {
          this.redditService.changeSubreddit(subreddit);
          Keyboard.hide().catch(err => console.warn(err));
        }
      });
  }

  showComments(post): void {

    Browser.open({
      toolbarColor: '#fff',
      url: 'http://reddit.com' + post.data.permalink,
      windowName: '_system'
    });

  }

  openSettings(): void {
    this.modalCtrl.create({
      component: ManageSettingsPage
    }).then((modal) => {

      modal.onDidDismiss().then(() => {
        this.redditService.resetPosts();
      });

      modal.present();

    });
  }

  playVideo(e, post): void {

    // Create a reference to the video
    const video = e.target;

    // Toggle the video playing
    if (video.paused) {

      // Show the loader gif
      video.play();

      video.addEventListener('playing', (_e) => {
        console.log('playing video');
      });

    } else {
      video.pause();
    }
  }

  loadMore(): void {
    this.redditService.nextPage();
  }
}
