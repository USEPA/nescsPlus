import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {TutorialService} from '../../services/tutorial.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-splash-entry-modal',
  templateUrl: './splash-entry-modal.component.html',
  styleUrls: ['./splash-entry-modal.component.scss']
})
export class SplashEntryModalComponent implements AfterViewInit, OnInit {
  innerWidth: number;
  innerHeight: number;
  firstStepToggle = true;
  secondStepToggle = false;
  secondComplete = false;
  thirdStepToggle = false;
  thirdComplete = false;
  fourthStepToggle = false;
  fourthComplete = false;
  fifthStepToggle = false;
  sixthStepToggle = false;
  seventhStepToggle = false;
  eighthStepToggle = false;
  ninthStepToggle = false;
  tenthStepToggle = false;
  eleventhStepToggle = false;
  twelfthStepToggle = false;
  timerFunction;
  panel = 'welcome';

  constructor(public modalRef: BsModalRef,
              private router: Router,
              private tutorialService: TutorialService) {
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight * .90;
  }

  ngAfterViewInit() {
    if (this.tutorialService.tutorialAction.getValue() === 'showAdvanceTutorialSection') {
      this.timerFunction = setTimeout(this.showTwelfthStep.bind(this), 200);
    } else {
      this.timerFunction = setTimeout(this.showSecondStep.bind(this), 4000);
    }
    this.tutorialService.tutorialAction.next(null);
  }

  initSteps() {
    this.firstStepToggle = false;
    this.secondStepToggle = false;
    this.thirdStepToggle = false;
    this.fourthStepToggle = false;
    this.fifthStepToggle = false;
    this.sixthStepToggle = false;
    this.seventhStepToggle = false;
    this.eighthStepToggle = false;
    this.ninthStepToggle = false;
    this.tenthStepToggle = false;
    this.eleventhStepToggle = false;
    this.twelfthStepToggle = false;
  }

  showSecondStep() {
    if (!this.secondStepToggle && !this.secondComplete) {
      this.initSteps();
      this.secondStepToggle = true;
      this.timerFunction = setTimeout(this.showThirdStep.bind(this), 5000);
      this.secondComplete = true;
    }
  }

  showThirdStep() {
    if (!this.thirdStepToggle && !this.thirdComplete) {
      this.initSteps();
      this.thirdStepToggle = true;
      this.timerFunction = setTimeout(this.showFourthStep.bind(this), 5000);
      this.thirdComplete = true;
    }
  }

  showFourthStep() {
    if (!this.fourthStepToggle && !this.fourthComplete) {
      this.initSteps();
      this.fourthStepToggle = true;
      this.fourthComplete = true;
      this.tutorialService.tutorialClass.next('welcomePanel');
    }
  }

// Tour Steps
  showFifthStep() {
    this.initSteps();
    this.fifthStepToggle = true;
    this.tutorialService.tutorialClass.next('tourStepsContainer');
  }

  showSixthStep() {
    this.initSteps();
    this.sixthStepToggle = true;
    this.tutorialService.tutorialClass.next('tourStepsContainer sixthStep');
  }

  showSeventhStep() {
    this.initSteps();
    this.seventhStepToggle = true;
    this.tutorialService.tutorialClass.next('tourStepsContainer seventhStep');
  }

  showEighthStep() {
    this.initSteps();
    this.eighthStepToggle = true;
    this.tutorialService.tutorialClass.next('tourStepsContainer eighthStep');
  }

  showNinthStep() {
    this.initSteps();
    this.ninthStepToggle = true;
    this.tutorialService.tutorialClass.next('tourStepsContainer ninthStep');
  }

  showTenthStep() {
    this.initSteps();
    this.tenthStepToggle = true;
    this.tutorialService.tutorialClass.next('tourStepsContainer tenthStep');
  }

  showEleventhStep() {
    this.initSteps();
    this.eleventhStepToggle = true;
    this.tutorialService.tutorialClass.next('tourStepsContainer eleventhStep');
  }

  showTwelfthStep() {
    this.initSteps();
    this.twelfthStepToggle = true;
    this.tutorialService.tutorialClass.next('tourStepsContainer twelfthStep');
  }

  nextModalStep() {
    this.tutorialService.modalHidden.next(false);
    this.tutorialService.tutorialToggle.next(true);
    this.tutorialService.tutorialAction.next('showCustomTutorial');
    this.router.navigate(['application/singleQuery']);
  }

  openLearnPage() {
    window.open('https://www.epa.gov/eco-research/national-ecosystem-services-classification-system-nescs-plus', '_blank');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth * .90;
    this.innerHeight = window.innerHeight * .90;
  }

}
