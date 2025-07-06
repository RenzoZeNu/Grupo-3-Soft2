import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-usuarios',
  imports: [CommonModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css'
})
export class AdminUsuariosComponent implements OnInit{
  usuarios: any[] = [];

  constructor(private svc: AdminService) {}

  ngOnInit() {
    this.svc.listarUsuarios().subscribe(u => this.usuarios = u);
  }

  eliminar(id: number) {
    this.svc.eliminarUsuario(id).subscribe(() => this.ngOnInit());
  }

}
