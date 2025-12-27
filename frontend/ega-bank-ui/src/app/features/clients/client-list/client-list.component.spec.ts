import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Client, PageResponse } from '../../../core/models';
import { ClientService } from '../../../core/services/client.service';
import { ClientListComponent } from './client-list.component';

describe('ClientListComponent', () => {
    let component: ClientListComponent;
    let fixture: ComponentFixture<ClientListComponent>;
    let clientServiceSpy: {
        getAll: ReturnType<typeof vi.fn>;
        search: ReturnType<typeof vi.fn>;
        create: ReturnType<typeof vi.fn>;
        update: ReturnType<typeof vi.fn>;
        delete: ReturnType<typeof vi.fn>;
    };

    const mockClient: Client = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        nomComplet: 'Jean Dupont',
        dateNaissance: '1990-05-15',
        sexe: 'MASCULIN',
        adresse: '123 Rue de la Paix',
        telephone: '+22890123456',
        courriel: 'jean.dupont@email.com',
        nationalite: 'Togolaise',
        createdAt: '2025-01-01T00:00:00',
        nombreComptes: 2
    };

    const mockPageResponse: PageResponse<Client> = {
        content: [mockClient],
        pageNumber: 0,
        pageSize: 10,
        totalElements: 1,
        totalPages: 1,
        first: true,
        last: true
    };

    beforeEach(async () => {
        clientServiceSpy = {
            getAll: vi.fn().mockReturnValue(of(mockPageResponse)),
            search: vi.fn().mockReturnValue(of(mockPageResponse)),
            create: vi.fn().mockReturnValue(of(mockClient)),
            update: vi.fn().mockReturnValue(of(mockClient)),
            delete: vi.fn().mockReturnValue(of({ success: true, message: 'Supprimé' }))
        };

        await TestBed.configureTestingModule({
            imports: [ClientListComponent, ReactiveFormsModule, FormsModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: ClientService, useValue: clientServiceSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ClientListComponent);
        component = fixture.componentInstance;
    });

    describe('Initialization', () => {
        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should load clients on init', fakeAsync(() => {
            fixture.detectChanges();
            tick();

            expect(clientServiceSpy.getAll).toHaveBeenCalledWith(0, 10);
            expect(component.clients().length).toBe(1);
        }));

        it('should have empty clients initially before loading', () => {
            expect(component.clients()).toEqual([]);
        });

        it('should set pageInfo after loading', fakeAsync(() => {
            fixture.detectChanges();
            tick();

            expect(component.pageInfo()).not.toBeNull();
            expect(component.pageInfo()?.totalElements).toBe(1);
        }));
    });

    describe('loadClients', () => {
        it('should load clients for a specific page', fakeAsync(() => {
            component.loadClients(2);
            tick();

            expect(clientServiceSpy.getAll).toHaveBeenCalledWith(2, 10);
        }));

        it('should update clients signal with response', fakeAsync(() => {
            const multiClientResponse: PageResponse<Client> = {
                ...mockPageResponse,
                content: [mockClient, { ...mockClient, id: 2, nom: 'Martin' }],
                totalElements: 2
            };
            clientServiceSpy.getAll.mockReturnValue(of(multiClientResponse));

            component.loadClients(0);
            tick();

            expect(component.clients().length).toBe(2);
        }));
    });

    describe('Search', () => {
        it('should not search if query is less than 3 characters', fakeAsync(() => {
            component.searchQuery = 'ab';
            component.onSearch();
            tick();

            expect(clientServiceSpy.search).not.toHaveBeenCalled();
        }));

        it('should search when query is 3 or more characters', fakeAsync(() => {
            component.searchQuery = 'Dup';
            component.onSearch();
            tick();

            expect(clientServiceSpy.search).toHaveBeenCalledWith('Dup', 0, 10);
        }));

        it('should reload all clients when search is cleared', fakeAsync(() => {
            fixture.detectChanges();
            tick();

            clientServiceSpy.getAll.mockClear();
            component.searchQuery = '';
            component.onSearch();
            tick();

            expect(clientServiceSpy.getAll).toHaveBeenCalledWith(0, 10);
        }));
    });

    describe('Modal', () => {
        it('should open modal for new client', () => {
            component.openModal();

            expect(component.showModal()).toBe(true);
            expect(component.editingClient()).toBeNull();
        });

        it('should open modal for editing client', () => {
            component.openModal(mockClient);

            expect(component.showModal()).toBe(true);
            expect(component.editingClient()).toEqual(mockClient);
        });

        it('should populate form when editing', () => {
            component.openModal(mockClient);

            expect(component.form.get('nom')?.value).toBe('Dupont');
            expect(component.form.get('prenom')?.value).toBe('Jean');
        });

        it('should reset form when creating new client', () => {
            component.form.patchValue({ nom: 'Test' });
            component.openModal();

            expect(component.form.get('nom')?.value).toBeFalsy();
            expect(component.form.get('sexe')?.value).toBe('MASCULIN');
        });

        it('should close modal', () => {
            component.showModal.set(true);
            component.closeModal();

            expect(component.showModal()).toBe(false);
            expect(component.editingClient()).toBeNull();
        });
    });

    describe('Form Submission', () => {
        it('should not submit if form is invalid', fakeAsync(() => {
            component.form.patchValue({ nom: '', prenom: '' });
            component.onSubmit();
            tick();

            expect(clientServiceSpy.create).not.toHaveBeenCalled();
            expect(clientServiceSpy.update).not.toHaveBeenCalled();
        }));

        it('should create client when not editing', fakeAsync(() => {
            component.form.patchValue({
                nom: 'Nouveau',
                prenom: 'Client',
                dateNaissance: '1990-01-01',
                sexe: 'MASCULIN'
            });
            component.showModal.set(true);

            component.onSubmit();
            tick();

            expect(clientServiceSpy.create).toHaveBeenCalled();
            expect(component.showModal()).toBe(false);
        }));

        it('should update client when editing', fakeAsync(() => {
            component.openModal(mockClient);
            component.form.patchValue({
                nom: 'DupontModifié',
                prenom: 'Jean',
                dateNaissance: '1990-05-15',
                sexe: 'MASCULIN'
            });

            component.onSubmit();
            tick();

            expect(clientServiceSpy.update).toHaveBeenCalledWith(1, expect.any(Object));
        }));

        it('should reload clients after create', fakeAsync(() => {
            fixture.detectChanges();
            tick();
            clientServiceSpy.getAll.mockClear();

            component.form.patchValue({
                nom: 'Test',
                prenom: 'User',
                dateNaissance: '1990-01-01',
                sexe: 'MASCULIN'
            });
            component.onSubmit();
            tick();

            expect(clientServiceSpy.getAll).toHaveBeenCalled();
        }));
    });

    describe('Delete Client', () => {
        beforeEach(() => {
            vi.spyOn(window, 'confirm').mockReturnValue(true);
        });

        it('should confirm before deleting', fakeAsync(() => {
            component.deleteClient(1);
            tick();

            expect(window.confirm).toHaveBeenCalled();
        }));

        it('should call delete service', fakeAsync(() => {
            component.deleteClient(1);
            tick();

            expect(clientServiceSpy.delete).toHaveBeenCalledWith(1);
        }));

        it('should reload clients after delete', fakeAsync(() => {
            fixture.detectChanges();
            tick();
            clientServiceSpy.getAll.mockClear();

            component.deleteClient(1);
            tick();

            expect(clientServiceSpy.getAll).toHaveBeenCalled();
        }));

        it('should not delete if user cancels', fakeAsync(() => {
            vi.spyOn(window, 'confirm').mockReturnValue(false);

            component.deleteClient(1);
            tick();

            expect(clientServiceSpy.delete).not.toHaveBeenCalled();
        }));
    });

    describe('UI Rendering', () => {
        beforeEach(fakeAsync(() => {
            fixture.detectChanges();
            tick();
        }));

        it('should render client list', () => {
            const compiled = fixture.nativeElement;
            expect(compiled.querySelector('table')).toBeTruthy();
        });

        it('should display client name', () => {
            fixture.detectChanges();
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain('Jean Dupont');
        });

        it('should have new client button', () => {
            const compiled = fixture.nativeElement;
            const button = compiled.querySelector('button');
            expect(button.textContent).toContain('Nouveau Client');
        });

        it('should have search input', () => {
            const compiled = fixture.nativeElement;
            expect(compiled.querySelector('input[type="text"]')).toBeTruthy();
        });
    });

    describe('Form Validation', () => {
        it('should require nom', () => {
            component.form.patchValue({ nom: '' });
            expect(component.form.get('nom')?.errors?.['required']).toBeTruthy();
        });

        it('should require prenom', () => {
            component.form.patchValue({ prenom: '' });
            expect(component.form.get('prenom')?.errors?.['required']).toBeTruthy();
        });

        it('should require dateNaissance', () => {
            component.form.patchValue({ dateNaissance: '' });
            expect(component.form.get('dateNaissance')?.errors?.['required']).toBeTruthy();
        });

        it('should validate email format', () => {
            component.form.patchValue({ courriel: 'invalid-email' });
            expect(component.form.get('courriel')?.errors?.['email']).toBeTruthy();
        });

        it('should accept valid email', () => {
            component.form.patchValue({ courriel: 'valid@email.com' });
            expect(component.form.get('courriel')?.errors).toBeNull();
        });

        it('should be valid with all required fields', () => {
            component.form.patchValue({
                nom: 'Test',
                prenom: 'User',
                dateNaissance: '1990-01-01',
                sexe: 'MASCULIN'
            });
            expect(component.form.valid).toBe(true);
        });
    });
});
