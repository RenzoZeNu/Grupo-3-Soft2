import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService, Usuario } from '../../services/usuario.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private svc: UsuarioService) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.svc.getAll().subscribe(list => this.usuarios = list);
  }

  eliminar(u: Usuario): void {
    // Nunca eliminar admins
    if (u.rol === 'admin') {
      return;
    }
    // Confirmar antes de borrar
    if (!confirm(`¿Eliminar al usuario ${u.nombre}?`)) {
      return;
    }
    this.svc.delete(u.id).subscribe(() => this.load());
  }
}
