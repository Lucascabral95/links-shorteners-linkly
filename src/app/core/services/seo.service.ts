import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Options } from '../interfaces';
import { GetLinkByIDInterface } from '../../features/links/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    @Inject(PLATFORM_ID)
    private platformId: Object,
    private titleService: Title,
    private meta: Meta) { }

  setSEO(title: string, description: string, options?: Options): void {

    if (!isPlatformBrowser(this.platformId)) return;

    this.titleService.setTitle(title);

    this.meta.updateTag({ name: 'description', content: description })

    if (options?.keywords) {
      this.meta.updateTag({ name: 'keywords', content: options.keywords })
    }

    const robotsContent = options?.noIndex ? 'noindex, nofollow' : 'index, follow';
    this.meta.updateTag({ name: 'robots', content: robotsContent })

    this.meta.updateTag({ property: 'og:title', content: title })
    this.meta.updateTag({ property: 'og:description', content: description })
    this.meta.updateTag({ property: 'og:type', content: 'website' })
    this.meta.updateTag({ property: 'og:url', content: window.location.href })

    if (options?.image) {
      this.meta.updateTag({ property: 'og:image', content: options.image })
    }

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' })
    this.meta.updateTag({ name: 'twitter:title', content: title })
    this.meta.updateTag({ name: 'twitter:description', content: description })

    if (options?.image) {
      this.meta.updateTag({ name: 'twitter:image', content: options.image })
    }
  }

  setLandingPageSEO(): void {
    this.setSEO(
      'Linkly - Acortador de Enlaces Gratis | Acorta URLs Rápido y Seguro',
      'Linkly es el acortador de enlaces más rápido y seguro. Acorta tus URLs gratis, obtén estadísticas detalladas y gestiona todos tus enlaces desde una sola plataforma.',
      {
        keywords: 'acortador enlaces, acortar URL, links cortos, acortador gratis, estadísticas enlaces, gestión URLs, Linkly',
        image: '/assets/img/linkly-social-preview.png'
      }
    );

    this.setExtraConfigs();
  }

  setLoginSEO(): void {
    this.setSEO(
      'Iniciar Sesión - Linkly | Accede a tu cuenta',
      'Inicia sesión en Linkly para gestionar tus enlaces acortados, ver estadísticas y acceder a todas las funciones de tu cuenta.',
      {
        keywords: 'login, iniciar sesión, acceder cuenta, Linkly, gestión enlaces',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setRegisterSEO(): void {
    this.setSEO(
      'Registrarse - Linkly | Crea tu cuenta',
      'Regístrate en Linkly para crear tus propios enlaces acortados y gestionarlos desde una sola plataforma.',
      {
        keywords: 'registrarse, crear cuenta, Linkly, gestión enlaces',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setForgotPasswordSEO(): void {
    this.setSEO(
      'Recuperar Contraseña - Linkly | Recupera tu cuenta',
      'Recupera tu contraseña en Linkly para acceder a tu cuenta y gestionar tus enlaces acortados.',
      {
        keywords: 'recuperar contraseña, recuperar cuenta, Linkly, gestión enlaces',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setResetPasswordSEO(): void {
    this.setSEO(
      'Restablecer Contraseña - Linkly | Restablece tu cuenta',
      'Restablece tu contraseña en Linkly para acceder a tu cuenta y gestionar tus enlaces acortados.',
      {
        keywords: 'restablecer contraseña, restablecer cuenta, Linkly, gestión enlaces',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setClickSEO(): void {
    this.setSEO(
      'Clicks - Linkly | Ver estadísticas de tus enlaces',
      'Ver estadísticas de tus enlaces acortados en Linkly.',
      {
        keywords: 'clicks, estadísticas, Linkly, gestión enlaces',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setClickDetailSEO(): void {
    this.setSEO(
      'Detalle de Click - Linkly | Estadísticas específicas',
      'Análisis detallado de un click específico en tus enlaces acortados. Ve estadísticas por país, ciudad, dispositivo y navegador.',
      {
        keywords: 'detalle click, estadísticas específicas, analytics Linkly, métricas enlace',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setConfigurationSEO(): void {
    this.setSEO(
      'Configuración de Perfil - Linkly | Gestiona tu información personal',
      'Administra y actualiza tu información personal en Linkly. Modifica tu nombre completo, revisa los datos de tu cuenta y mantén tu perfil actualizado. Configuración segura y privada de tu cuenta de usuario.',
      {
        keywords: 'configuración perfil, datos personales, actualizar nombre completo, información usuario, configuración cuenta, perfil Linkly, datos privados, gestión usuario',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setMyLinksSEO(): void {
    this.setSEO(
      'Mis Enlaces - Linkly | Panel de Control y Gestión Completa de URLs',
      'Panel completo para gestionar tus enlaces acortados. Filtra por estado activo/inactivo, público/privado, busca por título o alias personalizado, copia enlaces al instante, elimina URLs obsoletas y controla fechas de expiración. Todo tu contenido organizado en un solo lugar.',
      {
        keywords: 'panel control enlaces, gestión URLs acortadas, filtrar enlaces activos, enlaces públicos privados, copiar enlaces, eliminar URLs, alias personalizado, enlaces expirados, dashboard Linkly, administrar links',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setLinkDetailSEO(): void {
    this.setSEO(
      'Estadísticas de Enlace - Linkly | Análisis Visual Completo con Gráficos',
      'Análisis visual completo de tu enlace acortado con gráficos interactivos. Visualiza estadísticas detalladas por países, ciudades, dispositivos y navegadores en tiempo real. Dashboard analítico con gráficos de barras profesionales para entender el comportamiento de tus visitantes.',
      {
        keywords: 'estadísticas enlace visual, gráficos interactivos, análisis por país ciudad, métricas dispositivos navegadores, dashboard analítico, visualización datos, gráficos barras, ApexCharts, analytics visual Linkly',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setUserDetailSEO(): void {
    this.setSEO(
      'Detalle de Usuario - Linkly | Información Completa del Perfil',
      'Visualiza la información detallada del usuario en Linkly. Consulta datos del perfil, fecha de registro, información personal y estado de la cuenta. Vista completa y organizada de toda la información del usuario.',
      {
        keywords: 'detalle usuario, información perfil, datos usuario, consulta perfil, vista usuario, información personal, estado cuenta, perfil Linkly',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setRedirectSEO(linkData?: GetLinkByIDInterface, shortCode?: string): void {
    if (linkData && shortCode) {
      const title = linkData.title ?
        `${linkData.title} - Redirigiendo` :
        `Redirigiendo a ${linkData.originalUrl}`;

      this.setSEO(
        title,
        `Serás redirigido automáticamente a: ${linkData.originalUrl}. Link acortado seguro a través de Linkly.`,
        {
          keywords: `redirigiendo, ${linkData.title || 'enlace'}, link acortado, redirección segura, Linkly`,
          noIndex: true,
          image: '/assets/img/linkly-social-preview.png'
        }
      );

      if (isPlatformBrowser(this.platformId)) {
        const domainUrl = window.location.origin;

        this.meta.updateTag({
          property: 'og:url',
          content: `${domainUrl}/${shortCode}`
        });

        this.meta.updateTag({
          property: 'og:description',
          content: `Link acortado que redirige a: ${linkData.originalUrl}`
        });
      }
    } else {
      this.setSEO(
        'Redirigiendo - Linkly | Redirección en curso',
        'Procesando redirección a tu enlace acortado. Serás redirigido automáticamente en unos segundos.',
        {
          keywords: 'redirigiendo, procesando, enlace acortado, redirección automática, Linkly',
          noIndex: true,
          image: '/assets/img/linkly-social-preview.png'
        }
      );
    }

    this.setExtraConfigs();
  }

  setAnalyticsComponentSEO(): void {
    this.setSEO(
      'Analytics Avanzado - Linkly | Dashboard Completo con 8 Visualizaciones Interactivas',
      'Dashboard analítico completo con 8 gráficos interactivos para analizar el rendimiento de tus enlaces. Visualiza distribución de clicks vs enlaces, top enlaces más populares, análisis geográfico por países, segmentación por dispositivos y navegadores, evolución temporal de clicks, rendimiento por categorías y estado de enlaces activos. Insights profesionales con gráficos ApexCharts para tomar decisiones basadas en datos.',
      {
        keywords: 'dashboard analytics, 8 gráficos interactivos, distribución clicks enlaces, top enlaces populares, análisis geográfico países, segmentación dispositivos navegadores, evolución temporal clicks, categorías enlaces, estado enlaces activos, visualización ApexCharts, insights datos, analytics profesional Linkly',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setAnalyticsSEO(): void {
    this.setSEO(
      'Analytics de Comportamiento - Linkly | Dashboard con 8 Métricas de Engagement de Enlaces',
      'Dashboard completo de analytics con 8 visualizaciones para analizar cómo los usuarios interactúan con tus enlaces acortados. Rastrea el comportamiento de clicks por ubicación geográfica (países y ciudades), tecnología utilizada (dispositivos y navegadores), rendimiento temporal y categorización de contenido. Incluye distribución total de clicks vs enlaces, ranking de enlaces más exitosos, análisis geográfico detallado, segmentación tecnológica, evolución temporal de engagement, performance por categorías y monitoreo de estado de enlaces. Inteligencia de datos con visualizaciones ApexCharts para optimizar estrategias de contenido.',
      {
        keywords: 'analytics comportamiento usuarios, tracking clicks geográfico, análisis países ciudades dispositivos navegadores, engagement enlaces, comportamiento usuarios clicks, métricas geolocalización, segmentación tecnológica usuarios, evolución temporal engagement, performance enlaces categorías, inteligencia datos ApexCharts, optimización estrategias contenido, analytics usuarios Linkly',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  setAdminSEO(): void {
    this.setSEO(
      'Panel de Administración - Linkly | Dashboard de Control Total del Sistema',
      'Panel de administración completo para supervisar y gestionar toda la plataforma Linkly. Controla usuarios registrados, administra todos los enlaces del sistema, monitorea clicks globales y accede a analytics administrativos completos. Dashboard ejecutivo con métricas en tiempo real, capacidades de modificación global, supervisión de usuarios activos, gestión masiva de enlaces y análisis de comportamiento de la plataforma. Control total del ecosistema Linkly con herramientas administrativas avanzadas.',
      {
        keywords: 'panel administración Linkly, dashboard control sistema, gestión usuarios globales, supervisión enlaces sistema, monitoreo clicks globales, analytics administrativos, métricas tiempo real, modificación global datos, supervisión usuarios activos, gestión masiva enlaces, control ecosistema plataforma, herramientas administrativas avanzadas',
        noIndex: true,
        image: '/assets/img/linkly-social-preview.png'
      }
    );
    this.setExtraConfigs();
  }

  private setExtraConfigs(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.meta.updateTag({ name: 'author', content: 'Linkly' });
    this.meta.updateTag({ name: 'theme-color', content: '#0f172a' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Linkly' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_AR' });
  }
}
