import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Database, ref, get, set, update, remove, child, push } from '@angular/fire/database'
import { FirebaseService } from 'src/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [IonButton, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage implements AfterViewInit {
  constructor(private renderer: Renderer2, private auth: Auth, private router: Router, private firebaseDatabase: FirebaseService) {}

  currentTheme: string = 'dark';
  selectedLanguage: number = 1;

  menu_vocab: any = [
    {0: 'Tentang Kami', 1: 'About Us', 2: '私たちについて'},
    { 0: 'Keluar', 1: 'Logout', 2: 'ログアウト' },
  ]

  footer: any = {
    0: "Hak Cipta © 2024 Hayago Indonesia. Hak cipta dilindungi undang-undang.",
    1: "Copyright © 2024 Hayago Indonesia. All rights reserved.",
    2: "著作権 © 2024 Hayago Indonesia. 無断転載を禁じます。"
  }

  vocabs: any = [
    { 0: 'Tambahkan data', 1: 'Add data', 2: 'データを追加' },
    { 0: 'Ubah', 1: 'Edit', 2: '編集' },
    { 0: 'Hapus', 1: 'Delete', 2: '削除' },
    { 0: 'Kembali', 1: 'Back', 2: '戻る' },
  ]

  user: any = null
  data: any = []

  ngAfterViewInit(): void {
    let localTheme: string = localStorage.getItem('theme') || 'dark'
    let localLanguage: number = parseInt(localStorage.getItem('language')!) || 1
    let localUser: any = localStorage.getItem('user') || null
    this.user = JSON.parse(localUser)
    console.log(this.user)
    if (this.user == null) this.router.navigate(['/'])
    if(localTheme != this.currentTheme) this.renderer.setAttribute(document.documentElement, 'data-theme', localTheme);
    if(localLanguage != this.selectedLanguage) this.selectedLanguage = localLanguage
    this.getAllData()
  }

  async getAllData(): Promise<void> {
    let tempData = await this.firebaseDatabase.getAllData()
    if (tempData) {
      const dataArray = Object.keys(tempData).map((key: any) => {
        return {
          id: key,
          ...tempData[key]
        };
      });
      this.data = dataArray
    } else {
      this.data = []
    }
    console.log(this.data)
  }

  async addData(text: string, lang: string) {
    const uuid = await this.firebaseDatabase.createData({ text, lang });
    this.getAllData()
  }

  async deleteData(uuid: string) {
    await this.firebaseDatabase.deleteData(uuid)
    this.getAllData()
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
