import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team.model';
import { Teammember } from '../models/member.model';
import { TeamService } from '../team.service';
import { AddNewMemberDialogComponent } from '../add-new-member-dialog/add-new-member-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { AddNewTeamDialogComponent } from '../add-new-team-dialog/add-new-team-dialog.component';

@Component({
  selector: 'app-team-list-container',
  templateUrl: './team-list-container.component.html',
  styleUrls: ['./team-list-container.component.scss']
})
export class TeamListContainerComponent implements OnInit {
  teams: Team[] = [];
  selectedTeam: Team;

  constructor(private teamService: TeamService, public addMemberDialog: MatDialog, public addNewTeamDialog: MatDialog) { }

  ngOnInit() {
    this.teams = this.teamService.teams;
    this.teamService.selectedTeam.subscribe(data => {
      this.selectedTeam = data;
    })
  }

  openAddPersonDialog(): void {
    const dialogRef = this.addMemberDialog.open(AddNewMemberDialogComponent, {
      data: { teams: this.teams }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openAddNewTeamDialog(): void {
    const dialogRef = this.addNewTeamDialog.open(AddNewTeamDialogComponent, {
      data: { teams: this.teams }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  setSelectedTeam(team: Team) {
    this.teamService.selectedTeam.next(team);
  }

  drop(event: CdkDragDrop<Teammember[]>, team: Team) {
    if (event.previousContainer === event.container) {
      moveItemInArray(team.members, event.previousIndex, event.currentIndex);
    } else {
      if (event.container.data.length < 12) {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
      else {
        this.startErrorTimer(team);
      }
    }

  }

  startErrorTimer(team: Team) {
    team.limitReachedError = true;
    setTimeout(function () { team.limitReachedError = false }, 3000);
  }

}
