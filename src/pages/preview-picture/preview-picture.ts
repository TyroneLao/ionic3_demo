import {Component, ViewChild, ElementRef} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';

declare let Swiper;

@IonicPage()
@Component({
  selector: 'page-preview-picture',
  templateUrl: 'preview-picture.html',
})
export class PreviewPicturePage {

  @ViewChild('panel') panel: ElementRef;
  initialSlide: number = 0;
  picturePaths: string[] = [];

  constructor(private viewCtrl: ViewController, private navParams: NavParams) {
    this.initialSlide = this.navParams.get('initialSlide');
    this.picturePaths = this.navParams.get('picturePaths');
  }

  ionViewDidLoad() {
    new Swiper(this.panel.nativeElement, {
      // 初始化显示第几个
      initialSlide: this.initialSlide,
      // 双击，手势缩放
      zoom: true,
      // 循环切换
      loop: false,
      // 延迟加载
      lazyLoading: true,
      lazyLoadingOnTransitionStart: true,
      // 分页器
      pagination: '.swiper-pagination',
      // 分页器类型
      paginationType: 'fraction',
      onClick: () => {
        this.dismiss();
      }
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
