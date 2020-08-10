// default
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDateParserFormatter, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
//angular-library
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
//services
import { TokenInterceptorService } from './shared/_helpers/tokenInterceptor/token-interceptor.service';
import { ErrorInterceptorService } from './shared/_helpers/errorInterceptor/error-interceptor.service';
import { MomentDateFormatter } from './shared/services/utility/moment-date-formatter';
//components
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { InstrumentsComponent } from './instruments/instruments.component';
import { LevelsComponent } from './levels/levels.component';
import { RegisterComponent } from './register/register.component';
import { HeaderRegisteredUserComponent } from './header-registered-user/header-registered-user.component';
import { ProfileComponent } from './profile/profile.component';
import { PaymentComponent } from './payment/payment.component';
import { RegisterModalComponent } from './register-modal/register-modal.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { InstrumentInfoComponent } from './instrument-info/instrument-info.component';
import { ActivateLicenceComponent } from './activate-licence/activate-licence.component';
import { DatePipe, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgxStripeModule } from 'ngx-stripe';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { FacebookService } from './shared/services/facebook.service';
import bugsnag from '@bugsnag/js'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'
import { ErrorHandler } from '@angular/core'
import { environment } from 'src/environments/environment';
import { AboutComponent } from './about/about.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CertifiedTeachersComponent } from './certified-teachers/certified-teachers.component';
import { FeesComponent } from './fees/fees.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { NewsComponent } from './news/news.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { ExamBookingComponent } from './exam-booking/exam-booking.component';
import { SettingsComponent } from './settings/settings.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';

import { AngularResizedEventModule } from 'angular-resize-event';
import { ListOfVideosComponent } from './list-of-videos/list-of-videos.component';
import { WatchVideoComponent } from './watch-video/watch-video.component';
import { MyVideosComponent } from './my-videos/my-videos.component';
import { InternationalCentresComponent } from './international-centres/international-centres.component';
import { EmbedVideo } from 'ngx-embed-video';
import { RegisterExamComponent } from './register-exam/register-exam.component';
import { Globals } from './global';
import { ExamModalComponent } from './exam-modal/exam-modal.component';

// configure Bugsnag asap
const bugsnagClient = bugsnag({
  apiKey: '6fb2663c4f489c78a470a93d502a197f',
  notifyReleaseStages: ['production']
 })
// create a factory which will return the bugsnag error handler


export function errorHandlerFactory() {
  return new BugsnagErrorHandler(bugsnagClient)
}


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    ResetPasswordComponent,
    InstrumentsComponent,
    LevelsComponent,
    RegisterComponent,
    HeaderRegisteredUserComponent,
    ProfileComponent,
    PaymentComponent,  
    RegisterModalComponent, 
    LoginModalComponent, 
    InstrumentInfoComponent, 
    ActivateLicenceComponent, 
    ConfirmAccountComponent, 
    AboutComponent, 
    TermsAndConditionsComponent, 
    PrivacyComponent, 
    CertifiedTeachersComponent, 
    FeesComponent, 
    JoinUsComponent, 
    NewsComponent, 
    ContactUsComponent, 
    DeleteAccountComponent,
    DisclaimerComponent, ExamBookingComponent, SettingsComponent, ListOfVideosComponent, WatchVideoComponent, MyVideosComponent, InternationalCentresComponent, RegisterExamComponent, ExamModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    PdfViewerModule,
    NgxStripeModule.forRoot(environment.stripeKey),
    AngularResizedEventModule,
    EmbedVideo.forRoot()
  ],
  providers: [
    Globals,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true},
    {provide: NgbDateParserFormatter,
      useFactory: () => { return new MomentDateFormatter()}
    },
    {
      provide: MomentDateFormatter,
      useFactory: () => { return new MomentDateFormatter()}
    },
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: ErrorHandler, useFactory: errorHandlerFactory },
    { provide: 'bugsnagClient', useValue: bugsnagClient},
    DatePipe,
    FacebookService
  ],
  entryComponents: [
    RegisterModalComponent, 
    LoginModalComponent,
    ActivateLicenceComponent,
    DisclaimerComponent,
    DeleteAccountComponent,
    ExamModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

}



