import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdatePage } from './update';
import {FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {InAppBrowser} from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    UpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(UpdatePage),
  ],
  providers: [File,FileTransfer,InAppBrowser],
})
export class UpdatePageModule {}
