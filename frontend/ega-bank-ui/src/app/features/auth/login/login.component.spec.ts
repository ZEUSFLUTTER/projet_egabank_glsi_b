import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthResponse } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authServiceSpy: { login: ReturnType<typeof vi.fn> };
    let routerSpy: { navigate: ReturnType<typeof vi.fn> };

    const mockAuthResponse: AuthResponse = {
        accessToken: 'test-token',
        refreshToken: 'refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        username: 'testuser',
        email: 'test@email.com',
        role: 'ROLE_USER'
    };

    beforeEach(async () => {
        authServiceSpy = {
            login: vi.fn()
        };
        routerSpy = {
            navigate: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('Initialization', () => {
        it('should create the component', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize the form with empty values', () => {
            expect(component.form.get('username')?.value).toBe('');
            expect(component.form.get('password')?.value).toBe('');
        });

        it('should have loading set to false initially', () => {
            expect(component.loading()).toBe(false);
        });

        it('should have no error initially', () => {
            expect(component.error()).toBeNull();
        });
    });

    describe('Form Validation', () => {
        it('should be invalid when empty', () => {
            expect(component.form.valid).toBe(false);
        });

        it('should be invalid when username is empty', () => {
            component.form.patchValue({ username: '', password: 'password123' });
            expect(component.form.valid).toBe(false);
            expect(component.form.get('username')?.errors?.['required']).toBeTruthy();
        });

        it('should be invalid when password is empty', () => {
            component.form.patchValue({ username: 'testuser', password: '' });
            expect(component.form.valid).toBe(false);
            expect(component.form.get('password')?.errors?.['required']).toBeTruthy();
        });

        it('should be valid when all fields are filled', () => {
            component.form.patchValue({ username: 'testuser', password: 'password123' });
            expect(component.form.valid).toBe(true);
        });
    });

    describe('Form Submission', () => {
        it('should not call authService if form is invalid', () => {
            component.onSubmit();
            expect(authServiceSpy.login).not.toHaveBeenCalled();
        });

        it('should mark all fields as touched if form is invalid', () => {
            component.onSubmit();
            expect(component.form.get('username')?.touched).toBe(true);
            expect(component.form.get('password')?.touched).toBe(true);
        });

        it('should call authService.login when form is valid', fakeAsync(() => {
            authServiceSpy.login.mockReturnValue(of(mockAuthResponse));
            component.form.patchValue({ username: 'testuser', password: 'password123' });

            component.onSubmit();
            tick();

            expect(authServiceSpy.login).toHaveBeenCalledWith({
                username: 'testuser',
                password: 'password123'
            });
        }));

        it('should set loading to true during submission', fakeAsync(() => {
            authServiceSpy.login.mockReturnValue(of(mockAuthResponse));
            component.form.patchValue({ username: 'testuser', password: 'password123' });

            component.onSubmit();
            expect(component.loading()).toBe(true);

            tick();
        }));

        it('should navigate to dashboard on successful login', fakeAsync(() => {
            authServiceSpy.login.mockReturnValue(of(mockAuthResponse));
            component.form.patchValue({ username: 'testuser', password: 'password123' });

            component.onSubmit();
            tick();

            expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
        }));

        it('should clear error on new submission', fakeAsync(() => {
            component.error.set('Previous error');
            authServiceSpy.login.mockReturnValue(of(mockAuthResponse));
            component.form.patchValue({ username: 'testuser', password: 'password123' });

            component.onSubmit();
            tick();

            expect(component.error()).toBeNull();
        }));
    });

    describe('Error Handling', () => {
        it('should display error message on failed login', fakeAsync(() => {
            const errorResponse = {
                error: { message: 'Identifiants invalides' }
            };
            authServiceSpy.login.mockReturnValue(throwError(() => errorResponse));
            component.form.patchValue({ username: 'testuser', password: 'wrongpassword' });

            component.onSubmit();
            tick();

            expect(component.error()).toBe('Identifiants invalides');
            expect(component.loading()).toBe(false);
        }));

        it('should display default error message if no message in response', fakeAsync(() => {
            authServiceSpy.login.mockReturnValue(throwError(() => ({})));
            component.form.patchValue({ username: 'testuser', password: 'wrongpassword' });

            component.onSubmit();
            tick();

            expect(component.error()).toBe('Identifiants invalides');
        }));

        it('should set loading to false on error', fakeAsync(() => {
            authServiceSpy.login.mockReturnValue(throwError(() => ({ error: {} })));
            component.form.patchValue({ username: 'testuser', password: 'password' });

            component.onSubmit();
            tick();

            expect(component.loading()).toBe(false);
        }));
    });

    describe('UI Rendering', () => {
        it('should render login form', () => {
            const compiled = fixture.nativeElement;
            expect(compiled.querySelector('form')).toBeTruthy();
            expect(compiled.querySelector('input[formControlName="username"]')).toBeTruthy();
            expect(compiled.querySelector('input[formControlName="password"]')).toBeTruthy();
            expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
        });

        it('should display EGA Bank title', () => {
            const compiled = fixture.nativeElement;
            expect(compiled.textContent).toContain('EGA Bank');
        });

        it('should have link to register page', () => {
            const compiled = fixture.nativeElement;
            const registerLink = compiled.querySelector('a[routerLink="/register"]');
            expect(registerLink).toBeTruthy();
        });
    });
});
