import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Event } from "../../model/o365.model";

export class RoomStatus {
  roomName: string;
  unoccupied: boolean;
  emptySchedule: boolean;
}

export class ScheduledEvent {
  title: string;
  startTime: Date;
  endTime: Date;
}

@Injectable({
  providedIn: "root"
})
export class DataService {
  url: string;
  status: RoomStatus;
  config: Object;

  currentSchedule: ScheduledEvent[] = [];

  constructor(private http: HttpClient) {
    const base = location.origin.split(":");
    this.url = base[0] + ":" + base[1];
    console.log(this.url);

    this.getConfig();

    this.status = {
      roomName: "ITB-1004",
      unoccupied: true,
      emptySchedule: false
    };

    this.getScheduleData();
    this.getCurrentEvent();
  }

  getBackground(): string {
    if (this.config && this.config.hasOwnProperty("image-url")) {
      return this.config["image-url"];
    }

    return "assets/YMountain.png";
  }

  getRoomStatus(): RoomStatus {
    return this.status;
  }

  getSchedule(): ScheduledEvent[] {
    return this.currentSchedule;
  }

  getCurrentEvent(): ScheduledEvent {
    const time = new Date();

    for (const event of this.currentSchedule) {
      if (
        time.getTime() >= event.startTime.getTime() &&
        time.getTime() < event.endTime.getTime()
      ) {
        this.status.unoccupied = false;
        return event;
      }
    }
    this.status.unoccupied = true;
    return null;
  }

  getConfig = async () => {
    console.log("Getting config...");

    await this.http.get(this.url + ":5000/config").subscribe(
      data => {
        this.config = data;
        console.log("config", this.config);
      },
      err => {
        setTimeout(() => {
          console.error("failed to get config", err);
          this.getConfig();
        }, 5000);
      }
    );
  };

  getScheduleData(): void {
    const url = this.url + ":5000/v1.0/exchange/calendar/events";
    // console.log("refreshing event data from", url);

    this.http.get<Event[]>(url).subscribe(
      data => {
        console.log("events response", data);
        const newEvents: ScheduledEvent[] = [];

        // create all the events
        for (const event of data) {
          const e = new ScheduledEvent();
          e.title = event.subject;
          e.startTime = new Date(event.start);
          e.endTime = new Date(event.end);

          newEvents.push(e);
        }

        // sort events
        newEvents.sort((a, b) => {
          if (a.startTime < b.startTime) {
            return -1;
          } else if (a.startTime > b.startTime) {
            return 1;
          }
          return 0;
        });

        // replace events
        this.currentSchedule = newEvents;
        this.status.emptySchedule = !(this.currentSchedule.length > 0);

        // console.log("updated events", this.currentSchedule);
      },
      err => {
        console.log("error getting events", err);
      }
    );
  }

  submitNewEvent(event: ScheduledEvent): void {
    const req = new Event();
    const today = new Date();
    const M = today.getMonth(); // month is zero-indexed
    const d = today.getDate();
    const y = today.getFullYear();
    const tzoffset = today.getTimezoneOffset();

    req.subject = event.title;
    req.start = new Date(event.startTime.getTime() - tzoffset * 60000);
    req.end = new Date(event.endTime.getTime() - tzoffset * 60000);

    /////////
    ///  SUBMIT
    ///////
    const url = this.url + ":5000/v1.0/exchange/calendar/events";
    console.log("posting", req, "to", url);

    const resp = this.http
      .post(url, JSON.stringify(req), {
        headers: new HttpHeaders().set("Content-Type", "application/json")
      })
      .subscribe(
        response => {
          console.log("successfully posted event. response: ", response);
          this.getScheduleData();
          location.reload();
        },
        err => {
          console.log("error posting event: ", err);
        }
      );

    setTimeout(() => {
      location.reload();
    }, 10000);
  }
}
