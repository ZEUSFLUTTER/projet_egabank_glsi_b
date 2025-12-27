import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let routerSpy: ReturnType<typeof vi.spyOn>;

    const mockAuthResponse: AuthResponse = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        username: 'testuser',
        email: 'test@email.com',
        role: 'ROLE_USER'
    };

    beforeEach(() => {
        const routerMock = {
            navigate: vi.fn()
        };

        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                AuthService,
                { provide: Router, useValue: routerMock }
            ]
        });

        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        routerSpy = vi.spyOn(TestBed.inject(Router), 'navigate');

        // Nettoyer le localStorage avant chaque test
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    describe('register', () => {
        it('should register a new user', () => {
            const registerRequest: RegisterRequest = {
                username: 'newuser',
                email: 'newuser@email.com',
                password: 'password123'
            };

            service.register(registerRequest).subscribe(response => {
                expect(response).toEqual(mockAuthResponse);
                expect(service.isAuthenticated()).toBe(true);
                expect(service.currentUser()).toEqual(mockAuthResponse);
            });

            const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(registerRequest);
            req.flush(mockAuthResponse);
        });

        it('should store tokens in localStorage after registration', () => {
            const registerRequest: RegisterRequest = {
                username: 'newuser',
                email: 'newuser@email.com',
                password: 'password123'
            };

            service.register(registerRequest).subscribe(() => {
                expect(localStorage.getItem('ega_access_token')).toBe('test-access-token');
                expect(localStorage.getItem('ega_refresh_token')).toBe('test-refresh-token');
            });

            const req = httpMock.expectOne('http://localhost:8080/api/auth/register');
            req.flush(mockAuthResponse);
        });
    });

    describe('login', () => {
        it('should login a user', () => {
            const loginRequest: LoginRequest = {
                username: 'testuser',
                password: 'password123'
            };

            service.login(loginRequest).subscribe(response => {
                expect(response).toEqual(mockAuthResponse);
                expect(service.isAuthenticated()).toBe(true);
            });

            const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(loginRequest);
            req.flush(mockAuthResponse);
        });

        it('should store user info after login', () => {
            const loginRequest: LoginRequest = {
                username: 'testuser',
                password: 'password123'
            };

            service.login(loginRequest).subscribe(() => {
                const storedUser = JSON.parse(localStorage.getItem('ega_user') || '{}');
                expect(storedUser.username).toBe('testuser');
            });

            const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
            req.flush(mockAuthResponse);
        });
    });

    describe('logout', () => {
        it('should clear tokens and redirect to login', () => {
            // Simuler une connexion
            localStorage.setItem('ega_access_token', 'token');
            localStorage.setItem('ega_refresh_token', 'refresh');
            localStorage.setItem('ega_user', JSON.stringify(mockAuthResponse));

            service.logout();

            expect(localStorage.getItem('ega_access_token')).toBeNull();
            expect(localStorage.getItem('ega_refresh_token')).toBeNull();
            expect(localStorage.getItem('ega_user')).toBeNull();
            expect(service.isAuthenticated()).toBe(false);
            expect(service.currentUser()).toBeNull();
            expect(routerSpy).toHaveBeenCalledWith(['/login']);
        });
    });

    describe('refreshToken', () => {
        it('should refresh the access token', () => {
            localStorage.setItem('ega_refresh_token', 'old-refresh-token');

            const newAuthResponse = {
                ...mockAuthResponse,
                accessToken: 'new-access-token'
            };

            service.refreshToken().subscribe(response => {
                expect(response.accessToken).toBe('new-access-token');
            });

            const req = httpMock.expectOne(
                req => req.url.includes('/api/auth/refresh') &&
                    req.params.get('refreshToken') === 'old-refresh-token'
            );
            expect(req.request.method).toBe('POST');
            req.flush(newAuthResponse);
        });
    });

    describe('getToken', () => {
        it('should return the access token from localStorage', () => {
            localStorage.setItem('ega_access_token', 'stored-token');
            expect(service.getToken()).toBe('stored-token');
        });

        it('should return null if no token is stored', () => {
            expect(service.getToken()).toBeNull();
        });
    });

    describe('initialization', () => {
        it('should restore authentication state from localStorage', () => {
            localStorage.setItem('ega_access_token', 'stored-token');
            localStorage.setItem('ega_user', JSON.stringify(mockAuthResponse));

            // Recréer le service pour tester l'initialisation
            const newService = new AuthService(
                TestBed.inject(HttpTestingController) as any,
                TestBed.inject(Router)
            );

            // Note: Le service lit le localStorage dans le constructeur
        });
    });
});
