import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  audio = new Audio();

  constructor() { }

  playAudio(src: string) {

    this.audio.src = src
    this.audio.load();
    this.audio.play();

  }

}
