import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wc-pengaturan',
  templateUrl: './pengaturan.component.html',
  styleUrls: ['./pengaturan.component.scss']
})
export class PengaturanComponent implements OnInit {

  domain: string = '';
  token: string = '';
  salamUndangan: string = 'Assalamu’alaikum Warahmatullahi Wabarakatuh.';
  salamWhatsappAtas: string = 'Assalamu’alaikum Wr. Wb.';
  salamWhatsappBawah: string = 'Assalamu’alaikum Wr. Wb.';
  filters = [
    { name: 'Halaman sampul', active: false },
    { name: 'Halaman Mempelai', active: false },
    { name: 'Halaman Acara', active: false },
    { name: 'Halaman Ucapan', active: false },
    { name: 'Halaman Gallery/Album', active: false },
    { name: 'Halaman Cerita', active: false },
    { name: 'Halaman Lokasi', active: false },
    { name: 'Halaman Prokes', active: false },
    { name: 'Halaman Kirim Hadiah', active: false },
    { name: 'Halaman Quote', active: false },
  ];

  constructor() { }

  ngOnInit(): void {
  }

  saveToken() {
    console.log('Domain:', this.domain, 'Token:', this.token);
  }

  uploadMusic(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploaded file:', file.name);
    }
  }

  submitMusic() {
    console.log('Music submitted.');
  }

  saveSalam() {
    console.log('Salam:', this.salamUndangan, this.salamWhatsappAtas, this.salamWhatsappBawah);
  }

  applyFilters() {
    console.log('Active filters:', this.filters.filter(f => f.active));
  }

}
