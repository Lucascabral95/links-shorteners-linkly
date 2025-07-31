import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './landing-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LandingComponentComponent implements OnInit {
  private seoService = inject(SeoService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.seoService.setLandingPageSEO();
    }
  }
}
