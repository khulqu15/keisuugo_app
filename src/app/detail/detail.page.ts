import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Database, ref, get, set, update, remove, child, push } from '@angular/fire/database'
import { FirebaseService } from 'src/firebase.service';
import { FormsModule } from '@angular/forms';
import { TextToSpeech } from '@capacitor-community/text-to-speech';


@Component({
  selector: 'app-text',
  templateUrl: 'detail.page.html',
  standalone: true,
  imports: [IonButton, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, FormsModule],
})
export class DetailPage implements AfterViewInit, OnInit {
  constructor(private renderer: Renderer2, private auth: Auth, private router: Router, private activeRouter: ActivatedRoute, private firebaseDatabase: FirebaseService) {}
  uuid: string | null = null;
  textDetail: any = {
    lang: 'id-ID',
    text: 'Tunggu bentar...'
  };

  vocabs: any = [
    { 0: 'Kembali', 1: 'Back', 2: '戻る' },
  ]

  currentTheme: string = 'dark';
  selectedLanguage: number = 1;

  menu_vocab: any = [
    {0: 'Tentang Kami', 1: 'About Us', 2: '私たちについて'},
  ]

  footer: any = {
    0: "Hak Cipta © 2024 Hayago Indonesia. Hak cipta dilindungi undang-undang.",
    1: "Copyright © 2024 Hayago Indonesia. All rights reserved.",
    2: "著作権 © 2024 Hayago Indonesia. 無断転載を禁じます。"
  }

  user: any = null

  is_playing: boolean = false

  ngOnInit(): void {
    this.uuid = this.activeRouter.snapshot.paramMap.get('uuid');

    if (this.uuid) {
      this.firebaseDatabase.readData(this.uuid).then((data) => {
        this.textDetail = data;
        console.log(this.textDetail)
      }).catch((error) => {
        console.error('Error fetching text details:', error);
      });
    }
  }

  ngAfterViewInit(): void {
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage: number = parseInt(localStorage.getItem('language')!) || 1
    let localUser: any = localStorage.getItem('user') || null
    this.user = JSON.parse(localUser)
    console.log(this.user)
    if (this.user == null) this.router.navigate(['/'])
    if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
    if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme == 'dark' ? 'light' : 'dark';
    this.renderer.setAttribute(document.documentElement, 'data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  changeLanguage(option: number): void {
    this.selectedLanguage = option
    localStorage.setItem('language', this.selectedLanguage.toString());
  }

  navigatePush(path: string): void {
    this.router.navigate([path])
  }

  async logout() {
    await this.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  async speak(): Promise<void> {
    this.is_playing = !this.is_playing
    if(this.is_playing) {
      await TextToSpeech.speak({
        text: this.textDetail.text,
        lang: this.textDetail.lang,
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        category: 'ambient'
      })
    } else {
      await TextToSpeech.stop();
    }
  }
}
