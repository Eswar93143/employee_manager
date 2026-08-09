import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment';

@Service()
export class AutheService {
    private api = 'https://api.example.com';
    private authApi = environment.authApi;


    // constructor(private http: HttpClient) { }
    private http = inject(HttpClient);

    login(email: string, password: string) {
        return this.http.get<any>(
            `${this.authApi}/login`,
            {
                params: {
                    email,
                    password
                }
            }
        );
    }

    logout() {
        localStorage.removeItem('token');
    }

    saveToken(token: string) {
        localStorage.setItem('token', token);
    }

    getToken() {
        return localStorage.getItem('token');
    }


    isLoggedIn() {
        return !!this.getToken();
    }
}
