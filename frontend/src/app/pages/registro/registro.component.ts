import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  registroForm: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  success: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const password2 = group.get('password2')?.value;
    return password === password2 ? null : { passwordMismatch: true };
  }

  get f() {
    return this.registroForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = null;
    this.success = null;

    if (this.registroForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registroForm.value).subscribe({
      next: () => {
        this.success = 'Registro exitoso! Redireccionando...';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        if (error.error && typeof error.error === 'object') {
          const errors = Object.values(error.error).flat();
          this.error = Array.isArray(errors) ? String(errors[0]) : 'Error en el registro';
        } else {
          this.error = 'Error en el registro';
        }
        this.loading = false;
      }
    });
  }
}
