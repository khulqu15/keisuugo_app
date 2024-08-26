import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth'

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  standalone: true,
  imports: [IonButton, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})

export class LoginPage implements AfterViewInit {

  constructor(private renderer: Renderer2, private auth: Auth, private router: Router) {}

  ngAfterViewInit(): void {
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage = parseInt(localStorage.getItem('language')!) || 0
    if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
    if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
    this.speak(this.vocab[0][this.selectedLanguage])
    this.speak(this.vocab[1][this.selectedLanguage])
    this.speak(this.vocab[2][this.selectedLanguage])
  }

  vocab: any = [
    {0: 'Hai, Selamat Datang', 1: 'Hello, Welcome', 2: 'こんにちは、ようこそ'},
    {0: 'Senang Bertemu denganmu, mari membaca bersamaku', 1: 'Nice to meet you, let\'s read together', 2: 'お会いできて嬉しいです、一緒に読んでみましょう'},
    {0: 'Ayo login dengan Google', 1: 'Let\'s login with Google', 2: 'Googleでログインしましょう'},
  ]

  languages: any = {0: 'id-ID', 1: 'en-US', 2: 'ja-JP'}

  currentTheme = 'dark'
  selectedLanguage: number = 0

  changeLanguage(option: number): void {
    this.selectedLanguage = option
    localStorage.setItem('language', this.selectedLanguage.toString());
    setTimeout(() => window.location.reload(), 200)
  }

  toggleTheme(): void {
    this.currentTheme = this.currentTheme == 'dark' ? 'light' : 'dark';
    this.renderer.setAttribute(document.documentElement, 'data-theme', this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  async googleLogin() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      if (user) {
        localStorage.setItem('user', JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
          photoURL: user.photoURL
        }));
        console.log('User information saved to localStorage:', user);
        this.router.navigate(['/home']);
      }
    } catch (error) {
      console.error("Google login error: ", error);
    }
  }


  async speak(text: string): Promise<void> {
    await TextToSpeech.speak({
      text: text,
      lang: this.languages[this.selectedLanguage],
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
      category: 'ambient'
    })
  }

}
