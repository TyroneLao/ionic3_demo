import { Component } from '@angular/core';
import {HomePage} from "../home/home";
import {MessagePage} from "../message/message";
import {SettingPage} from "../setting/setting";


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MessagePage;
  tab3Root = SettingPage;

  constructor() {

  }
}
