import { Component, ChangeDetectionStrategy } from '@angular/core';
import AnalytitcsGeneralComponentComponent from "../../../../components/analytics-sections/analytitcs-general-component/analytitcs-general-component.component";
import { AnalyticsLinksTopsComponentComponent } from "../../../../components/analytics-sections/analytics-links-tops-component/analytics-links-tops-component.component";
import { AnalyticsGeographicComponentComponent } from "../../../../components/analytics-sections/analytics-geographic-component/analytics-geographic-component/analytics-geographic-component.component";

@Component({
  selector: 'app-analytics-admin-component',
  standalone: true,
  imports: [AnalytitcsGeneralComponentComponent, AnalyticsLinksTopsComponentComponent, AnalyticsGeographicComponentComponent],
  templateUrl: './analytics-admin-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AnalyticsAdminComponent {

}
