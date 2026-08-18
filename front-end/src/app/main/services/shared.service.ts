import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MasterData } from '../models/shared.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private departmentsSubject =
    new BehaviorSubject<MasterData[]>([
      { id: 'guid', name: 'Development' },
      { id: 'guid', name: 'Design' }
    ]);

  private rolesSubject =
    new BehaviorSubject<MasterData[]>([
      { id: 'guid', name: 'Software Engineer' },
      { id: 'guid', name: 'Engineering Manager' }
    ]);

  departments$: Observable<MasterData[]> =
    this.departmentsSubject.asObservable();

  roles$: Observable<MasterData[]> =
    this.rolesSubject.asObservable();

  getDepartments(): MasterData[] {
    return this.departmentsSubject.value;
  }

  getRoles(): MasterData[] {
    return this.rolesSubject.value;
  }

  setDepartments(departments: MasterData[]): void {
    this.departmentsSubject.next(departments);
  }

  setRoles(roles: MasterData[]): void {
    this.rolesSubject.next(roles);
  }
}