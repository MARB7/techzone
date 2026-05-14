import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  isEditing = false;
  editData = {
    first_name: '',
    last_name: '',
    email: '',
    telefono: ''
  };
  msg = '';
  avatarFile?: File;
  avatarPreview?: string;

  constructor(public auth: AuthService, private router: Router) {
    if (!auth.user()) this.router.navigate(['/']);
  }

  ngOnInit() {
    this.initEditData();
  }

  initEditData() {
    if (this.user) {
      this.editData = {
        first_name: this.user.first_name || '',
        last_name: this.user.last_name || '',
        email: this.user.email || '',
        telefono: this.user.perfil?.telefono || ''
      };
    }
  }

  get user() { return this.auth.user()!; }

  get userDisplayName(): string {
    if (!this.user) return '';
    const name = `${this.user.first_name} ${this.user.last_name}`.trim();
    return name || this.user.username;
  }

  get userAvatar(): string {
    if (this.user?.perfil?.avatar) {
      const url = this.user.perfil.avatar;
      return url.startsWith('http') ? url : `http://localhost:8000${url}`;
    }
    const name = this.userDisplayName || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2dd4a8&color=0a0a0a&bold=true&size=128`;
  }

  logout() { this.auth.logout(); this.router.navigate(['/']); }

  toggleEdit() {
    if (!this.isEditing) {
      this.initEditData();
    }
    this.isEditing = !this.isEditing;
  }

  onFileChange(ev: any) {
    const f = ev.target.files[0];
    if (f) {
      this.avatarFile = f;
      this.avatarPreview = URL.createObjectURL(f);
    }
  }

  saveProfile() {
    const formData = new FormData();
    formData.append('first_name', this.editData.first_name);
    formData.append('last_name', this.editData.last_name);
    formData.append('email', this.editData.email);
    formData.append('telefono', this.editData.telefono);
    if (this.avatarFile) {
      formData.append('avatar', this.avatarFile);
    }

    this.auth.updateProfile(formData).subscribe({
      next: () => {
        this.isEditing = false;
        this.avatarFile = undefined;
        this.avatarPreview = undefined;
        this.msg = 'Perfil actualizado exitosamente';
        setTimeout(() => this.msg = '', 3000);
      },
      error: () => {
        this.msg = 'Error al actualizar el perfil';
        setTimeout(() => this.msg = '', 3000);
      }
    });
  }
}
