import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './model/post.model';
import { PostService } from './services/post.service';
import { title } from 'process';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('postForm') postForm: NgForm;
  @ViewChild('updateForm') updateForm: NgForm;

  loadedPosts = [];
  showLoading = false;
  error = null;

  errorSubs: Subscription;

  constructor(
    private postService: PostService,
    private http: HttpClient) { }

  ngOnDestroy(): void {
    this.errorSubs.unsubscribe();
  }

  ngOnInit() {
    this.errorSubs = this.postService.errorHandling.subscribe(
      error => {
        this.error = error;
      }
    );

    this.fecthPosts();
  }

  fecthPosts() {
    this.showLoading = true;
    this.error = null;
    this.postService.fetchPosts()
      .subscribe(
        posts => {
          this.showLoading = false;
          this.loadedPosts = posts;
        },
        error => {
          this.showLoading = false;
          this.error = error;
        }
      );
  }

  onCreatePost(postData: Post) {
    this.postService.createAndPost(postData);
  }

  onUpdate(updateData: Post) {
    this.showLoading = true;
    this.postService.updateData(updateData).subscribe(
      (response) => {
        this.showLoading = false;
        console.log(response)
      },
      error => {
        this.showLoading = false;
        this.error = error;
      }
    );
  }

  onItemClicked(selectedData: Post) {
    this.updateForm.setValue({
      id: selectedData.id,
      title: selectedData.title,
      content: selectedData.content
    });
  }

  clearPosts() {
    this.showLoading = true;
    this.postService.deletePosts().subscribe(
      (data) => {
        this.showLoading = false;
        this.loadedPosts = [];
      },
      error => {
        this.showLoading = false;
        this.error = error;
      }
    );
  }


}
