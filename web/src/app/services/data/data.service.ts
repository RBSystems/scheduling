import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Event } from "../../model/o365.model";
import * as moment from 'moment/moment';

export class RoomStatus {
  roomName: string;
  deviceName: string;
  unoccupied: boolean;
  emptySchedule: boolean;
}

export class OutputEvent {
  title: string;
  startTime: string;
  endTime: string;
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
      roomName: "",
      deviceName: "",
      unoccupied: true,
      emptySchedule: false
    };

    this.getScheduleData();
    setInterval(() => {
      this.getScheduleData();
    }, 30000);
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

    if (!this.status.emptySchedule) {
      for (const event of this.currentSchedule) {
        if (
          time.getTime() >= event.startTime.getTime() &&
          time.getTime() < event.endTime.getTime()
        ) {
          this.status.unoccupied = false;
          return event;
        }
      }
    }
    this.status.unoccupied = true;
    return null;
  }

  getConfig = async () => {
    console.log("Getting config...");

    await this.http.get(this.url + ":8033/config").subscribe(
      data => {
        this.config = data;
        console.log("config", this.config);
        this.status.roomName = this.config["displayname"];
        this.status.deviceName = this.config["_id"];
      },
      err => {
        setTimeout(() => {
          console.error("failed to get config", err);
          this.getConfig();
        }, 5000);
      }
    );
  };

  getScheduleData = async () => {
    const url = this.url + ":8033/calendar/" + this.status.deviceName;
    console.log("Getting schedule data from: ", url);

    await this.http.get<ScheduledEvent[]>(url).subscribe(
      data => {
        if (data == null) {
          this.status.emptySchedule = true;
        } else {
          this.status.emptySchedule = false;
          this.currentSchedule = data;
          for (const event of this.currentSchedule) {
            event.startTime = new Date(event.startTime);
            event.endTime = new Date(event.endTime);
          }
        }
        console.log("Schedule updated")
      },
      err => {
        setTimeout(() => {
          console.error("failed to get schedule data", err);
          this.getScheduleData();
        }, 5000);
      }
    );
  };

  submitNewEvent = async (event: ScheduledEvent) => {
    const url = this.url + ":8033/calendar/" + this.status.deviceName;
    console.log("Submitting new event to ", url);
    const httpHeaders = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    const body = new OutputEvent();
    body.title = event.title;
    body.startTime = moment(event.startTime).format("YYYY-MM-DDTHH:mm:ssZ");
    body.endTime = moment(event.endTime).format("YYYY-MM-DDTHH:mm:ssZ");

    await this.http.put(url, body, httpHeaders).subscribe(
      data => {
        console.log("Event submitted")
        console.log(data);
        this.getScheduleData();
      },
      err => {
        setTimeout(() => {
          console.error("failed to send event", err);
          this.submitNewEvent(event);
        }, 5000);
      }
    );
  };
}
