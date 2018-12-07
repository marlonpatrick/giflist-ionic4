import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, filter } from 'rxjs/operators';
import { SettingsDataService } from 'src/app/settings/shared/domain/settings-data.service';
import { RedditPost } from './reddit-post';


@Injectable({
  providedIn: 'root'
})
export class RedditService {

  public settings = {
    perPage: 10,
    subreddit: 'gifs',
    sort: '/hot'
  };

  public posts: any[] = [];

  public loading = false;
  private page = 1;
  private after: string;
  private moreCount = 0;

  constructor(private http: HttpClient, private dataService: SettingsDataService) { }

  load(): void {
    this.dataService.getData().then((settings) => {

      if (settings != null) {
        this.settings = settings;
      }

      this.fetchData();
    });
  }

  private fetchData(): void {

    this.loading = true;

    // Build the URL that will be used to access the API based on the users current preferences
    let url = 'https://www.reddit.com/r/' + this.settings.subreddit + this.settings.sort + '/.json?limit=100';

    // Only grab posts from the API after the last post we retrieved (if we've already fetched some data)
    if (this.after) {
      url += '&after=' + this.after;
    }

    this.http.get(url)
      .pipe(
        // Modify the response to return data in a more friendly format
        map((res: any) => {

          console.log(res);

          let response: any[] = res.data.children;
          let validPosts = 0;

          response = response.filter((post) => {

            const isValidPostResult = this.isValidPost(post, validPosts);

            if (isValidPostResult) {
              validPosts++;
            }

            return isValidPostResult;
          });

          response.forEach((post) => {

            this.convertUrlFormat(post);

            this.createSnapshotField(post);
          });

          this.getLastPost(validPosts, response, res);

          console.log(this.after);

          return response;
        })
      ).subscribe((data: any) => {

        console.log(data);

        // Add new posts we just pulled in to the existing posts
        this.posts.push(...data);

        // Keep fetching more GIFs if we didn't retrieve enough to fill a page
        // But give up after 20 tries if we still don't have enough
        if (this.moreCount > 20) {

          console.log('giving up');

          // Time to give up!
          this.moreCount = 0;
          this.loading = false;
        } else {

          // If we don't have enough valid posts to fill a page, try fetching more data
          if (this.posts.length < (this.settings.perPage * this.page)) {
            this.fetchData();
            this.moreCount++;
          } else {
            this.loading = false;
            this.moreCount = 0;
          }
        }

      }, err => {
        console.log(err);

        // Fail silently, in this case the loading spinner will just continue to display
        console.warn('Can\'t find data!');
      });
  }

  private getLastPost(validPosts: number, handledResponse: any[], originalResponse: any) {

    // If we had enough valid posts, set that as the "after", otherwise just set the last post
    if (validPosts >= this.settings.perPage) {
      this.after = handledResponse[this.settings.perPage - 1].data.name;
    } else if (originalResponse.data.children.length > 0) {
      this.after = originalResponse.data.children[originalResponse.data.children.length - 1].data.name;
    }
  }

  private createSnapshotField(post): void {

    // If a preview image is available, assign it to the post as 'snapshot'
    if (post.data.preview) {
      post.data.snapshot = post.data.preview.images[0].source.url.replace(/&amp;/g, '&');
    }

    // If the snapshot is undefined, change it to be blank so it doesnt use a broken image
    if (!post.data.snapshot) {
      post.data.snapshot = '';
    }
  }
  private convertUrlFormat(post): void {
    post.data.url = post.data.url.replace('.gifv', '.mp4');
    post.data.url = post.data.url.replace('.webm', '.mp4');
  }

  // Remove any posts that don't provide a GIF in a suitable format
  private isValidPost(post, validPostsQty: number): boolean {

    // If we've already retrieved enough posts for a page, we don't want anymore
    if (validPostsQty >= this.settings.perPage) {
      return false;
    }

    // .gifv is a valid format to convert to mp4
    if (post.data.url.indexOf('.gifv') > -1) {
      return true;
    }

    // .webm is a valid format to convert to mp4
    if (post.data.url.indexOf('.webm') > -1) {
      return true;
    }

    return false;
  }

  nextPage(): void {
    this.page++;
    this.fetchData();
  }

  resetPosts() {
    this.page = 1;
    this.posts = [];
    this.after = null;
    this.fetchData();
  }

  changeSubreddit(subreddit): void {
    this.settings.subreddit = subreddit;
    this.resetPosts();
  }
}
