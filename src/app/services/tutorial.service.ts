import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  public modalHidden = new BehaviorSubject(false);
  public tutorialAction = new BehaviorSubject('firstTime');
  public tutorialClass = new BehaviorSubject('');
  public tutorialToggle = new BehaviorSubject(false);
  public tutorialCustomClass = new BehaviorSubject('');
  public tutorialCustomToggle = new BehaviorSubject(false);

  constructor() {
  }
}
