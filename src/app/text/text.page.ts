import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Database, ref, get, set, update, remove, child, push } from '@angular/fire/database'
import { FirebaseService } from 'src/firebase.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-text',
  templateUrl: 'text.page.html',
  standalone: true,
  imports: [IonButton, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, FormsModule],
})
export class TextPage implements AfterViewInit {
  constructor(private renderer: Renderer2, private auth: Auth, private router: Router, private activeRouter: ActivatedRoute, private firebaseDatabase: FirebaseService) {}

  newData = {
    lang: 'id-ID',
    text: ''
  };

  currentTheme: string = 'dark';
  selectedLanguage: number = 1;

  menu_vocab: any = [
    {0: 'Tentang Kami', 1: 'About Us', 2: '私たちについて'},
    {0: 'Keluar', 1: 'Logout', 2: 'ログアウト' },
  ]

  footer: any = {
    0: "Hak Cipta © 2024 Hayago Indonesia. Hak cipta dilindungi undang-undang.",
    1: "Copyright © 2024 Hayago Indonesia. All rights reserved.",
    2: "著作権 © 2024 Hayago Indonesia. 無断転載を禁じます。"
  }

  user: any = null

  isEditMode = false;

  vocabs: any = [
    { 0: 'Kembali', 1: 'Back', 2: '戻る' },
  ]

  uuid: string | null = null;

  ngAfterViewInit(): void {
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage: number = parseInt(localStorage.getItem('language')!) || 1
    let localUser: any = localStorage.getItem('user') || null
    this.user = JSON.parse(localUser)
    console.log(this.user)
    if (this.user == null) this.router.navigate(['/'])
    if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
    if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
    this.uuid = this.activeRouter.snapshot.paramMap.get('uuid');
    if (this.uuid) {
      this.isEditMode = true;
      this.loadDataForEdit(this.uuid);
    }
  }

  async loadDataForEdit(uuid: string) {
    try {
      const data = await this.firebaseDatabase.readData(uuid);
      if (data) {
        this.newData = data;
      }
    } catch (error) {
      console.error('Error loading data for edit:', error);
    }
  }

  async onSubmit(form: any) {
    if (form.valid) {
      try {
        if (this.isEditMode && this.uuid) {
          await this.firebaseDatabase.updateData(this.uuid, this.newData);
        } else {
          await this.firebaseDatabase.createData(this.newData);
        }
        this.navigatePush('/home');
        form.resetForm();
      } catch (error) {
        console.error('Error saving data:', error);
      }
    } else {
      console.log('Form is invalid');
    }
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

}
