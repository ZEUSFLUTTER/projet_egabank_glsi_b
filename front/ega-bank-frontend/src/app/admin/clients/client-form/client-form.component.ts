import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from 'src/app/core/services/client.service';
import { Client } from 'src/app/core/models/client.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss']
})
export class ClientFormComponent implements OnInit {
  clientForm: FormGroup;
  clientId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params['id'];
    if (this.clientId) {
      this.loadClient();
    }
  }

  loadClient(): void {
    this.clientService.getClientById(this.clientId).subscribe((client: Client) => {
      this.clientForm.patchValue(client);
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const clientData: Client = this.clientForm.value;
      if (this.clientId) {
        this.clientService.updateClient(this.clientId, clientData).subscribe(() => {
          this.router.navigate(['/admin/clients']);
        });
      } else {
        this.clientService.createClient(clientData).subscribe(() => {
          this.router.navigate(['/admin/clients']);
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/clients']);
  }
}