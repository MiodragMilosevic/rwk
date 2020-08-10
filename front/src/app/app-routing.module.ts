import {  NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { InstrumentsComponent } from './instruments/instruments.component';
import { LevelsComponent } from './levels/levels.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { PaymentComponent } from './payment/payment.component';
import { LoggedInGuardService } from './shared/_helpers/authGuard/logged-in-guard.service';
import { NotLoggedInGuardService } from './shared/_helpers/authGuard/not-logged-in-guard.service';
import { InstrumentInfoComponent } from './instrument-info/instrument-info.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { AboutComponent } from './about/about.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { CertifiedTeachersComponent } from './certified-teachers/certified-teachers.component';
import { FeesComponent } from './fees/fees.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { NewsComponent } from './news/news.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ExamBookingComponent } from './exam-booking/exam-booking.component';
import { SettingsComponent } from './settings/settings.component';
import { ListOfVideosComponent } from './list-of-videos/list-of-videos.component';
import { WatchVideoComponent } from './watch-video/watch-video.component';
import { MyVideosComponent } from './my-videos/my-videos.component';
import { InternationalCentresComponent } from './international-centres/international-centres.component';
import { RegisterExamComponent } from './register-exam/register-exam.component';

const routes: Routes = [
  {path: '', component: LoginComponent, canActivate: [LoggedInGuardService] }, 
  {path: 'register', component: RegisterComponent, canActivate: [LoggedInGuardService]},
  {path: 'resetPassword/:resetToken', component: ResetPasswordComponent, canActivate: [LoggedInGuardService]},
  {path: 'instruments/:instrumentName', component: InstrumentsComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [NotLoggedInGuardService]},
  {path: 'home', component: LoginComponent },
  {path: 'payment', component: PaymentComponent, canActivate: [NotLoggedInGuardService]},
  {path: 'instruments-info', component: InstrumentInfoComponent,canActivate: [NotLoggedInGuardService]},
  {path: 'instruments/:instrumentName/levels', component: LevelsComponent, canActivate: [NotLoggedInGuardService]},
  {path: ':confirmToken/confirm_account', component: ConfirmAccountComponent },
  {path: 'about', component: AboutComponent },
  {path: 'terms-and-conditions', component: TermsAndConditionsComponent},
  {path: 'privacy', component: PrivacyComponent},
  {path: 'certified-teachers', component: CertifiedTeachersComponent},
  {path: 'fees', component: FeesComponent},
  {path: 'join-us', component: JoinUsComponent},
  {path: 'news', component: NewsComponent},
  {path: 'contact-us', component: ContactUsComponent},
  {path: 'exam-booking', component: ExamBookingComponent, canActivate: [LoggedInGuardService]},
  {path: 'settings', component: SettingsComponent},
  {path: 'videos', component: ListOfVideosComponent},
  {path: 'watch-video/:videos', component: WatchVideoComponent},
  {path: 'my-videos', component: MyVideosComponent, canActivate: [NotLoggedInGuardService]},
  {path: 'international-centres', component: InternationalCentresComponent},
  {path: 'country-centres/:country', component: RegisterExamComponent},
  {path: '**', component: LoginComponent, canActivate: [LoggedInGuardService] }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
