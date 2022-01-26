import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import * as moment from "moment";

export interface Task {
  title: string;
  id?: string;
  date?: string;
}

interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  static url = 'https://angular-organizer-6cb6e-default-rtdb.firebaseio.com/';

  constructor(private http: HttpClient) {
  }

  loadAllTasks(date: moment.Moment): Observable<Task[]> {
    return this.http.get<Task[]>(`${TaskService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if (!tasks) return [];

        // @ts-ignore
        return Object.keys(tasks).map(key => ({ ...tasks[key], id: key }));
      }));
  }

  create(task: Task): Observable<Task> {
    return this.http.post<CreateResponse>(`${TaskService.url}/${task.date}.json`, task)
      .pipe(map(res => {
        return { ...task, id: res.name };
      }));
  }

  remove(task: Task) {
    return this.http.delete(`${TaskService.url}/${task.date}/${task.id}.json`);
  }
}
