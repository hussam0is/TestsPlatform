import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule }    from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ConnectComponent } from './connect/connect.component';
import { AllTestsComponent } from './all-tests/all-tests.component';
import { RunBuildComponent } from './run-build/run-build.component';
import { ReportsComponent } from './reports/reports.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageReportsComponent } from './manage-reports/manage-reports.component';
import { AddEnvironmentComponent } from './add-environment/add-environment.component';
import { AddNewTestComponent } from './add-new-test/add-new-test.component';
import { AddUserComponent } from './add-user/add-user.component';
import { BuildDetailsComponent } from './build-details/build-details.component';
import { BuildOverViewComponent } from './build-over-view/build-over-view.component';
import { BuildStopComponent } from './build-stop/build-stop.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { TestDetailsComponent } from './test-details/test-details.component';
import { TestHistoryComponent } from './test-history/test-history.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ConnectComponent,
    AllTestsComponent,
    RunBuildComponent,
    ReportsComponent,
    ManageUsersComponent,
    ManageReportsComponent,
    AddEnvironmentComponent,
    AddNewTestComponent,
    AddUserComponent,
    BuildDetailsComponent,
    BuildOverViewComponent,
    BuildStopComponent,
    ViewReportsComponent,
    UserDetailsComponent,
    TestDetailsComponent,
    TestHistoryComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: ConnectComponent },
      { path: 'home', component: HomeComponent },
      { path: 'allTest', component: AllTestsComponent },
      { path: 'runBuild', component: RunBuildComponent },
      { path: 'reportDetails', component: ReportsComponent },
      { path: 'users', component:  ManageUsersComponent },
      { path: 'managereports', component: ManageReportsComponent },
      { path: 'addEnvironment', component: AddEnvironmentComponent },
      { path: 'addTest', component: AddNewTestComponent },
      { path: 'addUser', component: AddUserComponent },
      { path: 'buildDetails', component: BuildDetailsComponent },
      { path: 'buildOverView', component: BuildOverViewComponent },
      { path: 'buildStop', component: BuildStopComponent },
      { path: 'viewReports', component: ViewReportsComponent },
      { path: 'userDetail', component: UserDetailsComponent },
      { path: 'TestDetail', component: TestDetailsComponent },
      { path: 'TestHistory', component:TestHistoryComponent },

    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
