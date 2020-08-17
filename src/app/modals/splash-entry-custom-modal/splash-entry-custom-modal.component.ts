import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {TutorialService} from '../../services/tutorial.service';

@Component({
  selector: 'app-splash-entry-custom-modal',
  templateUrl: './splash-entry-custom-modal.component.html',
  styleUrls: ['./splash-entry-custom-modal.component.scss']
})
export class SplashEntryCustomModalComponent implements AfterViewInit, OnInit {
  twelfthStepToggle = false;
  thirteenthStepToggle = false;
  fourteenthStepToggle = false;

  constructor(private router: Router,
              private tutorialService: TutorialService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.showTwelvethStep();
  }

  initSteps() {
    this.twelfthStepToggle = false;
    this.thirteenthStepToggle = false;
    this.fourteenthStepToggle = false;
  }

  showBrowseStep() {
    this.tutorialService.tutorialAction.next('showAdvanceTutorialSection');
    this.tutorialService.tutorialCustomToggle.next(true);
    this.router.navigate(['application/multipleQuery']);
  }

  showTwelvethStep() {
    this.initSteps();
    this.twelfthStepToggle = true;
    this.tutorialService.tutorialCustomClass.next('tourStepsContainer thirteenthStep');
  }

  showThirteenthStep() {
    this.initSteps();
    this.thirteenthStepToggle = true;
    this.tutorialService.tutorialCustomClass.next('tourStepsContainer fourteenthStep');
  }

  showFourteenthStep() {
    this.initSteps();
    this.fourteenthStepToggle = true;
    this.tutorialService.tutorialCustomClass.next('tourStepsContainer fifteenthStep');
  }
}
