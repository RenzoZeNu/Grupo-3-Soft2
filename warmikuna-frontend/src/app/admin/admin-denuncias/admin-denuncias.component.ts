import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-denuncias',
  imports: [CommonModule],
  templateUrl: './admin-denuncias.component.html',
  styleUrl: './admin-denuncias.component.css'
})
export class AdminDenunciasComponent implements OnInit{
  denuncias: any[] = [];

  constructor(private svc: AdminService) {}

  ngOnInit() {
    this.svc.listarDenuncias().subscribe(d => this.denuncias = d);
  }

  cambiarEstado(id: number, estado: string) {
    this.svc.cambiarEstado(id, estado).subscribe(() => this.ngOnInit());
  }
}
