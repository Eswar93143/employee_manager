import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';

@Service()
export class AutheService {
    private api = 'https://api.example.com';

    // constructor(private http: HttpClient) { }
    private http = inject(HttpClient);

    login(username: string, password: string) {
        return this.http.post<any>(
            `${this.api}/login`,
            { username, password }
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
