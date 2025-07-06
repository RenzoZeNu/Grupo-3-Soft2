import { Component, OnInit } from '@angular/core';
import { AdminService }      from '../../services/admin.service';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  standalone: true
})
export class AdminUsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private svc: AdminService) {}

  ngOnInit() {
    this.svc.listarUsuarios().subscribe(u => this.usuarios = u);
  }

  eliminar(id: number) {
    this.svc.eliminarUsuario(id).subscribe(() => this.ngOnInit());
  }
}


