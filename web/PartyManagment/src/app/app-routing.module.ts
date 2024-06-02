import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  { path: "",
    component: LoginComponent,
  },
  // { path: "login",
  // component: LoginComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
