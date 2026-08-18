import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Employee } from '../models/employee.interface';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly apiUrl = environment.apiUrl;

  private employeesSubject =
    new BehaviorSubject<Employee[]>([]);

  employees$ = this.employeesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.employees$;
  }

  getCurrentEmployees(): Employee[] {
    return this.employeesSubject.value;
  }

  hasEmployeesLoaded(): boolean {
    return this.employeesSubject.value.length > 0;
  }

  setEmployees(employees: Employee[]): void {
    this.employeesSubject.next(employees);
  }

  fetchEmployees(): Observable<Employee[]> {
    return this.http
      .get<Employee[]>(this.apiUrl)
      .pipe(
        tap(employees => {
          this.employeesSubject.next(employees);
        })
      );
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(
      `${this.apiUrl}/${id}`
    );
  }

  create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(
      this.apiUrl,
      employee
    );
  }

  update(
    id: string,
    employee: Employee
  ): Observable<Employee> {
    return this.http.put<Employee>(
      `${this.apiUrl}/${id}`,
      employee
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}